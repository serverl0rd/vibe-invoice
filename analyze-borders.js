const puppeteer = require('puppeteer');

(async () => {
    console.log('🔍 Analyzing Border Issues...\n');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('file://' + __dirname + '/Vibe Invoice.html');
    
    // Fill minimal data to generate invoice
    await page.type('#sellerName', 'Test Company with Very Long Name That Should Wrap');
    await page.type('.thisBill', '100000');
    
    // Generate invoice
    await page.click('button[onclick="generateInvoice()"]');
    await page.waitForSelector('#preview', { visible: true });
    await new Promise(r => setTimeout(r, 500));
    
    // Detailed border analysis
    const detailedAnalysis = await page.evaluate(() => {
        const preview = document.querySelector('#preview');
        const results = {
            tables: [],
            specificIssues: [],
            borderStyles: new Set()
        };
        
        // Analyze each table
        const tables = preview.querySelectorAll('table');
        tables.forEach((table, index) => {
            const tableInfo = {
                index,
                borderCollapse: table.style.borderCollapse,
                border: table.style.border,
                cellCount: table.querySelectorAll('td, th').length,
                issues: []
            };
            
            // Check each cell in this table
            const cells = table.querySelectorAll('td, th');
            cells.forEach((cell, cellIndex) => {
                const borderStyle = cell.style.border;
                if (borderStyle) {
                    results.borderStyles.add(borderStyle);
                    
                    // Check for "border: 0px" which might be the issue
                    if (borderStyle.includes('0px') || borderStyle === '0') {
                        tableInfo.issues.push({
                            cellIndex,
                            content: cell.textContent.trim().substring(0, 30),
                            borderStyle: borderStyle
                        });
                    }
                }
            });
            
            results.tables.push(tableInfo);
        });
        
        // Look for the specific IFSC code cell
        const allCells = preview.querySelectorAll('td');
        allCells.forEach(cell => {
            if (cell.textContent.includes('IFSC Code:') || cell.textContent.includes('SBIN')) {
                results.specificIssues.push({
                    content: cell.textContent.trim(),
                    border: cell.style.border,
                    parent: cell.parentElement.tagName,
                    parentBorder: cell.parentElement.style.border
                });
            }
        });
        
        return {
            ...results,
            borderStyles: Array.from(results.borderStyles)
        };
    });
    
    console.log('📊 Detailed Analysis:\n');
    console.log('Border Styles Found:', detailedAnalysis.borderStyles);
    
    console.log('\n📋 Table Analysis:');
    detailedAnalysis.tables.forEach(table => {
        if (table.issues.length > 0) {
            console.log(`\nTable ${table.index}:`);
            console.log(`  Border Collapse: ${table.borderCollapse}`);
            console.log(`  Issues:`);
            table.issues.forEach(issue => {
                console.log(`    - Cell: "${issue.content}"`);
                console.log(`      Border: ${issue.borderStyle}`);
            });
        }
    });
    
    if (detailedAnalysis.specificIssues.length > 0) {
        console.log('\n🔍 Specific Issues Found:');
        detailedAnalysis.specificIssues.forEach(issue => {
            console.log(`  Content: ${issue.content}`);
            console.log(`  Border: ${issue.border}`);
            console.log(`  Parent: ${issue.parent}`);
        });
    }
    
    // Look for the actual issue in the HTML
    const htmlAnalysis = await page.evaluate(() => {
        const preview = document.querySelector('#preview');
        const html = preview.innerHTML;
        
        // Find all instances of border: 0
        const borderZeroMatches = html.match(/border:\s*0(?:px)?(?:\s|;|")/g) || [];
        
        // Find the specific bank details section
        const bankSection = html.substring(
            html.indexOf('Bank Details'),
            html.indexOf('Terms and Conditions')
        );
        
        return {
            borderZeroCount: borderZeroMatches.length,
            borderZeroInstances: borderZeroMatches,
            bankSectionSnippet: bankSection.substring(0, 500)
        };
    });
    
    console.log('\n🔬 HTML Analysis:');
    console.log(`Found ${htmlAnalysis.borderZeroCount} instances of "border: 0"`);
    if (htmlAnalysis.borderZeroCount > 0) {
        console.log('Instances:', htmlAnalysis.borderZeroInstances);
    }
    
    await browser.close();
    console.log('\n✅ Analysis complete!');
})();