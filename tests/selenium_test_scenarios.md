# Selenium Automation Test Scenarios — ShopLab

**Framework:** Selenium WebDriver (Python or Java)  
**Browser:** Chrome (latest)  
**Base URL:** http://localhost:5173  
**data-testid attributes** are included on all interactive elements for reliable selector targeting.

---

## Setup

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get("http://localhost:5173")
wait = WebDriverWait(driver, 10)
```

---

## Test Suite 1: Authentication

### AT-01: Successful Registration Flow
```python
# Selector reference
# data-testid: input-name, input-reg-email, input-reg-password, input-confirm-password, btn-register

driver.get("http://localhost:5173/register")
driver.find_element(By.CSS_SELECTOR, '[data-testid="input-name"]').send_keys("Test User")
driver.find_element(By.CSS_SELECTOR, '[data-testid="input-reg-email"]').send_keys("test@example.com")
driver.find_element(By.CSS_SELECTOR, '[data-testid="input-reg-password"]').send_keys("password123")
driver.find_element(By.CSS_SELECTOR, '[data-testid="input-confirm-password"]').send_keys("password123")
driver.find_element(By.CSS_SELECTOR, '[data-testid="btn-register"]').click()

# Assert: redirected to /products
wait.until(EC.url_contains("/products"))
assert "/products" in driver.current_url
```

### AT-02: Login with Valid Credentials
```python
# data-testid: input-email, input-password, btn-login

driver.get("http://localhost:5173/login")
driver.find_element(By.CSS_SELECTOR, '[data-testid="input-email"]').send_keys("test@example.com")
driver.find_element(By.CSS_SELECTOR, '[data-testid="input-password"]').send_keys("password123")
driver.find_element(By.CSS_SELECTOR, '[data-testid="btn-login"]').click()

wait.until(EC.url_contains("/products"))
# Assert cart link and dashboard visible (user logged in)
nav_cart = driver.find_element(By.CSS_SELECTOR, '[data-testid="nav-cart"]')
assert nav_cart.is_displayed()
```

### AT-03: Login with Wrong Password (Negative Test)
```python
driver.get("http://localhost:5173/login")
driver.find_element(By.CSS_SELECTOR, '[data-testid="input-email"]').send_keys("test@example.com")
driver.find_element(By.CSS_SELECTOR, '[data-testid="input-password"]').send_keys("wrongpassword")
driver.find_element(By.CSS_SELECTOR, '[data-testid="btn-login"]').click()

error_el = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="login-error"]')))
assert "Invalid credentials" in error_el.text
```

---

## Test Suite 2: Product Search & Filter

### AT-04: Search Products by Name
```python
driver.get("http://localhost:5173/products")
wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="product-grid"]')))

search = driver.find_element(By.CSS_SELECTOR, '[data-testid="search-input"]')
search.send_keys("keyboard")

import time; time.sleep(0.5)  # debounce delay

cards = driver.find_elements(By.CSS_SELECTOR, '[data-testid^="product-card-"]')
assert len(cards) >= 1
# Verify the card name contains "keyboard" (case-insensitive)
assert "keyboard" in cards[0].text.lower()
```

### AT-05: Filter by Category
```python
from selenium.webdriver.support.ui import Select

driver.get("http://localhost:5173/products")
wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="product-grid"]')))

select = Select(driver.find_element(By.CSS_SELECTOR, '[data-testid="category-filter"]'))
select.select_by_visible_text("Books")

time.sleep(0.5)
cards = driver.find_elements(By.CSS_SELECTOR, '[data-testid^="product-card-"]')
assert len(cards) == 2  # 2 book products seeded
```

---

## Test Suite 3: Cart Operations

### AT-06: Add Product to Cart
```python
# Prerequisites: user logged in
driver.get("http://localhost:5173/products")
wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid^="btn-add-to-cart-"]')))

add_buttons = driver.find_elements(By.CSS_SELECTOR, '[data-testid^="btn-add-to-cart-"]')
add_buttons[0].click()

badge = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="cart-badge"]')))
assert badge.text == "1"
```

### AT-07: Update Cart Quantity
```python
driver.get("http://localhost:5173/cart")
wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="cart-items"]')))

increase_btns = driver.find_elements(By.CSS_SELECTOR, '[data-testid^="btn-increase-"]')
increase_btns[0].click()

qty_displays = driver.find_elements(By.CSS_SELECTOR, '[data-testid^="qty-"]')
assert qty_displays[0].text == "2"
```

### AT-08: Boundary Test — Quantity Reduced to Zero (BUG-03)
```python
# This test DOCUMENTS the known bug: qty=0 item remains in cart
driver.get("http://localhost:5173/cart")
wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="cart-items"]')))

# Set item to qty=1 first via decrease
decrease_btn = driver.find_element(By.CSS_SELECTOR, '[data-testid^="btn-decrease-"]')
decrease_btn.click()

qty_display = driver.find_element(By.CSS_SELECTOR, '[data-testid^="qty-"]')
# Bug: qty shows 0 but item not removed
assert qty_display.text == "0"  # Documents the bug — item still present
```

---

## Test Suite 4: Order Placement

### AT-09: End-to-End Order Placement
```python
# Prerequisites: logged in, at least 1 item in cart

driver.get("http://localhost:5173/cart")
wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="btn-place-order"]')))

driver.find_element(By.CSS_SELECTOR, '[data-testid="btn-place-order"]').click()

# Wait for success state
wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="btn-view-orders"]')))
assert "Order Placed" in driver.page_source
```

### AT-10: Dashboard Shows Order History
```python
driver.get("http://localhost:5173/dashboard")
wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, '[data-testid="orders-list"]')))

orders = driver.find_elements(By.CSS_SELECTOR, '[data-testid^="order-"]')
assert len(orders) >= 1
```

---

## Selector Quick Reference

| Element | data-testid |
|---------|-------------|
| Login form | `login-form` |
| Email input (login) | `input-email` |
| Password input (login) | `input-password` |
| Login button | `btn-login` |
| Login error | `login-error` |
| Register form | `register-form` |
| Name input | `input-name` |
| Email input (register) | `input-reg-email` |
| Password input (register) | `input-reg-password` |
| Confirm password | `input-confirm-password` |
| Register button | `btn-register` |
| Register error | `register-error` |
| Navbar logo | `nav-logo` |
| Navbar cart | `nav-cart` |
| Cart badge | `cart-badge` |
| Search input | `search-input` |
| Category filter | `category-filter` |
| Product grid | `product-grid` |
| Product card | `product-card-{id}` |
| Add to cart | `btn-add-to-cart-{id}` |
| Cart items list | `cart-items` |
| Qty display | `qty-{id}` |
| Increase qty | `btn-increase-{id}` |
| Decrease qty | `btn-decrease-{id}` |
| Remove item | `btn-remove-{id}` |
| Cart total | `cart-total` |
| Place order | `btn-place-order` |
| Empty cart msg | `empty-cart` |
| Profile card | `profile-card` |
| Orders list | `orders-list` |
| Chatbot toggle | `chatbot-toggle` |
| Chatbot window | `chatbot-window` |
| Chatbot input | `chatbot-input` |
| Chatbot send | `chatbot-send` |
| Chatbot loading | `chatbot-loading` |
