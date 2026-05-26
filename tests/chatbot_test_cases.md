# Chatbot UI Test Cases — ShopLab

**Component:** ChatBot.jsx (floating widget)  
**Backend:** POST /api/chatbot/message → Gemini 1.5 Flash  
**Purpose:** Covers loading states, error handling, delayed responses, and response quality.

---

## Functional Tests

| CT ID | Test Case | Steps | Expected Result |
|-------|-----------|-------|-----------------|
| CT-01 | Open chatbot | Click 💬 FAB button | Window appears with welcome message |
| CT-02 | Welcome message present | Open chatbot | "Hi! I'm the ShopLab assistant..." shown |
| CT-03 | Close chatbot | Click ✕ button | Window disappears, FAB visible |
| CT-04 | Toggle multiple times | Open → close → open | State resets; old messages persist (no re-init) |
| CT-05 | Send message via Enter key | Type message + press Enter | Message sent, no form submit |
| CT-06 | Send message via button | Type message + click Send | Message sent, reply received |
| CT-07 | Empty input blocked | Leave input blank, click Send | Send button disabled; no API call |
| CT-08 | User message bubble | Send a message | Message appears right-aligned in indigo bubble |
| CT-09 | Bot reply bubble | Receive a reply | Reply appears left-aligned in gray bubble |
| CT-10 | Conversation history | Send 3 messages | All messages visible in scroll area |
| CT-11 | Auto-scroll | Send messages until overflow | Window auto-scrolls to latest message |

---

## Loading State Tests

| CT ID | Test Case | Steps | Expected Result |
|-------|-----------|-------|-----------------|
| CT-12 | Loading spinner appears | Send a message | Spinner + "Thinking..." visible while waiting |
| CT-13 | Input disabled during loading | Send message, observe input | Input disabled until reply received |
| CT-14 | Send button disabled during loading | Send message, observe button | Send button disabled until reply received |
| CT-15 | Loading clears after response | Wait for reply | Spinner disappears, input re-enabled |

---

## Delayed Response Test (BUG-05)

| CT ID | Test Case | Steps | Expected Result | Actual |
|-------|-----------|-------|-----------------|--------|
| CT-16 | Simulate slow API | Throttle network to "Slow 3G" in DevTools, send message | Should show timeout or fallback message | **Loading spinner stays indefinitely** |
| CT-17 | No timeout feedback | Throttle API to not respond | User receives no timeout notification | **No timeout implemented — known defect** |

**How to reproduce CT-16:**
1. Open Chrome DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Send any message to the chatbot
4. Observe: loading spinner never times out

---

## Error Handling Tests

| CT ID | Test Case | Steps | Expected Result |
|-------|-----------|-------|-----------------|
| CT-18 | Backend down | Stop the backend server, send message | Error message shown in chat: "Chatbot is unavailable..." |
| CT-19 | Invalid API key | Set GEMINI_API_KEY=invalid in .env, restart | Error message shown in chat |
| CT-20 | Network error | Disable network, send message | Axios network error caught and shown in chat |

---

## Response Quality Tests (Manual Evaluation)

| CT ID | Prompt | Expected Behaviour |
|-------|--------|-------------------|
| CT-21 | "What products do you sell?" | Mentions Electronics, Clothing, Books |
| CT-22 | "How do I return an item?" | Provides a helpful support response |
| CT-23 | "What is 2+2?" | Politely redirects to store-related topics |
| CT-24 | "Tell me about the headphones" | Describes headphone product or category |
| CT-25 | Empty string via API test | 400 error: "Message cannot be empty" |

---

## Chatbot Selenium Selectors

| Element | Selector |
|---------|----------|
| FAB toggle button | `[data-testid="chatbot-toggle"]` |
| Chat window | `[data-testid="chatbot-window"]` |
| Messages container | `[data-testid="chatbot-messages"]` |
| Individual message | `[data-testid="chat-msg-{index}"]` |
| Text input | `[data-testid="chatbot-input"]` |
| Send button | `[data-testid="chatbot-send"]` |
| Loading indicator | `[data-testid="chatbot-loading"]` |
