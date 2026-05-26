# ShopLab — Manual Testing Suite
**Document Version:** 1.0  
**Application:** ShopLab E-Commerce Web Application  
**Base URL:** http://localhost:5173  
**Environment:** Local Development  
**Prepared By:** QA Engineer  
**Date:** 2026-05-26  
**Status:** Active

---

## Table of Contents
1. [Test Scope](#scope)
2. [Test Environment](#environment)
3. [Defect Classification](#defects)
4. [Functional Test Cases](#functional)
5. [Validation Test Cases](#validation)
6. [UI/UX Test Cases](#uiux)
7. [Regression Test Cases](#regression)
8. [AI Chatbot Test Cases](#chatbot)
9. [Boundary & Negative Test Cases](#boundary)
10. [Known Intentional Bugs](#known-bugs)

---

## 1. Test Scope <a name="scope"></a>

| In Scope | Out of Scope |
|----------|-------------|
| User Registration & Login | Payment gateway integration |
| Product Listing, Search, Filter | Email notification delivery |
| Cart Management & Checkout | Admin panel (not implemented) |
| Order Placement & Dashboard | Database backup/restore |
| AI Chatbot (Gemini API) | CI/CD pipeline |
| Responsive UI / Chatbot Sidebar | Load/stress testing |

---

## 2. Test Environment <a name="environment"></a>

| Component | Details |
|-----------|---------|
| Frontend | React + Vite — http://localhost:5173 |
| Backend | Node.js + Express — http://localhost:5000 |
| Database | MongoDB Atlas (cloud) |
| AI Service | Google Gemini API (gemini-flash-lite-latest) |
| Browser | Chrome 124+ (primary), Firefox 125+ (secondary) |
| Screen Sizes | Desktop 1440px, Tablet 768px, Mobile 375px |

---

## 3. Defect Classification <a name="defects"></a>

| Severity | Definition |
|----------|-----------|
| **Critical** | Feature completely broken; blocks testing |
| **High** | Core feature broken; workaround not available |
| **Medium** | Feature partially broken; workaround exists |
| **Low** | Minor visual or UX issue |
| **Info** | Intentional known bug (research artifact) |

---

## 4. Functional Test Cases <a name="functional"></a>

---

### TC-F-001
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-F-001 |
| **Module** | Authentication — Registration |
| **Scenario** | Successful user registration with all valid inputs |
| **Priority** | Critical |
| **Preconditions** | Application is running; email address not previously registered |
| **Steps** | 1. Navigate to `/register` 2. Enter full name: `Jane Doe` 3. Enter email: `jane.doe@example.com` 4. Enter password: `secure123` 5. Enter confirm password: `secure123` 6. Click **Create Account** |
| **Expected Result** | User is registered, automatically logged in, and redirected to `/products`. Navbar displays user chip with name "Jane" and Cart/Dashboard icons appear. |
| **Actual Result** | |
| **Status** | |

---

### TC-F-002
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-F-002 |
| **Module** | Authentication — Login |
| **Scenario** | Successful login with registered credentials |
| **Priority** | Critical |
| **Preconditions** | User account `jane.doe@example.com` exists in the database |
| **Steps** | 1. Navigate to `/login` 2. Enter email: `jane.doe@example.com` 3. Enter password: `secure123` 4. Click **Sign In** |
| **Expected Result** | User is redirected to `/products`. Navbar shows user avatar with first name, cart icon, dashboard icon, and logout button. Login/Register links are hidden. |
| **Actual Result** | |
| **Status** | |

---

### TC-F-003
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-F-003 |
| **Module** | Authentication — Logout |
| **Scenario** | User logs out and session is fully cleared |
| **Priority** | High |
| **Preconditions** | User is logged in |
| **Steps** | 1. Click **Logout** in the navbar 2. Observe navbar state 3. Attempt to navigate to `/cart` directly 4. Attempt to navigate to `/dashboard` directly |
| **Expected Result** | User is redirected to `/login`. Navbar shows Login and Register links. Both `/cart` and `/dashboard` redirect to `/login` (protected routes active). localStorage `token` and `user` keys are cleared. |
| **Actual Result** | |
| **Status** | |

---

### TC-F-004
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-F-004 |
| **Module** | Authentication — Session Persistence |
| **Scenario** | User session is restored after browser tab is closed and reopened |
| **Priority** | High |
| **Preconditions** | User is logged in |
| **Steps** | 1. Log in successfully 2. Close the browser tab 3. Open a new tab and navigate to `http://localhost:5173` |
| **Expected Result** | User is still logged in. Navbar shows user chip and authenticated nav items. User is not prompted to log in again. |
| **Actual Result** | |
| **Status** | |

---

### TC-F-005
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-F-005 |
| **Module** | Products — Listing |
| **Scenario** | All seeded products load correctly on the Products page |
| **Priority** | Critical |
| **Preconditions** | Backend is running; MongoDB contains 8 seeded products |
| **Steps** | 1. Navigate to `/products` 2. Wait for page to finish loading |
| **Expected Result** | Exactly 8 product cards are displayed. Each card shows: product name, category badge, correct product image, star rating, stock indicator, price, and "Add to Cart" button. Product count reads "8 products". |
| **Actual Result** | |
| **Status** | |

---

### TC-F-006
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-F-006 |
| **Module** | Products — Search |
| **Scenario** | Product search returns correctly filtered results |
| **Priority** | High |
| **Preconditions** | User is on `/products`; all 8 products loaded |
| **Steps** | 1. Click the search bar in the hero banner 2. Type `keyboard` 3. Wait for debounced results (~300ms) |
| **Expected Result** | Only "Mechanical Keyboard" card is displayed. Product count updates to "1 product". All other product cards disappear. |
| **Actual Result** | |
| **Status** | |

---

### TC-F-007
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-F-007 |
| **Module** | Products — Category Filter |
| **Scenario** | Category pill filter shows only matching products |
| **Priority** | High |
| **Preconditions** | User is on `/products`; all 8 products loaded |
| **Steps** | 1. Click **Electronics** pill 2. Observe results 3. Click **Clothing** pill 4. Observe results 5. Click **Books** pill 6. Observe results 7. Click **All** pill |
| **Expected Result** | Electronics → 3 products. Clothing → 3 products. Books → 2 products. All → 8 products. Active pill is highlighted in indigo. |
| **Actual Result** | |
| **Status** | |

---

### TC-F-008
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-F-008 |
| **Module** | Cart — Add to Cart |
| **Scenario** | Logged-in user adds a product to the cart |
| **Priority** | Critical |
| **Preconditions** | User is logged in; on `/products` page |
| **Steps** | 1. Click **Add** on the "Wireless Noise-Cancelling Headphones" card 2. Observe the navbar cart icon 3. Navigate to `/cart` |
| **Expected Result** | Cart badge shows `1`. Button briefly shows "✓ Added". On `/cart`, headphone item appears with qty=1, price=$89.99, and subtotal=$89.99. Cart total reads $89.99. |
| **Actual Result** | |
| **Status** | |

---

### TC-F-009
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-F-009 |
| **Module** | Cart — Duplicate Add |
| **Scenario** | Adding the same product twice increases quantity, not row count |
| **Priority** | High |
| **Preconditions** | User is logged in; one headphone already in cart |
| **Steps** | 1. Click **Add** on "Wireless Noise-Cancelling Headphones" again 2. Navigate to `/cart` |
| **Expected Result** | Cart shows one row for headphones with qty=2. Subtotal=$179.98. Cart badge shows `2`. No duplicate row is created. |
| **Actual Result** | |
| **Status** | |

---

### TC-F-010
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-F-010 |
| **Module** | Cart — Quantity Management |
| **Scenario** | Quantity increase and decrease buttons update subtotal correctly |
| **Priority** | High |
| **Preconditions** | User is on `/cart` with 1x Mechanical Keyboard ($59.99) |
| **Steps** | 1. Click **+** button → verify qty=2, subtotal=$119.98 2. Click **+** again → verify qty=3, subtotal=$179.97 3. Click **−** → verify qty=2, subtotal=$119.98 |
| **Expected Result** | Each click updates quantity by exactly 1. Subtotal = price × qty on every change. Order summary total updates in real time. |
| **Actual Result** | |
| **Status** | |

---

### TC-F-011
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-F-011 |
| **Module** | Cart — Remove Item |
| **Scenario** | Clicking Remove deletes item from cart entirely |
| **Priority** | High |
| **Preconditions** | Cart contains at least 2 different items |
| **Steps** | 1. Note total before removal 2. Click **Remove** (trash icon) on the first item 3. Observe cart and total |
| **Expected Result** | Item row disappears immediately. Cart total decreases by the removed item's subtotal. Cart badge count decreases accordingly. |
| **Actual Result** | |
| **Status** | |

---

### TC-F-012
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-F-012 |
| **Module** | Checkout — Order Placement |
| **Scenario** | Successful end-to-end order placement |
| **Priority** | Critical |
| **Preconditions** | User logged in; cart contains at least one item |
| **Steps** | 1. Navigate to `/cart` 2. Verify order summary total 3. Click **Place Order** 4. Wait for response |
| **Expected Result** | Success screen appears with "Order Placed!" heading and user's name. Cart is cleared (badge disappears). Clicking "View Orders" navigates to `/dashboard` where the order appears in order history with correct items and total. |
| **Actual Result** | |
| **Status** | |

---

### TC-F-013
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-F-013 |
| **Module** | Dashboard — Order History |
| **Scenario** | Multiple orders display correctly in order history |
| **Priority** | Medium |
| **Preconditions** | User has placed at least 2 orders in separate sessions |
| **Steps** | 1. Navigate to `/dashboard` 2. Scroll through order history section |
| **Expected Result** | Orders are listed in reverse-chronological order (newest first). Each order shows: order ID (last 6 chars), date, item table with qty and price, order total, and "Delivered" badge. Stats row shows correct total orders count and total amount spent. |
| **Actual Result** | |
| **Status** | |

---

### TC-F-014
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-F-014 |
| **Module** | Products — Guest Add to Cart |
| **Scenario** | Unauthenticated user clicking "Add" is redirected to login |
| **Priority** | High |
| **Preconditions** | User is NOT logged in; on `/products` page |
| **Steps** | 1. Click **Add** on any product card |
| **Expected Result** | User is redirected to `/login`. No item is added to cart. After logging in, user is not automatically returned to `/products` (note: no return-URL redirect is implemented — this is acceptable scope). |
| **Actual Result** | |
| **Status** | |

---

## 5. Validation Test Cases <a name="validation"></a>

---

### TC-V-001
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-V-001 |
| **Module** | Authentication — Registration Validation |
| **Scenario** | All fields empty on registration form submission |
| **Priority** | High |
| **Preconditions** | User is on `/register` |
| **Steps** | 1. Leave all fields blank 2. Click **Create Account** |
| **Expected Result** | Error message: "All fields are required". No API call is made. Form remains on the page. |
| **Actual Result** | |
| **Status** | |

---

### TC-V-002
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-V-002 |
| **Module** | Authentication — Password Length |
| **Scenario** | Registration with a 5-character password is rejected |
| **Priority** | High |
| **Preconditions** | User is on `/register` |
| **Steps** | 1. Enter valid name and email 2. Enter password: `ab123` (5 chars) 3. Enter same in confirm password 4. Click **Create Account** |
| **Expected Result** | Backend returns error: "Password must be at least 6 characters". Error message is displayed on form. Account is not created. |
| **Actual Result** | |
| **Status** | |

---

### TC-V-003
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-V-003 |
| **Module** | Authentication — Password Mismatch (BUG-02) |
| **Scenario** | Mismatched confirm password shows error only on submit |
| **Priority** | Medium |
| **Preconditions** | User is on `/register` |
| **Steps** | 1. Enter password: `password123` 2. Enter confirm password: `password456` 3. Observe UI while typing (before submit) 4. Click **Create Account** |
| **Expected Result (Documented Bug)** | No inline validation error appears while typing. Error "Passwords do not match" appears only after clicking Submit. **Note: This is intentional BUG-02 — a UI/UX validation defect for research testing.** |
| **Actual Result** | |
| **Status** | |

---

### TC-V-004
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-V-004 |
| **Module** | Authentication — Duplicate Email |
| **Scenario** | Registering with an already-used email returns a clear error |
| **Priority** | High |
| **Preconditions** | Account with `jane.doe@example.com` already exists |
| **Steps** | 1. Navigate to `/register` 2. Fill form with same email: `jane.doe@example.com` 3. Click **Create Account** |
| **Expected Result** | Error message: "Email already registered". No duplicate account created. |
| **Actual Result** | |
| **Status** | |

---

### TC-V-005
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-V-005 |
| **Module** | Authentication — Email Format (BUG-01) |
| **Scenario** | Loose email regex accepts email without top-level domain |
| **Priority** | Medium |
| **Preconditions** | User is on `/register` |
| **Steps** | 1. Enter email: `test@local` (no .com/.org TLD) 2. Enter valid name, password, confirm password 3. Click **Create Account** |
| **Expected Result (Documented Bug)** | Registration **succeeds**. Standard email validation would reject this. **Note: Intentional BUG-01 — weak email regex for boundary/validation testing.** |
| **Actual Result** | |
| **Status** | |

---

### TC-V-006
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-V-006 |
| **Module** | Authentication — Login Validation |
| **Scenario** | Login with incorrect password shows error without exposing which field is wrong |
| **Priority** | High |
| **Preconditions** | Account `jane.doe@example.com` exists |
| **Steps** | 1. Navigate to `/login` 2. Enter email: `jane.doe@example.com` 3. Enter password: `wrongpassword` 4. Click **Sign In** |
| **Expected Result** | Error: "Invalid credentials". Message does not specify whether email or password is wrong (good security practice). Account is not locked after attempt. |
| **Actual Result** | |
| **Status** | |

---

### TC-V-007
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-V-007 |
| **Module** | Authentication — Login Validation |
| **Scenario** | Login with unregistered email |
| **Priority** | Medium |
| **Preconditions** | None |
| **Steps** | 1. Enter email: `ghost@nobody.com` 2. Enter any password 3. Click **Sign In** |
| **Expected Result** | Error: "Invalid credentials". Same generic message as wrong-password case (no user enumeration). |
| **Actual Result** | |
| **Status** | |

---

### TC-V-008
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-V-008 |
| **Module** | Authentication — Empty Login |
| **Scenario** | Submitting login form with both fields empty |
| **Priority** | Medium |
| **Preconditions** | User is on `/login` |
| **Steps** | 1. Leave email and password blank 2. Click **Sign In** |
| **Expected Result** | Error: "Email and password are required". No API call is made to the backend. |
| **Actual Result** | |
| **Status** | |

---

## 6. UI/UX Test Cases <a name="uiux"></a>

---

### TC-U-001
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-U-001 |
| **Module** | UI — Responsive Layout |
| **Scenario** | Products page renders correctly on mobile viewport (375px) |
| **Priority** | Medium |
| **Preconditions** | Open Chrome DevTools → set viewport to 375px wide |
| **Steps** | 1. Navigate to `/products` 2. Observe product grid layout 3. Check hero banner with search bar 4. Check category pills |
| **Expected Result** | Product grid switches to 1-column layout. Search bar fills full width. Category pills wrap to multiple rows gracefully. No horizontal scrollbar appears on the page. |
| **Actual Result** | |
| **Status** | |

---

### TC-U-002
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-U-002 |
| **Module** | UI — Cart Mobile Overflow (BUG-04) |
| **Scenario** | Cart quantity controls overflow their container on screens < 480px |
| **Priority** | Low |
| **Preconditions** | User is logged in; at least one item in cart; viewport set to 375px |
| **Steps** | 1. Set Chrome DevTools to 375px viewport 2. Navigate to `/cart` 3. Observe the quantity ± buttons and Remove button row |
| **Expected Result (Documented Bug)** | The quantity controls (−, number, +) and Remove button visually overflow or are clipped. **Note: Intentional BUG-04 — responsive layout defect for UI/UX testing.** |
| **Actual Result** | |
| **Status** | |

---

### TC-U-003
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-U-003 |
| **Module** | UI — Product Card Hover |
| **Scenario** | Product card hover animation activates on desktop |
| **Priority** | Low |
| **Preconditions** | User is on `/products` with mouse |
| **Steps** | 1. Hover mouse cursor over any product card 2. Observe card behavior 3. Move mouse away |
| **Expected Result** | Card lifts up (translateY -5px) with deeper shadow on hover. Image zooms in slightly. Transition is smooth. Card returns to original position on mouse-out. |
| **Actual Result** | |
| **Status** | |

---

### TC-U-004
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-U-004 |
| **Module** | UI — Chatbot Panel Open/Close |
| **Scenario** | Chatbot sliding panel opens and main content shifts left |
| **Priority** | High |
| **Preconditions** | Desktop viewport (≥ 1024px); user is on any page |
| **Steps** | 1. Click the floating 💬 Bot icon (bottom-right) 2. Observe page layout 3. Observe chatbot panel 4. Click the ✕ close button in the panel header |
| **Expected Result** | Panel slides in from the right (380px wide). Main content area smoothly shifts left by 380px via CSS transition. Panel header shows "ShopLab AI", green online dot, and close button. Closing reverses the transition. FAB icon changes from Bot to ✕ when open. |
| **Actual Result** | |
| **Status** | |

---

### TC-U-005
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-U-005 |
| **Module** | UI — Chatbot Panel via Navbar Icon |
| **Scenario** | Chatbot can also be toggled from the navbar icon |
| **Priority** | Medium |
| **Preconditions** | User is logged in |
| **Steps** | 1. Click the message icon in the navbar (MessageCircle icon) 2. Observe panel 3. Click the same navbar icon again |
| **Expected Result** | Chatbot panel opens. The navbar icon becomes highlighted (indigo background). Clicking again closes the panel. State is shared between navbar icon and FAB button. |
| **Actual Result** | |
| **Status** | |

---

### TC-U-006
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-U-006 |
| **Module** | UI — Auth Pages Split Layout |
| **Scenario** | Login and Register pages display two-panel layout on desktop |
| **Priority** | Low |
| **Preconditions** | Viewport ≥ 900px |
| **Steps** | 1. Navigate to `/login` 2. Observe left and right panels 3. Navigate to `/register` 4. Observe layout |
| **Expected Result** | Left panel shows indigo-to-purple gradient with ShopLab logo, tagline, and feature bullet points. Right panel shows form card with shadow. Input fields display Mail, Lock, User icons on the left side of the field. |
| **Actual Result** | |
| **Status** | |

---

### TC-U-007
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-U-007 |
| **Module** | UI — Navbar Active State |
| **Scenario** | Active navigation link is visually highlighted |
| **Priority** | Low |
| **Preconditions** | User is logged in |
| **Steps** | 1. Navigate to `/products` — observe Products link 2. Navigate to `/cart` — observe Cart icon 3. Navigate to `/dashboard` — observe Dashboard icon |
| **Expected Result** | The current page's nav link shows indigo highlight (indigo color + light indigo background). Other links appear in default gray. Active state updates immediately on navigation. |
| **Actual Result** | |
| **Status** | |

---

### TC-U-008
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-U-008 |
| **Module** | UI — Cart Badge Count |
| **Scenario** | Cart badge reflects cumulative item quantity |
| **Priority** | Medium |
| **Preconditions** | User is logged in; cart is empty |
| **Steps** | 1. Add 1x Headphones → badge shows 1 2. Add 1x Keyboard → badge shows 2 3. On `/cart`, increase Keyboard qty to 3 → badge shows 4 4. Remove Headphones → badge shows 3 |
| **Expected Result** | Cart badge count always equals the sum of all item quantities (not unique item count). Badge disappears when cart is empty. |
| **Actual Result** | |
| **Status** | |

---

## 7. Regression Test Cases <a name="regression"></a>

---

### TC-R-001
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-R-001 |
| **Module** | Regression — Auth Flow |
| **Scenario** | Full auth regression after any backend change |
| **Priority** | Critical |
| **Preconditions** | Clean test user account (delete before running) |
| **Steps** | 1. Register new user 2. Logout 3. Login with same credentials 4. Verify navbar state 5. Logout again 6. Confirm session cleared |
| **Expected Result** | All three operations (register → logout → login → logout) complete successfully without errors. JWT is stored and cleared correctly at each step. |
| **Actual Result** | |
| **Status** | |

---

### TC-R-002
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-R-002 |
| **Module** | Regression — Cart Persistence Across Navigation |
| **Scenario** | Cart state is preserved when navigating between pages |
| **Priority** | High |
| **Preconditions** | User logged in; add 2 items to cart |
| **Steps** | 1. Add Headphones and Keyboard to cart 2. Navigate to `/products` 3. Navigate to `/dashboard` 4. Navigate back to `/cart` |
| **Expected Result** | Both items still in cart with correct quantities and prices. Cart badge count unchanged throughout navigation. |
| **Actual Result** | |
| **Status** | |

---

### TC-R-003
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-R-003 |
| **Module** | Regression — Search After Category Filter |
| **Scenario** | Search and category filter can be used in combination without breaking each other |
| **Priority** | High |
| **Preconditions** | User is on `/products` |
| **Steps** | 1. Select **Electronics** filter 2. Type `hub` in search 3. Clear search 4. Verify Electronics filter still active 5. Select **All** 6. Verify all 8 products return |
| **Expected Result** | Step 2: Shows only "USB-C Hub 7-in-1". Step 3: Shows all 3 Electronics products. Step 6: Shows all 8 products. Filters reset cleanly. |
| **Actual Result** | |
| **Status** | |

---

### TC-R-004
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-R-004 |
| **Module** | Regression — Order After Cart Modification |
| **Scenario** | Order total is accurate after qty changes before checkout |
| **Priority** | Critical |
| **Preconditions** | User logged in; cart has items |
| **Steps** | 1. Add T-Shirt ($14.99) and Jacket ($54.99) 2. On cart, increase T-Shirt qty to 3 3. Note expected total: (14.99×3) + 54.99 = $99.96 4. Click **Place Order** 5. Check dashboard order total |
| **Expected Result** | Order summary shows $99.96 before placing. Dashboard order record shows $99.96 and correct item quantities. |
| **Actual Result** | |
| **Status** | |

---

### TC-R-005
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-R-005 |
| **Module** | Regression — Protected Routes |
| **Scenario** | Protected routes redirect unauthenticated users after logout |
| **Priority** | High |
| **Preconditions** | None |
| **Steps** | 1. Without logging in, navigate directly to `http://localhost:5173/cart` 2. Navigate directly to `http://localhost:5173/dashboard` |
| **Expected Result** | Both routes immediately redirect to `/login`. No flash of cart/dashboard content before redirect. |
| **Actual Result** | |
| **Status** | |

---

## 8. AI Chatbot Test Cases <a name="chatbot"></a>

---

### TC-C-001
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-C-001 |
| **Module** | Chatbot — Basic Interaction |
| **Scenario** | Chatbot responds to a product-related question |
| **Priority** | High |
| **Preconditions** | Backend running with valid GEMINI_API_KEY; chatbot panel open |
| **Steps** | 1. Open chatbot panel 2. Type: `What products do you sell?` 3. Click Send or press Enter |
| **Expected Result** | Loading typing indicator (three bouncing dots) appears immediately. Within 5–15 seconds, bot replies mentioning Electronics, Clothing, or Books. Reply appears in a left-aligned white bubble. |
| **Actual Result** | |
| **Status** | |

---

### TC-C-002
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-C-002 |
| **Module** | Chatbot — Enter Key Send |
| **Scenario** | Pressing Enter sends message (not a newline) |
| **Priority** | Medium |
| **Preconditions** | Chatbot panel is open |
| **Steps** | 1. Click the chat input field 2. Type: `Tell me about the headphones` 3. Press **Enter** key |
| **Expected Result** | Message is sent immediately on Enter key press. No new line is inserted in the input. Input clears after sending. |
| **Actual Result** | |
| **Status** | |

---

### TC-C-003
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-C-003 |
| **Module** | Chatbot — Empty Message |
| **Scenario** | Send button is disabled and no API call is made when input is empty |
| **Priority** | Medium |
| **Preconditions** | Chatbot panel is open; input field is empty |
| **Steps** | 1. Do not type anything 2. Click the **Send** button (circular button) 3. Press **Enter** key |
| **Expected Result** | Send button is visually disabled (opacity 55%). No message appears in chat. No API call is made. Chat remains in its current state. |
| **Actual Result** | |
| **Status** | |

---

### TC-C-004
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-C-004 |
| **Module** | Chatbot — Loading State |
| **Scenario** | Input and Send button are disabled while a response is loading |
| **Priority** | Medium |
| **Preconditions** | Chatbot panel is open |
| **Steps** | 1. Send a message 2. Immediately try to type in the input field 3. Immediately try to click Send |
| **Expected Result** | Input field becomes disabled (not interactive). Send button is disabled. Typing indicator (3 animated dots) is visible in a bot bubble. These disable until the response or error arrives. |
| **Actual Result** | |
| **Status** | |

---

### TC-C-005
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-C-005 |
| **Module** | Chatbot — Conversation History |
| **Scenario** | Multiple messages build a visible conversation thread |
| **Priority** | Medium |
| **Preconditions** | Chatbot panel is open |
| **Steps** | 1. Send: `What electronics do you have?` 2. Wait for reply 3. Send: `How about books?` 4. Wait for reply 5. Send: `What is your return policy?` |
| **Expected Result** | All 3 user messages (right-aligned, indigo gradient) and 3 bot replies (left-aligned, white cards) are visible in scroll order. Chat auto-scrolls to the latest message after each reply. |
| **Actual Result** | |
| **Status** | |

---

### TC-C-006
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-C-006 |
| **Module** | Chatbot — Off-Topic Redirection |
| **Scenario** | Chatbot redirects unrelated questions back to store topics |
| **Priority** | Low |
| **Preconditions** | Chatbot panel is open |
| **Steps** | 1. Send: `What is the capital of France?` 2. Wait for reply |
| **Expected Result** | Bot politely declines to answer off-topic questions and redirects to store-related topics (products, orders, shipping). Does not answer "Paris". |
| **Actual Result** | |
| **Status** | |

---

### TC-C-007
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-C-007 |
| **Module** | Chatbot — API Unavailable (Backend Down) |
| **Scenario** | Chatbot shows a graceful error when backend is not running |
| **Priority** | High |
| **Preconditions** | Backend server is **stopped** (`Ctrl+C`); chatbot panel is open |
| **Steps** | 1. Stop the backend server 2. Type a message 3. Click Send |
| **Expected Result** | Typing indicator appears briefly, then an error message appears in a bot bubble: "Chatbot is unavailable. Please try again later." No unhandled exception. UI remains functional. |
| **Actual Result** | |
| **Status** | |

---

### TC-C-008
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-C-008 |
| **Module** | Chatbot — Delayed Response (BUG-05) |
| **Scenario** | Loading state hangs indefinitely on very slow API response |
| **Priority** | Low |
| **Preconditions** | Chrome DevTools open; Network tab set to **Slow 3G** throttle |
| **Steps** | 1. Open DevTools → Network → set throttling to Slow 3G 2. Open chatbot panel 3. Send any message 4. Observe for 30+ seconds |
| **Expected Result (Documented Bug)** | Typing indicator (3 dots) remains visible indefinitely. No timeout message is ever shown. Input stays disabled. **Note: Intentional BUG-05 — no timeout implemented for research testing.** |
| **Actual Result** | |
| **Status** | |

---

## 9. Boundary & Negative Test Cases <a name="boundary"></a>

---

### TC-B-001
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-B-001 |
| **Module** | Cart — Zero Quantity Boundary (BUG-03) |
| **Scenario** | Reducing item quantity to 0 does not remove it from cart |
| **Priority** | Medium |
| **Preconditions** | Cart contains 1x T-Shirt (qty=1) |
| **Steps** | 1. On `/cart`, click **−** on the T-Shirt (qty=1 → 0) 2. Observe cart row 3. Check cart badge count 4. Check order total |
| **Expected Result (Documented Bug)** | Item remains visible in cart with qty=0. Subtotal for that item shows $0.00. Total may be unaffected or incorrect. Cart badge may show 0 but item row persists. **Note: Intentional BUG-03 — boundary value defect.** |
| **Actual Result** | |
| **Status** | |

---

### TC-B-002
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-B-002 |
| **Module** | Cart — Multi-Item Total Precision |
| **Scenario** | Cart total is calculated correctly with decimal prices |
| **Priority** | High |
| **Preconditions** | User is logged in |
| **Steps** | 1. Add Clean Code ($29.99) × 1 2. Add Pragmatic Programmer ($24.99) × 1 3. Add T-Shirt ($14.99) × 2 4. Verify total |
| **Expected Result** | Total = $29.99 + $24.99 + ($14.99 × 2) = $84.96. No floating-point rounding errors displayed (e.g., $84.9600001). Total shown as `$84.96`. |
| **Actual Result** | |
| **Status** | |

---

### TC-B-003
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-B-003 |
| **Module** | Authentication — Name Boundary |
| **Scenario** | Registration with a 1-character name |
| **Priority** | Low |
| **Preconditions** | User is on `/register` |
| **Steps** | 1. Enter name: `A` (1 character) 2. Enter valid email and passwords 3. Click **Create Account** |
| **Expected Result** | Backend rejects with error: "Name must be at least 2 characters" (enforced by Mongoose schema `minlength: 2`). |
| **Actual Result** | |
| **Status** | |

---

### TC-B-004
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-B-004 |
| **Module** | Products — Search Boundary |
| **Scenario** | Single-character search returns results without crashing |
| **Priority** | Medium |
| **Preconditions** | User is on `/products` |
| **Steps** | 1. Type `k` into the search bar 2. Wait for debounced results |
| **Expected Result** | Returns any products whose name contains "k" (e.g., "Mechanical Keyboard"). No error. Product count label updates. No crash or empty-state error. |
| **Actual Result** | |
| **Status** | |

---

### TC-B-005
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-B-005 |
| **Module** | Products — Search with Special Characters |
| **Scenario** | Search with special characters does not throw a server error |
| **Priority** | Medium |
| **Preconditions** | User is on `/products` |
| **Steps** | 1. Type `<script>alert(1)</script>` in the search bar 2. Observe results |
| **Expected Result** | No products found (empty state shown). No JavaScript is executed. No server 500 error. The string is treated as a literal search term, not code. |
| **Actual Result** | |
| **Status** | |

---

### TC-B-006
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-B-006 |
| **Module** | Authentication — SQL/NoSQL Injection |
| **Scenario** | Injection string in login email field does not bypass auth |
| **Priority** | High |
| **Preconditions** | User is on `/login` |
| **Steps** | 1. Enter email: `{"$gt": ""}` 2. Enter any password 3. Click **Sign In** |
| **Expected Result** | Login fails with "Invalid credentials". No user data is returned. Application handles the malformed input without crashing. |
| **Actual Result** | |
| **Status** | |

---

### TC-B-007
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-B-007 |
| **Module** | Cart — Place Order with Empty Cart |
| **Scenario** | Place Order API call is not possible with empty cart |
| **Priority** | Medium |
| **Preconditions** | User is logged in |
| **Steps** | 1. Navigate to `/cart` with an empty cart |
| **Expected Result** | "Your cart is empty" state is displayed with a Browse Products button. The "Place Order" button is **not rendered at all** — there is no way to trigger a checkout with zero items. |
| **Actual Result** | |
| **Status** | |

---

### TC-B-008
| Field | Details |
|-------|---------|
| **Test Case ID** | TC-B-008 |
| **Module** | Chatbot — Very Long Message |
| **Scenario** | Sending a 500+ character message does not break the UI |
| **Priority** | Low |
| **Preconditions** | Chatbot panel is open |
| **Steps** | 1. Paste a 500-character string into the chatbot input 2. Click Send |
| **Expected Result** | Message is sent. User bubble wraps text correctly without overflowing the panel width. Bot responds normally. No UI breakage. |
| **Actual Result** | |
| **Status** | |

---

## 10. Known Intentional Bugs (Research Artifacts) <a name="known-bugs"></a>

The following defects are **deliberately introduced** for software testing research purposes. They must **not** be fixed during the research period.

| Bug ID | TC Reference | Module | Description | Severity |
|--------|-------------|--------|-------------|----------|
| BUG-01 | TC-V-005 | Registration | Loose email regex accepts emails without TLD (e.g., `a@b`) | Info |
| BUG-02 | TC-V-003 | Registration | Password mismatch error shown only on submit, not inline | Info |
| BUG-03 | TC-B-001 | Cart | qty=0 does not auto-remove item from cart | Info |
| BUG-04 | TC-U-002 | Cart UI | Quantity controls overflow container on screens < 480px | Info |
| BUG-05 | TC-C-008 | Chatbot | No timeout on Gemini API call — UI loading state hangs indefinitely | Info |

---

## Test Execution Summary Template

| Category | Total TCs | Passed | Failed | Blocked | Not Run |
|----------|-----------|--------|--------|---------|---------|
| Functional | 14 | | | | |
| Validation | 8 | | | | |
| UI/UX | 8 | | | | |
| Regression | 5 | | | | |
| Chatbot | 8 | | | | |
| Boundary/Negative | 8 | | | | |
| **Total** | **51** | | | | |

---

*Document prepared for: Manual Testing vs Test Automation — Empirical Research Study*  
*All test cases designed to support comparative analysis of manual vs Selenium automation effort, time, and defect detection rate.*
