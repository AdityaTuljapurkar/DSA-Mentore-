from web import login_web 
from pytest_bdd import scenarios, given, when, then, parsers

# Connect this step definition file to the feature file
scenarios('../features/login.feature')

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



@then('user sees an invalid credentials error')
def invalid_credentials_error(page):
    login_web.invalid_credentials(page)
