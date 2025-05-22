# Invesp Quick View Extension

A JavaScript and CSS implementation of a "Quick View" functionality for the Pamono furniture website, created as part of the Invesp front-end developer hiring process.

## Overview

This project implements a quick view feature for product cards on [Pamono's furniture page](https://www.pamono.com/furniture). When hovering over a product card, a "Quick View" button appears. Clicking this button fetches the product details and displays them in a modal with an image carousel.

## Features

- **Hover-triggered Quick View Button**: Appears when hovering over product cards
- **Product Data Fetching**: Dynamically fetches product details from individual product pages
- **Image Carousel**: Displays all product images with navigation controls
- **Responsive Modal**: Centered popup with smooth animations
- **Keyboard Navigation**: Supports arrow keys for image navigation and ESC to close
- **Thumbnail Gallery**: Scrollable thumbnail navigation with active state indicators
- **Auto-injection**: Works on dynamically loaded content via MutationObserver

## Installation

To use this extension:

1. Install the [User JavaScript and CSS](https://chrome.google.com/webstore/detail/userjavascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld) Chrome extension
2. Create a new script in the extension
3. Copy the provided JavaScript and CSS code into the appropriate sections
4. Set the script to run on `https://www.pamono.com/furniture*`

## Technical Details

### JavaScript Features
- Pure JavaScript implementation (no jQuery)
- Uses Fetch API for product data retrieval
- DOM manipulation for dynamic content creation
- MutationObserver for handling dynamically loaded products
- Event delegation for efficient event handling
- Smooth animations and transitions

### CSS Features
- Responsive modal design
- CSS Grid and Flexbox for layout
- Smooth transitions and animations
- Custom scrollbars
- Hover effects and active states
- Proper z-index management for layering

## Code Structure

1. **Modal Creation**: Dynamically creates the quick view modal structure
2. **Button Injection**: Adds Quick View buttons to all product cards
3. **Data Fetching**: Retrieves product details from individual pages
4. **Modal Display**: Shows product information in the modal
5. **Image Carousel**: Implements navigation between product images
6. **Event Handlers**: Manages all user interactions
7. **Cleanup**: Properly removes event listeners when modal closes

## Browser Compatibility

Tested in modern Chrome browsers. Uses standard web APIs that should work in most modern browsers.

## Limitations

- Requires the User JavaScript and CSS extension
- Dependent on Pamono's website structure (may break if they change their HTML)
- Image URLs are specifically targeted from their CDN

## Screenshots

(You can add screenshots here showing the quick view button and modal in action)

## License

This project is created as part of a hiring process and is not intended for production use.
