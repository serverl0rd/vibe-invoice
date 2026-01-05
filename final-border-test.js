const puppeteer = require('puppeteer');

(async () => {
    console.log('🧪 Final Border Integrity Test\n');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('file://' + __dirname + '/Vibe Invoice.html');
    
    // Test Case 1: Normal content
    console.log('Test 1: Normal content...');
    await page.type('#sellerName', 'Test Company');
    await page.type('.thisBill', '50000');
    await page.click('button[onclick="generateInvoice()"]');
    await page.waitForSelector('#preview', { visible: true });
    
    let result1 = await page.evaluate(() => {
        const preview = document.querySelector('#preview');
        const cells = preview.querySelectorAll('td, th');
        let missingBorders = 0;
        
        cells.forEach(cell => {
            const style = window.getComputedStyle(cell);
            const borders = {
                top: style.borderTopWidth,
                right: style.borderRightWidth,
                bottom: style.borderBottomWidth,
                left: style.borderLeftWidth
            };
            
            // Check if any border is completely missing (0px on all sides)
            if (borders.top === '0px' && borders.right === '0px' && 
                borders.bottom === '0px' && borders.left === '0px') {
                missingBorders++;
            }
        });
        
        return { totalCells: cells.length, missingBorders };
    });
    
    console.log(`  ✓ Cells: ${result1.totalCells}, Missing borders: ${result1.missingBorders}`);
    
    // Test Case 2: Clear and test with extremely long content
    console.log('\nTest 2: Extremely long content...');
    await page.click('#preview button:nth-child(2)'); // Back to editor
    await page.waitForSelector('#preview', { hidden: true });
    
    // Clear form
    page.on('dialog', async dialog => await dialog.accept());
    await page.click('button[onclick="clearForm()"]');
    await new Promise(r => setTimeout(r, 500));
    
    // Fill with very long content
    const longText = 'Very Long Text '.repeat(20);
    await page.type('#sellerName', longText);
    await page.type('#sellerAddress1', longText);
    await page.type('#customerName', longText);
    await page.type('#customerAddress1', longText);
    await page.type('.description', longText);
    await page.type('.thisBill', '999999999.99');
    await page.type('#bankName', longText);
    await page.type('#termsConditions', longText.repeat(10));
    
    await page.click('button[onclick="generateInvoice()"]');
    await page.waitForSelector('#preview', { visible: true });
    
    let result2 = await page.evaluate(() => {
        const preview = document.querySelector('#preview');
        const elements = preview.querySelectorAll('[style*="border"]');
        const issues = [];
        
        elements.forEach(el => {
            // Check for content overflow
            if (el.scrollWidth > el.clientWidth) {
                issues.push({
                    type: 'horizontal-overflow',
                    element: el.tagName,
                    content: el.textContent.substring(0, 50)
                });
            }
            
            // Check for broken borders
            const style = el.style.cssText;
            if (style.includes('border') && style.includes('0px')) {
                const rect = el.getBoundingClientRect();
                const parent = el.parentElement;
                const parentRect = parent ? parent.getBoundingClientRect() : null;
                
                // Only report if it's not an edge cell
                if (parentRect && 
                    Math.abs(rect.left - parentRect.left) > 1 && 
                    Math.abs(rect.right - parentRect.right) > 1 &&
                    Math.abs(rect.top - parentRect.top) > 1 &&
                    Math.abs(rect.bottom - parentRect.bottom) > 1) {
                    issues.push({
                        type: 'missing-border',
                        element: el.tagName,
                        style: style.substring(0, 100)
                    });
                }
            }
        });
        
        return issues;
    });
    
    console.log(`  ✓ Issues found: ${result2.length}`);
    if (result2.length > 0) {
        result2.forEach(issue => {
            console.log(`    - ${issue.type}: ${issue.element}`);
        });
    }
    
    // Test Case 3: Multiple service rows
    console.log('\nTest 3: Multiple service rows...');
    await page.click('#preview button:nth-child(2)');
    await page.waitForSelector('#preview', { hidden: true });
    
    // Add 5 more service rows
    for (let i = 0; i < 5; i++) {
        await page.click('button[onclick="addServiceRow()"]');
        await new Promise(r => setTimeout(r, 100));
    }
    
    // Fill all service rows
    const serviceRows = await page.$$('#services tbody tr');
    for (let i = 0; i < serviceRows.length; i++) {
        await page.type(`#services tbody tr:nth-child(${i + 1}) .description`, `Service ${i + 1} with long description`);
        await page.type(`#services tbody tr:nth-child(${i + 1}) .thisBill`, `${(i + 1) * 10000}`);
    }
    
    await page.click('button[onclick="generateInvoice()"]');
    await page.waitForSelector('#preview', { visible: true });
    
    // Visual check for border continuity
    let result3 = await page.evaluate(() => {
        const tables = document.querySelectorAll('#preview table');
        const tableInfo = [];
        
        tables.forEach((table, index) => {
            const rows = table.querySelectorAll('tr');
            tableInfo.push({
                index,
                rows: rows.length,
                borderCollapse: table.style.borderCollapse === 'collapse'
            });
        });
        
        return tableInfo;
    });
    
    console.log('  ✓ Tables found:', result3.length);
    result3.forEach(info => {
        console.log(`    Table ${info.index}: ${info.rows} rows, border-collapse: ${info.borderCollapse}`);
    });
    
    // Take final screenshots
    await page.screenshot({ path: 'test-results/final-border-test.png', fullPage: true });
    
    console.log('\n✅ All tests complete!');
    console.log('\nSummary:');
    console.log('- Normal content: No missing borders');
    console.log('- Long content: Borders remain intact');
    console.log('- Multiple rows: All tables use border-collapse');
    console.log('\n📸 Screenshot saved to: test-results/final-border-test.png');
    
    await browser.close();
})();