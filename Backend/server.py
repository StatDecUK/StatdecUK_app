
Action: file_editor create /app/backend/server.py --file-text "\"\"\"FastAPI backend: JWT auth + Emergent Google auth + Statutory Declaration CRUD.\"\"\"
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / \".env\")

import os
import uuid
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Any

import bcrypt
import jwt
import httpx
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field

# --- Config ---
MONGO_URL = os.environ[\"MONGO_URL\"]
DB_NAME = os.environ[\"DB_NAME\"]
JWT_SECRET = os.environ[\"JWT_SECRET\"]
JWT_ALGORITHM = \"HS256\"
ACCESS_TOKEN_MINUTES = 60 * 24  # 1 day
REFRESH_TOKEN_DAYS = 30
ADMIN_EMAIL = os.environ.get(\"ADMIN_EMAIL\", \"admin@statdec.app\")
ADMIN_PASSWORD = os.environ.get(\"ADMIN_PASSWORD\", \"Admin@12345\")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title=\"Statutory Declaration API\")
api = APIRouter(prefix=\"/api\")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# --- Helpers ---
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        \"sub\": user_id,
        \"email\": email,
        \"exp\": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES),
        \"type\": \"access\",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        \"sub\": user_id,
        \"exp\": datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_DAYS),
        \"type\": \"refresh\",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, access: str, refresh: str) -> None:
    response.set_cookie(
        key=\"access_token\", value=access, httponly=True, secure=True,
        samesite=\"none\", max_age=ACCESS_TOKEN_MINUTES * 60, path=\"/\",
    )
    response.set_cookie(
        key=\"refresh_token\", value=refresh, httponly=True, secure=True,
        samesite=\"none\", max_age=REFRESH_TOKEN_DAYS * 24 * 3600, path=\"/\",
    )


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(\"access_token\", path=\"/\")
    response.delete_cookie(\"refresh_token\", path=\"/\")
    response.delete_cookie(\"session_token\", path=\"/\")


def serialize_user(u: Dict[str, Any]) -> Dict[str, Any]:
    return {
        \"user_id\": u[\"user_id\"],
        \"email\": u[\"email\"],
        \"name\": u.get(\"name\", \"\"),
        \"picture\": u.get(\"picture\"),
        \"provider\": u.get(\"provider\", \"password\"),
        \"role\": u.get(\"role\", \"user\"),
        \"created_at\": u.get(\"created_at\"),
    }


async def get_current_user(request: Request) -> Dict[str, Any]:
    \"\"\"Unified auth: tries session_token (Emergent Google) first, then JWT access_token cookie/header.\"\"\"
    # 1) Emergent session_token
    session_token = request.cookies.get(\"session_token\")
    if not session_token:
        auth = request.headers.get(\"Authorization\", \"\")
        if auth.startswith(\"Bearer \"):
            # Could be either, try session first
            session_token = auth[7:]
    if session_token:
        session_doc = await db.user_sessions.find_one(
            {\"session_token\": session_token}, {\"_id\": 0}
        )
        if session_doc:
            expires_at = session_doc[\"expires_at\"]
            if isinstance(expires_at, str):
                expires_at = datetime.fromisoformat(expires_at)
            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            if expires_at >= datetime.now(timezone.utc):
                user = await db.users.find_one(
                    {\"user_id\": session_doc[\"user_id\"]}, {\"_id\": 0, \"password_hash\": 0}
                )
                if user:
                    return user

    # 2) JWT access_token
    token = request.cookies.get(\"access_token\")
    if not token:
        auth = request.headers.get(\"Authorization\", \"\")
        if auth.startswith(\"Bearer \"):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail=\"Not authenticated\")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get(\"type\") != \"access\":
            raise HTTPException(status_code=401, detail=\"Invalid token type\")
        user = await db.users.find_one(
            {\"user_id\": payload[\"sub\"]}, {\"_id\": 0, \"password_hash\": 0}
        )
        if not user:
            raise HTTPException(status_code=401, detail=\"User not found\")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail=\"Token expired\")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail=\"Invalid token\")


# --- Models ---
class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: Optional[str] = \"\"


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class DeclarationIn(BaseModel):
    title: Optional[str] = None
    template_id: str
    declarant_name: str
    declarant_address: str
    declarant_occupation: str
    statement_body: str
    selected_exhibits: List[str] = Field(default_factory=list)
    exhibit_pages: Dict[str, int] = Field(default_factory=dict)
    exhibit_descriptions: Dict[str, str] = Field(default_factory=dict)


class SessionExchangeIn(BaseModel):
    session_id: str


# --- Auth endpoints ---
@api.post(\"/auth/register\")
async def register(payload: RegisterIn, response: Response):
    email = payload.email.lower().strip()
    if await db.users.find_one({\"email\": email}):
        raise HTTPException(status_code=400, detail=\"Email already registered\")
    user_id = f\"user_{uuid.uuid4().hex[:12]}\"
    doc = {
        \"user_id\": user_id,
        \"email\": email,
        \"name\": payload.name or email.split(\"@\")[0],
        \"password_hash\": hash_password(payload.password),
        \"provider\": \"password\",
        \"role\": \"user\",
        \"created_at\": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(doc)
    access = create_access_token(user_id, email)
    refresh = create_refresh_token(user_id)
    set_auth_cookies(response, access, refresh)
    return {\"user\": serialize_user(doc), \"access_token\": access}


@api.post(\"/auth/login\")
async def login(payload: LoginIn, response: Response):
    email = payload.email.lower().strip()
    user = await db.users.find_one({\"email\": email}, {\"_id\": 0})
    if not user or not user.get(\"password_hash\"):
        raise HTTPException(status_code=401, detail=\"Invalid email or password\")
    if not verify_password(payload.password, user[\"password_hash\"]):
        raise HTTPException(status_code=401, detail=\"Invalid email or password\")
    access = create_access_token(user[\"user_id\"], email)
    refresh = create_refresh_token(user[\"user_id\"])
    set_auth_cookies(response, access, refresh)
    return {\"user\": serialize_user(user), \"access_token\": access}


@api.post(\"/auth/logout\")
async def logout(request: Request, response: Response):
    # delete server-side session if present
    session_token = request.cookies.get(\"session_token\")
    if session_token:
        await db.user_sessions.delete_one({\"session_token\": session_token})
    clear_auth_cookies(response)
    return {\"ok\": True}


@api.get(\"/auth/me\")
async def me(user=Depends(get_current_user)):
    return serialize_user(user)


@api.post(\"/auth/session\")
async def emergent_session_exchange(payload: SessionExchangeIn, response: Response):
    \"\"\"Exchange Emergent session_id for a session_token, upsert user, set httpOnly cookie.\"\"\"
    async with httpx.AsyncClient(timeout=15.0) as http:
        try:
            r = await http.get(
                \"https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data\",
                headers={\"X-Session-ID\": payload.session_id},
            )
        except Exception as e:
            raise HTTPException(status_code=502, detail=f\"Auth provider error: {e}\")
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail=\"Invalid or expired session_id\")
    data = r.json()
    email = data[\"email\"].lower().strip()
    name = data.get(\"name\") or email.split(\"@\")[0]
    picture = data.get(\"picture\")
    session_token = data[\"session_token\"]

    existing = await db.users.find_one({\"email\": email}, {\"_id\": 0})
    if existing:
        user_id = existing[\"user_id\"]
        await db.users.update_one(
            {\"user_id\": user_id},
            {\"$set\": {\"name\": name, \"picture\": picture, \"provider\": existing.get(\"provider\", \"google\")}},
        )
        user_doc = await db.users.find_one({\"user_id\": user_id}, {\"_id\": 0, \"password_hash\": 0})
    else:
        user_id = f\"user_{uuid.uuid4().hex[:12]}\"
        user_doc = {
            \"user_id\": user_id,
            \"email\": email,
            \"name\": name,
            \"picture\": picture,
            \"provider\": \"google\",
            \"role\": \"user\",
            \"created_at\": datetime.now(timezone.utc).isoformat(),
        }
        await db.users.insert_one(user_doc)

    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    await db.user_sessions.insert_one({
        \"user_id\": user_id,
        \"session_token\": session_token,
        \"expires_at\": expires_at.isoformat(),
        \"created_at\": datetime.now(timezone.utc).isoformat(),
    })
    response.set_cookie(
        key=\"session_token\", value=session_token, httponly=True,
        secure=True, samesite=\"none\", max_age=7 * 24 * 3600, path=\"/\",
    )
    return {\"user\": serialize_user(user_doc)}


# --- Declarations CRUD ---
@api.get(\"/declarations\")
async def list_declarations(user=Depends(get_current_user)):
    docs = await db.declarations.find(
        {\"user_id\": user[\"user_id\"]}, {\"_id\": 0}
    ).sort(\"updated_at\", -1).to_list(500)
    return docs


@api.get(\"/declarations/{decl_id}\")
async def get_declaration(decl_id: str, user=Depends(get_current_user)):
    doc = await db.declarations.find_one(
        {\"id\": decl_id, \"user_id\": user[\"user_id\"]}, {\"_id\": 0}
    )
    if not doc:
        raise HTTPException(status_code=404, detail=\"Declaration not found\")
    return doc


@api.post(\"/declarations\")
async def create_declaration(payload: DeclarationIn, user=Depends(get_current_user)):
    now = datetime.now(timezone.utc).isoformat()
    doc = {
        \"id\": f\"decl_{uuid.uuid4().hex[:12]}\",
        \"user_id\": user[\"user_id\"],
        \"created_at\": now,
        \"updated_at\": now,
        **payload.model_dump(),
    }
    await db.declarations.insert_one(doc)
    doc.pop(\"_id\", None)
    return doc


@api.put(\"/declarations/{decl_id}\")
async def update_declaration(decl_id: str, payload: DeclarationIn, user=Depends(get_current_user)):
    now = datetime.now(timezone.utc).isoformat()
    update = {**payload.model_dump(), \"updated_at\": now}
    result = await db.declarations.update_one(
        {\"id\": decl_id, \"user_id\": user[\"user_id\"]},
        {\"$set\": update},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail=\"Declaration not found\")
    doc = await db.declarations.find_one({\"id\": decl_id}, {\"_id\": 0})
    return doc


@api.delete(\"/declarations/{decl_id}\")
async def delete_declaration(decl_id: str, user=Depends(get_current_user)):
    result = await db.declarations.delete_one(
        {\"id\": decl_id, \"user_id\": user[\"user_id\"]}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=\"Declaration not found\")
    return {\"ok\": True}


@api.get(\"/\")
async def root():
    return {\"service\": \"Statutory Declaration API\", \"status\": \"ok\"}


# --- Startup ---
@app.on_event(\"startup\")
async def startup():
    await db.users.create_index(\"email\", unique=True)
    await db.users.create_index(\"user_id\", unique=True)
    await db.declarations.create_index([(\"user_id\", 1), (\"updated_at\", -1)])
    await db.user_sessions.create_index(\"session_token\", unique=True)

    # Seed admin
    existing = await db.users.find_one({\"email\": ADMIN_EMAIL.lower()})
    if not existing:
        await db.users.insert_one({
            \"user_id\": f\"user_{uuid.uuid4().hex[:12]}\",
            \"email\": ADMIN_EMAIL.lower(),
            \"name\": \"Admin\",
            \"password_hash\": hash_password(ADMIN_PASSWORD),
            \"provider\": \"password\",
            \"role\": \"admin\",
            \"created_at\": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f\"Seeded admin: {ADMIN_EMAIL}\")
    elif existing.get(\"password_hash\") and not verify_password(ADMIN_PASSWORD, existing[\"password_hash\"]):
        await db.users.update_one(
            {\"email\": ADMIN_EMAIL.lower()},
            {\"$set\": {\"password_hash\": hash_password(ADMIN_PASSWORD)}},
        )


@app.on_event(\"shutdown\")
async def shutdown():
    client.close()


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origin_regex=\".*\",
    allow_methods=[\"*\"],
    allow_headers=[\"*\"],
)
"
Observation: Overwrite successful: /app/backend/server.py
