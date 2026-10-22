from playwright.sync_api import expect
import re , time , requests
def click_question_dashboard(page,question):

    page.get_by_role("link", name=question).click()
    print(f"clicked question {question}")
    expect(page).to_have_url(
        re.compile(r"http://localhost:5173/problem/\d+")
    )
    print(f"navigated to {re.compile(r"http://localhost:5173/problem/\d+")}")
    
    # time.sleep(4)

SEEDED_QUESTION = {}

def seed_new_question_api(page):
    token = page.evaluate(
    "() => localStorage.getItem('accessToken')"
)
    assert token 

    payload = {
        "question": "Diameter of Binary Tree (E2E Test)",
        "content": "<p>Find the length of the longest path between any two nodes in a tree.</p>",
        "constraints": "Nodes: 1 to 10^4",
        "timelimit": 2,
        "memory_limit": 256,
        "topic": "Trees",
        "subtopic": "Binary Tree"
    }
    headers = {
        "Authorization" : f"Bearer {token}" , 
        "Content-type" : "application/json"
    }
    response = requests.post("http://127.0.0.1:8000/api/create_question/", json=payload, headers=headers, timeout=10)
    assert response.status_code == 201, f"Failed to seed question: {response.text}"

    data = response.json()
    SEEDED_QUESTION["ques_no"] = data["ques_no"]
    SEEDED_QUESTION["question"] = payload["question"]
    SEEDED_QUESTION["timelimit"] = payload["timelimit"]
    SEEDED_QUESTION["memory_limit"] = payload["memory_limit"]
    print(f"\n[API SEED] Created Question #{SEEDED_QUESTION['ques_no']} successfully!")

def navigate_to_seeded_problem(page):
    ques_no = SEEDED_QUESTION["ques_no"]
    page.goto(f"http://localhost:5173/problem/{ques_no}")
    print(f"Navigated to http://localhost:5173/problem/{ques_no}")

def verify_seeded_problem_details(page):
    expect(page.get_by_text(SEEDED_QUESTION["question"])).to_be_visible()

    tl = int(SEEDED_QUESTION['timelimit']) if float(SEEDED_QUESTION['timelimit']).is_integer() else SEEDED_QUESTION['timelimit']
    expect(page.get_by_text(f"⏱ {tl}s")).to_be_visible()

    expect(page.get_by_text(f"💾 {SEEDED_QUESTION['memory_limit']} MB")).to_be_visible()
    print("Verified title, time limit, and memory limits in UI!")
    # time.sleep(4)

def cleanup_seeded_question(page):
    token = page.evaluate("() => localStorage.getItem('accessToken')")
    ques_no = SEEDED_QUESTION.get("ques_no") 
    if ques_no and token:
        headers = {"Authorization": f"Bearer {token}"}
        res = requests.delete(f"http://127.0.0.1:8000/api/questions/{ques_no}/delete/", headers=headers, timeout=10)
        assert res.status_code == 200, f"Failed to delete question {ques_no}: {res.text}"
        print(f"[CLEANUP] Deleted Question : {ques_no} from database successfully!")
        # time.sleep(5)

