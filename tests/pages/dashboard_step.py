from web import dashboard_web, login_web
from pytest_bdd import scenarios, given, when, then, parsers

scenarios('../features/dashboard.feature')

# --- Background Login Steps ---
@given("user navigated to the login page")
def step_to_navigate_login(page):
    login_web.open_login_page(page)

@when(parsers.parse('user enters username "{username}"'))
def step_to_add_username(page, username):
    login_web.enter_username(page, username)

@when(parsers.parse('user enters password "{password}"'))
def step_to_add_password(page, password):
    login_web.enter_password(page, password)

@when('user clicks submit button')
def step_to_click_submit(page):
    login_web.click_submit(page)

@then('user navigates to dashboard')
def navigate_dashboard(page):
    login_web.navigate_dashboard(page)

# --- Dashboard Question Scenario Steps ---
@when(parsers.parse('user clicks a question "{question}" in dashboard'))
def click_question_dashboard(page, question):
    dashboard_web.click_question_dashboard(page, question)

@then('user navigates to the question page')
def verify_question_page(page):
    dashboard_web.verify_question_page(page)

# --------------hybrid API-UI Question seeping and cleanup 
@given("user seeds a new question via API")
def step_seed_question(page):
    dashboard_web.seed_new_question_api(page)

@when("user navigates to the seeded problem page")
def step_navigate_seeded_problem(page):
    dashboard_web.navigate_to_seeded_problem(page)

@then("problem title, time limit, and memory limit match the seeded data")
def step_verify_seeded_details(page):
    dashboard_web.verify_seeded_problem_details(page)

@then("the seeded question is cleaned up from the database")
def step_cleanup_seeded_question(page):
    dashboard_web.cleanup_seeded_question(page)