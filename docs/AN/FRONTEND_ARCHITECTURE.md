# Frontend architecture

## Roles

| Role | Scope |
| --- | --- |
| `ADMIN` | Full administration, including system settings |
| `RECRUITER` | Candidates, jobs, interviews, and organization reports |
| `CANDIDATE` | Public jobs, own interview sessions, own results, and own profile |

Candidate routes never expose candidate lists, organization analytics, other users' reports, or system settings. UI guards improve navigation and user experience; the backend must enforce the same ownership and role rules for every API request.

## Route namespaces

```text
/login

/admin
  /dashboard
  /interviews
  /interviews/new
  /interviews/:id/analysis
  /candidates
  /jobs
  /reports
  /reports/:id
  /settings                 ADMIN only

/app                       CANDIDATE only
  /jobs
  /interviews/new
  /interviews/:id/device-check
  /interviews/:id/room
  /interviews/:id/processing
  /results
  /results/:id
  /profile
```

## Source structure

```text
src/
├── app/
│   └── AppRouter.tsx       route definitions and role boundaries
├── auth/
│   ├── AuthContext.tsx     temporary session auth adapter
│   ├── RoleGuard.tsx       authorization guard
│   └── types.ts            roles and authenticated user contract
├── config/
│   └── access.ts           centralized access-control matrix
├── admin/
│   └── pages/              admin/recruiter page boundary
├── candidate/
│   └── CandidatePages.tsx  candidate-only workspace and pages
├── interview/
│   └── pages/              shared interview flow boundary
├── App.tsx                 existing admin screens
├── Pages.tsx               existing admin and interview screens
└── styles.css
```

## Backend authorization requirements

- Derive the role and user ID from the verified access token, never from request parameters.
- Candidate queries must always include `candidate_id = current_user.id`.
- A candidate may only read their own interview, recording, transcript, and result.
- Recruiters are restricted to their organization; only admins may change system settings.
- File download URLs should be short-lived signed URLs.
