# Security Specification for Rooted Portfolio

## 1. Data Invariants

- **Project**: Portfolio items visible to everyone.
  - Required: `title`, `description`, `imageUrl`.
  - Permissions: Read: Anyone, Write: Admin Only.
- **Content**: Website configuration and assets.
  - Required: `value`, `type`.
  - Permissions: Read: Anyone, Write: Admin Only.
- **ContactMessages**: Inbound lead capturing.
  - Required: `name`, `email`, `message`.
  - Permissions: Create: Anyone, Read/Update/Delete: Admin Only.

## 2. The "Dirty Dozen" Payloads

| ID | Operation | Collection | Payload | Predicted Result | Vulnerability Tested |
|---|---|---|---|---|---|
| P1 | Create | projects | `{"title": "Hacker", "description": "Me"}` | DENIED | Unauthorized creation |
| P2 | Delete | content | N/A | DENIED | Unauthorized deletion |
| P3 | Create | messages | `{"name": "Spam", "email": "spam@test.com", "message": "Hi"}` | ALLOWED | Public form submission |
| P4 | List | messages | N/A | DENIED | PII Disclosure |
| P5 | Create | projects | `{"title": 123}` | DENIED | Type safety violation |
| P6 | Create | projects | `{"title": "x".repeat(2000)}` | DENIED | Resource Exhaustion (Size) |
| P7 | Update | projects | `{"title": "New", "isAdmin": true}` | DENIED | Shadow field injection |
| P8 | Create | messages | `{"name": "A", "email": "invalid", "message": "B"}` | DENIED | Schema validation |
| P9 | Update | projects | `{"title": "Hacked"}` (as non-admin) | DENIED | Identity Spoofing |
| P10 | Delete | messages | N/A (as non-admin) | DENIED | State integrity |
| P11 | Create | random | `{"key": "val"}` | DENIED | Global Safety Net |
| P12 | Create | messages | `{"name": "A", "email": "a@a.com", "message": "A"}` (empty message) | DENIED | Mandatory fields |

## 3. Test Scenarios

Verified in `firestore.rules`:
1. `isAdmin()` matches `pauloribeirosantos1606@gmail.com` + `email_verified`.
2. `isValidProject()` enforces strings and sizes.
3. `isValidMessage()` enforces contact form schema.
4. Default deny `match /{document=**}` is active.
