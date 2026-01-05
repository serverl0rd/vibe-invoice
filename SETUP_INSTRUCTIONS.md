# 🚀 Simple Setup Instructions for Vibe Invoice Testing

## ✅ What I've Done For You:

1. **Installed Playwright MCP** globally on your system
2. **Created Claude configuration** at:
   ```
   ~/Library/Application Support/Claude Desktop/claude_desktop_config.json
   ```
3. **Created all test files** in your project directory
4. **Created an automated setup script** 

## 📋 What You Need To Do:

### Step 1: Restart Claude Desktop
**Important**: You must completely quit and restart Claude Desktop for the Playwright MCP to be available.

1. Quit Claude completely (Cmd+Q on Mac)
2. Start Claude again
3. The Playwright MCP tools should now be available

### Step 2: Run Local Tests (Easy Way)

Open Terminal and run these commands:

```bash
cd /Users/rightfulguy/vibe-invoice
./setup-and-test.sh
```

This script will:
- Install all necessary dependencies
- Set up Playwright
- Run the tests
- Show you the results

### Step 3: Alternative - Manual Browser Testing

If you prefer to test in your browser:

1. Open `Vibe Invoice.html` in Chrome or Firefox
2. Press F12 to open Developer Console
3. Open `test-suite.js` in a text editor
4. Copy all the code
5. Paste it in the browser console
6. Type: `tester.runAllTests()` and press Enter
7. Watch the tests run automatically!

## 🧪 Test Commands (After Setup):

- `npm test` - Run all tests
- `npm run test:headed` - See the browser while testing
- `npm run test:debug` - Debug tests step by step
- `npm run test:ui` - Interactive test interface

## ❓ Troubleshooting:

### If Playwright MCP doesn't work in Claude:
- Make sure you completely quit Claude (not just close the window)
- Check that the config file exists at: `~/Library/Application Support/Claude Desktop/claude_desktop_config.json`
- Try restarting your computer

### If local tests don't work:
- Make sure you have Node.js installed
- Run: `node --version` (should show a version number)
- If not installed, download from: https://nodejs.org/

### If you see permission errors:
- Run: `chmod +x setup-and-test.sh`
- Try: `bash setup-and-test.sh`

## 📸 What the Tests Check:

1. ✅ All form fields work correctly
2. ✅ GST automatically selects IGST or CGST/SGST based on states
3. ✅ Calculations are accurate
4. ✅ Special characters don't break anything
5. ✅ Borders are consistent (all 1px)
6. ✅ Invoice generates without errors
7. ✅ Empty fields don't show "undefined" or "null"
8. ✅ Print function works
9. ✅ Form can be cleared
10. ✅ Long text in terms doesn't break layout

## 🎉 That's It!

The simplest way is to just run the setup script:
```bash
cd /Users/rightfulguy/vibe-invoice
./setup-and-test.sh
```

It will guide you through everything!