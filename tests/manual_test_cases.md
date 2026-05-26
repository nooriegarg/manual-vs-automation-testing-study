# Manual Test Cases — ShopLab Testing Research App

**Application:** ShopLab  
**Version:** 1.0.0  
**Tester:** [Name]  
**Date:** [Date]  
**Status Legend:** ✅ Pass | ❌ Fail | ⚠️ Partial

---

## Module 1: User Authentication

| TC ID | Test Case | Steps | Expected Result | Status | Notes |
|-------|-----------|-------|-----------------|--------|-------|
| TC-01 | Valid Registration | 1. Go to /register 2. Enter valid name, email, password 3. Submit | User created, redirected to /products | | |
| TC-02 | Registration — empty fields | Submit form with all fields blank | Error: "All fields are required" | | |
| TC-03 | Registration — weak email (BUG-01) | Enter email "test@local" (no TLD) | **Expected:** Error. **Actual:** Accepted (intentional bug) | | Boundary test |
| TC-04 | Registration — password < 6 chars | Enter password "abc" | Error: "Password must be at least 6 characters" | | |
| TC-05 | Registration — password mismatch (BUG-02) | Enter mismatched passwords and click Submit | Error shown only after Submit, not inline | | UI/UX defect |
| TC-06 | Registration — duplicate email | Register with an already-used email | Error: "Email already registered" | | |
| TC-07 | Valid Login | Enter correct credentials | Redirected to /products, Navbar shows user options | | |
| TC-08 | Login — wrong password | Enter correct email, wrong password | Error: "Invalid credentials" | | |
| TC-09 | Login — unregistered email | Enter email not in database | Error: "Invalid credentials" | | |
| TC-10 | Login — empty fields | Submit empty login form | Error: "Email and password are required" | | |
| TC-11 | Session persistence | Login, close tab, reopen app | User remains logged in | | |
| TC-12 | Logout | Click Logout in Navbar | Redirected to /login, Cart/Dashboard links hidden | | |

---

## Module 2: Product Listing

| TC ID | Test Case | Steps | Expected Result | Status | Notes |
|-------|-----------|-------|-----------------|--------|-------|
| TC-13 | Products load on page open | Navigate to /products | 8 products displayed in grid | | |
| TC-14 | Search by name | Type "keyboard" in search box | Only matching products shown | | |
| TC-15 | Search — no results | Type "xyzabc999" | "No products found." message shown | | |
| TC-16 | Filter by category | Select "Electronics" from dropdown | Only Electronics products shown | | |
| TC-17 | Filter — "All" resets filter | After filtering, select "All" | All 8 products shown | | |
| TC-18 | Search + filter combined | Type "jacket" and select "Clothing" | Only matching product shown | | |
| TC-19 | Product card displays correct info | Check name, price, category badge | Each card shows correct product data | | |

---

## Module 3: Cart & Checkout

| TC ID | Test Case | Steps | Expected Result | Status | Notes |
|-------|-----------|-------|-----------------|--------|-------|
| TC-20 | Add to cart (logged in) | Click "Add to Cart" on a product | Cart badge increments, item appears in /cart | | |
| TC-21 | Add to cart (guest user) | Click "Add to Cart" without login | Redirected to /login | | |
| TC-22 | Add same item twice | Add the same product twice | Quantity increases to 2 (not duplicate rows) | | |
| TC-23 | Increase quantity | Click "+" on cart item | Quantity increments, subtotal updates | | |
| TC-24 | Decrease quantity to 1 | Click "−" when qty is 2 | Quantity becomes 1 | | |
| TC-25 | Decrease quantity to 0 (BUG-03) | Click "−" when qty is 1 | **Expected:** Item removed. **Actual:** Item stays with qty=0 | | Boundary bug |
| TC-26 | Remove item | Click "Remove" button | Item removed from cart | | |
| TC-27 | Cart total accuracy | Add 2 items, check total | Total = sum of (price × qty) for all items | | |
| TC-28 | Place order | With items in cart, click "Place Order" | Order success page shown, cart cleared | | |
| TC-29 | Place order — empty cart | Navigate to /cart with no items | "Your cart is empty" message shown | | |
| TC-30 | Cart mobile layout (BUG-04) | Resize browser to < 480px | **Observed:** qty controls overflow container | | UI/UX bug |

---

## Module 4: Dashboard & Orders

| TC ID | Test Case | Steps | Expected Result | Status | Notes |
|-------|-----------|-------|-----------------|--------|-------|
| TC-31 | Profile displays correctly | Go to /dashboard | User name and email shown in profile card | | |
| TC-32 | Orders display after purchase | Place an order, go to /dashboard | Order with ID, date, items, and total shown | | |
| TC-33 | Multiple orders listed | Place 2 orders | Both orders listed in reverse chronological order | | |
| TC-34 | Protected route — unauthenticated | Try to access /dashboard without login | Redirected to /login | | |

---

## Module 5: Chatbot

| TC ID | Test Case | Steps | Expected Result | Status | Notes |
|-------|-----------|-------|-----------------|--------|-------|
| TC-35 | Open chatbot | Click 💬 button | Chat window opens with welcome message | | |
| TC-36 | Close chatbot | Click ✕ button | Chat window closes | | |
| TC-37 | Send a message | Type a question and press Enter | Loading spinner shown, then reply appears | | |
| TC-38 | Send empty message | Click Send with empty input | Button disabled, no request sent | | |
| TC-39 | Send button disabled during loading | Send a message while previous is loading | Send button remains disabled | | |
| TC-40 | Chatbot delayed response (BUG-05) | Send message when API is slow | Loading state persists indefinitely (no timeout) | | Testing edge case |

---

*Total Test Cases: 40*
