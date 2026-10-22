from playwright.sync_api import expect  , Page
import time 
from    Network_Mocking import AI_NM

# page.locator("#language-select").select_option("cpp")
#     page.locator("#language-select").select_option("java")
#     page.locator("#language-select").select_option("javascript")
#     page.locator("#language-select").select_option("python")
def change_code_language(page,language):
    page.locator('#language-select').click()
    print("changing the language")
    page.locator("#language-select").select_option(str(language))
    
    
def verify_cpp_template(page):
    editor = page.locator(".monaco-editor")
    expect(editor).to_contain_text("// Write your C++ solution below")
    expect(editor).to_contain_text("#include <iostream>")
    expect(editor).to_contain_text("class Solution")
    expect(editor).to_contain_text("void solve()")
    print("the c++ code is loaded ")

def verify_java_template(page):
    editor = page.locator(".monaco-editor")
    expect(editor).to_contain_text("// Write your Java solution below")
    expect(editor).to_contain_text("import java.util.*;")
    expect(editor).to_contain_text("class Solution {")
    expect(editor).to_contain_text("public void solve() {")
    print("the java code is loaded ")

def verify_javascript_template(page):
    editor = page.locator(".monaco-editor")
    expect(editor).to_contain_text("// Write your JavaScript solution below")
    expect(editor).to_contain_text("function solution() {")
    print("the javascript code is loaded ")

def verify_python_template(page):
    editor = page.locator(".monaco-editor")
    expect(editor).to_contain_text(" # Write your Python solution below")
    expect(editor).to_contain_text("def solution():")
    print("the python code is loaded ")



def remove_older_code(page):    

    page.locator(".monaco-editor").first.click()
    page.keyboard.press("ControlOrMeta+a")
    page.keyboard.press("Backspace")
    # time.sleep(2)
    
    

def add_custom_data_in_code(page, data):
    page.locator(".monaco-editor").first.click()
    page.keyboard.insert_text(str(data))
    with page.expect_response(lambda r: "api/submissions" in r.url, timeout=30000):
        page.get_by_role("button", name="Submit Code").click()
    
 
def reload_page(page):
    page.reload()
    print("Page reloaded")

def check_custom_data(page, data):
    editor = page.locator(".monaco-editor")
    expect(editor).to_contain_text(data)
    print("found custom code")
    

def change_editor_theme_to_light(page:Page):
    page.locator('#change_theme').click()
    page.locator("#change_theme").select_option("vs-light")
    print("theme is changed to white")

def verify_light_theme(page:Page):
    expect(page.locator(".monaco-editor.vs").first).to_be_visible()
    print("light theme verified")


def change_editor_theme_to_dark(page:Page):
    page.locator('#change_theme').click()
    page.locator('#change_theme').select_option("vs-dark")
    print("theme is changed to dark")

def verify_dark_theme(page:Page):
    expect(page.locator(".monaco-editor.vs-dark").first).to_be_visible()
    print("dark theme verified")

def setup_mock_ai_sucess(page:Page):
    AI_NM.mock_ai_success(page)
    print("AI Mock Route setup with sucess ")

def setup_mock_ai_timeout(page:Page):
    AI_NM.mock_ai_timeout(page)
    print("AI Mock route setup with timeout error")

def setup_mock_ai_server_error(page:Page):
    AI_NM.mock_ai_server_error(page)
    print("AI Mock route setup with server error")

def setup_ai_unauthorized_error(page:Page):
    AI_NM.mock_ai_unauthorized_error(page)
    print("AI Mock route setup with unauthorsed error")

def click_submit_button(page:Page):
    page.get_by_role("button", name="Submit Code").click() 
    print("clicked submmit button")
    # time.sleep(15)
  

def review_status_displays(page:Page,data):
    page.locator("#status_box").get_by_text(str(data))
    print(f"status found: {data} ")

def review_status_error(page:Page,error):
    page.get_by_text(str(error)).is_visible()
    print(f"found error : {error}")

def check_redirect_login(page:Page):
    expect(page).to_have_url("http://localhost:5173/login")
    print("redirect login verified")

def reset_code(page:Page):
    page.get_by_role("button", name="↺ Reset").click()
    print("Reset button is been clicked")
   