// Edge Case Tests for Vibe Invoice Generator
// These tests check for specific bugs and edge cases

class EdgeCaseTests {
    constructor() {
        this.bugs = [];
        this.fixes = [];
    }

    // Test for number to words conversion edge cases
    testNumberToWords() {
        console.log('\n🧪 Testing Number to Words Conversion...');
        
        // Get the numberToWords function from the invoice window
        const testCases = [
            { num: 0, expected: 'Zero' },
            { num: 1, expected: 'One' },
            { num: 99, expected: 'Ninety Nine' },
            { num: 100, expected: 'One Hundred' },
            { num: 1000, expected: 'One Thousand' },
            { num: 100000, expected: 'One Lac' },
            { num: 1000000, expected: 'Ten Lac' },
            { num: 10000000, expected: 'One Crore' },
            { num: 123456.78, expected: 'One Lac Twenty Three Thousand Four Hundred Fifty Six and Seventy Eight Paise' }
        ];

        testCases.forEach(test => {
            if (window.numberToWords) {
                const result = window.numberToWords(test.num);
                console.log(`${test.num} => ${result}`);
                if (!result.includes(test.expected.split(' ')[0])) {
                    this.bugs.push(`Number to words conversion issue for ${test.num}`);
                }
            }
        });
    }

    // Test for empty/null value handling
    testEmptyValueHandling() {
        console.log('\n🧪 Testing Empty Value Handling...');
        
        // Try to generate invoice with minimal data
        const generateBtn = document.querySelector('button[onclick="generateInvoice()"]');
        if (generateBtn) {
            generateBtn.click();
            
            setTimeout(() => {
                const preview = document.querySelector('#preview');
                if (preview && preview.style.display !== 'none') {
                    // Check if empty values are handled gracefully
                    const hasUndefined = preview.innerHTML.includes('undefined');
                    const hasNull = preview.innerHTML.includes('null');
                    
                    if (hasUndefined || hasNull) {
                        this.bugs.push('Empty values not handled properly - showing undefined/null');
                        this.fixes.push('Need to add default empty string handling for all fields');
                    }
                }
            }, 500);
        }
    }

    // Test decimal handling in calculations
    testDecimalCalculations() {
        console.log('\n🧪 Testing Decimal Calculations...');
        
        const testAmounts = [
            { amount: '999.99', taxRate: 18 },
            { amount: '0.01', taxRate: 18 },
            { amount: '123.456', taxRate: 12.5 }
        ];

        testAmounts.forEach(test => {
            const input = document.querySelector('.thisBill');
            if (input) {
                input.value = test.amount;
                input.dispatchEvent(new Event('input'));
                
                const taxRateInput = document.querySelector('#taxRate');
                if (taxRateInput) {
                    taxRateInput.value = test.taxRate;
                    taxRateInput.dispatchEvent(new Event('input'));
                }

                setTimeout(() => {
                    const taxAmount = parseFloat(document.querySelector('#taxAmount').value);
                    const expectedTax = parseFloat(test.amount) * (test.taxRate / 100);
                    
                    if (Math.abs(taxAmount - expectedTax) > 0.01) {
                        this.bugs.push(`Tax calculation precision issue for amount ${test.amount}`);
                    }
                }, 100);
            }
        });
    }

    // Test special characters in input fields
    testSpecialCharacters() {
        console.log('\n🧪 Testing Special Characters...');
        
        const specialCharTests = {
            '#sellerName': 'Test & Co. "Limited"',
            '#sellerAddress1': "123, Test's Street, #45",
            '#customerEmail': 'test+invoice@example.com'
        };

        Object.entries(specialCharTests).forEach(([selector, value]) => {
            const input = document.querySelector(selector);
            if (input) {
                input.value = value;
            }
        });

        // Generate invoice to see if special characters are handled
        setTimeout(() => {
            const generateBtn = document.querySelector('button[onclick="generateInvoice()"]');
            if (generateBtn) generateBtn.click();
            
            setTimeout(() => {
                const preview = document.querySelector('#preview');
                if (preview) {
                    // Check if special characters are properly escaped
                    const hasHTMLIssues = preview.innerHTML.includes('&amp;amp;') || 
                                         preview.innerHTML.includes('&lt;') ||
                                         preview.innerHTML.includes('&gt;');
                    
                    if (hasHTMLIssues) {
                        this.bugs.push('HTML encoding issues with special characters');
                    }
                }
            }, 500);
        }, 200);
    }

    // Test maximum length inputs
    testMaxLengthInputs() {
        console.log('\n🧪 Testing Maximum Length Inputs...');
        
        const longText = 'A'.repeat(1000);
        const termsInput = document.querySelector('#termsConditions');
        
        if (termsInput) {
            termsInput.value = longText;
            
            // Check if it causes layout issues
            setTimeout(() => {
                const generateBtn = document.querySelector('button[onclick="generateInvoice()"]');
                if (generateBtn) generateBtn.click();
                
                setTimeout(() => {
                    const preview = document.querySelector('#preview');
                    if (preview) {
                        // Check if layout is broken
                        const termsSection = preview.querySelector('[style*="white-space: pre-line"]');
                        if (termsSection && termsSection.offsetHeight > 500) {
                            this.bugs.push('Terms section can overflow with long text');
                            this.fixes.push('Add max-height and overflow-y: auto to terms section');
                        }
                    }
                }, 500);
            }, 200);
        }
    }

    // Test date format handling
    testDateFormats() {
        console.log('\n🧪 Testing Date Formats...');
        
        const dateInput = document.querySelector('#invoiceDate');
        if (dateInput) {
            // Test various date inputs
            dateInput.value = '2024-12-31';
            
            setTimeout(() => {
                const generateBtn = document.querySelector('button[onclick="generateInvoice()"]');
                if (generateBtn) generateBtn.click();
                
                setTimeout(() => {
                    const preview = document.querySelector('#preview');
                    if (preview && preview.innerHTML.includes('31/12/2024')) {
                        console.log('✅ Date format conversion working correctly');
                    } else {
                        this.bugs.push('Date format not converting to DD/MM/YYYY');
                    }
                }, 500);
            }, 200);
        }
    }

    // Test print CSS
    testPrintCSS() {
        console.log('\n🧪 Testing Print CSS...');
        
        // Check if print styles are defined
        const styles = document.styleSheets;
        let hasPrintStyles = false;
        
        for (let i = 0; i < styles.length; i++) {
            try {
                const rules = styles[i].cssRules || styles[i].rules;
                for (let j = 0; j < rules.length; j++) {
                    if (rules[j].media && rules[j].media.mediaText === 'print') {
                        hasPrintStyles = true;
                        break;
                    }
                }
            } catch (e) {
                // Cross-origin or other access issues
            }
        }
        
        if (!hasPrintStyles) {
            this.bugs.push('Print styles might not be properly defined');
        }
    }

    // Generate bug report
    generateReport() {
        console.log('\n' + '='.repeat(50));
        console.log('🐛 BUG REPORT');
        console.log('='.repeat(50));
        
        if (this.bugs.length === 0) {
            console.log('✅ No bugs found!');
        } else {
            console.log(`Found ${this.bugs.length} issues:\n`);
            this.bugs.forEach((bug, index) => {
                console.log(`${index + 1}. ${bug}`);
            });
        }
        
        if (this.fixes.length > 0) {
            console.log('\n📝 SUGGESTED FIXES:');
            this.fixes.forEach((fix, index) => {
                console.log(`${index + 1}. ${fix}`);
            });
        }
        
        console.log('='.repeat(50));
    }

    // Run all edge case tests
    runAll() {
        console.log('🔍 Running Edge Case Tests...\n');
        
        this.testNumberToWords();
        this.testEmptyValueHandling();
        this.testDecimalCalculations();
        this.testSpecialCharacters();
        this.testMaxLengthInputs();
        this.testDateFormats();
        this.testPrintCSS();
        
        setTimeout(() => {
            this.generateReport();
        }, 3000);
    }
}

// Create edge case tester
const edgeTester = new EdgeCaseTests();
console.log('Edge case tester ready. Run: edgeTester.runAll()');

// Auto-fix function for common issues
function applyAutoFixes() {
    console.log('🔧 Applying automatic fixes...');
    
    // Fix 1: Ensure all input fields have proper null/undefined handling
    const originalGenerateInvoice = window.generateInvoice;
    window.generateInvoice = function() {
        // Pre-process all inputs to ensure no undefined/null values
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="number"], input[type="date"], textarea');
        inputs.forEach(input => {
            if (input.value === null || input.value === undefined) {
                input.value = '';
            }
        });
        
        // Call original function
        if (originalGenerateInvoice) {
            originalGenerateInvoice.call(this);
        }
    };
    
    console.log('✅ Applied null/undefined handling fix');
}