
Action: file_editor create /app/auth_testing.md --file-text "# Auth Testing Playbook (Combined JWT + Emergent Google)

## JWT Auth (email + password)
1. Register: POST /api/auth/register {email, password, name}
2. Login: POST /api/auth/login {email, password} → sets httpOnly cookies access_token + refresh_token
3. Authenticated check: GET /api/auth/me → returns user
4. Logout: POST /api/auth/logout → clears cookies

## Emergent Google Auth
1. Frontend redirects to https://auth.emergentagent.com/?redirect={origin}/dashboard
2. After Google login, callback returns to /dashboard#session_id=...
3. Frontend hits POST /api/auth/session with X-Session-ID header
4. Backend exchanges session_id at https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data
5. Backend stores session_token in user_sessions collection + sets httpOnly cookie

## Unified auth dependency
get_current_user checks both JWT access_token cookie and session_token cookie. Either works.

## Mongo verification
mongosh test_database
db.users.find({}).pretty()
db.user_sessions.find({}).pretty()

## Test users (see /app/memory/test_credentials.md)
- admin@statdec.app / Admin@12345
- testuser@statdec.app / TestUser@123
"
Observation: Create successful: /app/auth_testing.md
