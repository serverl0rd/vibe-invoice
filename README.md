# Vibe Invoice Generator

A professional, standalone HTML-based invoice generator with GST support for Indian businesses. This tool provides a complete solution for creating, previewing, and printing invoices without any external dependencies.

## Features

### Core Functionality
- **Single File Solution**: Everything contained in one HTML file - no external dependencies
- **Real-time Preview**: See your invoice as you fill in the details
- **Print-Ready**: Optimized for A4 paper size with clean print formatting
- **GST Compliant**: Full support for Indian GST requirements (IGST, CGST & SGST)

### Key Features
- **Dynamic Service Management**: Add or remove service items as needed
- **Automatic Calculations**: 
  - Service totals
  - Tax calculations (configurable tax rates)
  - Amount in words conversion (Indian numbering system)
- **Digital Signature Support**: Upload and include signature images
- **Comprehensive Details**:
  - Seller and customer information
  - Invoice and PO details
  - Transportation details
  - Bank information
  - Terms & conditions

### Recent Updates
- Fixed signature image overlap issues with improved layout
- Standardized all borders to 2px for consistency
- Enhanced signature section with proper spacing and positioning

## Usage

1. **Open the File**: Simply open `Vibe Invoice.html` in any modern web browser
2. **Fill in Details**: Enter all required information in the form fields
3. **Add Services**: Use the "Add Service" button to include multiple line items
4. **Configure Tax**: Select tax type (IGST or CGST & SGST) and set the rate
5. **Upload Signature**: Add a digital signature image if needed
6. **Generate Invoice**: Click "Generate Invoice" to see the preview
7. **Print or Save**: Use the browser's print function to save as PDF or print

## Invoice Sections

### 1. Seller Information
- Full Name
- Address (2 lines)
- Email
- GSTIN
- Contact Number

### 2. Invoice Details
- Invoice Number
- Invoice Date
- PO Number & Date
- Vendor Code
- Transportation Mode
- Vehicle Number
- LR Number
- State & State Code
- Place of Supply

### 3. Customer Details
- Name
- GSTIN
- Address
- State & State Code

### 4. Service Details
- Description
- SAC Code
- Previous Bill Amount
- Current Bill Amount
- Total Amount (auto-calculated)

### 5. Tax Configuration
- Tax Type (IGST or CGST & SGST)
- Tax Rate (customizable)
- Automatic tax calculations

### 6. Bank Details
- Bank Name
- Branch Address
- Account Number
- IFSC Code

### 7. Signature Section
- Digital signature upload
- Authorised signatory name
- Designation

## Technical Details

- **Technology**: Pure HTML, CSS, and JavaScript
- **Browser Compatibility**: Works on all modern browsers
- **Responsive Design**: Optimized for desktop use
- **Print Optimization**: Special CSS for clean printing
- **No Server Required**: Runs entirely in the browser

## Customization

The invoice can be easily customized by editing the HTML file:
- Modify CSS styles for different branding
- Adjust field labels and placeholders
- Change default tax rates
- Customize the invoice layout

## License

This project is open source and available for personal and commercial use.

## Support

For issues, suggestions, or contributions, please create an issue on GitHub.

---

Made with care for Indian businesses needing a simple, effective invoicing solution.