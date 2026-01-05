# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ServerLord's Vibe Invoice Generator is a standalone HTML-based invoice generator for Indian businesses with GST support. It's a single-file solution with no dependencies, frameworks, or build process.

## Architecture

- **Single HTML file**: All functionality (HTML, CSS, JavaScript) is contained within `Vibe Invoice.html`
- **Pure client-side**: Runs entirely in the browser with no server requirements
- **No build process**: Direct editing and testing - no compilation needed
- **Print-optimized**: Special CSS for clean printing/PDF generation

## Development Commands

This project has no npm scripts or build commands. Development is done by:
1. Editing the HTML file directly
2. Opening it in a browser to test changes
3. Using browser print preview to test invoice output

## Key Implementation Details

### Invoice Calculation Logic
The application handles Indian GST calculations:
- Automatically calculates IGST (inter-state) or CGST & SGST (intra-state)
- Based on matching supplier and recipient GST state codes
- All calculations are done in JavaScript within the HTML file

### Important Functions
- **Amount-to-words conversion**: Uses Indian numbering system (lakh, crore)
- **Dynamic service rows**: Add/remove line items with automatic recalculation
- **Digital signature**: Image upload and display functionality
- **Real-time preview**: Updates as user enters data

### File Structure
- `Vibe Invoice.html` - Main application file (all code here)
- `vibe-invoice.html` - Duplicate for GitHub Pages URL encoding compatibility
- `index.html` - GitHub Pages redirect page

## Testing Approach

Manual testing only:
1. Open HTML file in browser
2. Fill out invoice form
3. Verify calculations
4. Test print preview/PDF generation
5. Test signature image upload

## Deployment

Can be deployed anywhere that serves static HTML:
- GitHub Pages (index.html provides redirect)
- Any web server
- Can be used locally without any server