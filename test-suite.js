// Vibe Invoice Generator Test Suite
// Run this script in the browser console to test the invoice generator

class InvoiceTestSuite {
    constructor() {
        this.testResults = [];
        this.testCount = 0;
        this.passedTests = 0;
        this.failedTests = 0;
    }

    // Helper function to set input value and trigger events
    setInputValue(selector, value) {
        const element = document.querySelector(selector);
        if (element) {
            element.value = value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        }
        return false;
    }

    // Helper function to click a button
    clickButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            button.click();
            return true;
        }
        return false;
    }

    // Assert helper
    assert(condition, testName, errorMessage = '') {
        this.testCount++;
        if (condition) {
            this.passedTests++;
            this.testResults.push({ test: testName, status: 'PASSED' });
            console.log(`✅ ${testName}`);
        } else {
            this.failedTests++;
            this.testResults.push({ test: testName, status: 'FAILED', error: errorMessage });
            console.error(`❌ ${testName} - ${errorMessage}`);
        }
    }

    // Test 1: Check if all form elements exist
    testFormElements() {
        console.log('\n🧪 Testing Form Elements...');
        
        const elements = [
            '#sellerName', '#sellerAddress1', '#sellerAddress2', '#sellerEmail', 
            '#sellerGSTIN', '#sellerContact', '#invoiceNo', '#invoiceDate',
            '#customerName', '#customerGSTIN', '#customerAddress1', '#customerAddress2',
            '#bankName', '#accountNo', '#ifscCode', '#taxRate', '#taxType'
        ];

        elements.forEach(selector => {
            const element = document.querySelector(selector);
            this.assert(element !== null, `Form element exists: ${selector}`);
        });
    }

    // Test 2: Fill basic form data
    fillBasicFormData() {
        console.log('\n🧪 Filling Basic Form Data...');
        
        const formData = {
            '#sellerName': 'Tech Solutions Pvt Ltd',
            '#sellerAddress1': '123 Business Park',
            '#sellerAddress2': 'Mumbai, Maharashtra',
            '#sellerEmail': 'billing@techsolutions.com',
            '#sellerGSTIN': '27AABCT1332L1ZV',
            '#sellerContact': '+91 9876543210',
            '#sellerState': 'Maharashtra',
            '#sellerStateCode': '27',
            '#invoiceNo': 'INV-2024-001',
            '#invoiceDate': '2024-01-15',
            '#customerName': 'Client Corporation Ltd',
            '#customerGSTIN': '29AABCC1206D1ZM',
            '#customerAddress1': '456 Tech Street',
            '#customerAddress2': 'Bangalore, Karnataka',
            '#customerState': 'Karnataka',
            '#customerStateCode': '29',
            '#bankName': 'State Bank of India',
            '#branchAddress1': 'Fort Branch, Mumbai',
            '#accountNo': '1234567890',
            '#ifscCode': 'SBIN0001234'
        };

        let allFieldsFilled = true;
        for (const [selector, value] of Object.entries(formData)) {
            const result = this.setInputValue(selector, value);
            if (!result) {
                allFieldsFilled = false;
                console.error(`Failed to fill: ${selector}`);
            }
        }

        this.assert(allFieldsFilled, 'All basic form fields filled successfully');
        return formData;
    }

    // Test 3: Add service rows
    testServiceRows() {
        console.log('\n🧪 Testing Service Rows...');
        
        // Fill first service row
        this.setInputValue('.description', 'Web Development Services');
        this.setInputValue('.sac', '998314');
        this.setInputValue('.prevBill', '0');
        this.setInputValue('.thisBill', '50000');
        
        // Add second service row
        this.clickButton('button[onclick="addServiceRow()"]');
        
        const rows = document.querySelectorAll('#services tbody tr');
        this.assert(rows.length >= 2, 'Service row added successfully');
        
        // Fill second service row
        const secondRowInputs = rows[1].querySelectorAll('input');
        if (secondRowInputs.length >= 4) {
            secondRowInputs[0].value = 'Maintenance Services';
            secondRowInputs[1].value = '998311';
            secondRowInputs[2].value = '0';
            secondRowInputs[3].value = '25000';
            secondRowInputs[3].dispatchEvent(new Event('input', { bubbles: true }));
        }

        // Check if totals are calculated
        setTimeout(() => {
            const totalBeforeTax = document.querySelector('#totalBeforeTax').value;
            this.assert(parseFloat(totalBeforeTax) === 75000, 
                'Total calculation correct', 
                `Expected 75000, got ${totalBeforeTax}`);
        }, 100);
    }

    // Test 4: Test GST calculations
    testGSTCalculations() {
        console.log('\n🧪 Testing GST Calculations...');
        
        // Test IGST (different states)
        this.setInputValue('#taxType', 'IGST');
        this.setInputValue('#taxRate', '18');
        
        setTimeout(() => {
            const taxAmount = parseFloat(document.querySelector('#taxAmount').value);
            const totalAfterTax = parseFloat(document.querySelector('#totalAfterTax').value);
            
            this.assert(Math.abs(taxAmount - 13500) < 0.01, 
                'IGST calculation correct', 
                `Expected 13500, got ${taxAmount}`);
            
            this.assert(Math.abs(totalAfterTax - 88500) < 0.01, 
                'Total after tax correct', 
                `Expected 88500, got ${totalAfterTax}`);
                
            // Test CGST & SGST (same state)
            this.setInputValue('#customerStateCode', '27'); // Same as seller
            this.setInputValue('#taxType', 'CGST & SGST');
            
            setTimeout(() => {
                const newTaxAmount = parseFloat(document.querySelector('#taxAmount').value);
                this.assert(Math.abs(newTaxAmount - 13500) < 0.01, 
                    'CGST & SGST calculation correct', 
                    `Expected 13500, got ${newTaxAmount}`);
            }, 100);
        }, 200);
    }

    // Test 5: Remove service row
    testRemoveServiceRow() {
        console.log('\n🧪 Testing Remove Service Row...');
        
        const removeButtons = document.querySelectorAll('button[onclick*="removeRow"]');
        const initialRowCount = document.querySelectorAll('#services tbody tr').length;
        
        if (removeButtons.length > 1) {
            removeButtons[1].click();
            
            setTimeout(() => {
                const newRowCount = document.querySelectorAll('#services tbody tr').length;
                this.assert(newRowCount === initialRowCount - 1, 
                    'Service row removed successfully',
                    `Expected ${initialRowCount - 1} rows, got ${newRowCount}`);
                    
                // Check if total is recalculated
                const totalBeforeTax = parseFloat(document.querySelector('#totalBeforeTax').value);
                this.assert(Math.abs(totalBeforeTax - 50000) < 0.01, 
                    'Total recalculated after row removal', 
                    `Expected 50000, got ${totalBeforeTax}`);
            }, 100);
        }
    }

    // Test 6: Generate invoice preview
    testInvoiceGeneration() {
        console.log('\n🧪 Testing Invoice Generation...');
        
        // Add terms and conditions
        this.setInputValue('#termsConditions', 'Payment due within 30 days.\nLate payment charges: 2% per month.');
        
        // Click generate invoice
        this.clickButton('button[onclick="generateInvoice()"]');
        
        setTimeout(() => {
            const preview = document.querySelector('#preview');
            const isVisible = preview && preview.style.display !== 'none';
            
            this.assert(isVisible, 'Invoice preview generated and visible');
            
            if (isVisible) {
                // Check if all sections are present
                const hasHeader = preview.querySelector('.preview-header') !== null;
                const hasTaxInvoiceTitle = preview.innerHTML.includes('TAX INVOICE');
                const hasServiceTable = preview.querySelector('table') !== null;
                const hasBankDetails = preview.innerHTML.includes('Bank Details');
                const hasTerms = preview.innerHTML.includes('Terms and Conditions');
                
                this.assert(hasHeader, 'Invoice header present');
                this.assert(hasTaxInvoiceTitle, 'Tax Invoice title present');
                this.assert(hasServiceTable, 'Service table present');
                this.assert(hasBankDetails, 'Bank details section present');
                this.assert(hasTerms, 'Terms and conditions present');
                
                // Check borders
                this.testBorderConsistency();
            }
        }, 500);
    }

    // Test 7: Check border consistency
    testBorderConsistency() {
        console.log('\n🧪 Testing Border Consistency...');
        
        const preview = document.querySelector('#preview');
        if (preview) {
            // Check if all borders are 1px
            const elements = preview.querySelectorAll('[style*="border"]');
            let allBorders1px = true;
            let inconsistentBorders = [];
            
            elements.forEach(el => {
                const style = el.getAttribute('style');
                if (style && style.includes('border') && style.includes('2px')) {
                    allBorders1px = false;
                    inconsistentBorders.push(el.tagName + ': ' + style.substring(0, 50) + '...');
                }
            });
            
            this.assert(allBorders1px, 
                'All borders are 1px (not 2px)', 
                'Found 2px borders: ' + inconsistentBorders.join(', '));
            
            // Check for complete table borders
            const tables = preview.querySelectorAll('table');
            this.assert(tables.length > 0, 'Tables found in preview');
            
            tables.forEach((table, index) => {
                const hasStyle = table.hasAttribute('style');
                this.assert(hasStyle, `Table ${index + 1} has style attribute`);
            });
        }
    }

    // Test 8: Clear form functionality
    testClearForm() {
        console.log('\n🧪 Testing Clear Form...');
        
        // First, ensure we're not in preview mode
        const preview = document.querySelector('#preview');
        if (preview && preview.style.display !== 'none') {
            const backButton = preview.querySelector('button[onclick*="preview"][onclick*="none"]');
            if (backButton) backButton.click();
        }
        
        // Test clear with cancel
        window.confirm = () => false; // Mock cancel
        this.clickButton('button[onclick="clearForm()"]');
        
        const sellerName = document.querySelector('#sellerName').value;
        this.assert(sellerName !== '', 'Form not cleared when cancelled');
        
        // Test clear with confirm
        window.confirm = () => true; // Mock confirm
        this.clickButton('button[onclick="clearForm()"]');
        
        setTimeout(() => {
            const isCleared = document.querySelector('#sellerName').value === '' &&
                             document.querySelector('#customerName').value === '' &&
                             document.querySelector('#invoiceNo').value === '';
            
            this.assert(isCleared, 'Form cleared successfully');
            
            // Check if default values are restored
            const taxRate = document.querySelector('#taxRate').value;
            this.assert(taxRate === '18', 'Default tax rate restored', `Got ${taxRate}`);
        }, 100);
    }

    // Test 9: Number formatting
    testNumberFormatting() {
        console.log('\n🧪 Testing Number Formatting...');
        
        // Fill form again for this test
        this.fillBasicFormData();
        this.setInputValue('.thisBill', '1234567.89');
        
        setTimeout(() => {
            this.clickButton('button[onclick="generateInvoice()"]');
            
            setTimeout(() => {
                const preview = document.querySelector('#preview');
                if (preview) {
                    const hasCommas = preview.innerHTML.includes('1,234,567.89') || 
                                     preview.innerHTML.includes('12,34,567.89');
                    this.assert(hasCommas, 'Numbers formatted with commas');
                }
            }, 300);
        }, 200);
    }

    // Run all tests
    runAllTests() {
        console.log('🚀 Starting Vibe Invoice Generator Test Suite...\n');
        
        this.testFormElements();
        this.fillBasicFormData();
        
        setTimeout(() => {
            this.testServiceRows();
            setTimeout(() => {
                this.testGSTCalculations();
                setTimeout(() => {
                    this.testRemoveServiceRow();
                    setTimeout(() => {
                        this.testInvoiceGeneration();
                        setTimeout(() => {
                            this.testClearForm();
                            setTimeout(() => {
                                this.testNumberFormatting();
                                setTimeout(() => {
                                    this.printSummary();
                                }, 1000);
                            }, 500);
                        }, 1000);
                    }, 500);
                }, 500);
            }, 500);
        }, 300);
    }

    // Print test summary
    printSummary() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(50));
        console.log(`Total Tests: ${this.testCount}`);
        console.log(`✅ Passed: ${this.passedTests}`);
        console.log(`❌ Failed: ${this.failedTests}`);
        console.log(`Success Rate: ${((this.passedTests / this.testCount) * 100).toFixed(2)}%`);
        console.log('='.repeat(50));
        
        if (this.failedTests > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults.filter(r => r.status === 'FAILED').forEach(r => {
                console.log(`- ${r.test}: ${r.error}`);
            });
        }
    }
}

// Create test runner
const tester = new InvoiceTestSuite();

// Instructions
console.log('📝 Vibe Invoice Test Suite Ready!');
console.log('To run all tests, execute: tester.runAllTests()');
console.log('Make sure you have the invoice page open in your browser.');