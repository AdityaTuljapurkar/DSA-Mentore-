from playwright.sync_api import expect  , Page
import time 

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
    

def add_custom_data_in_code(page,data):
    page.locator(".monaco-editor").first.click()
    page.locator(".monaco-editor").first.type(str(data))
    page.get_by_role("button", name="Submit Code").click()
    
 
def reload_page(page):
    page.reload()
    print("Page reloaded")

def check_custom_data(page,data):
    Page = page.locator(".monaco-editor")
    expect(Page.get_by_text(data)).to_be_visible()
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

