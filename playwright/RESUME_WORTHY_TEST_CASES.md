# Resume-Worthy Playwright Test Automation Strategy for DSA Mentor

This document outlines high-impact, resume-worthy test automation suites for the **DSA Mentor** platform using **Playwright (Python) + pytest-bdd**.

---

## 1. High-Value Test Suites for DSA Mentor

### Suite 1: Monaco Code Editor & Language Workspace (Advanced UI Automation)
> **Why it's resume-worthy:** Monaco Editor does not use standard HTML `<input>` or `<textarea>` tags. Automating it demonstrates mastery over virtualized DOM trees, custom keyboard events, and dynamic templates.

* **TC-1.1: Language Switcher & Starter Template Population**
  * **Flow:** Navigate to `/workspace`, switch language dropdown between Python, C++, Java, and JavaScript.
  * **Verification:** Assert Monaco Editor content updates to each language's respective starter template (`#include <iostream>`, `class Solution`, etc.) without losing editor focus.
* **TC-1.2: Code State Caching & Page Reload Resilience**
  * **Flow:** Enter custom code in Python, reload the browser or switch problems, then return.
  * **Verification:** Verify `api/cache_source_code/{id}` returns the cached code and Monaco re-hydrates with the user's uncommitted work.
* **TC-1.3: Editor Theme Switching & Responsiveness**
  * **Flow:** Toggle between dark mode (`vs-dark`) and light themes.
  * **Verification:** Check CSS variables and Monaco container theme attributes render correctly.

---

### Suite 2: AI Mentor Review with Network Interception & Mocking
> **Why it's resume-worthy:** Testing AI-driven apps with live LLMs is slow, costly, and non-deterministic. Using Playwright's `page.route()` to mock API responses simulates edge cases (malformed JSON, rate limits, timeouts) with 100% deterministic results.

* **TC-2.1: Mocked Successful AI Review & Progressive Hint Reveal**
  * **Flow:** Mock `POST /api/submissions/{id}` to return a realistic AI payload with logic analysis, issues, and 3 hints. Click "Submit".
  * **Verification:** Validate submission spinner appears, AI review badges ("Needs Optimization" or "Accepted") render, and toggling Hint 1, 2, and 3 unfolds the respective accordion content.
* **TC-2.2: AI Backend Timeout & Error Boundary Recovery**
  * **Flow:** Intercept `/api/submissions/{id}` and abort or respond with HTTP 504 (Gateway Timeout).
  * **Verification:** Verify UI displays a friendly error banner instead of crashing, Monaco keeps the user's code intact, and the submit button re-enables.
* **TC-2.3: Malformed AI Response / Parsing Resilience**
  * **Flow:** Intercept API to return non-JSON string or unexpected schema.
  * **Verification:** Assert `extractReview()` safely falls back and UI displays fallback diagnostics.

---

### Suite 3: Hybrid API-UI Automation & Telemetry Sync
> **Why it's resume-worthy:** Demonstrates full-stack test architecture—seeding data via REST API and asserting UI state, saving minutes of test execution time.

* **TC-3.1: Seeded Problem Verification & Dynamic Route**
  * **Flow:** Call backend API `POST /api/create_question/` directly via Playwright's `request` context to create a new problem.
  * **Verification:** Navigate directly to `/problem/{generated_id}`, verify question title, time limit, memory limit, and difficulty badges match the seeded payload.
* **TC-3.2: Submission to Dashboard Statistics Synchronization**
  * **Flow:** Solve/submit a question, then navigate to `/dashboard` and `/statistics`.
  * **Verification:** Assert `Your Statistics` cards (total solved count, subtopic breakdown, streak) update dynamically without manual database manipulation.

---

### Suite 4: Authentication State Reuse & Route Protection
> **Why it's resume-worthy:** Logging in through the UI before every test slows suites down drastically. Implementing Playwright `storageState` shows senior-level test architecture design.

* **TC-4.1: Fast Authenticated Sessions via `storageState`**
  * **Flow:** Generate an authenticated session once via API (`POST /api/login/`) and inject the JWT token directly into `localStorage`.
  * **Verification:** Open any protected route (`/workspace`, `/dashboard`, `/question_form`) without UI login step.
* **TC-4.2: Expired Token / 401 Unauthorized Auto-Redirect**
  * **Flow:** Set an expired JWT in `localStorage` and request `/api/fetch_dashboard_data/`.
  * **Verification:** Verify application detects 401, clears `accessToken`, and immediately redirects to `/login`.

---

## 2. Implementation Examples for Your Framework

### Example A: Intercepting & Mocking the AI Submission API
In your step definitions or web helper:

```python
# playwright/web/workspace_web.py
import json
from playwright.sync_api import Page, expect

MOCK_AI_RESPONSE = {
    "message": {
        "review_status": "needs_improvement",
        "summary": "Time complexity is O(N^2), consider using a Hash Map for O(N).",
        "logic_analysis": "Nested loop causes excess operations on large inputs.",
        "issues": ["Time Limit Exceeded risk on worst-case arrays"],
        "hints": [
            "Think about what data structure offers O(1) lookups.",
            "Can you store the complement (target - current_num) in a dictionary?"
        ]
    },
    "code_output": {"status": "success", "stdout": "Output: [0, 1]"}
}

def mock_ai_submission(page: Page, question_id: int):
    """Intercepts the submission endpoint and returns a mock AI response."""
    def handle_route(route):
        route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps(MOCK_AI_RESPONSE)
        )
    page.route(f"**/api/submissions/{question_id}*", handle_route)

def submit_and_verify_hints(page: Page):
    page.get_by_role("button", name="Submit Solution").click()
    
    # Assert review summary rendered from mock
    expect(page.get_by_text("Time complexity is O(N^2)")).to_be_visible()
    
    # Assert hint expansion works
    hint_toggle = page.get_by_role("button", name="Hint 1")
    hint_toggle.click()
    expect(page.get_by_text("Think about what data structure offers O(1) lookups.")).to_be_visible()
```

### Example B: Interacting with Monaco Editor
```python
def enter_code_into_monaco(page: Page, code: str):
    """
    Monaco cannot be filled like a normal input. 
    We click the editor area and use keyboard events to insert text safely.
    """
    monaco_editor = page.locator(".monaco-editor").first
    monaco_editor.click()
    
    # Select all and replace with new code
    page.keyboard.press("ControlOrMeta+A")
    page.keyboard.press("Backspace")
    page.keyboard.insert_text(code)
```

### Example C: Reusable Auth Fixture (In `conftest.py`)
```python
# playwright/conftest.py
import pytest
from playwright.sync_api import sync_playwright

@pytest.fixture(scope="session")
def auth_state(tmp_path_factory):
    """Logs in once via API or UI and saves storageState for the entire test suite."""
    storage_path = tmp_path_factory.mktemp("state") / "user_state.json"
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()
        
        # Fast API-based auth or UI login
        page.goto("http://localhost:5173/login")
        page.get_by_role("textbox", name="Enter your username").fill("test_dev")
        page.get_by_role("textbox", name="••••••••").fill("123456")
        page.get_by_role("button", name="Login").click()
        page.wait_for_url("**/dashboard")
        
        context.storage_state(path=str(storage_path))
        browser.close()
    return str(storage_path)

@pytest.fixture
def auth_page(auth_state):
    """Provides a page pre-authenticated without logging in every time."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(storage_state=auth_state)
        page = context.new_page()
        yield page
        context.close()
        browser.close()
```

---

## 3. How to Frame This on Your Resume / LinkedIn

* **Full-Stack Playwright Automation:** *“Architected an end-to-end BDD automation framework using Python, Playwright, and `pytest-bdd`, covering complex SPA workflows across Monaco Editor, code execution runners, and analytics dashboards.”*
* **Network Mocking & Interception:** *“Engineered deterministic test suites for AI features by mocking asynchronous LLM endpoints with Playwright `page.route()`, reducing test run costs and eliminating flaky network dependencies.”*
* **Authentication Optimization:** *“Implemented session reuse using Playwright `storageState`, bypassing repetitive UI login overhead and speeding up test execution by 65%.”*
* **Non-Standard DOM Automation:** *“Automated virtualized Monaco code editors with keyboard event orchestration, validating multi-language template switches and syntax caching.”*

