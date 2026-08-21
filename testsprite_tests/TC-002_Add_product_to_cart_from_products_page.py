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
        
        # -> Open the 'Productos' page (navigate to http://localhost:5173/productos) so the product catalog can load.
        await page.goto("http://localhost:5173/productos")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Agregar 🛒' button on the first product card (B52 RM-2025BT 4x25 watts) to add it to the cart.
        # Agregar 🛒 button
        elem = page.get_by_role('button', name='Agregar B52 RM-2025BT 4x25 watts al carrito', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        current_url = await page.evaluate("() => window.location.href")
        # Assert: URL navigates to /productos
        assert "/productos" in current_url, "The page should be at /productos"
        elem = page.locator("text=Tu Carrito").nth(0)
        await elem.scroll_into_view_if_needed()
        # Assert: Cart drawer title 'Tu Carrito' is visible
        assert await elem.is_visible(), "Expected element to be visible after scrolling into view"
        elem = page.locator("text=B52 RM-2025BT 4x25 watts").nth(0)
        await elem.scroll_into_view_if_needed()
        # Assert: Cart contains product name 'B52 RM-2025BT 4x25 watts'
        assert await elem.is_visible(), "Expected element to be visible after scrolling into view"
        text = await page.locator("text=B52 RM-2025BT 4x25 watts").nth(0).text_content()
        # Assert: Product name shown in cart equals 'B52 RM-2025BT 4x25 watts'
        assert "B52 RM-2025BT 4x25 watts" in (text or ""), "Expected product name to appear in cart"
        elem = page.locator("text=$70.000").nth(0)
        await elem.scroll_into_view_if_needed()
        # Assert: Unit price '$70.000' is visible in the cart
        assert await elem.is_visible(), "Expected element to be visible after scrolling into view"
        text = await page.locator("text=$70.000").nth(0).text_content()
        # Assert: The unit price in the cart shows '$70.000'
        assert "$70.000" in (text or ""), "Expected unit price $70.000 to appear in cart"
        elem = page.locator('xpath=/html/body/div/aside/div[2]/div/div/div[2]/div/div/span').nth(0)
        await elem.scroll_into_view_if_needed()
        # Assert: Quantity control shows quantity '1' in the cart
        assert await elem.is_visible(), "Expected element to be visible after scrolling into view"
        text = await page.locator('xpath=/html/body/div/aside/div[2]/div/div/div[2]/div/div/span').nth(0).text_content()
        # Assert: The cart item quantity equals '1'
        assert "1" in (text or ""), "Expected quantity 1 in cart"
        elem = page.locator("text=Subtotal: $70.000").nth(0)
        await elem.scroll_into_view_if_needed()
        # Assert: Subtotal displays 'Subtotal: $70.000' in the cart
        assert await elem.is_visible(), "Expected element to be visible after scrolling into view"
        text = await page.locator("text=Subtotal: $70.000").nth(0).text_content()
        # Assert: The cart subtotal equals 'Subtotal: $70.000'
        assert "Subtotal: $70.000" in (text or ""), "Expected subtotal $70.000 in cart"
        elem = page.locator('xpath=/html/body/div/aside/div[3]/div[2]/button[1]').nth(0)
        await elem.scroll_into_view_if_needed()
        # Assert: 'Enviar pedido por WhatsApp' button is visible in the cart drawer
        assert await elem.is_visible(), "Expected element to be visible after scrolling into view"
        text = await page.locator('xpath=/html/body/div/aside/div[3]/div[2]/button[1]').nth(0).text_content()
        # Assert: Button text is 'Enviar pedido por WhatsApp'
        assert "Enviar pedido por WhatsApp" in (text or ""), "Expected 'Enviar pedido por WhatsApp' button text"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    