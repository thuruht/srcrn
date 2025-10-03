from playwright.sync_api import sync_playwright, Page, expect

def verify_admin_dashboard(page: Page):
    """
    This script verifies that the admin dashboard loads correctly and takes a screenshot.
    """
    # 1. Navigate to the admin dashboard page.
    page.goto("http://localhost:3000/admin")

    # 2. Wait for the main heading to be visible to ensure the page has loaded.
    heading = page.get_by_role("heading", name="Admin Dashboard")
    expect(heading).to_be_visible()

    # 3. Take a screenshot of the page.
    page.screenshot(path="jules-scratch/verification/admin_dashboard.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_admin_dashboard(page)
        browser.close()

if __name__ == "__main__":
    main()