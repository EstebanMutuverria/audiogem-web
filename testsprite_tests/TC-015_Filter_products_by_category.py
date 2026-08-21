import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:5173")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Productos' link in the navbar to open the products page.
        # Productos link
        elem = page.get_by_text('Navegación', exact=True).locator("xpath=ancestor-or-self::*[.//a][1]").get_by_role('link', name='Productos', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Estéreos' category button to apply the Estéreos filter (after recording the initial product count).
        # Estéreos button
        elem = page.get_by_role('button', name='Estéreos', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Todos' category button to show the full (unfiltered) product list.
        # Todos button
        elem = page.get_by_role('button', name='Todos', exact=True)
        await elem.click(timeout=10000)
        
        # -> Count visible 'Agregar' buttons to record the initial product count, then click the 'Parlantes' category button.
        # Parlantes button
        elem = page.get_by_role('button', name='Parlantes', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Todos' category button to show the unfiltered product list so the initial product count can be recorded.
        # Todos button
        elem = page.get_by_role('button', name='Todos', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Parlantes' category button to apply the Parlantes filter and verify the filtered product list.
        # Parlantes button
        elem = page.get_by_role('button', name='Parlantes', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Todos' category button to show the unfiltered product list.
        # Todos button
        elem = page.get_by_role('button', name='Todos', exact=True)
        await elem.click(timeout=10000)
        
        # -> Count visible 'Agregar' (Add to cart) buttons on the page in the unfiltered 'Todos' view, then click the 'Parlantes' category button to apply that filter.
        # Parlantes button
        elem = page.get_by_role('button', name='Parlantes', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Todos' category button to return to the unfiltered products list so the initial product count can be recorded.
        # Todos button
        elem = page.get_by_role('button', name='Todos', exact=True)
        await elem.click(timeout=10000)
        
        # -> Count visible 'Agregar' buttons to record the initial product count, then click the 'Parlantes' category button.
        # Parlantes button
        elem = page.get_by_role('button', name='Parlantes', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Todos' category button to show all products and record the initial count of visible 'Agregar' (Add to cart) buttons.
        # Todos button
        elem = page.get_by_role('button', name='Todos', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Parlantes' category button to filter products by Parlantes and then verify the filtered list.
        # Parlantes button
        elem = page.get_by_role('button', name='Parlantes', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        current_url = await page.evaluate("() => window.location.href")
        # Assert: URL navigates to /productos after opening the products page
        assert "/productos" in current_url, "The page should be at /productos"
        elem = page.locator('xpath=/html/body/div/main/div/div[2]/div/button[3]').nth(0)
        await elem.scroll_into_view_if_needed()
        # Assert: "Parlantes" category button is visible
        assert await elem.is_visible(), "Expected element to be visible after scrolling into view"
        active_class = await page.locator('xpath=/html/body/div/main/div/div[2]/div/button[3]').nth(0).get_attribute("class")
        # Assert: "Parlantes" category button is highlighted as active
        assert 'filter__btn--active' in (active_class or ""), "Parlantes button should have active class"
        count_add = await page.locator("text=Agregar 🛒").count()
        # Assert: There are 5 visible 'Agregar 🛒' buttons in the filtered Parlantes view
        assert count_add == 5, f"Expected 5 Add-to-cart buttons for Parlantes filter, found {count_add}"
        first_add = page.locator('xpath=/html/body/div/main/div/div[3]/div/article[2]/div[2]/div[2]/div[2]/button').nth(0)
        await first_add.scroll_into_view_if_needed()
        # Assert: First Parlantes product's Add button is visible
        assert await first_add.is_visible(), "Expected element to be visible after scrolling into view"
        for i in range(count_add):
            aria = await page.locator("text=Agregar 🛒").nth(i).get_attribute("aria-label")
            # Assert: Add button's aria-label includes the category 'Parlantes'
            assert 'Parlantes' in (aria or ""), f"Add button #{i} should reference 'Parlantes' in aria-label"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    