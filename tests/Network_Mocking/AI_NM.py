MOCK_SUCCESSFUL_REVIEW = {
    "message": {
        "code_output": "[0, 1]\n",
        "ai_review": {
            "message": {
                "review_status": "partially_correct",
                "summary": "Your approach is O(n) but fails on duplicate elements.",
                "logic_analysis": "The hash map correctly stores numbers, but does not verify index uniqueness.",
                "execution_analysis": {
                    "status": "passed",
                    "interpretation": "Code ran against sample inputs without crashing."
                },
                "issues": [
                    {
                        "line": 4,
                        "severity": "critical",
                        "title": "Index Collision Bug",
                        "description": "Can pick the same element twice when target is double the element value.",
                        "counterexample": "nums = [3, 2, 4], target = 6 => returns [0, 0] instead of [1, 2]"
                    }
                ],
                "hints": [
                    {
                        "level": 1,
                        "hint": "Check if the index stored in your hash map is different from your current loop index."
                    }
                ],
                "next_step": "Add a check: if complement in map and map[complement] != i."
            }
        }
    }
}


def mock_ai_success(page):
    
    def handle_route(route):
        route.fulfill(
            status=202,
            content_type="application/json",
            json=MOCK_SUCCESSFUL_REVIEW
        )

    
    page.route("**/api/submissions/*", handle_route)


def mock_ai_timeout(page):
    
    def handle_route(route):
        route.fulfill(
            status=504,
            content_type="application/json",
            json={"error": "Execution Engine timeout while waiting for response"}
        )

    page.route("**/api/submissions/*", handle_route)


def mock_ai_server_error(page):
   
    def handle_route(route):
        route.fulfill(
            status=500,
            content_type="application/json",
            json={"error": "Failed to reach AI review engine"}
        )

    page.route("**/api/submissions/*", handle_route)

def mock_ai_unauthorized_error(page):
    def handle_route(route):
        route.fulfill(
            status=401,
            content_type="application/json",
            json = {"error":"User Unauthorized"}
        )
    page.route("**/api/submissions/*",handle_route)