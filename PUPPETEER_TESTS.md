# 🎭 Puppeteer Tests for Vibe Invoice Generator

## Overview

Puppeteer is a Node.js library that provides a high-level API to control Chrome/Chromium browsers. Unlike Playwright MCP which requires Claude configuration, Puppeteer tests can be run immediately from the command line.

## Quick Start

### 1. Run All Tests (Easiest Way)
```bash
cd /Users/rightfulguy/vibe-invoice
./run-puppeteer-tests.sh
```

### 2. Run Tests with Browser Visible
```bash
./run-puppeteer-tests.sh --headed
```

### 3. Run Tests in Slow Motion
```bash
./run-puppeteer-tests.sh --slow
```

## What the Tests Cover

The Puppeteer test suite includes 16 comprehensive tests:

1. **Page Loading** - Verifies the invoice page loads correctly
2. **Form Elements** - Checks all form fields exist
3. **Data Entry** - Tests filling seller information
4. **GST Auto-Selection** - Verifies IGST vs CGST/SGST logic
5. **Service Calculations** - Tests tax and total calculations
6. **Row Management** - Tests adding/removing service rows
7. **Complete Form** - Fills entire invoice form
8. **Invoice Generation** - Tests preview generation
9. **Content Verification** - Checks invoice content
10. **Border Consistency** - Ensures all borders are 1px
11. **Special Characters** - Tests HTML escaping
12. **Empty Values** - Ensures no undefined/null display
13. **Print Function** - Tests print functionality
14. **Clear Form** - Tests form reset
15. **Performance** - Ensures fast generation (<2s)
16. **Screenshot** - Captures invoice screenshot

## Manual Commands

### Install Dependencies
```bash
npm install
```

### Run Tests Directly
```bash
# Headless mode (default)
node puppeteer-tests.js

# Headed mode (see browser)
node puppeteer-tests.js --headed

# Slow mode (easier to watch)
node puppeteer-tests.js --slow
```

### Using npm Scripts
```bash
# Run Puppeteer tests
npm run test:puppeteer

# Run with browser visible
npm run test:puppeteer:headed
```

## Test Output

The tests will show:
- ✅ Green checkmarks for passed tests
- ❌ Red X marks for failed tests
- Detailed error messages for failures
- Summary statistics at the end
- Screenshot saved to `test-results/puppeteer-invoice.png`

## Example Output
```
🚀 Starting Puppeteer Tests for Vibe Invoice Generator

Testing: Load invoice page... ✓ PASSED
Testing: All form elements exist... ✓ PASSED
Testing: Fill seller information... ✓ PASSED
...

============================================================
TEST RESULTS SUMMARY
============================================================
Total Tests: 16
✓ Passed: 16
✗ Failed: 0
Success Rate: 100.00%
============================================================

🎉 All tests passed! The invoice generator is working correctly.
```

## Troubleshooting

### "Puppeteer is not installed"
Run: `npm install`

### "No usable sandbox" error on Linux
The tests include `--no-sandbox` flag for compatibility. If you still have issues:
```bash
sudo sysctl -w kernel.unprivileged_userns_clone=1
```

### Tests run too fast to see
Use headed mode with slow motion:
```bash
node puppeteer-tests.js --headed --slow
```

### Screenshot not generated
- Check the `test-results` directory
- Ensure the invoice generation test passed
- Look for file: `test-results/puppeteer-invoice.png`

## Differences from Playwright

| Feature | Puppeteer | Playwright |
|---------|-----------|------------|
| Browser Support | Chrome/Chromium only | Chrome, Firefox, Safari |
| API | Simple, Chrome-focused | Cross-browser unified |
| Speed | Fast | Fast |
| Setup | Just npm install | npm install + browsers |
| MCP Support | No | Yes (with Claude) |

## Advanced Usage

### Debugging Failed Tests
```javascript
// Add this to puppeteer-tests.js for debugging
page.on('console', msg => console.log('Browser log:', msg.text()));
page.on('error', err => console.error('Browser error:', err));
```

### Custom Test Data
Edit the `testData` object in `puppeteer-tests.js` to test with different values.

### Add New Tests
Add new test cases using the `runTest` helper:
```javascript
await runTest('Your test name', async () => {
    // Your test code here
    await page.click('#someButton');
    const result = await page.$eval('#result', el => el.textContent);
    if (result !== 'expected') throw new Error('Test failed');
});
```

## Benefits of Puppeteer Tests

1. **No Claude Configuration Required** - Works immediately
2. **Simple Setup** - Just npm install
3. **Fast Execution** - Chrome/Chromium only
4. **Good for CI/CD** - Easy to integrate
5. **Detailed Output** - Clear pass/fail indicators
6. **Screenshots** - Visual verification

That's it! Just run `./run-puppeteer-tests.sh` to test your invoice generator.