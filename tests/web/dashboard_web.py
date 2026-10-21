from playwright.sync_api import expect
import re , time
def click_question_dashboard(page,question):

    page.get_by_role("link", name=question).click()
    print(f"clicked question {question}")
    expect(page).to_have_url(
        re.compile(r"http://localhost:5173/problem/\d+")
    )
    print(f"navigated to {re.compile(r"http://localhost:5173/problem/\d+")}")
    
    time.sleep(4)