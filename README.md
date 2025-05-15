# TenVerse POS System

A modern, responsive Point of Sale (POS) system designed for small to medium-sized businesses. This POS system is optimized for both mobile and desktop use, with a focus on user experience and performance.

## Features

- **Beautiful UI**: Modern and clean user interface with smooth animations
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Product Management**: Easily add, categorize, and manage products
- **Order Management**: Create, modify, and complete orders with ease
- **Menu Management**: Comprehensive menu item, category, and combo management
- **Payment Processing**: Support for multiple payment methods
- **SaaS Ready**: Structure designed for multi-tenant deployment
- **Extensible**: Built to allow for additional modules and features

## Project Structure

The project follows a modular structure for easy maintenance and expansion:

```
tenversepos/
├── assets/               # Static assets
│   ├── logo.svg          # Logo file
│   ├── placeholder.svg   # Placeholder image
│   └── products/         # Product images
├── css/                  # CSS stylesheets
│   ├── styles.css        # Main styles
│   ├── responsive.css    # Responsive design styles
│   └── menu-dashboard.css # Menu management styles
├── js/                   # JavaScript files
│   ├── app.js            # Core application logic
│   ├── pos.js            # POS-specific functionality
│   └── menu-dashboard.js # Menu management functionality
├── index.html            # Main HTML file
├── menu-dashboard.html   # Menu management dashboard
└── README.md             # Project documentation
```

## Menu Management Features

The POS system includes a comprehensive menu management system with the following features:

### Dashboard Overview
- Statistics: Total menu items, categories, active combos, and unavailable items
- Quick access buttons for common tasks
- Tabbed interface for easy navigation

### Menu Item Management
- Add, edit, and delete menu items
- Set basic details (name, price, description, etc.)
- Manage variants (e.g., sizes) with price adjustments
- Manage add-ons (e.g., toppings) with prices
- Track availability status

### Category Management
- Create and organize menu categories
- Set display order, icons, and colors
- Easily view how many items are in each category

### Combo/Meal Deal Management
- Create special combos and meal deals
- Set pricing and time-bound availability
- Add multiple items to a combo

### Menu Settings
- Configure global menu settings
- Set default currency and tax rates
- Control display options

## Technology Stack

- HTML5
- CSS3 (with Flexbox and Grid)
- Vanilla JavaScript
- Font Awesome (for icons)
- Google Fonts (Poppins)

## Future Expansion

This POS system is designed to be expanded with additional features and modules. Some planned expansions include:

1. **Inventory Management**: Track stock levels, set reorder points, and manage suppliers
2. **Customer Management**: Store customer information, purchase history, and loyalty programs
3. **Employee Management**: User roles, permissions, and time tracking
4. **Analytics Dashboard**: Sales reports, product performance, and business insights
5. **Multi-location Support**: Manage multiple stores or locations from a single interface
6. **Offline Mode**: Continue operations during internet outages with local data synchronization
7. **Custom Receipts**: Design and customize receipts with your business branding
8. **API Integration**: Connect with other business tools and platforms

## Getting Started

1. Clone the repository
2. Open `index.html` in your browser to run the POS system
3. For production use, deploy to a web server or use a service like Netlify, Vercel, or GitHub Pages

## Customization

- **Theme**: Edit the CSS variables in `styles.css` to change colors and styling
- **Products**: Add your own product images to the `assets/products/` directory
- **Logo**: Replace `assets/logo.svg` with your own logo

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## License

This project is available for use under the MIT License.

## Support

For questions, feature requests, or bug reports, please create an issue in the repository or contact the maintainer at support@tenversepos.com. 