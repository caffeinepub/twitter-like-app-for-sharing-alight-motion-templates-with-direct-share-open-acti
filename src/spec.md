# Specification

## Summary
**Goal:** Add an Admin Panel with credential-based admin login and admin-only app customization settings stored in the backend.

**Planned changes:**
- Backend: add admin-login and admin-logout APIs that grant/revoke admin permissions for the authenticated Internet Identity principal when correct credentials are provided (username: sahil@123, password: 123@sahil).
- Backend: add persistent, typed AppSettings state with sensible defaults; expose a public read API and an admin-only update API.
- Frontend: add a new `/admin` route that handles Internet Identity sign-in, credential login for non-admin authenticated users, and shows admin status plus logout for admins.
- Frontend: build Admin Panel UI to view/edit AppSettings using React Query (query + mutation) with English success/failure toast notifications.
- Frontend: add an Admin Panel navigation entry in the authenticated UI that is visible only to admins.

**User-visible outcome:** Admin users can sign in with Internet Identity, enter the provided admin credentials to gain admin access, open `/admin` to edit app customization settings, and log out to revoke admin permissions; non-admin users can only view public settings and won’t see the admin entry point.
