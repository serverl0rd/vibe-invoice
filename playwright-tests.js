// Playwright Tests for Vibe Invoice Generator
// This file contains Playwright-based tests that can be run with Playwright MCP

const playwrightTests = {
    // Test configuration
    config: {
        baseURL: 'file://' + __dirname + '/Vibe Invoice.html',
        timeout: 30000,
        viewport: { width: 1280, height: 720 }
    },

    // Test data
    testData: {
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
        },
        services: [
            {
                description: 'Web Development Services',
                sac: '998314',
                prevBill: '0',
                thisBill: '50000'
            },
            {
                description: 'Maintenance Services',
                sac: '998311',
                prevBill: '0',
                thisBill: '25000'
            }
        ]
    },

    // Test cases for Playwright MCP
    tests: [
        {
            name: 'Load invoice page',
            steps: [
                { action: 'navigate', url: '${config.baseURL}' },
                { action: 'wait', selector: '#sellerName', state: 'visible' },
                { action: 'screenshot', name: 'invoice-loaded' }
            ]
        },
        {
            name: 'Fill seller information',
            steps: [
                { action: 'fill', selector: '#sellerName', value: '${testData.seller.name}' },
                { action: 'fill', selector: '#sellerAddress1', value: '${testData.seller.address1}' },
                { action: 'fill', selector: '#sellerAddress2', value: '${testData.seller.address2}' },
                { action: 'fill', selector: '#sellerEmail', value: '${testData.seller.email}' },
                { action: 'fill', selector: '#sellerGSTIN', value: '${testData.seller.gstin}' },
                { action: 'fill', selector: '#sellerContact', value: '${testData.seller.contact}' },
                { action: 'fill', selector: '#sellerState', value: '${testData.seller.state}' },
                { action: 'fill', selector: '#sellerStateCode', value: '${testData.seller.stateCode}' }
            ]
        },
        {
            name: 'Fill customer information',
            steps: [
                { action: 'fill', selector: '#customerName', value: '${testData.customer.name}' },
                { action: 'fill', selector: '#customerGSTIN', value: '${testData.customer.gstin}' },
                { action: 'fill', selector: '#customerAddress1', value: '${testData.customer.address1}' },
                { action: 'fill', selector: '#customerAddress2', value: '${testData.customer.address2}' },
                { action: 'fill', selector: '#customerState', value: '${testData.customer.state}' },
                { action: 'fill', selector: '#customerStateCode', value: '${testData.customer.stateCode}' }
            ]
        },
        {
            name: 'Verify GST type auto-selection',
            steps: [
                { action: 'wait', time: 500 },
                { action: 'expect', selector: '#taxType', property: 'value', value: 'IGST' },
                { action: 'screenshot', name: 'gst-type-igst' },
                // Change customer state to same as seller
                { action: 'fill', selector: '#customerStateCode', value: '27' },
                { action: 'wait', time: 500 },
                { action: 'expect', selector: '#taxType', property: 'value', value: 'CGST & SGST' },
                { action: 'screenshot', name: 'gst-type-cgst-sgst' }
            ]
        },
        {
            name: 'Add service rows',
            steps: [
                // Fill first service row
                { action: 'fill', selector: '.description', value: '${testData.services[0].description}' },
                { action: 'fill', selector: '.sac', value: '${testData.services[0].sac}' },
                { action: 'fill', selector: '.thisBill', value: '${testData.services[0].thisBill}' },
                // Add second service row
                { action: 'click', selector: 'button[onclick="addServiceRow()"]' },
                { action: 'wait', selector: '#services tbody tr:nth-child(2)', state: 'visible' },
                { action: 'fill', selector: '#services tbody tr:nth-child(2) .description', value: '${testData.services[1].description}' },
                { action: 'fill', selector: '#services tbody tr:nth-child(2) .sac', value: '${testData.services[1].sac}' },
                { action: 'fill', selector: '#services tbody tr:nth-child(2) .thisBill', value: '${testData.services[1].thisBill}' },
                { action: 'screenshot', name: 'services-added' }
            ]
        },
        {
            name: 'Verify calculations',
            steps: [
                { action: 'wait', time: 500 },
                { action: 'expect', selector: '#totalBeforeTax', property: 'value', value: '75000.00' },
                { action: 'expect', selector: '#taxAmount', property: 'value', value: '13500.00' },
                { action: 'expect', selector: '#totalAfterTax', property: 'value', value: '88500.00' }
            ]
        },
        {
            name: 'Fill remaining details',
            steps: [
                { action: 'fill', selector: '#invoiceNo', value: '${testData.invoice.invoiceNo}' },
                { action: 'fill', selector: '#invoiceDate', value: '${testData.invoice.invoiceDate}' },
                { action: 'fill', selector: '#poNo', value: '${testData.invoice.poNo}' },
                { action: 'fill', selector: '#poDate', value: '${testData.invoice.poDate}' },
                { action: 'fill', selector: '#vendorCode', value: '${testData.invoice.vendorCode}' },
                { action: 'fill', selector: '#bankName', value: '${testData.bank.name}' },
                { action: 'fill', selector: '#branchAddress1', value: '${testData.bank.branch1}' },
                { action: 'fill', selector: '#accountNo', value: '${testData.bank.accountNo}' },
                { action: 'fill', selector: '#ifscCode', value: '${testData.bank.ifscCode}' },
                { action: 'fill', selector: '#termsConditions', value: 'Payment due within 30 days.\\nLate payment charges: 2% per month.' }
            ]
        },
        {
            name: 'Generate invoice',
            steps: [
                { action: 'click', selector: 'button[onclick="generateInvoice()"]' },
                { action: 'wait', selector: '#preview', state: 'visible' },
                { action: 'screenshot', name: 'invoice-preview', fullPage: true }
            ]
        },
        {
            name: 'Verify invoice content',
            steps: [
                { action: 'expect', selector: '#preview', text: 'TAX INVOICE' },
                { action: 'expect', selector: '#preview', text: '${testData.seller.name}' },
                { action: 'expect', selector: '#preview', text: '${testData.customer.name}' },
                { action: 'expect', selector: '#preview', text: 'Total Invoice Amount in Words:' },
                { action: 'expect', selector: '#preview', text: 'Bank Details' }
            ]
        },
        {
            name: 'Test border consistency',
            steps: [
                { action: 'evaluate', code: `
                    const elements = document.querySelectorAll('#preview [style*="border"]');
                    let has2pxBorder = false;
                    elements.forEach(el => {
                        if (el.style.cssText.includes('2px')) {
                            has2pxBorder = true;
                        }
                    });
                    return !has2pxBorder;
                `, expect: true }
            ]
        },
        {
            name: 'Test special characters',
            steps: [
                { action: 'click', selector: 'button:has-text("Back to Editor")' },
                { action: 'wait', selector: '#preview', state: 'hidden' },
                { action: 'fill', selector: '#sellerName', value: 'Test & Co. "Limited"' },
                { action: 'fill', selector: '#customerName', value: "O'Brien's Company" },
                { action: 'click', selector: 'button[onclick="generateInvoice()"]' },
                { action: 'wait', selector: '#preview', state: 'visible' },
                { action: 'evaluate', code: `
                    const preview = document.querySelector('#preview');
                    return !preview.innerHTML.includes('&amp;amp;') && 
                           !preview.innerHTML.includes('undefined') &&
                           !preview.innerHTML.includes('null');
                `, expect: true },
                { action: 'screenshot', name: 'special-characters-test' }
            ]
        },
        {
            name: 'Test print view',
            steps: [
                { action: 'evaluate', code: 'window.print = () => { window.printCalled = true; }' },
                { action: 'click', selector: '#preview button:has-text("Print Invoice")' },
                { action: 'evaluate', code: 'return window.printCalled', expect: true }
            ]
        },
        {
            name: 'Test clear form',
            steps: [
                { action: 'click', selector: 'button:has-text("Back to Editor")' },
                { action: 'evaluate', code: 'window.confirm = () => true' },
                { action: 'click', selector: 'button[onclick="clearForm()"]' },
                { action: 'wait', time: 500 },
                { action: 'expect', selector: '#sellerName', property: 'value', value: '' },
                { action: 'expect', selector: '#customerName', property: 'value', value: '' },
                { action: 'expect', selector: '#taxRate', property: 'value', value: '18' },
                { action: 'screenshot', name: 'form-cleared' }
            ]
        }
    ]
};

// Export for use with Playwright MCP
if (typeof module !== 'undefined' && module.exports) {
    module.exports = playwrightTests;
}

console.log('Playwright test configuration created.');
console.log('To use with Playwright MCP:');
console.log('1. Configure Claude to use @playwright/mcp');
console.log('2. Restart Claude to enable MCP tools');
console.log('3. Use mcp__playwright tools to run these tests');