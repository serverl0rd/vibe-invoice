// Standalone Playwright test for Vibe Invoice Generator
// Run with: npx playwright test

const { test, expect } = require('@playwright/test');
const path = require('path');

// Test configuration
const invoiceURL = 'file://' + path.resolve(__dirname, 'Vibe Invoice.html');

test.describe('Vibe Invoice Generator Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(invoiceURL);
  });

  test('should load invoice page with all form elements', async ({ page }) => {
    // Check if main elements are visible
    await expect(page.locator('#sellerName')).toBeVisible();
    await expect(page.locator('#customerName')).toBeVisible();
    await expect(page.locator('#invoiceNo')).toBeVisible();
    await expect(page.locator('#services')).toBeVisible();
  });

  test('should auto-select GST type based on state codes', async ({ page }) => {
    // Fill seller state code
    await page.fill('#sellerStateCode', '27');
    
    // Test IGST (different states)
    await page.fill('#customerStateCode', '29');
    await page.waitForTimeout(500);
    await expect(page.locator('#taxType')).toHaveValue('IGST');
    
    // Test CGST & SGST (same state)
    await page.fill('#customerStateCode', '27');
    await page.waitForTimeout(500);
    await expect(page.locator('#taxType')).toHaveValue('CGST & SGST');
  });

  test('should calculate totals correctly', async ({ page }) => {
    // Fill service details
    await page.fill('.description', 'Web Development Services');
    await page.fill('.sac', '998314');
    await page.fill('.thisBill', '50000');
    
    // Wait for calculations
    await page.waitForTimeout(500);
    
    // Check calculations
    await expect(page.locator('#totalBeforeTax')).toHaveValue('50000.00');
    await expect(page.locator('#taxAmount')).toHaveValue('9000.00'); // 18% of 50000
    await expect(page.locator('#totalAfterTax')).toHaveValue('59000.00');
  });

  test('should add and remove service rows', async ({ page }) => {
    // Count initial rows
    const initialRows = await page.locator('#services tbody tr').count();
    
    // Add a new row
    await page.click('button[onclick="addServiceRow()"]');
    await expect(page.locator('#services tbody tr')).toHaveCount(initialRows + 1);
    
    // Remove a row
    await page.click('button[onclick*="removeRow"]:last-child');
    await expect(page.locator('#services tbody tr')).toHaveCount(initialRows);
  });

  test('should handle empty values without showing undefined/null', async ({ page }) => {
    // Generate invoice with minimal data
    await page.fill('#sellerName', 'Test Company');
    await page.fill('.thisBill', '1000');
    
    await page.click('button[onclick="generateInvoice()"]');
    await expect(page.locator('#preview')).toBeVisible();
    
    // Check that undefined/null are not displayed
    const previewContent = await page.locator('#preview').innerHTML();
    expect(previewContent).not.toContain('undefined');
    expect(previewContent).not.toContain('null');
  });

  test('should handle special characters correctly', async ({ page }) => {
    // Fill form with special characters
    await page.fill('#sellerName', 'Test & Co. "Limited"');
    await page.fill('#customerName', "O'Brien's Company");
    await page.fill('#sellerAddress1', '123, Test\'s Street, #45');
    
    // Generate invoice
    await page.click('button[onclick="generateInvoice()"]');
    await expect(page.locator('#preview')).toBeVisible();
    
    // Check that special characters are properly displayed
    await expect(page.locator('#preview')).toContainText('Test & Co. "Limited"');
    await expect(page.locator('#preview')).toContainText("O'Brien's Company");
    
    // Check no double encoding
    const previewContent = await page.locator('#preview').innerHTML();
    expect(previewContent).not.toContain('&amp;amp;');
  });

  test('should generate complete invoice', async ({ page }) => {
    // Fill complete form
    await page.fill('#sellerName', 'Tech Solutions Pvt Ltd');
    await page.fill('#sellerAddress1', '123 Business Park');
    await page.fill('#sellerAddress2', 'Mumbai, Maharashtra 400001');
    await page.fill('#sellerEmail', 'billing@techsolutions.com');
    await page.fill('#sellerGSTIN', '27AABCT1332L1ZV');
    await page.fill('#sellerContact', '+91 9876543210');
    await page.fill('#sellerState', 'Maharashtra');
    await page.fill('#sellerStateCode', '27');
    
    await page.fill('#customerName', 'Client Corporation Ltd');
    await page.fill('#customerGSTIN', '29AABCC1206D1ZM');
    await page.fill('#customerAddress1', '456 Tech Street');
    await page.fill('#customerAddress2', 'Bangalore, Karnataka 560001');
    await page.fill('#customerState', 'Karnataka');
    await page.fill('#customerStateCode', '29');
    
    await page.fill('#invoiceNo', 'INV-2024-001');
    await page.fill('#invoiceDate', '2024-01-15');
    
    await page.fill('.description', 'Web Development Services');
    await page.fill('.sac', '998314');
    await page.fill('.thisBill', '50000');
    
    await page.fill('#bankName', 'State Bank of India');
    await page.fill('#accountNo', '1234567890');
    await page.fill('#ifscCode', 'SBIN0001234');
    
    // Generate invoice
    await page.click('button[onclick="generateInvoice()"]');
    await expect(page.locator('#preview')).toBeVisible();
    
    // Verify all sections are present
    await expect(page.locator('#preview')).toContainText('TAX INVOICE');
    await expect(page.locator('#preview')).toContainText('Tech Solutions Pvt Ltd');
    await expect(page.locator('#preview')).toContainText('Client Corporation Ltd');
    await expect(page.locator('#preview')).toContainText('Total Invoice Amount in Words:');
    await expect(page.locator('#preview')).toContainText('Bank Details');
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/complete-invoice.png', fullPage: true });
  });

  test('should have consistent 1px borders', async ({ page }) => {
    // Generate a simple invoice
    await page.fill('#sellerName', 'Test Company');
    await page.fill('.thisBill', '1000');
    await page.click('button[onclick="generateInvoice()"]');
    
    // Check for 2px borders (should not exist)
    const elements = await page.locator('#preview [style*="2px"]').count();
    expect(elements).toBe(0);
    
    // Verify 1px borders exist
    const borderElements = await page.locator('#preview [style*="border: 1px solid"]').count();
    expect(borderElements).toBeGreaterThan(0);
  });

  test('should clear form correctly', async ({ page }) => {
    // Fill some data
    await page.fill('#sellerName', 'Test Company');
    await page.fill('#invoiceNo', 'INV-001');
    await page.fill('.thisBill', '5000');
    
    // Clear form (handle confirm dialog)
    page.on('dialog', dialog => dialog.accept());
    await page.click('button[onclick="clearForm()"]');
    
    // Verify form is cleared
    await expect(page.locator('#sellerName')).toHaveValue('');
    await expect(page.locator('#invoiceNo')).toHaveValue('');
    await expect(page.locator('.thisBill')).toHaveValue('0');
    await expect(page.locator('#taxRate')).toHaveValue('18'); // Default value
  });

  test('should handle print functionality', async ({ page }) => {
    // Generate invoice
    await page.fill('#sellerName', 'Test Company');
    await page.fill('.thisBill', '1000');
    await page.click('button[onclick="generateInvoice()"]');
    
    // Mock print function
    let printCalled = false;
    await page.exposeFunction('print', () => {
      printCalled = true;
    });
    
    // Override window.print
    await page.evaluate(() => {
      window.print = () => window.print();
    });
    
    // Click print button
    await page.click('#preview button:has-text("Print Invoice")');
    
    // Note: Actual print dialog testing is limited in Playwright
    // This test verifies the button exists and is clickable
  });

  test('should handle terms and conditions with long text', async ({ page }) => {
    // Add very long text to terms
    const longText = 'This is a very long terms and conditions text. '.repeat(50);
    await page.fill('#termsConditions', longText);
    
    // Generate invoice
    await page.fill('#sellerName', 'Test Company');
    await page.fill('.thisBill', '1000');
    await page.click('button[onclick="generateInvoice()"]');
    
    // Check that terms section has overflow handling
    const termsElement = await page.locator('#preview p[style*="white-space: pre-line"]');
    const style = await termsElement.getAttribute('style');
    expect(style).toContain('overflow-y: auto');
    expect(style).toContain('max-height: 160px');
  });
});

// Performance test
test('should generate invoice quickly', async ({ page }) => {
  await page.goto(invoiceURL);
  
  // Fill minimal data
  await page.fill('#sellerName', 'Performance Test Company');
  await page.fill('.thisBill', '100000');
  
  // Measure generation time
  const startTime = Date.now();
  await page.click('button[onclick="generateInvoice()"]');
  await page.waitForSelector('#preview', { state: 'visible' });
  const endTime = Date.now();
  
  const generationTime = endTime - startTime;
  console.log(`Invoice generation took ${generationTime}ms`);
  
  // Should generate in less than 2 seconds
  expect(generationTime).toBeLessThan(2000);
});