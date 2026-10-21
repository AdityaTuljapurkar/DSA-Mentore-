from web import codespace_web , dashboard_web , login_web 
from pytest_bdd import scenarios, given, when, then, parsers

scenarios('../features/codespace.feature')

# ----------login step functions
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

# ----------dashboard step functions 

@then('user navigates to dashboard')
def navigate_dashboard(page):
    login_web.navigate_dashboard(page)

@when(parsers.parse('user clicks a question "{question}" in dashboard'))
def click_question_dashboard(page, question):
    dashboard_web.click_question_dashboard(page, question)

@then('user navigates to the question page')
def verify_question_page(page):
    dashboard_web.verify_question_page(page)

#----------codespace step functions  
@when(parsers.parse('user clicks on language "{language}" dropdown'))
def change_code_language(page,language):
    codespace_web.change_code_language(page,language)

@then('Cpp code Template is loaded')
def verify_cpp_code_template(page):
    codespace_web.verify_cpp_template(page)

@then('Java code Template is loaded')
def verify_java_code_template(page):
    codespace_web.verify_java_template(page)

@then('Javascript code Template is loaded')
def verify_javascript_code_template(page):
    codespace_web.verify_javascript_template(page)

@then('Python code Template is loaded')
def verify_python_code_template(page):
    codespace_web.verify_python_template(page)

@when('user removes the older code')
def remove_code(page):
    codespace_web.remove_older_code(page)

@when(parsers.parse('user enter custom data "{data}"'))
def add_custom_code(page,data):
    codespace_web.add_custom_data_in_code(page,data)

@when('user reloads the page')
def reload_page(page):
    codespace_web.reload_page(page)

@then(parsers.parse('user finds custom data "{data}"'))
def find_custom_data(page,data):
    codespace_web.check_custom_data(page,data)

@when("user selects the light theme")
def change_to_light_theme(page):
    codespace_web.change_editor_theme_to_light(page)

@when("user selects the dark theme")
def change_to_dark_theme(page):
    codespace_web.change_editor_theme_to_dark(page)

@then("light theme applied to the code editor")
def verify_light_theme(page):
    codespace_web.verify_light_theme(page)

@then("dark theme applied to the code editor")
def verify_light_theme(page):
    codespace_web.verify_dark_theme(page)


@given("user enables successful AI review mock")
def enable_sucessful_ai_review_mock(page):
    codespace_web.setup_mock_ai_sucess(page)
@when("user clicks submit code button")
def click_submit_button(page):
    codespace_web.click_submit_button(page)

@then(parsers.parse('review status displays "{data}"'))
def review_status_display(page,data):
    codespace_web.review_status_displays(page,data)


@given("user enables timeout AI review mock")
def enable_timeout_ai_review_mock(page):
    codespace_web.setup_mock_ai_timeout(page)

@given("user enables unauthorized AI review mock")
def enable_unauthorized_ai_review_mock(page):
    codespace_web.setup_ai_unauthorized_error(page)

@then(parsers.parse('review status error displays "{error}"'))
def review_error_display(page,error):
    codespace_web.review_status_error(page,error)


@then("user redirects to login")
def check_redirect_login(page):
    codespace_web.check_redirect_login(page)