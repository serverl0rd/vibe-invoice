# Playwright MCP Setup Guide

## Installation Status
✅ Playwright MCP has been installed globally at: `/Users/rightfulguy/.npm-global/lib/node_modules/@playwright/mcp`

## Configure Claude to Use Playwright MCP

To enable Playwright MCP in Claude, you need to add it to Claude's configuration:

### 1. Locate Claude's Configuration File

The configuration file is typically located at:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- Linux: `~/.config/Claude/claude_desktop_config.json`

### 2. Add Playwright MCP Configuration

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp"
      ],
      "env": {}
    }
  }
}
```

If you already have other MCP servers configured, add the playwright configuration to the existing `mcpServers` object:

```json
{
  "mcpServers": {
    "existing-server": {
      // ... existing configuration
    },
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp"
      ],
      "env": {}
    }
  }
}
```

### 3. Restart Claude

After saving the configuration file, completely quit and restart Claude for the changes to take effect.

### 4. Verify MCP is Loaded

Once restarted, you should have access to Playwright MCP tools that start with `mcp__`. These might include:
- `mcp__playwright_navigate`
- `mcp__playwright_click`
- `mcp__playwright_fill`
- `mcp__playwright_screenshot`
- etc.

## Running Tests with Playwright MCP

Once configured, you can run the tests using commands like:

```javascript
// Navigate to the invoice page
mcp__playwright_navigate({ url: "file:///Users/rightfulguy/vibe-invoice/Vibe Invoice.html" })

// Fill form fields
mcp__playwright_fill({ selector: "#sellerName", value: "Test Company Ltd" })

// Click buttons
mcp__playwright_click({ selector: "button[onclick='generateInvoice()']" })

// Take screenshots
mcp__playwright_screenshot({ path: "invoice-test.png" })

// Verify elements
mcp__playwright_expect({ selector: "#preview", visible: true })
```

## Alternative: Run Playwright Tests Locally

If you prefer to run Playwright tests without MCP, you can install Playwright locally:

```bash
cd /Users/rightfulguy/vibe-invoice
npm init -y
npm install --save-dev playwright @playwright/test
```

Then create a test file `playwright.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');

test('Invoice Generator Tests', async ({ page }) => {
  // Navigate to the invoice page
  await page.goto('file:///Users/rightfulguy/vibe-invoice/Vibe Invoice.html');
  
  // Fill seller information
  await page.fill('#sellerName', 'Tech Solutions Pvt Ltd');
  await page.fill('#sellerGSTIN', '27AABCT1332L1ZV');
  
  // Add service
  await page.fill('.description', 'Web Development');
  await page.fill('.thisBill', '50000');
  
  // Generate invoice
  await page.click('button[onclick="generateInvoice()"]');
  
  // Verify preview is visible
  await expect(page.locator('#preview')).toBeVisible();
  
  // Take screenshot
  await page.screenshot({ path: 'invoice-test.png', fullPage: true });
});
```

Run with: `npx playwright test`

## Troubleshooting

1. **MCP tools not appearing**: Make sure Claude is completely closed and restarted after configuration changes.

2. **Permission issues**: Ensure the global npm directory is in your PATH:
   ```bash
   echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
   source ~/.bashrc
   ```

3. **Playwright not found**: Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Test Files Created

- `playwright-tests.js` - Structured test configuration for Playwright MCP
- `test-suite.js` - Browser-based test suite (no Playwright required)
- `edge-case-tests.js` - Edge case tests
- `test-runner.html` - HTML test runner interface