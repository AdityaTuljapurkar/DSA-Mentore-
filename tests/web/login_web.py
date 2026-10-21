from playwright.sync_api import expect

def open_login_page(page):
    page.goto("http://localhost:5173/login")

def enter_username(page, username):
    page.get_by_role("textbox", name="Enter your username").click()
    page.get_by_role("textbox", name="Enter your username").fill(username)

def enter_password(page, password):
    page.get_by_role("textbox", name="••••••••").click()
    page.get_by_role("textbox", name="••••••••").fill(password)

def click_submit(page):
    print("clicked login page submit button")
    page.get_by_role("button", name="Login").click()

def navigate_dashboard(page):
    expect(page).to_have_url("http://localhost:5173/dashboard")
    expect(page.get_by_role("heading", name="Your Statistics")).to_be_visible()
    print("The user have entered the dashboard")

def invalid_credentials(page):
    expect(page.get_by_text("Invalid username or password")).to_be_visible()
    
