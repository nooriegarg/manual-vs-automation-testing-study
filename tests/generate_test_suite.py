import sys
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

doc = Document()

# ── Page margins ──────────────────────────────────────────
for section in doc.sections:
    section.top_margin    = Inches(1)
    section.bottom_margin = Inches(1)
    section.left_margin   = Inches(1.2)
    section.right_margin  = Inches(1.2)

# ── Colour palette ────────────────────────────────────────
C_PRIMARY   = RGBColor(0x4F, 0x46, 0xE5)   # indigo
C_DARK      = RGBColor(0x0F, 0x17, 0x2A)
C_MUTED     = RGBColor(0x64, 0x74, 0x8B)
C_WHITE     = RGBColor(0xFF, 0xFF, 0xFF)
C_BORDER    = RGBColor(0xE2, 0xE8, 0xF0)
C_HEADER_BG = "4F46E5"   # hex fill for table headers
C_ROW_ALT   = "F8FAFC"   # alternating row fill
C_CRIT_BG   = "FEF2F2"
C_INFO_BG   = "EEF2FF"
C_WARN_BG   = "FFFBEB"

def hex_fill(cell, hex_color):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), hex_color)
    tcPr.append(shd)

def set_cell_border(cell, color="E2E8F0"):
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    for side in ('top', 'left', 'bottom', 'right'):
        el = OxmlElement(f'w:{side}')
        el.set(qn('w:val'), 'single')
        el.set(qn('w:sz'), '4')
        el.set(qn('w:color'), color)
        tcBorders.append(el)
    tcPr.append(tcBorders)

def para_text(doc, text, size=11, bold=False, color=None, italic=False,
              align=WD_ALIGN_PARAGRAPH.LEFT, space_before=3, space_after=4):
    p = doc.add_paragraph()
    p.alignment = align
    p.paragraph_format.space_before = Pt(space_before)
    p.paragraph_format.space_after  = Pt(space_after)
    r = p.add_run(text)
    r.bold       = bold
    r.italic     = italic
    r.font.size  = Pt(size)
    r.font.color.rgb = color or C_DARK
    return p

def add_section_heading(doc, text, number=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(18)
    p.paragraph_format.space_after  = Pt(6)
    # Thick left border effect via shading paragraph
    pPr = p._p.get_or_add_pPr()
    pBdr = OxmlElement('w:pBdr')
    left = OxmlElement('w:left')
    left.set(qn('w:val'), 'single')
    left.set(qn('w:sz'), '18')
    left.set(qn('w:space'), '6')
    left.set(qn('w:color'), '4F46E5')
    pBdr.append(left)
    pPr.append(pBdr)
    label = f"{number}. {text}" if number else text
    r = p.add_run(label)
    r.bold = True
    r.font.size = Pt(14)
    r.font.color.rgb = C_PRIMARY
    return p

def add_tc_table(doc, fields):
    """
    fields: list of (label, value, bg_hex_or_None)
    """
    tbl = doc.add_table(rows=0, cols=2)
    tbl.style = 'Table Grid'
    # Column widths
    for cell in tbl.columns[0].cells if tbl.columns else []:
        cell.width = Inches(1.8)

    for label, value, bg in fields:
        row = tbl.add_row()
        # Label cell
        lc = row.cells[0]
        hex_fill(lc, "EEF2FF")
        set_cell_border(lc)
        lp = lc.paragraphs[0]
        lr = lp.add_run(label)
        lr.bold = True
        lr.font.size = Pt(9.5)
        lr.font.color.rgb = C_PRIMARY

        # Value cell
        vc = row.cells[1]
        if bg:
            hex_fill(vc, bg)
        set_cell_border(vc)
        vp = vc.paragraphs[0]
        vp.paragraph_format.space_before = Pt(1)
        vp.paragraph_format.space_after  = Pt(1)

        # Handle multi-line values (steps)
        lines = value.split('\n')
        for i, line in enumerate(lines):
            if i == 0:
                vr = vp.add_run(line)
            else:
                vp.add_run('\n' + line)
                vr = None
            if i == 0 and vr:
                vr.font.size = Pt(10)
                vr.font.color.rgb = C_DARK

        # Set font size on all runs
        for r in vp.runs:
            r.font.size = Pt(10)

    doc.add_paragraph().paragraph_format.space_after = Pt(6)
    return tbl

def add_info_table(doc, headers, rows, header_bg=C_HEADER_BG):
    tbl = doc.add_table(rows=1, cols=len(headers))
    tbl.style = 'Table Grid'
    # Header row
    hrow = tbl.rows[0]
    for i, h in enumerate(headers):
        cell = hrow.cells[i]
        hex_fill(cell, header_bg)
        set_cell_border(cell)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.size = Pt(9)
        r.font.color.rgb = C_WHITE
    # Data rows
    for ri, row_data in enumerate(rows):
        row = tbl.add_row()
        bg = C_ROW_ALT if ri % 2 == 1 else "FFFFFF"
        for ci, cell_text in enumerate(row_data):
            cell = row.cells[ci]
            hex_fill(cell, bg)
            set_cell_border(cell)
            p = cell.paragraphs[0]
            r = p.add_run(str(cell_text))
            r.font.size = Pt(9)
    doc.add_paragraph().paragraph_format.space_after = Pt(4)
    return tbl

# ══════════════════════════════════════════════════════════
#  TITLE PAGE
# ══════════════════════════════════════════════════════════
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.paragraph_format.space_before = Pt(50)
r = p.add_run("ShopLab E-Commerce Application")
r.bold = True; r.font.size = Pt(22); r.font.color.rgb = C_PRIMARY

p2 = doc.add_paragraph()
p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
r2 = p2.add_run("Manual Testing Suite")
r2.bold = True; r2.font.size = Pt(17); r2.font.color.rgb = RGBColor(0x7C, 0x3A, 0xED)

doc.add_paragraph()
for label, val in [
    ("Document Version", "1.0"),
    ("Prepared By",      "QA Engineer"),
    ("Date",             "2026-05-26"),
    ("Environment",      "Local Development"),
    ("Base URL",         "http://localhost:5173"),
    ("Total Test Cases", "51"),
]:
    mp = doc.add_paragraph()
    mp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    mr1 = mp.add_run(f"{label}: ")
    mr1.bold = True; mr1.font.size = Pt(10.5); mr1.font.color.rgb = C_MUTED
    mr2 = mp.add_run(val)
    mr2.font.size = Pt(10.5); mr2.font.color.rgb = C_DARK

doc.add_page_break()

# ══════════════════════════════════════════════════════════
#  SECTION 1 — Test Scope
# ══════════════════════════════════════════════════════════
add_section_heading(doc, "Test Scope", 1)
add_info_table(doc,
    ["In Scope", "Out of Scope"],
    [
        ["User Registration & Login",         "Payment gateway integration"],
        ["Product Listing, Search, Filter",   "Email notification delivery"],
        ["Cart Management & Checkout",        "Admin panel (not implemented)"],
        ["Order Placement & Dashboard",       "Database backup/restore"],
        ["AI Chatbot (Gemini API)",           "CI/CD pipeline"],
        ["Responsive UI / Chatbot Sidebar",   "Load/stress testing"],
    ]
)

# ══════════════════════════════════════════════════════════
#  SECTION 2 — Test Environment
# ══════════════════════════════════════════════════════════
add_section_heading(doc, "Test Environment", 2)
add_info_table(doc,
    ["Component", "Details"],
    [
        ["Frontend",      "React + Vite — http://localhost:5173"],
        ["Backend",       "Node.js + Express — http://localhost:5000"],
        ["Database",      "MongoDB Atlas (cloud)"],
        ["AI Service",    "Google Gemini API (gemini-flash-lite-latest)"],
        ["Browser",       "Chrome 124+ (primary), Firefox 125+ (secondary)"],
        ["Screen Sizes",  "Desktop 1440px, Tablet 768px, Mobile 375px"],
    ]
)

# ══════════════════════════════════════════════════════════
#  SECTION 3 — Defect Classification
# ══════════════════════════════════════════════════════════
add_section_heading(doc, "Defect Classification", 3)
add_info_table(doc,
    ["Severity", "Definition"],
    [
        ["Critical", "Feature completely broken; blocks further testing"],
        ["High",     "Core feature broken; no acceptable workaround"],
        ["Medium",   "Feature partially broken; workaround exists"],
        ["Low",      "Minor visual or UX issue; no functional impact"],
        ["Info",     "Intentional known bug (research artifact — do not fix)"],
    ]
)

# ══════════════════════════════════════════════════════════
#  HELPER: priority colour
# ══════════════════════════════════════════════════════════
PRIORITY_BG = {
    "Critical": "FEE2E2",
    "High":     "FEF3C7",
    "Medium":   "DBEAFE",
    "Low":      "DCFCE7",
}

def tc_bg(priority):
    return PRIORITY_BG.get(priority, "FFFFFF")

# ══════════════════════════════════════════════════════════
#  SECTION 4 — Functional Test Cases
# ══════════════════════════════════════════════════════════
add_section_heading(doc, "Functional Test Cases", 4)

functional_tcs = [
    {
        "id": "TC-F-001", "module": "Authentication — Registration",
        "scenario": "Successful user registration with all valid inputs",
        "priority": "Critical",
        "preconditions": "Application is running; email address not previously registered",
        "steps": "1. Navigate to /register\n2. Enter full name: Jane Doe\n3. Enter email: jane.doe@example.com\n4. Enter password: secure123\n5. Enter confirm password: secure123\n6. Click Create Account",
        "expected": "User is registered, automatically logged in, and redirected to /products. Navbar displays user chip with name 'Jane' and Cart/Dashboard icons appear.",
    },
    {
        "id": "TC-F-002", "module": "Authentication — Login",
        "scenario": "Successful login with registered credentials",
        "priority": "Critical",
        "preconditions": "User account jane.doe@example.com exists in the database",
        "steps": "1. Navigate to /login\n2. Enter email: jane.doe@example.com\n3. Enter password: secure123\n4. Click Sign In",
        "expected": "User is redirected to /products. Navbar shows user avatar with first name, cart icon, dashboard icon, and logout button. Login/Register links are hidden.",
    },
    {
        "id": "TC-F-003", "module": "Authentication — Logout",
        "scenario": "User logs out and session is fully cleared",
        "priority": "High",
        "preconditions": "User is logged in",
        "steps": "1. Click Logout in the navbar\n2. Observe navbar state\n3. Navigate directly to /cart\n4. Navigate directly to /dashboard",
        "expected": "User is redirected to /login. Navbar shows Login and Register links. Both /cart and /dashboard redirect to /login. localStorage token and user keys are cleared.",
    },
    {
        "id": "TC-F-004", "module": "Authentication — Session Persistence",
        "scenario": "User session is restored after browser tab is closed and reopened",
        "priority": "High",
        "preconditions": "User is logged in",
        "steps": "1. Log in successfully\n2. Close the browser tab\n3. Open a new tab and navigate to http://localhost:5173",
        "expected": "User is still logged in. Navbar shows user chip and authenticated nav items without re-login prompt.",
    },
    {
        "id": "TC-F-005", "module": "Products — Listing",
        "scenario": "All seeded products load correctly on the Products page",
        "priority": "Critical",
        "preconditions": "Backend running; MongoDB contains 8 seeded products",
        "steps": "1. Navigate to /products\n2. Wait for page to finish loading",
        "expected": "Exactly 8 product cards displayed. Each card shows: name, category badge, product image, star rating, stock indicator, price, Add to Cart button. Product count reads '8 products'.",
    },
    {
        "id": "TC-F-006", "module": "Products — Search",
        "scenario": "Product search returns correctly filtered results",
        "priority": "High",
        "preconditions": "User is on /products; all 8 products loaded",
        "steps": "1. Click the search bar in the hero banner\n2. Type 'keyboard'\n3. Wait for debounced results (~300ms)",
        "expected": "Only 'Mechanical Keyboard' card is displayed. Product count updates to '1 product'. All other cards disappear.",
    },
    {
        "id": "TC-F-007", "module": "Products — Category Filter",
        "scenario": "Category pill filter shows only matching products",
        "priority": "High",
        "preconditions": "User is on /products; all 8 products loaded",
        "steps": "1. Click Electronics pill\n2. Click Clothing pill\n3. Click Books pill\n4. Click All pill",
        "expected": "Electronics → 3 products. Clothing → 3 products. Books → 2 products. All → 8 products. Active pill highlighted in indigo.",
    },
    {
        "id": "TC-F-008", "module": "Cart — Add to Cart",
        "scenario": "Logged-in user adds a product to the cart",
        "priority": "Critical",
        "preconditions": "User is logged in; on /products",
        "steps": "1. Click Add on 'Wireless Noise-Cancelling Headphones'\n2. Observe navbar cart icon\n3. Navigate to /cart",
        "expected": "Cart badge shows 1. Button briefly shows '✓ Added'. On /cart, headphone item appears with qty=1, price=$89.99, subtotal=$89.99. Total reads $89.99.",
    },
    {
        "id": "TC-F-009", "module": "Cart — Duplicate Add",
        "scenario": "Adding the same product twice increases quantity, not row count",
        "priority": "High",
        "preconditions": "User is logged in; one headphone already in cart",
        "steps": "1. Click Add on 'Wireless Noise-Cancelling Headphones' again\n2. Navigate to /cart",
        "expected": "Cart shows one row for headphones with qty=2. Subtotal=$179.98. Cart badge shows 2. No duplicate row created.",
    },
    {
        "id": "TC-F-010", "module": "Cart — Quantity Management",
        "scenario": "Quantity +/− buttons update subtotal correctly in real time",
        "priority": "High",
        "preconditions": "Cart contains 1x Mechanical Keyboard ($59.99)",
        "steps": "1. Click + → verify qty=2, subtotal=$119.98\n2. Click + → verify qty=3, subtotal=$179.97\n3. Click − → verify qty=2, subtotal=$119.98",
        "expected": "Each click updates quantity by exactly 1. Subtotal = price × qty at every step. Order summary total updates in real time.",
    },
    {
        "id": "TC-F-011", "module": "Cart — Remove Item",
        "scenario": "Clicking Remove deletes item from cart entirely",
        "priority": "High",
        "preconditions": "Cart contains at least 2 different items",
        "steps": "1. Note total before removal\n2. Click Remove (trash icon) on the first item\n3. Observe cart and total",
        "expected": "Item row disappears immediately. Total decreases by removed item's subtotal. Badge count decreases accordingly.",
    },
    {
        "id": "TC-F-012", "module": "Checkout — Order Placement",
        "scenario": "Successful end-to-end order placement",
        "priority": "Critical",
        "preconditions": "User logged in; cart contains at least one item",
        "steps": "1. Navigate to /cart\n2. Verify order summary total\n3. Click Place Order\n4. Wait for response",
        "expected": "Success screen: 'Order Placed!' with user name. Cart is cleared. Clicking 'View Orders' → /dashboard shows the order with correct items and total.",
    },
    {
        "id": "TC-F-013", "module": "Dashboard — Order History",
        "scenario": "Multiple orders display correctly in order history",
        "priority": "Medium",
        "preconditions": "User has placed at least 2 orders",
        "steps": "1. Navigate to /dashboard\n2. Scroll through order history",
        "expected": "Orders listed newest first. Each shows: order ID, date, item table with qty/price, total, 'Delivered' badge. Stats row shows correct total orders and total spent.",
    },
    {
        "id": "TC-F-014", "module": "Products — Guest Cart Redirect",
        "scenario": "Unauthenticated user clicking Add is redirected to login",
        "priority": "High",
        "preconditions": "User is NOT logged in; on /products",
        "steps": "1. Click Add on any product card",
        "expected": "User is redirected to /login. No item is added to cart.",
    },
]

for tc in functional_tcs:
    para_text(doc, tc['id'], size=11, bold=True, color=C_PRIMARY, space_before=10, space_after=2)
    add_tc_table(doc, [
        ("Test Case ID",    tc['id'],            "EEF2FF"),
        ("Module",          tc['module'],         None),
        ("Scenario",        tc['scenario'],       None),
        ("Priority",        tc['priority'],       tc_bg(tc['priority'])),
        ("Preconditions",   tc['preconditions'],  None),
        ("Steps",           tc['steps'],          "F8FAFC"),
        ("Expected Result", tc['expected'],       "F0FDF4"),
        ("Actual Result",   "",                   None),
        ("Status",          "",                   None),
    ])

# ══════════════════════════════════════════════════════════
#  SECTION 5 — Validation Test Cases
# ══════════════════════════════════════════════════════════
doc.add_page_break()
add_section_heading(doc, "Validation Test Cases", 5)

validation_tcs = [
    {
        "id": "TC-V-001", "module": "Registration — Empty Fields",
        "scenario": "All fields empty on registration form submission",
        "priority": "High",
        "preconditions": "User is on /register",
        "steps": "1. Leave all fields blank\n2. Click Create Account",
        "expected": "Error: 'All fields are required'. No API call made. Form remains on page.",
    },
    {
        "id": "TC-V-002", "module": "Registration — Password Length",
        "scenario": "Registration with a 5-character password is rejected",
        "priority": "High",
        "preconditions": "User is on /register",
        "steps": "1. Enter valid name and email\n2. Enter password: 'ab123' (5 chars)\n3. Enter same in confirm password\n4. Click Create Account",
        "expected": "Backend error: 'Password must be at least 6 characters'. Account not created.",
    },
    {
        "id": "TC-V-003", "module": "Registration — Password Mismatch [BUG-02]",
        "scenario": "Confirm password mismatch shows error only on submit (intentional bug)",
        "priority": "Medium",
        "preconditions": "User is on /register",
        "steps": "1. Enter password: 'password123'\n2. Enter confirm: 'password456'\n3. Observe UI while typing\n4. Click Create Account",
        "expected": "[BUG-02] No inline validation error while typing. Error 'Passwords do not match' shown ONLY after Submit click. Intentional research defect.",
    },
    {
        "id": "TC-V-004", "module": "Registration — Duplicate Email",
        "scenario": "Registering with already-used email returns a clear error",
        "priority": "High",
        "preconditions": "Account jane.doe@example.com already exists",
        "steps": "1. Navigate to /register\n2. Fill with email: jane.doe@example.com\n3. Click Create Account",
        "expected": "Error: 'Email already registered'. No duplicate account created.",
    },
    {
        "id": "TC-V-005", "module": "Registration — Weak Email [BUG-01]",
        "scenario": "Loose email regex accepts email without top-level domain",
        "priority": "Medium",
        "preconditions": "User is on /register",
        "steps": "1. Enter email: 'test@local' (no TLD)\n2. Enter valid name, password, confirm\n3. Click Create Account",
        "expected": "[BUG-01] Registration SUCCEEDS. Standard validation would reject this. Intentional research defect.",
    },
    {
        "id": "TC-V-006", "module": "Login — Wrong Password",
        "scenario": "Login with incorrect password shows generic error (no field disclosure)",
        "priority": "High",
        "preconditions": "Account jane.doe@example.com exists",
        "steps": "1. Navigate to /login\n2. Enter email: jane.doe@example.com\n3. Enter password: wrongpassword\n4. Click Sign In",
        "expected": "Error: 'Invalid credentials'. Message does not disclose whether email or password is wrong. No account lockout.",
    },
    {
        "id": "TC-V-007", "module": "Login — Unregistered Email",
        "scenario": "Login with unregistered email returns same error as wrong password",
        "priority": "Medium",
        "preconditions": "None",
        "steps": "1. Enter email: ghost@nobody.com\n2. Enter any password\n3. Click Sign In",
        "expected": "Error: 'Invalid credentials'. Same message as wrong-password case (no user enumeration).",
    },
    {
        "id": "TC-V-008", "module": "Login — Empty Fields",
        "scenario": "Submitting empty login form",
        "priority": "Medium",
        "preconditions": "User is on /login",
        "steps": "1. Leave email and password blank\n2. Click Sign In",
        "expected": "Error: 'Email and password are required'. No API call made.",
    },
]

for tc in validation_tcs:
    para_text(doc, tc['id'], size=11, bold=True, color=C_PRIMARY, space_before=10, space_after=2)
    add_tc_table(doc, [
        ("Test Case ID",    tc['id'],            "EEF2FF"),
        ("Module",          tc['module'],         None),
        ("Scenario",        tc['scenario'],       None),
        ("Priority",        tc['priority'],       tc_bg(tc['priority'])),
        ("Preconditions",   tc['preconditions'],  None),
        ("Steps",           tc['steps'],          "F8FAFC"),
        ("Expected Result", tc['expected'],       "F0FDF4"),
        ("Actual Result",   "",                   None),
        ("Status",          "",                   None),
    ])

# ══════════════════════════════════════════════════════════
#  SECTION 6 — UI/UX Test Cases
# ══════════════════════════════════════════════════════════
doc.add_page_break()
add_section_heading(doc, "UI/UX Test Cases", 6)

uiux_tcs = [
    {
        "id": "TC-U-001", "module": "Responsive — Products Page",
        "scenario": "Products page renders correctly on mobile viewport (375px)",
        "priority": "Medium",
        "preconditions": "Chrome DevTools → viewport set to 375px wide",
        "steps": "1. Navigate to /products\n2. Observe product grid layout\n3. Check hero banner and search bar\n4. Check category pills",
        "expected": "Grid switches to 1-column layout. Search bar fills full width. Category pills wrap gracefully. No horizontal scrollbar.",
    },
    {
        "id": "TC-U-002", "module": "Cart — Mobile Overflow [BUG-04]",
        "scenario": "Cart quantity controls overflow their container on screens < 480px",
        "priority": "Low",
        "preconditions": "User logged in; item in cart; viewport 375px",
        "steps": "1. Set Chrome DevTools to 375px\n2. Navigate to /cart\n3. Observe the quantity ± buttons and Remove button row",
        "expected": "[BUG-04] Qty controls overflow/clip their container. Intentional responsive layout defect.",
    },
    {
        "id": "TC-U-003", "module": "Product Card — Hover Animation",
        "scenario": "Product card hover animation activates on desktop",
        "priority": "Low",
        "preconditions": "User is on /products with a mouse pointer",
        "steps": "1. Hover mouse over any product card\n2. Observe card behavior\n3. Move mouse away",
        "expected": "Card lifts (translateY -5px) with deeper shadow. Image zooms slightly. Smooth transition. Returns to original on mouse-out.",
    },
    {
        "id": "TC-U-004", "module": "Chatbot — Sliding Panel",
        "scenario": "Chatbot panel opens and main content shifts left smoothly",
        "priority": "High",
        "preconditions": "Desktop viewport ≥ 1024px",
        "steps": "1. Click floating Bot icon (bottom-right)\n2. Observe page layout\n3. Observe chatbot panel\n4. Click ✕ in panel header",
        "expected": "Panel slides in from right (380px). Main content shifts left by 380px via CSS transition. Panel shows 'ShopLab AI', green online dot, close button. Closing reverses transition.",
    },
    {
        "id": "TC-U-005", "module": "Chatbot — Navbar Toggle",
        "scenario": "Chatbot can also be toggled from the navbar icon",
        "priority": "Medium",
        "preconditions": "User is logged in",
        "steps": "1. Click MessageCircle icon in navbar\n2. Observe panel\n3. Click same icon again",
        "expected": "Panel opens. Navbar icon becomes highlighted (indigo). Clicking again closes. State shared between navbar and FAB.",
    },
    {
        "id": "TC-U-006", "module": "Auth Pages — Split Layout",
        "scenario": "Login and Register pages display two-panel layout on desktop",
        "priority": "Low",
        "preconditions": "Viewport ≥ 900px",
        "steps": "1. Navigate to /login\n2. Navigate to /register",
        "expected": "Left panel: indigo-purple gradient with logo, tagline, feature bullets. Right panel: form card with shadow. Input fields show icons (Mail, Lock, User).",
    },
    {
        "id": "TC-U-007", "module": "Navbar — Active State",
        "scenario": "Active navigation link is visually highlighted per current route",
        "priority": "Low",
        "preconditions": "User is logged in",
        "steps": "1. Navigate to /products → observe Products link\n2. Navigate to /cart → observe Cart icon\n3. Navigate to /dashboard → observe Dashboard icon",
        "expected": "Current page nav link shows indigo highlight. Other links remain in default gray. Updates immediately on navigation.",
    },
    {
        "id": "TC-U-008", "module": "Cart Badge — Live Count",
        "scenario": "Cart badge reflects cumulative item quantity at all times",
        "priority": "Medium",
        "preconditions": "User is logged in; cart is empty",
        "steps": "1. Add 1x Headphones → badge=1\n2. Add 1x Keyboard → badge=2\n3. On /cart, increase Keyboard qty to 3 → badge=4\n4. Remove Headphones → badge=3",
        "expected": "Badge = sum of all item quantities (not unique item count). Disappears when cart is empty.",
    },
]

for tc in uiux_tcs:
    para_text(doc, tc['id'], size=11, bold=True, color=C_PRIMARY, space_before=10, space_after=2)
    add_tc_table(doc, [
        ("Test Case ID",    tc['id'],            "EEF2FF"),
        ("Module",          tc['module'],         None),
        ("Scenario",        tc['scenario'],       None),
        ("Priority",        tc['priority'],       tc_bg(tc['priority'])),
        ("Preconditions",   tc['preconditions'],  None),
        ("Steps",           tc['steps'],          "F8FAFC"),
        ("Expected Result", tc['expected'],       "F0FDF4"),
        ("Actual Result",   "",                   None),
        ("Status",          "",                   None),
    ])

# ══════════════════════════════════════════════════════════
#  SECTION 7 — Regression Test Cases
# ══════════════════════════════════════════════════════════
doc.add_page_break()
add_section_heading(doc, "Regression Test Cases", 7)

regression_tcs = [
    {
        "id": "TC-R-001", "module": "Regression — Full Auth Flow",
        "scenario": "Complete auth regression: register → logout → login → logout",
        "priority": "Critical",
        "preconditions": "Clean test user (delete before running)",
        "steps": "1. Register new user\n2. Logout\n3. Login with same credentials\n4. Verify navbar state\n5. Logout again\n6. Confirm session cleared",
        "expected": "All operations succeed without errors. JWT stored and cleared at correct steps.",
    },
    {
        "id": "TC-R-002", "module": "Regression — Cart Persistence",
        "scenario": "Cart state preserved across multi-page navigation",
        "priority": "High",
        "preconditions": "User logged in; 2 items in cart",
        "steps": "1. Add Headphones and Keyboard to cart\n2. Navigate to /products\n3. Navigate to /dashboard\n4. Navigate back to /cart",
        "expected": "Both items still in cart with correct quantities. Badge count unchanged throughout.",
    },
    {
        "id": "TC-R-003", "module": "Regression — Search + Filter Combo",
        "scenario": "Search and category filter work in combination without state breakage",
        "priority": "High",
        "preconditions": "User is on /products",
        "steps": "1. Select Electronics filter\n2. Type 'hub' in search → expect 1 result\n3. Clear search → expect 3 Electronics\n4. Select All → expect all 8",
        "expected": "Filters compose correctly. Clearing search restores category state. Selecting All resets to full list.",
    },
    {
        "id": "TC-R-004", "module": "Regression — Order Total Accuracy",
        "scenario": "Order total is accurate after quantity changes before checkout",
        "priority": "Critical",
        "preconditions": "User logged in",
        "steps": "1. Add T-Shirt ($14.99) and Jacket ($54.99)\n2. Increase T-Shirt qty to 3\n3. Expected total: (14.99×3) + 54.99 = $99.96\n4. Place order\n5. Check dashboard total",
        "expected": "Summary shows $99.96. Dashboard order record shows $99.96 with correct item quantities.",
    },
    {
        "id": "TC-R-005", "module": "Regression — Protected Routes",
        "scenario": "Protected routes redirect unauthenticated users correctly",
        "priority": "High",
        "preconditions": "User is NOT logged in",
        "steps": "1. Navigate directly to http://localhost:5173/cart\n2. Navigate directly to http://localhost:5173/dashboard",
        "expected": "Both redirect immediately to /login. No flash of protected content before redirect.",
    },
]

for tc in regression_tcs:
    para_text(doc, tc['id'], size=11, bold=True, color=C_PRIMARY, space_before=10, space_after=2)
    add_tc_table(doc, [
        ("Test Case ID",    tc['id'],            "EEF2FF"),
        ("Module",          tc['module'],         None),
        ("Scenario",        tc['scenario'],       None),
        ("Priority",        tc['priority'],       tc_bg(tc['priority'])),
        ("Preconditions",   tc['preconditions'],  None),
        ("Steps",           tc['steps'],          "F8FAFC"),
        ("Expected Result", tc['expected'],       "F0FDF4"),
        ("Actual Result",   "",                   None),
        ("Status",          "",                   None),
    ])

# ══════════════════════════════════════════════════════════
#  SECTION 8 — AI Chatbot Test Cases
# ══════════════════════════════════════════════════════════
doc.add_page_break()
add_section_heading(doc, "AI Chatbot Test Cases", 8)

chatbot_tcs = [
    {
        "id": "TC-C-001", "module": "Chatbot — Product Query",
        "scenario": "Chatbot responds to a product-related question",
        "priority": "High",
        "preconditions": "Backend running with valid GEMINI_API_KEY; chatbot panel open",
        "steps": "1. Open chatbot panel\n2. Type: 'What products do you sell?'\n3. Click Send or press Enter",
        "expected": "Typing indicator (3 bouncing dots) appears immediately. Within 5–15 seconds, bot replies mentioning Electronics, Clothing, or Books.",
    },
    {
        "id": "TC-C-002", "module": "Chatbot — Enter Key",
        "scenario": "Pressing Enter sends message without inserting a newline",
        "priority": "Medium",
        "preconditions": "Chatbot panel is open",
        "steps": "1. Click the input field\n2. Type: 'Tell me about the headphones'\n3. Press Enter key",
        "expected": "Message sent on Enter. No newline inserted. Input clears after sending.",
    },
    {
        "id": "TC-C-003", "module": "Chatbot — Empty Message",
        "scenario": "Send button disabled and no API call made when input is empty",
        "priority": "Medium",
        "preconditions": "Chatbot panel open; input empty",
        "steps": "1. Leave input blank\n2. Click Send button\n3. Press Enter key",
        "expected": "Send button disabled (opacity 55%). No message appears. No API call made.",
    },
    {
        "id": "TC-C-004", "module": "Chatbot — Loading State",
        "scenario": "Input and Send button disabled while response is loading",
        "priority": "Medium",
        "preconditions": "Chatbot panel is open",
        "steps": "1. Send a message\n2. Immediately try to type in input\n3. Immediately try to click Send",
        "expected": "Input disabled. Send button disabled. Typing indicator visible. Both re-enable after response arrives.",
    },
    {
        "id": "TC-C-005", "module": "Chatbot — Conversation Thread",
        "scenario": "Multiple messages build a visible scrollable conversation thread",
        "priority": "Medium",
        "preconditions": "Chatbot panel is open",
        "steps": "1. Send: 'What electronics do you have?'\n2. Wait for reply\n3. Send: 'How about books?'\n4. Wait for reply\n5. Send: 'What is your return policy?'",
        "expected": "All 3 user messages (right-aligned, indigo) and 3 replies (left-aligned, white) visible. Chat auto-scrolls to latest message.",
    },
    {
        "id": "TC-C-006", "module": "Chatbot — Off-Topic Redirection",
        "scenario": "Chatbot redirects unrelated questions to store topics",
        "priority": "Low",
        "preconditions": "Chatbot panel is open",
        "steps": "1. Send: 'What is the capital of France?'\n2. Wait for reply",
        "expected": "Bot politely declines and redirects to store topics. Does NOT answer 'Paris'.",
    },
    {
        "id": "TC-C-007", "module": "Chatbot — Backend Down",
        "scenario": "Graceful error message when backend is stopped",
        "priority": "High",
        "preconditions": "Backend server is STOPPED; chatbot panel open",
        "steps": "1. Stop backend server (Ctrl+C)\n2. Type any message\n3. Click Send",
        "expected": "Error appears in bot bubble: 'Chatbot is unavailable. Please try again later.' UI remains functional.",
    },
    {
        "id": "TC-C-008", "module": "Chatbot — Delayed Response [BUG-05]",
        "scenario": "Loading state hangs indefinitely on very slow API response",
        "priority": "Low",
        "preconditions": "Chrome DevTools → Network → Slow 3G throttle",
        "steps": "1. Set DevTools throttling to Slow 3G\n2. Open chatbot\n3. Send any message\n4. Observe for 30+ seconds",
        "expected": "[BUG-05] Typing indicator remains visible indefinitely. No timeout message shown. Input stays disabled. Intentional research defect.",
    },
]

for tc in chatbot_tcs:
    para_text(doc, tc['id'], size=11, bold=True, color=C_PRIMARY, space_before=10, space_after=2)
    add_tc_table(doc, [
        ("Test Case ID",    tc['id'],            "EEF2FF"),
        ("Module",          tc['module'],         None),
        ("Scenario",        tc['scenario'],       None),
        ("Priority",        tc['priority'],       tc_bg(tc['priority'])),
        ("Preconditions",   tc['preconditions'],  None),
        ("Steps",           tc['steps'],          "F8FAFC"),
        ("Expected Result", tc['expected'],       "F0FDF4"),
        ("Actual Result",   "",                   None),
        ("Status",          "",                   None),
    ])

# ══════════════════════════════════════════════════════════
#  SECTION 9 — Boundary & Negative Test Cases
# ══════════════════════════════════════════════════════════
doc.add_page_break()
add_section_heading(doc, "Boundary & Negative Test Cases", 9)

boundary_tcs = [
    {
        "id": "TC-B-001", "module": "Cart — Zero Quantity [BUG-03]",
        "scenario": "Reducing item qty to 0 does not auto-remove it from cart",
        "priority": "Medium",
        "preconditions": "Cart contains 1x T-Shirt (qty=1)",
        "steps": "1. On /cart, click − on T-Shirt (qty 1 → 0)\n2. Observe cart row\n3. Check badge and total",
        "expected": "[BUG-03] Item stays in cart with qty=0. Subtotal shows $0.00. Intentional boundary defect.",
    },
    {
        "id": "TC-B-002", "module": "Cart — Decimal Total Precision",
        "scenario": "Cart total correct with multiple decimal-price items",
        "priority": "High",
        "preconditions": "User is logged in",
        "steps": "1. Add Clean Code ($29.99) × 1\n2. Add Pragmatic Programmer ($24.99) × 1\n3. Add T-Shirt ($14.99) × 2\n4. Check total",
        "expected": "Total = $29.99 + $24.99 + ($14.99 × 2) = $84.96. No floating-point rounding errors.",
    },
    {
        "id": "TC-B-003", "module": "Registration — Name Min Length",
        "scenario": "Registration with 1-character name is rejected",
        "priority": "Low",
        "preconditions": "User is on /register",
        "steps": "1. Enter name: 'A' (1 char)\n2. Enter valid email and passwords\n3. Click Create Account",
        "expected": "Backend error: 'Name must be at least 2 characters' (Mongoose minlength validation).",
    },
    {
        "id": "TC-B-004", "module": "Search — Single Character",
        "scenario": "Single-character search returns results without crashing",
        "priority": "Medium",
        "preconditions": "User is on /products",
        "steps": "1. Type 'k' in the search bar\n2. Wait for debounced results",
        "expected": "Returns products containing 'k' (e.g., Mechanical Keyboard). No error. Count label updates.",
    },
    {
        "id": "TC-B-005", "module": "Search — Special Characters",
        "scenario": "Search with HTML/script injection does not execute or crash",
        "priority": "Medium",
        "preconditions": "User is on /products",
        "steps": "1. Type '<script>alert(1)</script>' in search bar\n2. Observe results",
        "expected": "No products found (empty state shown). No JavaScript executes. No server 500 error. String treated as literal.",
    },
    {
        "id": "TC-B-006", "module": "Login — NoSQL Injection",
        "scenario": "NoSQL injection string in email field does not bypass authentication",
        "priority": "High",
        "preconditions": "User is on /login",
        "steps": "1. Enter email: {\"$gt\": \"\"}\n2. Enter any password\n3. Click Sign In",
        "expected": "Login fails with 'Invalid credentials'. No user data returned. Application handles malformed input without crash.",
    },
    {
        "id": "TC-B-007", "module": "Cart — Checkout with Empty Cart",
        "scenario": "Place Order button is not available when cart is empty",
        "priority": "Medium",
        "preconditions": "User is logged in; cart is empty",
        "steps": "1. Navigate to /cart",
        "expected": "'Your cart is empty' state displayed with Browse Products button. Place Order button not rendered — checkout cannot be triggered with zero items.",
    },
    {
        "id": "TC-B-008", "module": "Chatbot — Very Long Message",
        "scenario": "Sending a 500+ character message does not break the UI",
        "priority": "Low",
        "preconditions": "Chatbot panel is open",
        "steps": "1. Paste a 500-character string into chatbot input\n2. Click Send",
        "expected": "Message sent. User bubble wraps text correctly without overflowing panel. Bot responds normally. No UI breakage.",
    },
]

for tc in boundary_tcs:
    para_text(doc, tc['id'], size=11, bold=True, color=C_PRIMARY, space_before=10, space_after=2)
    add_tc_table(doc, [
        ("Test Case ID",    tc['id'],            "EEF2FF"),
        ("Module",          tc['module'],         None),
        ("Scenario",        tc['scenario'],       None),
        ("Priority",        tc['priority'],       tc_bg(tc['priority'])),
        ("Preconditions",   tc['preconditions'],  None),
        ("Steps",           tc['steps'],          "F8FAFC"),
        ("Expected Result", tc['expected'],       "F0FDF4"),
        ("Actual Result",   "",                   None),
        ("Status",          "",                   None),
    ])

# ══════════════════════════════════════════════════════════
#  SECTION 10 — Known Bugs
# ══════════════════════════════════════════════════════════
doc.add_page_break()
add_section_heading(doc, "Known Intentional Bugs (Research Artifacts)", 10)
para_text(doc, "The following defects are deliberately introduced for software testing research. They must NOT be fixed during the research period.", size=10, color=C_MUTED, italic=True, space_after=8)

add_info_table(doc,
    ["Bug ID", "TC Reference", "Module", "Description", "Severity"],
    [
        ["BUG-01", "TC-V-005", "Registration", "Loose email regex — accepts emails without TLD (e.g., a@b)", "Info"],
        ["BUG-02", "TC-V-003", "Registration", "Password mismatch error shown only on submit, not inline", "Info"],
        ["BUG-03", "TC-B-001", "Cart",         "qty=0 does not auto-remove item from cart",                 "Info"],
        ["BUG-04", "TC-U-002", "Cart UI",      "Qty controls overflow container on screens < 480px",        "Info"],
        ["BUG-05", "TC-C-008", "Chatbot",      "No timeout on Gemini API — UI loading hangs indefinitely",  "Info"],
    ]
)

# ══════════════════════════════════════════════════════════
#  SECTION 11 — Execution Summary Template
# ══════════════════════════════════════════════════════════
add_section_heading(doc, "Test Execution Summary", 11)
add_info_table(doc,
    ["Category", "Total TCs", "Passed", "Failed", "Blocked", "Not Run"],
    [
        ["Functional",        "14", "", "", "", ""],
        ["Validation",        "8",  "", "", "", ""],
        ["UI/UX",             "8",  "", "", "", ""],
        ["Regression",        "5",  "", "", "", ""],
        ["AI Chatbot",        "8",  "", "", "", ""],
        ["Boundary/Negative", "8",  "", "", "", ""],
        ["TOTAL",             "51", "", "", "", ""],
    ]
)

para_text(doc, "\nDocument prepared for: Manual Testing vs Test Automation — Empirical Research Study", size=9, color=C_MUTED, italic=True)

# ── Save ──────────────────────────────────────────────────
output = '/Users/I578365/Desktop/testing-research-app/tests/ShopLab_Manual_Test_Suite.docx'
doc.save(output)
print(f"Saved: {output}")
