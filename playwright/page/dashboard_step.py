from web import dashboard_web, login_web
from pytest_bdd import scenarios, given, when, then, parsers

scenarios('../feature/dashboard.feature')

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