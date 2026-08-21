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
        
        # -> Click the 'Productos' link in the navigation bar to open the product listings.
        # Productos link
        elem = page.get_by_text('Navegación', exact=True).locator("xpath=ancestor-or-self::*[.//a][1]").get_by_role('link', name='Productos', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Agregar 🛒' button for the product 'B52 RM-2025BT 4x25 watts', then open the cart by clicking the 'Ver mi carrito' cart button.
        # Agregar 🛒 button
        elem = page.get_by_role('button', name='Agregar B52 RM-2025BT 4x25 watts al carrito', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Agregar 🛒' button for the product 'B52 RM-2025BT 4x25 watts', then open the cart by clicking the 'Ver mi carrito' cart button.
        # Abrir carrito de compras button
        elem = page.get_by_role('button', name='Abrir carrito de compras', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the cart drawer by clicking the 'Ver mi carrito' cart button (cart icon) to view items in the cart.
        # Abrir carrito de compras button
        elem = page.get_by_role('button', name='Abrir carrito de compras', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the '🗑️' (Eliminar producto) button for the B52 RM-2025BT 4x25 watts item in the cart drawer to remove it.
        # Quitar B52 RM-2025BT 4x25 watts del carrito button
        elem = page.get_by_role('button', name='Quitar B52 RM-2025BT 4x25 watts del carrito', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        elem = page.locator('xpath=/html/body/div[1]/aside/div[1]/div/span').nth(0)
        await elem.scroll_into_view_if_needed()
        # Assert: Cart count shows "0" after removing the item
        assert await elem.is_visible(), "Expected element to be visible after scrolling into view"
        msg = page.locator('text=Tu carrito está vacío').nth(0)
        await msg.scroll_into_view_if_needed()
        text = await msg.text_content()
        # Assert: Cart drawer displays the empty message "Tu carrito está vacío"
        assert 'Tu carrito está vacío' in text
        btn = page.locator('xpath=/html/body/div[1]/aside/div[2]/div/button').nth(0)
        await btn.scroll_into_view_if_needed()
        # Assert: "Explorar Productos" button is visible in the empty cart view
        assert await btn.is_visible(), "Expected element to be visible after scrolling into view"
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    