/**
 * Puppeteer Test Suite for Vibe Invoice Generator
 * Run with: node puppeteer-tests.js
 * Run headed: node puppeteer-tests.js --headed
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Test configuration
const config = {
    headless: !process.argv.includes('--headed'),
    invoiceURL: 'file://' + path.resolve(__dirname, 'Vibe Invoice.html'),
    slowMo: process.argv.includes('--slow') ? 50 : 0,
    timeout: 30000,
    viewport: { width: 1280, height: 720 }
};

// Test results tracking
let testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    failures: []
};

// Console colors
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

// Test data
const testData = {
    seller: {
        name: 'Tech Solutions Pvt Ltd',
        address1: '123 Business Park',
        address2: 'Mumbai, Maharashtra 400001',
        email: 'billing@techsolutions.com',
        gstin: '27AABCT1332L1ZV',
        contact: '+91 9876543210',
        state: 'Maharashtra',
        stateCode: '27'
    },
    customer: {
        name: 'Client Corporation Ltd',
        gstin: '29AABCC1206D1ZM',
        address1: '456 Tech Street',
        address2: 'Bangalore, Karnataka 560001',
        state: 'Karnataka',
        stateCode: '29'
    },
    invoice: {
        invoiceNo: 'INV-2024-001',
        invoiceDate: '2024-01-15',
        poNo: 'PO-2024-100',
        poDate: '2024-01-10',
        vendorCode: 'VEN001'
    },
    bank: {
        name: 'State Bank of India',
        branch1: 'Fort Branch',
        branch2: 'Mumbai, Maharashtra',
        accountNo: '1234567890',
        ifscCode: 'SBIN0001234'
    }
};

// Helper function to run a test
async function runTest(name, testFn) {
    testResults.total++;
    process.stdout.write(`${colors.blue}Testing:${colors.reset} ${name}... `);
    
    try {
        await testFn();
        testResults.passed++;
        console.log(`${colors.green}✓ PASSED${colors.reset}`);
        return true;
    } catch (error) {
        testResults.failed++;
        testResults.failures.push({ name, error: error.message });
        console.log(`${colors.red}✗ FAILED${colors.reset}`);
        console.error(`  ${colors.red}Error: ${error.message}${colors.reset}`);
        return false;
    }
}

// Helper to wait and find element
async function waitForSelector(page, selector, options = {}) {
    return await page.waitForSelector(selector, { timeout: 5000, ...options });
}

// Helper to wait for a specified time
async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main test suite
async function runAllTests() {
    console.log(`\n${colors.blue}🚀 Starting Puppeteer Tests for Vibe Invoice Generator${colors.reset}\n`);
    console.log(`Running in ${config.headless ? 'headless' : 'headed'} mode\n`);

    const browser = await puppeteer.launch({
        headless: config.headless,
        slowMo: config.slowMo,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport(config.viewport);

    try {
        // Test 1: Load invoice page
        await runTest('Load invoice page', async () => {
            await page.goto(config.invoiceURL, { waitUntil: 'networkidle0' });
            await waitForSelector(page, '#sellerName');
            const title = await page.title();
            if (!title.includes('Invoice')) throw new Error('Page title incorrect');
        });

        // Test 2: Check all form elements exist
        await runTest('All form elements exist', async () => {
            const elements = [
                '#sellerName', '#sellerAddress1', '#sellerEmail', '#sellerGSTIN',
                '#customerName', '#customerGSTIN', '#invoiceNo', '#invoiceDate',
                '#taxType', '#taxRate', '#bankName', '#ifscCode'
            ];
            
            for (const selector of elements) {
                const element = await page.$(selector);
                if (!element) throw new Error(`Element ${selector} not found`);
            }
        });

        // Test 3: Fill seller information
        await runTest('Fill seller information', async () => {
            await page.type('#sellerName', testData.seller.name);
            await page.type('#sellerAddress1', testData.seller.address1);
            await page.type('#sellerAddress2', testData.seller.address2);
            await page.type('#sellerEmail', testData.seller.email);
            await page.type('#sellerGSTIN', testData.seller.gstin);
            await page.type('#sellerContact', testData.seller.contact);
            await page.type('#sellerState', testData.seller.state);
            await page.type('#sellerStateCode', testData.seller.stateCode);
            
            const value = await page.$eval('#sellerName', el => el.value);
            if (value !== testData.seller.name) throw new Error('Seller name not filled correctly');
        });

        // Test 4: GST auto-selection based on state codes
        await runTest('GST auto-selection (different states = IGST)', async () => {
            await page.type('#customerStateCode', '29'); // Different from seller (27)
            await wait(500);
            
            const taxType = await page.$eval('#taxType', el => el.value);
            if (taxType !== 'IGST') throw new Error(`Expected IGST, got ${taxType}`);
        });

        // Test 5: GST auto-selection for same state
        await runTest('GST auto-selection (same state = CGST & SGST)', async () => {
            await page.$eval('#customerStateCode', el => el.value = '');
            await page.type('#customerStateCode', '27'); // Same as seller
            await wait(500);
            
            const taxType = await page.$eval('#taxType', el => el.value);
            if (taxType !== 'CGST & SGST') throw new Error(`Expected CGST & SGST, got ${taxType}`);
        });

        // Test 6: Add service and calculate totals
        await runTest('Add service and calculate totals', async () => {
            // Clear existing values first
            await page.$eval('.description', el => el.value = '');
            await page.$eval('.sac', el => el.value = '');
            await page.$eval('.thisBill', el => el.value = '');
            
            await page.type('.description', 'Web Development Services');
            await page.type('.sac', '998314');
            await page.type('.thisBill', '50000');
            
            // Trigger calculation by dispatching input event
            await page.evaluate(() => {
                const input = document.querySelector('.thisBill');
                input.dispatchEvent(new Event('input', { bubbles: true }));
            });
            
            await wait(500);
            
            const totalBeforeTax = await page.$eval('#totalBeforeTax', el => el.value);
            const taxAmount = await page.$eval('#taxAmount', el => el.value);
            const totalAfterTax = await page.$eval('#totalAfterTax', el => el.value);
            
            console.log(`\n  Debug: totalBeforeTax=${totalBeforeTax}, taxAmount=${taxAmount}, totalAfterTax=${totalAfterTax}`);
            
            if (parseFloat(totalBeforeTax) !== 50000) throw new Error(`Total before tax incorrect: expected 50000, got ${totalBeforeTax}`);
            if (parseFloat(taxAmount) !== 9000) throw new Error(`Tax amount incorrect: expected 9000, got ${taxAmount}`);
            if (parseFloat(totalAfterTax) !== 59000) throw new Error(`Total after tax incorrect: expected 59000, got ${totalAfterTax}`);
        });

        // Test 7: Add and remove service rows
        await runTest('Add and remove service rows', async () => {
            const initialRows = await page.$$eval('#services tbody tr', rows => rows.length);
            
            // Add row
            await page.click('button[onclick="addServiceRow()"]');
            await wait(300);
            
            const afterAddRows = await page.$$eval('#services tbody tr', rows => rows.length);
            if (afterAddRows !== initialRows + 1) throw new Error('Row not added');
            
            // Remove row
            const removeButtons = await page.$$('button[onclick*="removeRow"]');
            await removeButtons[removeButtons.length - 1].click();
            await wait(300);
            
            const afterRemoveRows = await page.$$eval('#services tbody tr', rows => rows.length);
            if (afterRemoveRows !== initialRows) throw new Error('Row not removed');
        });

        // Test 8: Fill complete form
        await runTest('Fill complete invoice form', async () => {
            // Customer details
            await page.type('#customerName', testData.customer.name);
            await page.type('#customerGSTIN', testData.customer.gstin);
            await page.type('#customerAddress1', testData.customer.address1);
            await page.type('#customerAddress2', testData.customer.address2);
            
            // Invoice details
            await page.type('#invoiceNo', testData.invoice.invoiceNo);
            await page.type('#invoiceDate', testData.invoice.invoiceDate);
            await page.type('#poNo', testData.invoice.poNo);
            
            // Bank details
            await page.type('#bankName', testData.bank.name);
            await page.type('#accountNo', testData.bank.accountNo);
            await page.type('#ifscCode', testData.bank.ifscCode);
            
            // Terms
            await page.type('#termsConditions', 'Payment due within 30 days.\nLate charges apply.');
            
            const invoiceNo = await page.$eval('#invoiceNo', el => el.value);
            if (invoiceNo !== testData.invoice.invoiceNo) throw new Error('Invoice details not filled');
        });

        // Test 9: Generate invoice
        await runTest('Generate invoice preview', async () => {
            await page.click('button[onclick="generateInvoice()"]');
            await waitForSelector(page, '#preview', { visible: true });
            
            const previewVisible = await page.$eval('#preview', el => el.style.display !== 'none');
            if (!previewVisible) throw new Error('Preview not visible');
            
            // Take screenshot
            if (!fs.existsSync('test-results')) {
                fs.mkdirSync('test-results');
            }
            await page.screenshot({ path: 'test-results/puppeteer-invoice.png', fullPage: true });
        });

        // Test 10: Check invoice content
        await runTest('Invoice content verification', async () => {
            const previewText = await page.$eval('#preview', el => el.textContent);
            
            const expectedContent = [
                'TAX INVOICE',
                testData.seller.name,
                testData.customer.name,
                'Total Invoice Amount in Words',
                'Bank Details'
            ];
            
            for (const content of expectedContent) {
                if (!previewText.includes(content)) {
                    throw new Error(`Missing content: ${content}`);
                }
            }
        });

        // Test 11: Check border consistency
        await runTest('Border consistency (all 1px)', async () => {
            const has2pxBorder = await page.evaluate(() => {
                const elements = document.querySelectorAll('#preview [style*="border"]');
                return Array.from(elements).some(el => el.style.cssText.includes('2px'));
            });
            
            if (has2pxBorder) throw new Error('Found 2px borders, should all be 1px');
        });

        // Test 12: Test special characters
        await runTest('Special characters handling', async () => {
            // Go back to editor
            await page.click('#preview button:nth-child(2)'); // Back to Editor button
            await page.waitForSelector('#preview', { hidden: true });
            
            // Clear and add special characters
            await page.$eval('#sellerName', el => el.value = '');
            await page.type('#sellerName', 'Test & Co. "Limited"');
            
            await page.click('button[onclick="generateInvoice()"]');
            await waitForSelector(page, '#preview', { visible: true });
            
            const hasDoubleEncoding = await page.evaluate(() => {
                const preview = document.querySelector('#preview');
                return preview.innerHTML.includes('&amp;amp;');
            });
            
            if (hasDoubleEncoding) throw new Error('Double HTML encoding detected');
        });

        // Test 13: Empty values handling
        await runTest('Empty values (no undefined/null)', async () => {
            await page.click('#preview button:nth-child(2)');
            await page.waitForSelector('#preview', { hidden: true });
            
            // Clear some fields
            await page.$eval('#poNo', el => el.value = '');
            await page.$eval('#vehicleNo', el => el.value = '');
            
            await page.click('button[onclick="generateInvoice()"]');
            await waitForSelector(page, '#preview', { visible: true });
            
            const hasUndefinedOrNull = await page.evaluate(() => {
                const preview = document.querySelector('#preview');
                return preview.innerHTML.includes('undefined') || preview.innerHTML.includes('null');
            });
            
            if (hasUndefinedOrNull) throw new Error('Found undefined or null in preview');
        });

        // Test 14: Print functionality
        await runTest('Print functionality', async () => {
            // Override print function
            await page.evaluate(() => {
                window.print = () => {
                    window.printCalled = true;
                };
            });
            
            await page.click('#preview button:nth-child(1)'); // Print button
            
            const printCalled = await page.evaluate(() => window.printCalled);
            if (!printCalled) throw new Error('Print function not called');
        });

        // Test 15: Clear form
        await runTest('Clear form functionality', async () => {
            await page.click('#preview button:nth-child(2)');
            await page.waitForSelector('#preview', { hidden: true });
            
            // Set up dialog handler before triggering the dialog
            const dialogPromise = new Promise(resolve => {
                page.once('dialog', async dialog => {
                    await dialog.accept();
                    resolve();
                });
            });
            
            await page.click('button[onclick="clearForm()"]');
            await dialogPromise;
            
            await wait(500);
            
            const sellerName = await page.$eval('#sellerName', el => el.value);
            const taxRate = await page.$eval('#taxRate', el => el.value);
            
            if (sellerName !== '') throw new Error('Form not cleared');
            if (taxRate !== '18') throw new Error('Default tax rate not restored');
        });

        // Test 16: Performance test
        await runTest('Performance (invoice generation < 2s)', async () => {
            await page.type('#sellerName', 'Performance Test Company');
            await page.type('.thisBill', '100000');
            
            const startTime = Date.now();
            await page.click('button[onclick="generateInvoice()"]');
            await waitForSelector(page, '#preview', { visible: true });
            const endTime = Date.now();
            
            const generationTime = endTime - startTime;
            if (generationTime > 2000) {
                throw new Error(`Generation took ${generationTime}ms (> 2000ms)`);
            }
        });

    } catch (error) {
        console.error(`\n${colors.red}Fatal error during tests: ${error.message}${colors.reset}`);
    } finally {
        await browser.close();
        printResults();
    }
}

// Print test results summary
function printResults() {
    console.log(`\n${colors.blue}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.blue}TEST RESULTS SUMMARY${colors.reset}`);
    console.log(`${colors.blue}${'='.repeat(60)}${colors.reset}`);
    
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`${colors.green}✓ Passed: ${testResults.passed}${colors.reset}`);
    console.log(`${colors.red}✗ Failed: ${testResults.failed}${colors.reset}`);
    console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(2)}%`);
    
    if (testResults.failures.length > 0) {
        console.log(`\n${colors.red}Failed Tests:${colors.reset}`);
        testResults.failures.forEach((failure, index) => {
            console.log(`${index + 1}. ${failure.name}`);
            console.log(`   Error: ${failure.error}`);
        });
    }
    
    console.log(`\n${colors.blue}${'='.repeat(60)}${colors.reset}`);
    
    if (testResults.failed === 0) {
        console.log(`\n${colors.green}🎉 All tests passed! The invoice generator is working correctly.${colors.reset}\n`);
    } else {
        console.log(`\n${colors.red}⚠️  Some tests failed. Please check the errors above.${colors.reset}\n`);
        process.exit(1);
    }
}

// Check if Puppeteer is installed
async function checkDependencies() {
    try {
        require.resolve('puppeteer');
    } catch (e) {
        console.error(`${colors.red}Error: Puppeteer is not installed.${colors.reset}`);
        console.log(`\nPlease run: ${colors.yellow}npm install${colors.reset}\n`);
        process.exit(1);
    }
}

// Main execution
async function main() {
    await checkDependencies();
    await runAllTests();
}

// Run tests
main().catch(error => {
    console.error(`${colors.red}Unexpected error: ${error}${colors.reset}`);
    process.exit(1);
});