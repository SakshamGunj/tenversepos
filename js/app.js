// Main Application JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeSidebar();
    initializeUserDropdown();
    updateDateTime();
    
    // Setup mobile cart toggle for responsive view
    setupMobileCartToggle();
    
    // Update date/time periodically
    setInterval(updateDateTime, 60000);
});

// Sidebar functionality
function initializeSidebar() {
    const menuItems = document.querySelectorAll('.sidebar-menu .menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
        });
    });
}

// User dropdown functionality
function initializeUserDropdown() {
    const userProfile = document.querySelector('.user-profile');
    
    if (userProfile) {
        userProfile.addEventListener('click', function() {
            // Toggle dropdown menu (to be implemented)
            alert('User dropdown functionality to be implemented');
        });
    }
}

// Update date/time in the order section
function updateDateTime() {
    const orderDate = document.querySelector('.order-date');
    
    if (orderDate) {
        const now = new Date();
        const dateOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        
        const dateStr = now.toLocaleDateString('en-US', dateOptions);
        const timeStr = now.toLocaleTimeString('en-US', timeOptions);
        
        orderDate.textContent = `${dateStr} | ${timeStr}`;
    }
}

// Mobile cart toggle for responsive design
function setupMobileCartToggle() {
    // Check if we need to add the mobile cart button
    if (window.innerWidth <= 576) {
        addMobileCartElements();
    }
    
    // Listen for window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 576) {
            addMobileCartElements();
        } else {
            removeMobileCartElements();
        }
    });
}

// Add mobile cart elements
function addMobileCartElements() {
    // Only add if they don't already exist
    if (!document.querySelector('.mobile-cart-toggle')) {
        // Create mobile cart toggle button
        const cartToggle = document.createElement('button');
        cartToggle.className = 'mobile-cart-toggle';
        cartToggle.innerHTML = '<i class="fas fa-shopping-cart"></i><span class="cart-count">2</span>';
        document.body.appendChild(cartToggle);
        
        // Create close button for order section
        const closeBtn = document.createElement('button');
        closeBtn.className = 'mobile-cart-close';
        closeBtn.innerHTML = '<i class="fas fa-arrow-left"></i>';
        const orderSection = document.querySelector('.order-section');
        orderSection.appendChild(closeBtn);
        
        // Add event listeners
        cartToggle.addEventListener('click', function() {
            const orderSection = document.querySelector('.order-section');
            orderSection.classList.add('active');
        });
        
        closeBtn.addEventListener('click', function() {
            const orderSection = document.querySelector('.order-section');
            orderSection.classList.remove('active');
        });
    }
}

// Remove mobile cart elements
function removeMobileCartElements() {
    const cartToggle = document.querySelector('.mobile-cart-toggle');
    const closeBtn = document.querySelector('.mobile-cart-close');
    
    if (cartToggle) {
        cartToggle.remove();
    }
    
    if (closeBtn) {
        closeBtn.remove();
    }
    
    // Reset order section
    const orderSection = document.querySelector('.order-section');
    if (orderSection) {
        orderSection.classList.remove('active');
    }
} 