# Security Specification - Rooted Portfolio

## 1. Data Invariants
- **Projects**: Must have a title, description, and imageUrl. `order` must be a number.
- **Content**: Key-value pair for site-wide strings/images. Admin only changes.
- **Messages**: Public can only create. Admin can read/delete. Must have valid email.

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)
1. **Unauthorized Project Create**: Non-admin tries to create a project. -> EXPECT: DENIED
2. **Identity Spoofing**: Admin tries to update a project but changes ID to a malicious string. -> EXPECT: DENIED (isValidId check)
3. **Ghost Field Injection**: Adding `isVerified: true` to a project document. -> EXPECT: DENIED (hasOnly check)
4. **Content Overwrite**: Public trying to update the home page hero text. -> EXPECT: DENIED
5. **Message Listing**: Public trying to read all contact messages. -> EXPECT: DENIED
6. **Self-Promotion**: Non-verified email user trying to act as admin. -> EXPECT: DENIED
7. **Size Attack**: Sending a 2MB string for a project description. -> EXPECT: DENIED
8. **Path Poisoning**: Creating a project with a 200 character ID. -> EXPECT: DENIED
9. **Timestamp Fraud**: Manually setting `createdAt` to a date in the past. -> EXPECT: DENIED (must be request.time)
10. **Resource Exhaustion**: Creating an array of 10,000 tags in a project. -> EXPECT: DENIED (array size limit)
11. **PII Leak**: Public trying to read the specific message ID directly. -> EXPECT: DENIED
12. **Status Bypass**: Trying to update an immutable field (e.g. initial owner ID if it existed). -> EXPECT: DENIED

## 3. Test Runner Concept
The `firestore.rules` will be validated against these scenarios.
