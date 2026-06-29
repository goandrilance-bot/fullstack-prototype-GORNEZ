# fullstack-prototype-GORNEZ

## 🧩 Overview of Changes

### Feature Comparison

| Area | Frontend-Only Version | Full-Stack Version |
| --- | --- | --- |
| User Data Storage | localStorage | MySQL (or in-memory for simplicity) |
| Authentication | Fake login (no real validation) | Real login with password hashing |
| Authorization | Client-side role checks | Server enforces role-based access |
| Data Persistence | Lost on browser clear | Persists across sessions |
| Security | None (roles can be edited in DevTools) | Roles stored securely on server |

For simplicity in this activity, we will use an in-memory user store instead of a database, but the structure is ready for MySQL later.