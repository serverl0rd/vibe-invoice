const puppeteer = require('puppeteer');

// Test data with extensive content
const extensiveTestData = {
    seller: {
        name: 'Very Long Company Name Private Limited with Extended Business Description and Multiple Divisions',
        address1: 'Building 123-456, Floor 7-8-9, Very Long Street Name with Multiple Landmarks and Reference Points, Industrial Area Phase II',
        address2: 'Near Major Landmark, Opposite Another Landmark, Behind Third Landmark, City Name with Long Extension, State 400001',
        email: 'verylongemailaddress.department.subdivision@companywithverylongname.co.in',
        gstin: '27AABCT1332L1ZV',
        contact: '+91 9876543210, +91 9876543211, +91 9876543212',
        state: 'Maharashtra (Western Region)',
        stateCode: '27'
    },
    customer: {
        name: 'Another Extremely Long Customer Corporation Limited with Multiple Business Units and International Operations',
        gstin: '29AABCC1206D1ZM',
        address1: 'Plot No. 123-456-789, Building Complex A-B-C, Street with Very Long Name Including Multiple Sections',
        address2: 'Technology Park, IT Corridor, Export Promotion Zone, Extended City Area, Karnataka 560001',
        state: 'Karnataka (Southern Region)',
        stateCode: '29'
    },
    invoice: {
        invoiceNo: 'INV-2024-001-EXTENDED-REF-12345',
        invoiceDate: '2024-01-15',
        poNo: 'PO-2024-100-DEPT-A-SUB-B-REF-C-12345',
        poDate: '2024-01-10',
        vendorCode: 'VEN-001-CATEGORY-A-SUBCATEGORY-B-TYPE-C',
        transportMode: 'Road Transport via National Highway with Multiple Transit Points',
        vehicleNo: 'MH-12-AB-1234 (32 Feet Container Truck)',
        lrNo: 'LR-2024-MUMBAI-BANGALORE-EXPRESS-12345',
        placeOfSupply: 'Bangalore Urban District, Karnataka State, India'
    },
    bank: {
        name: 'State Bank of India - International Banking Division',
        branch1: 'Fort Branch, Main Building, Ground Floor, Counter No. 5',
        branch2: 'Fort Area, South Mumbai, Maharashtra 400001, India',
        accountNo: '12345678901234567890',
        ifscCode: 'SBIN0001234'
    },
    services: [
        {
            description: 'Comprehensive Web Development Services including Frontend Development, Backend Development, Database Design, API Integration, Cloud Deployment, Performance Optimization, Security Audit, and Post-Launch Support',
            sac: '998314',
            prevBill: '150000.50',
            thisBill: '250000.75'
        },
        {
            description: 'Extended Maintenance and Support Services covering 24x7 Monitoring, Regular Updates, Bug Fixes, Feature Enhancements, Server Management, Backup Services, Disaster Recovery Planning, and Technical Documentation',
            sac: '998311',
            prevBill: '75000.25',
            thisBill: '125000.50'
        },
        {
            description: 'Professional Consultation Services for Digital Transformation, Business Process Reengineering, Technology Strategy Planning, System Architecture Design, and Implementation Roadmap Development',
            sac: '998313',
            prevBill: '0',
            thisBill: '300000.00'
        }
    ],
    termsConditions: `COMPREHENSIVE TERMS AND CONDITIONS:

1. PAYMENT TERMS:
   - Payment is due within 30 days from the date of invoice
   - Late payment will attract interest @ 2% per month or part thereof
   - All payments should be made through RTGS/NEFT/IMPS only
   - Cheque payments will attract additional processing charges of Rs. 500/-
   - Part payments will not be accepted without prior written approval

2. SERVICE DELIVERY:
   - All services will be delivered as per the agreed timeline in the work order
   - Any delays due to client dependencies will extend the timeline accordingly
   - Force majeure conditions will be applicable as per standard industry practices
   - Regular status updates will be provided on weekly basis or as agreed

3. INTELLECTUAL PROPERTY:
   - All intellectual property rights remain with the service provider until full payment
   - Client will have usage rights post complete payment clearance
   - Source code will be provided only if specifically mentioned in the work order
   - Third-party licenses, if any, will be the responsibility of the client

4. WARRANTY AND SUPPORT:
   - 90 days warranty period from the date of delivery for bug fixes
   - Post-warranty support will be charged as per the prevailing rates
   - Warranty does not cover changes due to new requirements
   - Emergency support available 24x7 with additional charges

5. LIMITATION OF LIABILITY:
   - Service provider's liability limited to the invoice amount
   - No liability for indirect, consequential, or incidental damages
   - Client responsible for data backup and business continuity
   - Force majeure events exclude all liabilities

6. CONFIDENTIALITY:
   - Both parties agree to maintain strict confidentiality
   - NDAs to be signed separately if required by either party
   - Confidential information not to be disclosed to third parties
   - Obligations survive termination of services

7. DISPUTE RESOLUTION:
   - All disputes subject to Mumbai jurisdiction only
   - Arbitration as per Indian Arbitration Act if required
   - Legal costs to be borne by the losing party
   - Good faith negotiations before legal proceedings

8. ADDITIONAL TERMS:
   - GST and other taxes as applicable will be extra
   - Invoice amount subject to TDS deductions as per law
   - E-way bill to be generated for interstate supply
   - Digital signature valid as per IT Act 2000

9. CANCELLATION POLICY:
   - Cancellation charges apply based on work completed
   - Minimum 25% charges for cancellations
   - No refunds for completed milestones
   - Written notice required for cancellations

10. GOVERNING LAW:
    - Governed by laws of India
    - Indian Rupee is the currency of transaction
    - English language for all communications
    - Time is the essence of the contract`,
    signatory: {
        name: 'Shri Ramesh Kumar Patel (Senior Vice President - Finance & Accounts)',
        designation: 'Authorized Signatory with Full Financial Powers up to Rs. 50 Lakhs'
    }
};

(async () => {
    console.log('🧪 Testing Invoice with Extensive Content...\n');
    
    const browser = await puppeteer.launch({ 
        headless: true,
        defaultViewport: { width: 1400, height: 900 }
    });
    
    const page = await browser.newPage();
    await page.goto('file://' + __dirname + '/Vibe Invoice.html');
    
    console.log('📝 Filling form with extensive data...');
    
    // Fill seller information
    await page.type('#sellerName', extensiveTestData.seller.name);
    await page.type('#sellerAddress1', extensiveTestData.seller.address1);
    await page.type('#sellerAddress2', extensiveTestData.seller.address2);
    await page.type('#sellerEmail', extensiveTestData.seller.email);
    await page.type('#sellerGSTIN', extensiveTestData.seller.gstin);
    await page.type('#sellerContact', extensiveTestData.seller.contact);
    await page.type('#sellerState', extensiveTestData.seller.state);
    await page.type('#sellerStateCode', extensiveTestData.seller.stateCode);
    
    // Fill customer information
    await page.type('#customerName', extensiveTestData.customer.name);
    await page.type('#customerGSTIN', extensiveTestData.customer.gstin);
    await page.type('#customerAddress1', extensiveTestData.customer.address1);
    await page.type('#customerAddress2', extensiveTestData.customer.address2);
    await page.type('#customerState', extensiveTestData.customer.state);
    await page.type('#customerStateCode', extensiveTestData.customer.stateCode);
    
    // Fill invoice details
    await page.type('#invoiceNo', extensiveTestData.invoice.invoiceNo);
    await page.type('#invoiceDate', extensiveTestData.invoice.invoiceDate);
    await page.type('#poNo', extensiveTestData.invoice.poNo);
    await page.type('#poDate', extensiveTestData.invoice.poDate);
    await page.type('#vendorCode', extensiveTestData.invoice.vendorCode);
    await page.type('#transportMode', extensiveTestData.invoice.transportMode);
    await page.type('#vehicleNo', extensiveTestData.invoice.vehicleNo);
    await page.type('#lrNo', extensiveTestData.invoice.lrNo);
    await page.type('#placeOfSupply', extensiveTestData.invoice.placeOfSupply);
    
    // Fill bank details
    await page.type('#bankName', extensiveTestData.bank.name);
    await page.type('#branchAddress1', extensiveTestData.bank.branch1);
    await page.type('#branchAddress2', extensiveTestData.bank.branch2);
    await page.type('#accountNo', extensiveTestData.bank.accountNo);
    await page.type('#ifscCode', extensiveTestData.bank.ifscCode);
    
    // Fill first service
    await page.type('.description', extensiveTestData.services[0].description);
    await page.type('.sac', extensiveTestData.services[0].sac);
    await page.type('.prevBill', extensiveTestData.services[0].prevBill);
    await page.type('.thisBill', extensiveTestData.services[0].thisBill);
    
    // Add more services
    for (let i = 1; i < extensiveTestData.services.length; i++) {
        await page.click('button[onclick="addServiceRow()"]');
        await new Promise(r => setTimeout(r, 300));
        
        const rowIndex = i + 1;
        await page.type(`#services tbody tr:nth-child(${rowIndex}) .description`, extensiveTestData.services[i].description);
        await page.type(`#services tbody tr:nth-child(${rowIndex}) .sac`, extensiveTestData.services[i].sac);
        await page.type(`#services tbody tr:nth-child(${rowIndex}) .prevBill`, extensiveTestData.services[i].prevBill);
        await page.type(`#services tbody tr:nth-child(${rowIndex}) .thisBill`, extensiveTestData.services[i].thisBill);
    }
    
    // Fill terms and conditions
    await page.type('#termsConditions', extensiveTestData.termsConditions);
    
    // Fill signatory details
    await page.type('#signatoryName', extensiveTestData.signatory.name);
    await page.type('#signatoryDesignation', extensiveTestData.signatory.designation);
    
    console.log('\n🔍 Generating invoice and checking for border issues...');
    
    // Generate invoice
    await page.click('button[onclick="generateInvoice()"]');
    await page.waitForSelector('#preview', { visible: true });
    await new Promise(r => setTimeout(r, 1000));
    
    // Check for border issues
    const borderAnalysis = await page.evaluate(() => {
        const preview = document.querySelector('#preview');
        const issues = [];
        
        // Check all elements with borders
        const elementsWithBorders = preview.querySelectorAll('[style*="border"]');
        
        elementsWithBorders.forEach((element, index) => {
            const style = element.style;
            const computedStyle = window.getComputedStyle(element);
            
            // Check for missing borders
            if (style.cssText.includes('border') && 
                (style.cssText.includes('none') || computedStyle.borderWidth === '0px')) {
                // This might be intentional (like border-left: 0), so we check the context
                const rect = element.getBoundingClientRect();
                const parent = element.parentElement;
                const parentRect = parent ? parent.getBoundingClientRect() : null;
                
                // Check if element is at edge of parent (intentional border removal)
                if (!parentRect || 
                    Math.abs(rect.left - parentRect.left) > 1 || 
                    Math.abs(rect.right - parentRect.right) > 1) {
                    issues.push({
                        element: element.tagName,
                        text: element.textContent.substring(0, 50) + '...',
                        issue: 'Potential missing border',
                        style: style.cssText
                    });
                }
            }
            
            // Check for overflow
            if (element.scrollHeight > element.clientHeight || 
                element.scrollWidth > element.clientWidth) {
                issues.push({
                    element: element.tagName,
                    text: element.textContent.substring(0, 50) + '...',
                    issue: 'Content overflow detected',
                    dimensions: `Height: ${element.clientHeight}/${element.scrollHeight}, Width: ${element.clientWidth}/${element.scrollWidth}`
                });
            }
        });
        
        // Check table continuity
        const tables = preview.querySelectorAll('table');
        tables.forEach((table, i) => {
            if (table.style.borderCollapse !== 'collapse') {
                issues.push({
                    element: 'TABLE',
                    issue: 'Table not using border-collapse',
                    tableIndex: i
                });
            }
        });
        
        return {
            totalElements: elementsWithBorders.length,
            issues: issues,
            tablesCount: tables.length
        };
    });
    
    console.log('\n📊 Border Analysis Results:');
    console.log(`Total elements with borders: ${borderAnalysis.totalElements}`);
    console.log(`Total tables: ${borderAnalysis.tablesCount}`);
    console.log(`Issues found: ${borderAnalysis.issues.length}`);
    
    if (borderAnalysis.issues.length > 0) {
        console.log('\n⚠️  Potential Issues:');
        borderAnalysis.issues.forEach((issue, i) => {
            console.log(`\n${i + 1}. ${issue.issue}`);
            console.log(`   Element: ${issue.element}`);
            if (issue.text) console.log(`   Content: ${issue.text}`);
            if (issue.style) console.log(`   Style: ${issue.style.substring(0, 100)}...`);
            if (issue.dimensions) console.log(`   Dimensions: ${issue.dimensions}`);
        });
    } else {
        console.log('\n✅ No border issues detected!');
    }
    
    // Take screenshots
    await page.screenshot({ 
        path: 'test-results/extensive-content-full.png', 
        fullPage: true 
    });
    
    // Take viewport screenshot for detail
    await page.screenshot({ 
        path: 'test-results/extensive-content-detail.png', 
        fullPage: false 
    });
    
    console.log('\n📸 Screenshots saved:');
    console.log('   - test-results/extensive-content-full.png (full page)');
    console.log('   - test-results/extensive-content-detail.png (viewport detail)');
    
    console.log('\n✨ Test complete! Check the screenshots.');
    
    await browser.close();
})().catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
});