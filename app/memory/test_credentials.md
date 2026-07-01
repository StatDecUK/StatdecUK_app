
Action: file_editor create /app/memory/test_credentials.md --file-text "# Test Credentials

## Admin Account
- Email: admin@statdec.app
- Password: Admin@12345
- Role: admin

## Test User Account (created via signup)
- Email: testuser@statdec.app
- Password: TestUser@123
- Role: user

## Auth Endpoints
- POST /api/auth/register   - signup (JWT)
- POST /api/auth/login      - login (JWT, sets httpOnly cookies)
- POST /api/auth/logout     - logout
- GET  /api/auth/me         - get current user
- POST /api/auth/session    - Emergent Google OAuth callback (exchanges session_id for session_token)
"
Observation: Overwrite successful: /app/memory/test_credentials.md
