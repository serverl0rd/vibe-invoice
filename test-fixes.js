const puppeteer = require('puppeteer');

(async () => {
    console.log('Testing invoice fixes...\n');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('file://' + __dirname + '/Vibe Invoice.html');
    
    // Fill basic data
    await page.type('#sellerName', 'Test Company');
    await page.type('.thisBill', '1000');
    
    // Generate invoice
    await page.click('button[onclick="generateInvoice()"]');
    await page.waitForSelector('#preview', { visible: true });
    
    // Check for underline on TAX INVOICE
    const hasUnderline = await page.evaluate(() => {
        const h2 = document.querySelector('#preview h2');
        if (!h2) return 'H2 not found';
        const style = window.getComputedStyle(h2);
        return style.textDecoration;
    });
    
    console.log('TAX INVOICE text-decoration:', hasUnderline);
    console.log('Underline removed:', !hasUnderline.includes('underline') ? '✅ YES' : '❌ NO');
    
    // Check "Total Invoice Amount in Words" section
    const amountInWordsCheck = await page.evaluate(() => {
        const tables = document.querySelectorAll('#preview table');
        let foundAmountInWords = false;
        let borderStyle = '';
        
        tables.forEach(table => {
            const cells = table.querySelectorAll('td');
            cells.forEach(cell => {
                if (cell.textContent.includes('Total Invoice Amount in Words')) {
                    foundAmountInWords = true;
                    borderStyle = cell.style.border || 'No border style';
                }
            });
        });
        
        return { found: foundAmountInWords, borderStyle };
    });
    
    console.log('\nTotal Invoice Amount in Words:');
    console.log('Found in table:', amountInWordsCheck.found ? '✅ YES' : '❌ NO');
    console.log('Border style:', amountInWordsCheck.borderStyle);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/fixed-invoice.png', fullPage: true });
    console.log('\n📸 Screenshot saved to test-results/fixed-invoice.png');
    
    await browser.close();
    console.log('\nTest complete!');
})();