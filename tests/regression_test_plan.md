# Regression Test Plan — ShopLab

**Purpose:** Define what must be re-tested after each type of code change to catch regressions.  
**Strategy:** Priority-based. P1 = always run. P2 = run when affected module changes.

---

## Regression Trigger Matrix

| Code Change Area | P1 Tests to Run | P2 Tests to Run |
|-----------------|-----------------|-----------------|
| Auth routes / models | TC-01 to TC-12 | TC-20, TC-34 |
| Product routes | TC-13 to TC-19 | TC-20, TC-22 |
| Cart context / Cart page | TC-20 to TC-30 | TC-27, TC-28 |
| Orders route | TC-28, TC-31 to TC-33 | TC-34 |
| Chatbot route / component | TC-35 to TC-40 | — |
| Navbar component | TC-12, TC-20, TC-34 | TC-07 |
| CSS / styling changes | TC-30 (mobile layout) | TC-19, TC-24 |

---

## P1 Regression Checklist (Run After Every Merge)

- [ ] TC-07: Login with valid credentials succeeds
- [ ] TC-12: Logout works and clears session
- [ ] TC-13: Products load on /products
- [ ] TC-20: Logged-in user can add item to cart
- [ ] TC-28: Order placement succeeds end-to-end
- [ ] TC-34: Unauthenticated user cannot access /dashboard
- [ ] TC-35: Chatbot opens and receives a message

---

## Known Intentional Regressions (Do NOT Fix)

These are deliberately left as testing artifacts for research purposes:

| Bug ID | TC Reference | Description |
|--------|-------------|-------------|
| BUG-01 | TC-03 | Loose email regex accepts no-TLD emails |
| BUG-02 | TC-05 | Confirm-password mismatch shown only on submit |
| BUG-03 | TC-25, AT-08 | qty=0 does not remove item from cart |
| BUG-04 | TC-30 | Cart qty controls overflow on <480px |
| BUG-05 | TC-40 | No timeout on Gemini API call |

---

## Regression Test Execution Log Template

| Run Date | Triggered By | Tests Run | Passed | Failed | Notes |
|----------|-------------|-----------|--------|--------|-------|
| | | | | | |

---

## Post-Fix Regression Scenarios

### After fixing BUG-03 (qty=0 removal):
Re-run: TC-23, TC-24, TC-25, TC-26, TC-27, TC-28, AT-07, AT-08

### After fixing BUG-01 (email validation):
Re-run: TC-01, TC-02, TC-03, TC-06, AT-01

### After any CSS change:
Re-run: TC-30, TC-13 (product grid layout), TC-32 (orders table)
