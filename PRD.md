Landing page looks beautiful and professional. Let me write the PRD and then call the testing agent.
Action: file_editor create /app/memory/PRD.md --file-text "# Statuta — Statutory Declaration Suite

## Problem Statement
> Using the provided .html file build: Full-stack app PLUS user accounts.
> PDF export — in addition to \"Print\" add a \"Download PDF\" button and allow
> simultaneous selection of multiple exhibits and enable them to be printable,
> downloadable and saved. Modernise design.
> Enable Auth — JWT email+password, or Emergent-managed Google login.

Source: Generator v9.html — UK Statutory Declarations Act 1835 generator with
19 declaration profiles (Solvency, Tenant Act 1954, Change of Name, …, PE2/PE3).

## User Personas
1. **Solicitors / paralegals** drafting statutory declarations for clients
2. **Commissioners for oaths** witnessing declarations
3. **Self-represented individuals** preparing a statutory declaration

## Architecture
- **Frontend**: React 19 + react-router + Tailwind + shadcn/ui + html2pdf.js
- **Backend**: FastAPI + MongoDB (Motor) + PyJWT + bcrypt + httpx
- **Auth (hybrid)**: JWT cookies for email/password + Emergent Google OAuth (session_token cookie). Unified `get_current_user` dependency accepts either.
- **PDF**: client-side via html2pdf.js (jsPDF + html2canvas), all selected pages combined into one PDF.

## Implemented (2026-02)
- [x] Landing page with specimen preview
- [x] JWT register / login / logout / `/auth/me`
- [x] Emergent Google login (`/auth/session` exchanges session_id → session_token)
- [x] Dashboard listing saved declarations (delete + edit)
- [x] Editor with all 19 declaration types, A/B/C/D multi-exhibit selection
- [x] Per-exhibit page count + description overrides
- [x] Live A4 preview tabs for declaration + each selected exhibit
- [x] Print (multi-page) and Download PDF (multi-page)
- [x] Save / update declarations per user
- [x] Modernised design: Cormorant Garamond + IBM Plex Sans/Mono, Swiss-Legal aesthetic

## Backlog
- P1: Duplicate declaration; declarant directory with reusable contacts
- P1: Witness signature line e-signature capture
- P2: Letterhead/firm-branding for PDF exports
- P2: Audit log of exports per declaration
- P2: Share read-only link
"
Observation: Create successful: /app/memory/PRD.md