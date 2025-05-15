// POS System JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Fix layout issues immediately
    fixLayoutIssues();
    
    // Initialize the POS System
    initializePOS();
});

// Fix layout issues
function fixLayoutIssues() {
    // Fix app container layout
    const appContainer = document.querySelector('.app-container');
    appContainer.style.gridTemplateColumns = '80px 1fr';
    
    // Fix pos layout
    const posLayout = document.querySelector('.pos-layout');
    if (posLayout) {
        posLayout.style.gridTemplateColumns = '80px 1fr 350px';
        posLayout.style.width = '100%';
    }
    
    // Fix menu items container
    const menuItemsContainer = document.querySelector('.menu-items-container');
    if (menuItemsContainer) {
        menuItemsContainer.style.width = '100%';
        menuItemsContainer.style.flex = '1';
    }
    
    // Fix order summary
    const orderSummary = document.querySelector('.order-summary');
    if (orderSummary) {
        orderSummary.style.width = '350px';
        orderSummary.style.minWidth = '350px';
        orderSummary.style.maxWidth = '350px';
        orderSummary.style.display = 'flex';
        orderSummary.style.flexDirection = 'column';
        orderSummary.style.maxHeight = 'calc(100vh - 70px)';
        orderSummary.style.overflow = 'hidden';
        
        // Fix order items container
        const orderItemsContainer = orderSummary.querySelector('.order-items-container');
        if (orderItemsContainer) {
            orderItemsContainer.style.flex = '1';
            orderItemsContainer.style.overflowY = 'auto';
        }
        
        // Fix flex-shrink for fixed elements
        const fixedElements = orderSummary.querySelectorAll('.order-header, .order-notes, .order-totals, .order-actions');
        fixedElements.forEach(el => {
            el.style.flexShrink = '0';
        });
        
        // Adjust textarea height
        const textarea = orderSummary.querySelector('textarea');
        if (textarea) {
            textarea.style.height = '50px';
        }
    }
    
    // Adjust for mobile if needed
    if (window.innerWidth <= 768 && orderSummary) {
        orderSummary.style.width = window.innerWidth <= 576 ? '100%' : '250px';
        orderSummary.style.minWidth = window.innerWidth <= 576 ? '100%' : '250px';
        orderSummary.style.maxWidth = window.innerWidth <= 576 ? '100%' : '250px';
    }
}

// Global variables
let menuItems = [];
let categories = [];
let currentOrder = {
    tableNumber: null,
    items: [],
    notes: '',
    subtotal: 0,
    tax: 0,
    discount: 0,
    discountType: 'none',
    discountValue: 0,
    couponCode: '',
    giftCardAmount: 0,
    giftCardNumber: '',
    customerName: '',
    customerPhone: '',
    total: 0
};

// Helper function for modal handling
function setupModalCloseHandlers(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    // Close on click outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
}

// Initialize POS System
function initializePOS() {
    // Generate mock orders for occupied tables
    generateMockOrders();
    
    // Load menu data
    loadMenuData();
    
    // Initialize table selection
    initializeTableSelection();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Handle responsive adjustments
    handleResponsiveLayout();
    
    // Set up modal close handlers
    setupModalCloseHandlers('paymentModal');
    setupModalCloseHandlers('orderSuccessModal');
    setupModalCloseHandlers('billModal');
    
    // Add window resize listener
    window.addEventListener('resize', handleResponsiveLayout);
}

// Generate mock orders for occupied tables
function generateMockOrders() {
    // Check if orders already exist in localStorage
    const existingOrders = localStorage.getItem('tenverse_orders');
    if (existingOrders) return;
    
    // Get mock tables
    const tables = generateMockTables();
    const occupiedTables = tables.filter(table => table.status === 'occupied');
    
    // Sample menu items for orders
    const menuItems = [
        { name: 'Classic Breakfast', price: 12.99, options: ['Size: Regular'] },
        { name: 'Pancake Stack', price: 9.99, options: ['Extra syrup'] },
        { name: 'Caesar Salad', price: 8.99, options: [] },
        { name: 'Cheeseburger', price: 10.99, options: ['Medium rare'] },
        { name: 'Grilled Salmon', price: 18.99, options: [] },
        { name: 'Iced Coffee', price: 4.50, options: [] }
    ];
    
    // Generate orders for each occupied table
    const orders = [];
    
    occupiedTables.forEach(table => {
        // Generate 1-3 random items for this table
        const numItems = Math.floor(Math.random() * 3) + 1;
        const items = [];
        let subtotal = 0;
        
        for (let i = 0; i < numItems; i++) {
            const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
            const quantity = Math.floor(Math.random() * 2) + 1;
            
            items.push({
                name: randomItem.name,
                quantity: quantity,
                price: randomItem.price,
                options: randomItem.options
            });
            
            subtotal += randomItem.price * quantity;
        }
        
        const tax = subtotal * 0.1;
        const total = subtotal + tax;
        
        // Randomize order status between 'ready' and 'completed'
        const status = Math.random() > 0.5 ? 'ready' : 'completed';
        
        // Create order
        orders.push({
            id: 10000 + Math.floor(Math.random() * 90000),
            tableNumber: table.number,
            status: status,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString(),
            items: items,
            subtotal: subtotal,
            tax: tax,
            total: total,
            notes: ''
        });
    });
    
    // Save to localStorage
    localStorage.setItem('tenverse_orders', JSON.stringify(orders));
}

// Load menu data from the menu management module
function loadMenuData() {
    // In a real application, this would fetch data from an API or database
    // For this demo, we're using static sample data
    
    // Sample categories
    categories = [
        { id: 'all', name: 'All Items', icon: 'fa-border-all' },
        { id: 'breakfast', name: 'Breakfast', icon: 'fa-egg' },
        { id: 'lunch', name: 'Lunch', icon: 'fa-hamburger' },
        { id: 'dinner', name: 'Dinner', icon: 'fa-utensils' },
        { id: 'soups', name: 'Soups', icon: 'fa-mug-hot' },
        { id: 'burgers', name: 'Burgers', icon: 'fa-hamburger' },
        { id: 'desserts', name: 'Desserts', icon: 'fa-ice-cream' },
        { id: 'drinks', name: 'Drinks', icon: 'fa-coffee' }
    ];
    
    // Sample menu items
    menuItems = [
        {
            id: 1,
            name: 'Classic Breakfast',
            description: 'Eggs, bacon, toast, and hash browns',
            price: 12.99,
            category: 'breakfast',
            image: 'assets/products/breakfast.jpg',
            popular: true,
            inStock: true,
            variants: [
                {
                    name: 'Size',
                    options: [
                        { name: 'Small', price: 0 },
                        { name: 'Regular', price: 2 },
                        { name: 'Large', price: 4 }
                    ]
                }
            ],
            addons: [
                {
                    name: 'Add Extra',
                    options: [
                        { name: 'Extra Egg', price: 1.5 },
                        { name: 'Extra Bacon', price: 2 },
                        { name: 'Cheese', price: 1 }
                    ]
                }
            ]
        },
        {
            id: 2,
            name: 'Pancake Stack',
            description: 'Stack of fluffy pancakes with maple syrup',
            price: 9.99,
            category: 'breakfast',
            image: 'assets/products/pancakes.jpg',
            popular: false,
            inStock: true,
            variants: [],
            addons: []
        },
        {
            id: 3,
            name: 'Caesar Salad',
            description: 'Fresh romaine lettuce with Caesar dressing',
            price: 8.99,
            category: 'lunch',
            image: 'assets/products/salad.jpg',
            popular: false,
            inStock: true,
            variants: [],
            addons: []
        },
        {
            id: 4,
            name: 'Cheeseburger',
            description: 'Beef patty with cheese, lettuce, and tomato',
            price: 10.99,
            category: 'burgers',
            image: 'assets/products/burger.jpg',
            popular: true,
            inStock: true,
            variants: [],
            addons: []
        },
        {
            id: 5,
            name: 'Grilled Salmon',
            description: 'Grilled salmon with lemon butter sauce',
            price: 18.99,
            category: 'dinner',
            image: 'assets/products/salmon.jpg',
            popular: false,
            inStock: true,
            variants: [],
            addons: []
        },
        {
            id: 6,
            name: 'Tomato Soup',
            description: 'Creamy tomato soup with basil',
            price: 5.99,
            category: 'soups',
            image: 'assets/products/soup.jpg',
            popular: false,
            inStock: true,
            variants: [],
            addons: []
        },
        {
            id: 7,
            name: 'Chocolate Cake',
            description: 'Rich chocolate cake with ganache',
            price: 6.99,
            category: 'desserts',
            image: 'assets/products/cake.jpg',
            popular: true,
            inStock: true,
            variants: [],
            addons: []
        },
        {
            id: 8,
            name: 'Iced Coffee',
            description: 'Cold brewed coffee with ice',
            price: 4.50,
            category: 'drinks',
            image: 'assets/products/coffee.jpg',
            popular: false,
            inStock: true,
            variants: [],
            addons: []
        }
    ];
    
    // Add a fallback image for menu items without images
    menuItems.forEach(item => {
        if (!item.image) {
            item.image = 'assets/placeholder.svg';
        }
    });
    
    // Render menu categories
    renderMenuCategories();
    
    // Render menu items (all by default)
    renderMenuItems('all');
}

// Initialize Table Selection Area
function initializeTableSelection() {
    // Generate mock tables for demo purposes
    const tables = generateMockTables();
    
    // Save tables to localStorage
    localStorage.setItem('tenverse_tables', JSON.stringify(tables));
    
    const tablesGrid = document.getElementById('tablesGrid');
    tablesGrid.innerHTML = '';
    
    // Filter tables based on active section
    const activeSection = document.querySelector('.section-btn.active').dataset.section;
    const filteredTables = activeSection === 'all' ? tables : tables.filter(table => table.section === activeSection);
    
    // Populate the tables grid
    filteredTables.forEach(table => {
        const tableCard = renderTableCard(table);
        tablesGrid.appendChild(tableCard);
    });
    
    // Add event listeners to section filter buttons
    const sectionBtns = document.querySelectorAll('.section-btn');
    sectionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            sectionBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter tables based on selected section
            const section = this.dataset.section;
            const filteredTables = section === 'all' ? tables : tables.filter(table => table.section === section);
            
            // Clear and repopulate tables grid
            tablesGrid.innerHTML = '';
            filteredTables.forEach(table => {
                const tableCard = renderTableCard(table);
                tablesGrid.appendChild(tableCard);
            });
        });
    });
}

// Find the renderTableCard function and update it to include the Bill Payment button
function renderTableCard(table) {
    const tableCard = document.createElement('div');
    tableCard.className = `table-card ${table.status}`;
    tableCard.dataset.table = table.number;
    tableCard.dataset.section = table.section;
    
    // Create table card HTML
    tableCard.innerHTML = `
        <div class="table-number">${table.number}</div>
        <div class="table-details">
            <div class="seats"><i class="fas fa-chair"></i> ${table.seats} Seats</div>
            <div class="status ${table.status}">${capitalizeFirstLetter(table.status)}</div>
        </div>
        <div class="table-actions">
            <button class="table-action-btn">Select Table</button>
            <button class="bill-payment-btn" data-table="${table.number}"><i class="fas fa-file-invoice-dollar"></i> Bill Payment</button>
        </div>
    `;
    
    // Add event listener to select table button
    const selectTableBtn = tableCard.querySelector('.table-action-btn');
    selectTableBtn.addEventListener('click', function() {
        selectTable(table.number);
    });
    
    return tableCard;
}

// Select a table and show the POS interface
function selectTable(tableNumber) {
    // Update the current order with the table number
    currentOrder.tableNumber = tableNumber;
    
    // Update UI to show selected table
    document.getElementById('activeTable').textContent = `Table: ${tableNumber}`;
    document.getElementById('orderTable').innerHTML = `Table: <span>${tableNumber}</span>`;
    
    // Hide table selection and show POS interface
    document.getElementById('tableSelectionArea').style.display = 'none';
    
    // Show POS interface with full width
    const posInterface = document.getElementById('posInterface');
    posInterface.style.display = 'block';
    posInterface.style.width = '100%';
    
    // Force layout refresh
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 10);
}

// Render menu categories
function renderMenuCategories() {
    const menuCategoriesContainer = document.querySelector('.menu-categories');
    
    // Keep the "All Items" category and remove existing categories
    const allItemsCategory = menuCategoriesContainer.firstElementChild;
    menuCategoriesContainer.innerHTML = '';
    menuCategoriesContainer.appendChild(allItemsCategory);
    
    // Render each category
    categories.forEach(category => {
        // Skip the "all" category since we kept it
        if (category.id === 'all') return;
        
        const categoryBtn = document.createElement('button');
        categoryBtn.className = 'category-item';
        categoryBtn.dataset.category = category.id;
        categoryBtn.innerHTML = `
            <i class="fas ${category.icon}"></i>
            <span>${category.name}</span>
        `;
        
        menuCategoriesContainer.appendChild(categoryBtn);
    });
}

// Render menu items based on category
function renderMenuItems(categoryId) {
    const menuItemsGrid = document.getElementById('menuItemsGrid');
    menuItemsGrid.innerHTML = ''; // Clear the grid
    
    // Filter items by category (or show all if 'all' is selected)
    const filteredItems = categoryId === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === categoryId);
    
    // Render each menu item
    filteredItems.forEach(item => {
        const menuItemCard = document.createElement('div');
        menuItemCard.className = 'menu-item-card';
        menuItemCard.dataset.itemId = item.id;
        menuItemCard.dataset.category = item.category;
        
        menuItemCard.innerHTML = `
            <div class="item-image-container">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                ${item.popular ? '<span class="popularity-badge"><i class="fas fa-star"></i> Popular</span>' : ''}
            </div>
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-description">${item.description}</p>
                <div class="item-footer">
                    <span class="item-price">$${item.price.toFixed(2)}</span>
                    <div class="item-stock ${item.inStock ? 'in-stock' : 'out-of-stock'}">
                        ${item.inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                    <button class="add-item-btn" ${!item.inStock ? 'disabled' : ''}>
                        <i class="fas fa-plus"></i> Add
                    </button>
                </div>
            </div>
        `;
        
        menuItemsGrid.appendChild(menuItemCard);
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Category buttons
    document.querySelectorAll('.category-item').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all category buttons
            document.querySelectorAll('.category-item').forEach(b => {
                b.classList.remove('active');
            });
            // Add active class to clicked button
            this.classList.add('active');
            
            // Render menu items for selected category
            renderMenuItems(this.dataset.category);
        });
    });
    
    // Menu search
    document.getElementById('menuSearchInput').addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // If search is cleared, show items based on current category
            const activeCategory = document.querySelector('.category-item.active').dataset.category;
            renderMenuItems(activeCategory);
            return;
        }
        
        // Filter items based on search term
        const filteredItems = menuItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.description.toLowerCase().includes(searchTerm)
        );
        
        // Render filtered items
        const menuItemsGrid = document.getElementById('menuItemsGrid');
        menuItemsGrid.innerHTML = ''; // Clear the grid
        
        if (filteredItems.length === 0) {
            menuItemsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No items found matching "${this.value}"</p>
                </div>
            `;
            return;
        }
        
        // Render each filtered item
        filteredItems.forEach(item => {
            const menuItemCard = document.createElement('div');
            menuItemCard.className = 'menu-item-card';
            menuItemCard.dataset.itemId = item.id;
            menuItemCard.dataset.category = item.category;
            
            menuItemCard.innerHTML = `
                <div class="item-image-container">
                    <img src="${item.image}" alt="${item.name}" class="item-image">
                    ${item.popular ? '<span class="popularity-badge"><i class="fas fa-star"></i> Popular</span>' : ''}
                </div>
                <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-description">${item.description}</p>
                    <div class="item-footer">
                        <span class="item-price">$${item.price.toFixed(2)}</span>
                        <div class="item-stock ${item.inStock ? 'in-stock' : 'out-of-stock'}">
                            ${item.inStock ? 'In Stock' : 'Out of Stock'}
                        </div>
                        <button class="add-item-btn" ${!item.inStock ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i> Add
                        </button>
                    </div>
                </div>
            `;
            
            menuItemsGrid.appendChild(menuItemCard);
        });
    });
    
    // Add item buttons (delegation)
    document.getElementById('menuItemsGrid').addEventListener('click', function(e) {
        if (e.target.closest('.add-item-btn')) {
            const menuItemCard = e.target.closest('.menu-item-card');
            const itemId = parseInt(menuItemCard.dataset.itemId);
            
            // Find the selected menu item
            const menuItem = menuItems.find(item => item.id === itemId);
            
            // Open item customization modal
            openItemModal(menuItem);
        }
    });
    
    // Item customization modal
    setupItemCustomizationModal();
    
    // Order actions
    setupOrderActions();
    
    // Payment modal
    setupPaymentModal();
    
    // Floating cart button (for mobile)
    document.getElementById('floatingCartBtn').addEventListener('click', function() {
        document.querySelector('.order-summary').classList.add('active');
    });
}

// Set up item customization modal
function setupItemCustomizationModal() {
    const modal = document.getElementById('itemCustomizationModal');
    const closeModal = modal.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelItemBtn');
    const addToOrderBtn = document.getElementById('addToOrderBtn');
    const decreaseQtyBtn = document.getElementById('decreaseQty');
    const increaseQtyBtn = document.getElementById('increaseQty');
    const quantityInput = document.getElementById('itemQuantity');
    
    // Close modal function to ensure consistency
    function closeItemModal() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    // Close modal buttons
    closeModal.addEventListener('click', closeItemModal);
    cancelBtn.addEventListener('click', closeItemModal);
    
    // Decrease quantity
    decreaseQtyBtn.addEventListener('click', function() {
        let qty = parseInt(quantityInput.value);
        if (qty > 1) {
            qty--;
            quantityInput.value = qty;
            updateModalSubtotal();
        }
    });
    
    // Increase quantity
    increaseQtyBtn.addEventListener('click', function() {
        let qty = parseInt(quantityInput.value);
        qty++;
        quantityInput.value = qty;
        updateModalSubtotal();
    });
    
    // Quantity input change
    quantityInput.addEventListener('change', function() {
        let qty = parseInt(this.value);
        if (isNaN(qty) || qty < 1) {
            qty = 1;
        }
        this.value = qty;
        updateModalSubtotal();
    });
    
    // Add to order
    addToOrderBtn.addEventListener('click', function() {
        const itemId = parseInt(this.dataset.itemId);
        const menuItem = menuItems.find(item => item.id === itemId);
        
        if (!menuItem) return;
        
        // Get selected options
        const quantity = parseInt(document.getElementById('itemQuantity').value);
        const specialInstructions = document.getElementById('specialInstructions').value.trim();
        
        // Get selected variants
        const variantSelections = [];
        const variantRadios = document.querySelectorAll('.variant-option input[type="radio"]:checked');
        variantRadios.forEach(radio => {
            variantSelections.push({
                group: radio.dataset.group,
                option: radio.dataset.option,
                name: radio.dataset.name,
                price: parseFloat(radio.dataset.price)
            });
        });
        
        // Get selected add-ons
        const addonSelections = [];
        const addonCheckboxes = document.querySelectorAll('.addon-option input[type="checkbox"]:checked');
        addonCheckboxes.forEach(checkbox => {
            addonSelections.push({
                group: checkbox.dataset.group,
                option: checkbox.dataset.option,
                name: checkbox.dataset.name,
                price: parseFloat(checkbox.dataset.price)
            });
        });
        
        // Calculate item price with variants and add-ons
        let itemBasePrice = menuItem.price;
        variantSelections.forEach(variant => {
            itemBasePrice += variant.price;
        });
        
        let addonsTotalPrice = 0;
        addonSelections.forEach(addon => {
            addonsTotalPrice += addon.price;
        });
        
        // Create order item
        const orderItem = {
            id: Date.now(), // Unique ID for the order item
            menuItemId: menuItem.id,
            name: menuItem.name,
            price: itemBasePrice,
            addonsPrice: addonsTotalPrice,
            totalPrice: itemBasePrice + addonsTotalPrice,
            quantity: quantity,
            specialInstructions: specialInstructions,
            variants: variantSelections,
            addons: addonSelections,
            kdsSent: false, // Initialize kdsSent status
            image: menuItem.image
        };
        
        // Add item to order
        addItemToOrder(orderItem);
        
        // Close modal
        closeItemModal();
    });
    
    // Click outside to close
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeItemModal();
        }
    });
}

// Open item customization modal
function openItemModal(menuItem) {
    const modal = document.getElementById('itemCustomizationModal');
    
    // Disable page scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Set item details
    document.getElementById('modalItemName').textContent = menuItem.name;
    document.getElementById('modalItemDescription').textContent = menuItem.description;
    document.getElementById('modalItemPrice').textContent = menuItem.price.toFixed(2);
    document.getElementById('modalItemImage').src = menuItem.image;
    document.getElementById('modalItemSubtotal').textContent = menuItem.price.toFixed(2);
    
    // Reset form
    document.getElementById('itemQuantity').value = 1;
    document.getElementById('specialInstructions').value = '';
    
    // Clear previous variants and addons
    document.getElementById('itemVariantsContainer').innerHTML = '';
    document.getElementById('itemAddonsContainer').innerHTML = '';
    
    // Add variants if any
    if (menuItem.variants && menuItem.variants.length > 0) {
        const variantsContainer = document.getElementById('itemVariantsContainer');
        
        menuItem.variants.forEach((variantGroup, groupIndex) => {
            const variantGroupElement = document.createElement('div');
            variantGroupElement.className = 'variant-group';
            
            variantGroupElement.innerHTML = `<div class="group-title">${variantGroup.name}</div>`;
            
            // Add options
            variantGroup.options.forEach((option, optionIndex) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'variant-option';
                
                const isDefault = optionIndex === 0; // First option is default
                
                optionElement.innerHTML = `
                    <label>
                        <input type="radio" name="variant-${groupIndex}" 
                            data-group="${variantGroup.name}" 
                            data-option="${option.name}" 
                            data-name="${option.name}" 
                            data-price="${option.price}" 
                            ${isDefault ? 'checked' : ''}>
                        ${option.name}
                    </label>
                    <span class="option-price">${option.price > 0 ? '+$' + option.price.toFixed(2) : 'No extra charge'}</span>
                `;
                
                variantGroupElement.appendChild(optionElement);
            });
            
            variantsContainer.appendChild(variantGroupElement);
        });
    }
    
    // Add addons if any
    if (menuItem.addons && menuItem.addons.length > 0) {
        const addonsContainer = document.getElementById('itemAddonsContainer');
        
        menuItem.addons.forEach((addonGroup, groupIndex) => {
            const addonGroupElement = document.createElement('div');
            addonGroupElement.className = 'addon-group';
            
            addonGroupElement.innerHTML = `<div class="group-title">${addonGroup.name}</div>`;
            
            // Add options
            addonGroup.options.forEach((option) => {
                const optionElement = document.createElement('div');
                optionElement.className = 'addon-option';
                
                optionElement.innerHTML = `
                    <label>
                        <input type="checkbox" name="addon-${groupIndex}-${option.name.replace(/\s+/g, '-')}" 
                            data-group="${addonGroup.name}" 
                            data-option="${option.name}" 
                            data-name="${option.name}" 
                            data-price="${option.price}">
                        ${option.name}
                    </label>
                    <span class="option-price">+$${option.price.toFixed(2)}</span>
                `;
                
                addonGroupElement.appendChild(optionElement);
            });
            
            addonsContainer.appendChild(addonGroupElement);
        });
    }
    
    // Set item ID on the Add to Order button
    document.getElementById('addToOrderBtn').dataset.itemId = menuItem.id;
    
    // Add event listeners for variant/addon selection to update subtotal
    const variantInputs = document.querySelectorAll('.variant-option input[type="radio"]');
    variantInputs.forEach(input => {
        input.addEventListener('change', updateModalSubtotal);
    });
    
    const addonInputs = document.querySelectorAll('.addon-option input[type="checkbox"]');
    addonInputs.forEach(input => {
        input.addEventListener('change', updateModalSubtotal);
    });
    
    // Reset modal scroll position
    setTimeout(() => {
        const modalBody = modal.querySelector('.modal-body');
        if (modalBody) modalBody.scrollTop = 0;
    }, 10);
    
    // Show modal
    modal.style.display = 'flex';
}

// Update subtotal in item modal
function updateModalSubtotal() {
    const basePrice = parseFloat(document.getElementById('modalItemPrice').textContent);
    const quantity = parseInt(document.getElementById('itemQuantity').value);
    
    // Calculate variants price
    let variantsPrice = 0;
    document.querySelectorAll('.variant-option input[type="radio"]:checked').forEach(input => {
        variantsPrice += parseFloat(input.dataset.price);
    });
    
    // Calculate addons price
    let addonsPrice = 0;
    document.querySelectorAll('.addon-option input[type="checkbox"]:checked').forEach(input => {
        addonsPrice += parseFloat(input.dataset.price);
    });
    
    // Calculate subtotal
    const subtotal = (basePrice + variantsPrice + addonsPrice) * quantity;
    
    // Update subtotal display
    document.getElementById('modalItemSubtotal').textContent = subtotal.toFixed(2);
}

// Add item to order
function addItemToOrder(orderItem) {
    // Check if item with same ID and variants/addons already exists
    const existingItemIndex = currentOrder.items.findIndex(item => 
        item.menuItemId === orderItem.menuItemId &&
        JSON.stringify(item.variants.map(v => ({ name: v.name, option: v.option })).sort()) === JSON.stringify(orderItem.variants.map(v => ({ name: v.name, option: v.option })).sort()) &&
        JSON.stringify(item.addons.map(a => ({ name: a.name, option: a.option })).sort()) === JSON.stringify(orderItem.addons.map(a => ({ name: a.name, option: a.option })).sort()) &&
        item.specialInstructions === orderItem.specialInstructions
    );

    if (existingItemIndex > -1) {
        // Item exists, update quantity
        currentOrder.items[existingItemIndex].quantity += orderItem.quantity;
        showToast(`Updated ${orderItem.name} quantity to ${currentOrder.items[existingItemIndex].quantity}`);
    } else {
        // Item does not exist, add to the current order
        currentOrder.items.push(orderItem);
        showToast(`Added ${orderItem.quantity}x ${orderItem.name} to order`);
    }
    
    // Update order display
    updateOrderDisplay();
}

// Update order display
function updateOrderDisplay() {
    const orderItemsContainer = document.getElementById('orderItemsContainer');
    const emptyOrderMessage = document.getElementById('emptyOrderMessage');
    
    // Show or hide empty order message
    if (currentOrder.items.length === 0) {
        if (emptyOrderMessage) emptyOrderMessage.style.display = 'block';
        if (orderItemsContainer) orderItemsContainer.innerHTML = '';
        document.getElementById('cartItemCount').textContent = '0';
        updateOrderTotals();
        
        // Hide payment button when order is empty
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.innerHTML = '<i class="fas fa-check"></i> Place Order';
            checkoutBtn.classList.remove('payment-ready');
        }
        return;
    }
    
    // Hide empty message and display order items
    if (emptyOrderMessage) emptyOrderMessage.style.display = 'none';
    if (!orderItemsContainer) return;
    orderItemsContainer.innerHTML = '';
    
    // Create elements for each order item
    currentOrder.items.forEach(item => {
        const orderItemElement = document.createElement('div');
        orderItemElement.className = 'order-item';
        orderItemElement.dataset.itemId = item.id;
        
        let variantsText = '';
        if (item.variants.length > 0) {
            variantsText = item.variants.map(v => v.name).join(', ');
        }
        
        let addonsText = '';
        if (item.addons.length > 0) {
            addonsText = item.addons.map(a => a.name).join(', ');
        }
        
        let modifiersText = '';
        if (variantsText || addonsText) {
            modifiersText = `<div class="order-item-modifiers">`;
            if (variantsText) modifiersText += `<span>${variantsText}</span>`;
            if (addonsText) modifiersText += `<span>+ ${addonsText}</span>`;
            modifiersText += `</div>`;
        }
        
        orderItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="order-item-image">
            <div class="order-item-details">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-price">$${item.totalPrice.toFixed(2)}${item.addonsPrice > 0 ? ' (+ $' + item.addonsPrice.toFixed(2) + ' add-ons)' : ''}</div>
                ${modifiersText}
                ${item.specialInstructions ? `<div class="order-item-instructions">${item.specialInstructions}</div>` : ''}
            </div>
            <div class="order-item-controls">
                <div class="item-quantity-control">
                    <button class="quantity-btn decrease" data-item-id="${item.id}">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-item-id="${item.id}">+</button>
                </div>
                <div class="item-subtotal">$${(item.totalPrice * item.quantity).toFixed(2)}</div>
            </div>
            <button class="remove-item-btn" data-item-id="${item.id}"><i class="fas fa-times"></i></button>
        `;
        
        orderItemsContainer.appendChild(orderItemElement);
    });
    
    // Update cart item count for mobile
    document.getElementById('cartItemCount').textContent = currentOrder.items.length;
    
    // Add event listeners to order item controls
    document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            decreaseItemQuantity(this.dataset.itemId);
        });
    });
    
    document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            increaseItemQuantity(this.dataset.itemId);
        });
    });
    
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            removeOrderItem(this.dataset.itemId);
        });
    });
    
    // Update order totals
    updateOrderTotals();
}

// Decrease item quantity
function decreaseItemQuantity(itemId) {
    const itemIndex = currentOrder.items.findIndex(item => item.id == itemId);
    
    if (itemIndex === -1) return;
    
    const item = currentOrder.items[itemIndex];
    
    if (item.quantity > 1) {
        item.quantity--;
        updateOrderDisplay();
    } else {
        removeOrderItem(itemId);
    }
}

// Increase item quantity
function increaseItemQuantity(itemId) {
    const item = currentOrder.items.find(item => item.id == itemId);
    
    if (!item) return;
    
    item.quantity++;
    updateOrderDisplay();
}

// Remove item from order
function removeOrderItem(itemId) {
    const itemIndex = currentOrder.items.findIndex(item => item.id == itemId);
    
    if (itemIndex === -1) return;
    
    // Remove item from array
    currentOrder.items.splice(itemIndex, 1);
    
    // Update order display
    updateOrderDisplay();
}

// Update order totals
function updateOrderTotals() {
    // Calculate subtotal
    let subtotal = 0;
    currentOrder.items.forEach(item => {
        subtotal += item.totalPrice * item.quantity;
    });
    
    // Calculate tax (10%)
    const taxRate = 0.10;
    const tax = subtotal * taxRate;
    
    // Calculate discount
    let discount = 0;
    if (currentOrder.discountType === 'percentage' && currentOrder.discountValue > 0) {
        discount = (subtotal * (currentOrder.discountValue / 100));
    } else if (currentOrder.discountType === 'amount' && currentOrder.discountValue > 0) {
        discount = Math.min(subtotal, currentOrder.discountValue); // Cannot discount more than subtotal
    }
    
    // Apply gift card amount if any
    let giftCardAmount = currentOrder.giftCardAmount || 0;
    
    // Calculate total (subtotal + tax - discount - gift card)
    const total = Math.max(0, subtotal + tax - discount - giftCardAmount);
    
    // Update order object
    currentOrder.subtotal = subtotal;
    currentOrder.tax = tax;
    currentOrder.discount = discount;
    currentOrder.total = total;
    
    // Update display
    document.getElementById('subtotalAmount').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxAmount').textContent = `$${tax.toFixed(2)}`;
    
    // Update discount display if applicable
    if (discount > 0) {
        const discountElement = document.getElementById('discountAmount');
        if (discountElement) {
            discountElement.textContent = `-$${discount.toFixed(2)}`;
            document.getElementById('discountRow').style.display = 'flex';
        }
    } else {
        const discountRow = document.getElementById('discountRow');
        if (discountRow) {
            discountRow.style.display = 'none';
        }
    }
    
    // Update gift card display if applicable
    if (giftCardAmount > 0) {
        const giftCardElement = document.getElementById('giftCardAmount');
        if (giftCardElement) {
            giftCardElement.textContent = `-$${giftCardAmount.toFixed(2)}`;
            document.getElementById('giftCardRow').style.display = 'flex';
        }
    } else {
        const giftCardRow = document.getElementById('giftCardRow');
        if (giftCardRow) {
            giftCardRow.style.display = 'none';
        }
    }
    
    document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
}

// Show toast notification
function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.querySelector('.toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .toast {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 9999;
                transition: opacity 0.3s;
                opacity: 0;
            }
            .toast.show {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Set message and show toast
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Setup payment modal
function setupPaymentModal() {
    const modal = document.getElementById('paymentModal');
    const closeModal = modal.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelPaymentBtn');
    const completeBtn = document.getElementById('completePaymentBtn');
    
    // Close modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        resetDiscountAndCoupon(); // Reset discount and coupon when closing
    });
    
    cancelBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        resetDiscountAndCoupon(); // Reset discount and coupon when canceling
    });
    
    // Complete payment
    completeBtn.addEventListener('click', function() {
        // Save customer information if provided
        const customerName = document.getElementById('customerName').value.trim();
        const customerPhone = document.getElementById('customerPhone').value.trim();
        
        if (customerName) {
            currentOrder.customerName = customerName;
        }
        
        if (customerPhone) {
            currentOrder.customerPhone = customerPhone;
        }
        
        // Validate payment (in a real app, this would process the payment)
        completePayment();
    });
    
    // Setup payment method selection
    const paymentMethodBtns = document.querySelectorAll('.payment-method-btn');
    paymentMethodBtns.forEach(btn => {
        // Set ARIA attributes for accessibility
        btn.setAttribute('role', 'tab');
        btn.setAttribute('tabindex', btn.classList.contains('active') ? '0' : '-1');
        btn.setAttribute('aria-selected', btn.classList.contains('active') ? 'true' : 'false');

        // Click handler
        btn.addEventListener('click', function(e) {
            // Remove active class and update ARIA for all
            paymentMethodBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('tabindex', '-1');
                b.setAttribute('aria-selected', 'false');
            });
            // Add active to this
            this.classList.add('active');
            this.setAttribute('tabindex', '0');
            this.setAttribute('aria-selected', 'true');

            // Show corresponding payment details
            const method = this.dataset.method;
            document.querySelectorAll('.payment-details').forEach(details => {
                details.classList.remove('active');
            });
            document.querySelector(`.${method}-payment`).classList.add('active');
            this.focus();
        });

        // Keyboard accessibility: left/right arrow navigation
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const btns = Array.from(paymentMethodBtns);
                let idx = btns.indexOf(document.activeElement);
                if (e.key === 'ArrowRight') {
                    idx = (idx + 1) % btns.length;
                } else if (e.key === 'ArrowLeft') {
                    idx = (idx - 1 + btns.length) % btns.length;
                }
                btns[idx].focus();
                btns[idx].click();
                e.preventDefault();
            }
        });
    });

    // Ensure correct payment details are visible on modal open (in case of programmatic changes)
    const activeBtn = document.querySelector('.payment-method-btn.active');
    if (activeBtn) {
        const method = activeBtn.dataset.method;
        document.querySelectorAll('.payment-details').forEach(details => {
            details.classList.remove('active');
        });
        document.querySelector(`.${method}-payment`).classList.add('active');
    }
    
    // Setup discount type change
    const discountTypeSelect = document.getElementById('discountType');
    const discountValueGroup = document.getElementById('discountValueGroup');
    const discountValueInput = document.getElementById('discountValue');
    const applyDiscountBtn = document.getElementById('applyDiscountBtn');
    
    discountTypeSelect.addEventListener('change', function() {
        if (this.value === 'none') {
            discountValueGroup.style.display = 'none';
            applyDiscountBtn.disabled = true;
        } else {
            discountValueGroup.style.display = 'block';
            applyDiscountBtn.disabled = false;
            
            // Update placeholder and label based on discount type
            if (this.value === 'percentage') {
                discountValueInput.placeholder = 'Enter percentage';
                discountValueInput.max = 100; // Maximum 100%
            } else {
                discountValueInput.placeholder = 'Enter amount';
                discountValueInput.max = ''; // No maximum for fixed amount
            }
        }
    });
    
    // Apply discount button
    applyDiscountBtn.addEventListener('click', function() {
        const discountType = discountTypeSelect.value;
        const discountValue = parseFloat(discountValueInput.value) || 0;
        
        if (discountType !== 'none' && discountValue > 0) {
            // Update current order with discount
            currentOrder.discountType = discountType;
            currentOrder.discountValue = discountValue;
            
            // Update payment display
            updatePaymentDisplay();
            
            // Show success message
            showToast(`${discountType === 'percentage' ? discountValue + '%' : '$' + discountValue.toFixed(2)} discount applied`);
        }
    });
    
    // Apply coupon button
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const couponCodeInput = document.getElementById('couponCode');
    const couponMessage = document.getElementById('couponMessage');
    
    applyCouponBtn.addEventListener('click', function() {
        const couponCode = couponCodeInput.value.trim().toUpperCase();
        
        if (!couponCode) {
            couponMessage.textContent = 'Please enter a coupon code';
            couponMessage.style.color = 'red';
            return;
        }
        
        // Simulate coupon validation (in a real app, this would check against a database)
        const validCoupons = {
            'WELCOME10': { type: 'percentage', value: 10, message: '10% discount applied' },
            'SAVE20': { type: 'percentage', value: 20, message: '20% discount applied' },
            'FLAT5': { type: 'amount', value: 5, message: '$5 discount applied' },
            'TENVERSE': { type: 'amount', value: 15, message: '$15 discount applied' }
        };
        
        if (validCoupons[couponCode]) {
            const coupon = validCoupons[couponCode];
            
            // Apply coupon discount
            currentOrder.discountType = coupon.type;
            currentOrder.discountValue = coupon.value;
            currentOrder.couponCode = couponCode;
            
            // Update discount display in the UI
            if (coupon.type === 'percentage') {
                discountTypeSelect.value = 'percentage';
                discountValueInput.value = coupon.value;
            } else {
                discountTypeSelect.value = 'amount';
                discountValueInput.value = coupon.value;
            }
            
            // Show discount value group
            discountValueGroup.style.display = 'block';
            
            // Update payment display
            updatePaymentDisplay();
            
            // Show success message
            couponMessage.textContent = coupon.message;
            couponMessage.style.color = 'green';
            showToast(coupon.message);
        } else {
            // Invalid coupon
            couponMessage.textContent = 'Invalid coupon code';
            couponMessage.style.color = 'red';
        }
    });
    
    // Apply gift card button
    const applyGiftCardBtn = document.getElementById('applyGiftCardBtn');
    const giftCardNumberInput = document.getElementById('giftCardNumber');
    const giftCardPinInput = document.getElementById('giftCardPin');
    const giftCardMessage = document.getElementById('giftCardMessage');
    
    applyGiftCardBtn.addEventListener('click', function() {
        const giftCardNumber = giftCardNumberInput.value.trim();
        const giftCardPin = giftCardPinInput.value.trim();
        
        if (!giftCardNumber) {
            giftCardMessage.textContent = 'Please enter a gift card number';
            giftCardMessage.style.color = 'red';
            return;
        }
        
        // Simulate gift card validation (in a real app, this would check against a database)
        const validGiftCards = {
            'GC1234567890': { balance: 25, pin: '1234' },
            'GC0987654321': { balance: 50, pin: '5678' },
            'TENVERSEGIFT': { balance: 100, pin: '9999' }
        };
        
        if (validGiftCards[giftCardNumber]) {
            const giftCard = validGiftCards[giftCardNumber];
            
            // Validate PIN if required
            if (giftCard.pin && giftCard.pin !== giftCardPin) {
                giftCardMessage.textContent = 'Invalid PIN';
                giftCardMessage.style.color = 'red';
                return;
            }
            
            // Apply gift card
            const remainingTotal = currentOrder.total - currentOrder.giftCardAmount;
            const amountToApply = Math.min(giftCard.balance, remainingTotal);
            
            currentOrder.giftCardAmount += amountToApply;
            currentOrder.giftCardNumber = giftCardNumber;
            
            // Update payment display
            updatePaymentDisplay();
            
            // Show success message
            giftCardMessage.textContent = `Gift card applied: $${amountToApply.toFixed(2)}`;
            giftCardMessage.style.color = 'green';
            showToast(`Gift card applied: $${amountToApply.toFixed(2)}`);
        } else {
            // Invalid gift card
            giftCardMessage.textContent = 'Invalid gift card number';
            giftCardMessage.style.color = 'red';
        }
    });
    
    // Amount received input for cash payment
    const amountReceivedInput = document.getElementById('amountReceived');
    amountReceivedInput.addEventListener('input', updateChangeAmount);
    
    // Click outside to close
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            resetDiscountAndCoupon(); // Reset discount and coupon when closing
        }
    });
}

// Reset discount and coupon when closing payment modal
function resetDiscountAndCoupon() {
    // Only reset if not completing payment
    if (document.getElementById('paymentModal').style.display === 'none') {
        return;
    }
    
    // Reset current order discount and coupon
    currentOrder.discountType = 'none';
    currentOrder.discountValue = 0;
    currentOrder.couponCode = '';
    currentOrder.giftCardAmount = 0;
    currentOrder.giftCardNumber = '';
    
    // Reset UI elements if they exist
    const discountTypeSelect = document.getElementById('discountType');
    const discountValueInput = document.getElementById('discountValue');
    const discountValueGroup = document.getElementById('discountValueGroup');
    const couponCodeInput = document.getElementById('couponCode');
    const couponMessage = document.getElementById('couponMessage');
    const giftCardNumberInput = document.getElementById('giftCardNumber');
    const giftCardPinInput = document.getElementById('giftCardPin');
    const giftCardMessage = document.getElementById('giftCardMessage');
    
    if (discountTypeSelect) discountTypeSelect.value = 'none';
    if (discountValueInput) discountValueInput.value = 0;
    if (discountValueGroup) discountValueGroup.style.display = 'none';
    if (couponCodeInput) couponCodeInput.value = '';
    if (couponMessage) couponMessage.textContent = '';
    if (giftCardNumberInput) giftCardNumberInput.value = '';
    if (giftCardPinInput) giftCardPinInput.value = '';
    if (giftCardMessage) giftCardMessage.textContent = '';
}

// Update payment display with current order totals
function updatePaymentDisplay() {
    const subtotalElement = document.getElementById('paymentSubtotal');
    const taxElement = document.getElementById('paymentTax');
    const discountElement = document.getElementById('paymentDiscount');
    const discountRow = document.getElementById('discountRow');
    const totalElement = document.getElementById('paymentTotal');
    
    // Calculate discount
    let discount = 0;
    if (currentOrder.discountType === 'percentage' && currentOrder.discountValue > 0) {
        discount = (currentOrder.subtotal * (currentOrder.discountValue / 100));
    } else if (currentOrder.discountType === 'amount' && currentOrder.discountValue > 0) {
        discount = Math.min(currentOrder.subtotal, currentOrder.discountValue);
    }
    
    // Update discount in current order
    currentOrder.discount = discount;
    
    // Calculate total
    const total = Math.max(0, currentOrder.subtotal + currentOrder.tax - discount - currentOrder.giftCardAmount);
    currentOrder.total = total;
    
    // Update display
    if (subtotalElement) subtotalElement.textContent = `$${currentOrder.subtotal.toFixed(2)}`;
    if (taxElement) taxElement.textContent = `$${currentOrder.tax.toFixed(2)}`;
    
    // Update discount display
    if (discount > 0) {
        if (discountElement) discountElement.textContent = `-$${discount.toFixed(2)}`;
        if (discountRow) discountRow.style.display = 'flex';
    } else {
        if (discountRow) discountRow.style.display = 'none';
    }
    
    // Update gift card display
    const giftCardRow = document.getElementById('giftCardRow');
    const giftCardElement = document.getElementById('paymentGiftCard');
    
    if (currentOrder.giftCardAmount > 0) {
        if (giftCardElement) giftCardElement.textContent = `-$${currentOrder.giftCardAmount.toFixed(2)}`;
        if (giftCardRow) giftCardRow.style.display = 'flex';
    } else {
        if (giftCardRow) giftCardRow.style.display = 'none';
    }
    
    if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
    
    // Update amount received to match new total
    const amountReceivedInput = document.getElementById('amountReceived');
    if (amountReceivedInput) {
        amountReceivedInput.value = total.toFixed(2);
        updateChangeAmount();
    }
}
function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    
    // Reset discount and coupon values
    resetDiscountAndCoupon();
    
    // Populate payment summary
    const summaryItemsContainer = document.getElementById('paymentSummaryItems');
    summaryItemsContainer.innerHTML = '';
    
    currentOrder.items.forEach(item => {
        const paymentItem = document.createElement('div');
        paymentItem.className = 'payment-item';
        
        paymentItem.innerHTML = `
            <div class="payment-item-details">
                <div class="payment-item-name">${item.name}</div>
                <div class="payment-item-options">${item.variants.map(v => v.option).join(', ')}</div>
            </div>
            <div class="payment-item-quantity">${item.quantity}x</div>
            <div class="payment-item-price">$${(item.totalPrice * item.quantity).toFixed(2)}</div>
        `;
        
        summaryItemsContainer.appendChild(paymentItem);
    });
    
    // Update payment totals
    document.getElementById('paymentSubtotal').textContent = `$${currentOrder.subtotal.toFixed(2)}`;
    document.getElementById('paymentTax').textContent = `$${currentOrder.tax.toFixed(2)}`;
    document.getElementById('paymentTotal').textContent = `$${currentOrder.total.toFixed(2)}`;
    
    // Hide discount row initially
    const discountRow = document.getElementById('discountRow');
    if (discountRow) {
        discountRow.style.display = 'none';
    }
    
    // Reset customer information fields
    const customerNameInput = document.getElementById('customerName');
    const customerPhoneInput = document.getElementById('customerPhone');
    if (customerNameInput) customerNameInput.value = '';
    if (customerPhoneInput) customerPhoneInput.value = '';
    
    // Reset discount fields
    const discountTypeSelect = document.getElementById('discountType');
    const discountValueInput = document.getElementById('discountValue');
    const discountValueGroup = document.getElementById('discountValueGroup');
    if (discountTypeSelect) discountTypeSelect.value = 'none';
    if (discountValueInput) discountValueInput.value = 0;
    if (discountValueGroup) discountValueGroup.style.display = 'none';
    
    // Reset coupon fields
    const couponCodeInput = document.getElementById('couponCode');
    const couponMessage = document.getElementById('couponMessage');
    if (couponCodeInput) couponCodeInput.value = '';
    if (couponMessage) couponMessage.textContent = '';
    
    // Reset gift card fields
    const giftCardNumberInput = document.getElementById('giftCardNumber');
    const giftCardPinInput = document.getElementById('giftCardPin');
    const giftCardMessage = document.getElementById('giftCardMessage');
    if (giftCardNumberInput) giftCardNumberInput.value = '';
    if (giftCardPinInput) giftCardPinInput.value = '';
    if (giftCardMessage) giftCardMessage.textContent = '';
    
    // Reset amount received to order total
    document.getElementById('amountReceived').value = currentOrder.total.toFixed(2);
    updateChangeAmount();
    
    // Show modal
    modal.style.display = 'flex';
}

// Update change amount in payment modal
function updateChangeAmount() {
    const totalAmount = currentOrder.total;
    const amountReceived = parseFloat(document.getElementById('amountReceived').value) || 0;
    
    let changeAmount = amountReceived - totalAmount;
    changeAmount = changeAmount > 0 ? changeAmount : 0;
    
    document.getElementById('changeDueAmount').textContent = `$${changeAmount.toFixed(2)}`;
}

// Open order success modal
function openOrderSuccessModal() {
    const modal = document.getElementById('orderSuccessModal');
    
    // Generate random order number
    const orderNumber = Math.floor(10000 + Math.random() * 90000);
    
    // Set order details
    document.getElementById('successOrderNumber').textContent = orderNumber;
    document.getElementById('successTableNumber').textContent = currentOrder.tableNumber;
    document.getElementById('successOrderAmount').textContent = `$${currentOrder.total.toFixed(2)}`;
    
    // Clear previous event listeners
    const printReceiptBtn = document.getElementById('printReceiptBtn');
    const newOrderBtn = document.getElementById('newOrderBtn');
    const closeModalBtn = modal.querySelector('.close-modal');
    
    // Clone and replace to remove old event listeners
    const newPrintBtn = printReceiptBtn.cloneNode(true);
    const newOrderButtonBtn = newOrderBtn.cloneNode(true);
    const newCloseBtn = closeModalBtn.cloneNode(true);
    
    printReceiptBtn.parentNode.replaceChild(newPrintBtn, printReceiptBtn);
    newOrderBtn.parentNode.replaceChild(newOrderButtonBtn, newOrderBtn);
    closeModalBtn.parentNode.replaceChild(newCloseBtn, closeModalBtn);
    
    // Add event listeners
    newPrintBtn.addEventListener('click', function() {
        // In a real app, this would print the receipt
        showToast('Printing receipt...');
    });
    
    newOrderButtonBtn.addEventListener('click', function() {
        // Reset order and close modal
        resetOrder();
        modal.style.display = 'none';
        
        // Go back to table selection
        document.getElementById('posInterface').style.display = 'none';
        document.getElementById('tableSelectionArea').style.display = 'block';
    });
    
    newCloseBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Click outside to close
    window.addEventListener('click', function closeOutside(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            window.removeEventListener('click', closeOutside);
        }
    });
    
    // Show modal
    modal.style.display = 'flex';
}

// Reset current order
function resetOrder() {
    currentOrder = {
        tableNumber: null,
        items: [],
        notes: '',
        subtotal: 0,
        tax: 0,
        total: 0
    };
    
    document.getElementById('orderNotes').value = '';
    updateOrderDisplay();
}

// Setup order actions
function setupOrderActions() {
    // Order notes
    document.getElementById('orderNotes').addEventListener('input', function() {
        currentOrder.notes = this.value;
    });
    
    // Hold order
    document.getElementById('holdOrderBtn').addEventListener('click', function() {
        if (currentOrder.items.length === 0) {
            showToast('Cannot hold an empty order');
            return;
        }
        
        // In a real app, this would save the order to be retrieved later
        showToast('Order held successfully');
    });
    
    // Clear order
    document.getElementById('clearOrderBtn').addEventListener('click', function() {
        if (currentOrder.items.length === 0) {
            showToast('Order is already empty');
            return;
        }
        
        if (confirm('Are you sure you want to clear the current order?')) {
            currentOrder.items = [];
            updateOrderDisplay();
            showToast('Order cleared');
        }
    });
    
    // Print bill
    document.getElementById('printBillBtn').addEventListener('click', function() {
        if (currentOrder.items.length === 0) {
            showToast('Cannot print an empty order');
            return;
        }
        
        // In a real app, this would print the bill
        showToast('Printing bill...');
    });
    
    // Checkout/Place Order
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        if (currentOrder.items.length === 0) {
            showToast('Cannot place an empty order');
            return;
        }
        
        // If order is already placed, open payment modal
        if (this.classList.contains('payment-ready')) {
            openPaymentModal();
            return;
        }
        
        // This is the "Place Order" part (first time)

        // 1. Conceptual KDS Send: Mark items as sent
        let itemsNewlySentToKDS = 0;
        currentOrder.items.forEach(item => {
            if (!item.kdsSent) {
                item.kdsSent = true;
                itemsNewlySentToKDS++;
            }
        });
        if (itemsNewlySentToKDS > 0) {
            showToast(`Sent ${itemsNewlySentToKDS} item type(s) to kitchen.`);
        }

        // 2. Update order status and details
        currentOrder.status = 'placed';
        // Use existing ID if re-placing due to modification before payment, or new if truly new
        currentOrder.orderId = currentOrder.orderId || Math.floor(10000 + Math.random() * 90000); 
        currentOrder.orderTime = currentOrder.orderTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // 3. Save order to localStorage (saveOrderToStorage should handle kdsSent flags)
        // Check if order already exists to decide between save new or update existing
        let orders = JSON.parse(localStorage.getItem('tenverse_orders') || '[]');
        const existingOrderIndex = orders.findIndex(o => o.id === currentOrder.orderId);
        if (existingOrderIndex > -1) {
            updateOrderInStorage(currentOrder); // Assumes updateOrderInStorage handles kdsSent flags correctly
        } else {
            saveOrderToStorage(currentOrder); // Assumes saveOrderToStorage handles kdsSent flags correctly
        }

        // 4. Mark table as occupied
        const tableNumberToOccupy = currentOrder.tableNumber;
        if (tableNumberToOccupy) {
            try {
                let tables = JSON.parse(localStorage.getItem('tenverse_tables') || '[]');
                const tableIndex = tables.findIndex(t => t.number == tableNumberToOccupy);
                if (tableIndex > -1) {
                    tables[tableIndex].status = 'occupied';
                    localStorage.setItem('tenverse_tables', JSON.stringify(tables));
                    // TODO: Consider visually updating the table card if the table selection screen is visible
                    // This might involve dispatching an event or calling a specific update function.
                }
            } catch (e) {
                console.error("Error updating table status:", e);
            }
        }

        // 5. Update UI
        this.innerHTML = '<i class="fas fa-credit-card"></i> Payment';
        this.classList.add('payment-ready');
        showToast(`Order #${currentOrder.orderId} placed successfully!`);
    });
}

// Save order to localStorage
function saveOrderToStorage(order) {
    // Get existing orders
    let orders = JSON.parse(localStorage.getItem('tenverse_orders') || '[]');
    
    // Add new order
    orders.push({
        id: order.orderId,
        tableNumber: order.tableNumber,
        status: order.status,
        time: order.orderTime,
        date: new Date().toLocaleDateString(),
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        notes: order.notes || ''
    });
    
    // Save back to localStorage
    localStorage.setItem('tenverse_orders', JSON.stringify(orders));
}

// Complete payment and update order status
function completePayment() {
    // Update order status
    currentOrder.status = 'paid';
    currentOrder.paymentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Save payment details to order
    // Get the active payment method
    const activePaymentMethod = document.querySelector('.payment-method-btn.active');
    if (activePaymentMethod) {
        currentOrder.paymentMethod = activePaymentMethod.dataset.method;
    }
    
    // Update order in localStorage
    updateOrderInStorage(currentOrder);
    
    // Close payment modal
    document.getElementById('paymentModal').style.display = 'none';
    
    // Open success modal
    openOrderSuccessModal();
    
    // Clean up the order summary (post-payment cleanup)
    resetOrder();
}

// Update existing order in localStorage
function updateOrderInStorage(order) {
    // Get existing orders
    let orders = JSON.parse(localStorage.getItem('tenverse_orders') || '[]');
    
    // Find and update the order
    const orderIndex = orders.findIndex(o => o.id === order.orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = order.status;
        orders[orderIndex].paymentTime = order.paymentTime;
    }
    
    // Save back to localStorage
    localStorage.setItem('tenverse_orders', JSON.stringify(orders));
}

// Handle responsive layout adjustments
function handleResponsiveLayout() {
    const isMobile = window.innerWidth <= 576;
    const orderSummary = document.querySelector('.order-summary');
    
    // Adjust for mobile view
    if (isMobile) {
        // Create a close button for order summary if it doesn't exist
        if (!document.getElementById('closeOrderSummaryBtn')) {
            const closeBtn = document.createElement('button');
            closeBtn.id = 'closeOrderSummaryBtn';
            closeBtn.className = 'close-order-summary';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            closeBtn.style.cssText = 'position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 18px; cursor: pointer; color: var(--text-light);';
            
            closeBtn.addEventListener('click', function() {
                orderSummary.classList.remove('active');
            });
            
            // Insert into the order header
            const orderHeader = orderSummary.querySelector('.order-header');
            if (orderHeader) {
                orderHeader.appendChild(closeBtn);
            } else {
                orderSummary.prepend(closeBtn);
            }
        }
    } else {
        // Remove mobile-specific elements for desktop view
        const closeBtn = document.getElementById('closeOrderSummaryBtn');
        if (closeBtn) {
            closeBtn.remove();
        }
        
        // Ensure order summary is visible on desktop
        if (orderSummary) {
            orderSummary.classList.remove('active');
        }
    }
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Generate mock tables for demo purposes
function generateMockTables() {
    const tables = [];
    
    // Main section tables
    for (let i = 1; i <= 8; i++) {
        tables.push({
            number: i.toString().padStart(2, '0'),
            seats: 4,
            section: 'main',
            status: i <= 3 ? 'available' : (i <= 6 ? 'occupied' : 'reserved')
        });
    }
    
    // Bar section tables
    for (let i = 9; i <= 12; i++) {
        tables.push({
            number: i.toString().padStart(2, '0'),
            seats: 2,
            section: 'bar',
            status: i <= 10 ? 'available' : 'occupied'
        });
    }
    
    // Patio section tables
    for (let i = 13; i <= 16; i++) {
        tables.push({
            number: i.toString().padStart(2, '0'),
            seats: 6,
            section: 'patio',
            status: i <= 14 ? 'available' : 'reserved'
        });
    }
    
    // Private section tables
    for (let i = 17; i <= 18; i++) {
        tables.push({
            number: i.toString().padStart(2, '0'),
            seats: 8,
            section: 'private',
            status: i === 17 ? 'available' : 'occupied'
        });
    }
    
    return tables;
} 