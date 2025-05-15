// Orders Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the orders dashboard
    initializeOrdersDashboard();
});

// Global variables
let allOrders = [];
let currentFilter = 'all';

// Initialize Orders Dashboard
function initializeOrdersDashboard() {
    // Load orders data
    loadOrdersData();
    
    // Setup event listeners
    setupEventListeners();
}

// Load orders data from local storage or mock data
function loadOrdersData() {
    // Try to get orders from local storage
    const savedOrders = localStorage.getItem('tenverse_orders');
    
    if (savedOrders) {
        allOrders = JSON.parse(savedOrders);
    } else {
        // If no saved orders, use mock data
        allOrders = generateMockOrders();
    }
    
    // Render orders
    renderOrders(currentFilter);
}

// Generate mock orders for demo purposes
function generateMockOrders() {
    return [
        {
            id: 10024,
            tableNumber: '01',
            status: 'pending',
            time: '10:30 AM',
            date: new Date().toLocaleDateString(),
            items: [
                { name: 'Classic Breakfast', quantity: 2, price: 12.99, options: ['Size: Regular', 'Extra Bacon'] },
                { name: 'Pancake Stack', quantity: 1, price: 9.99, options: [] },
                { name: 'Iced Coffee', quantity: 2, price: 4.50, options: [] }
            ],
            subtotal: 44.97,
            tax: 4.50,
            total: 49.47,
            notes: 'Please serve the coffee first. Thanks!'
        },
        {
            id: 10023,
            tableNumber: '03',
            status: 'preparing',
            time: '10:25 AM',
            date: new Date().toLocaleDateString(),
            items: [
                { name: 'Caesar Salad', quantity: 1, price: 8.99, options: ['No croutons'] },
                { name: 'Cheeseburger', quantity: 2, price: 10.99, options: ['Medium well', 'Extra cheese'] }
            ],
            subtotal: 30.97,
            tax: 3.10,
            total: 34.07,
            notes: ''
        },
        {
            id: 10022,
            tableNumber: '05',
            status: 'ready',
            time: '10:15 AM',
            date: new Date().toLocaleDateString(),
            items: [
                { name: 'Grilled Salmon', quantity: 1, price: 18.99, options: [] },
                { name: 'House Salad', quantity: 1, price: 7.99, options: ['Dressing on the side'] }
            ],
            subtotal: 26.98,
            tax: 2.70,
            total: 29.68,
            notes: ''
        },
        {
            id: 10021,
            tableNumber: '02',
            status: 'completed',
            time: '10:00 AM',
            date: new Date().toLocaleDateString(),
            items: [
                { name: 'Eggs Benedict', quantity: 2, price: 14.99, options: [] },
                { name: 'Fresh Orange Juice', quantity: 2, price: 3.99, options: [] }
            ],
            subtotal: 37.96,
            tax: 3.80,
            total: 41.76,
            notes: ''
        },
        {
            id: 10020,
            tableNumber: '04',
            status: 'cancelled',
            time: '9:45 AM',
            date: new Date().toLocaleDateString(),
            items: [
                { name: 'Avocado Toast', quantity: 1, price: 9.99, options: [] },
                { name: 'Cappuccino', quantity: 1, price: 4.50, options: ['Extra shot'] }
            ],
            subtotal: 14.49,
            tax: 1.45,
            total: 15.94,
            notes: 'Customer changed their mind'
        }
    ];
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update filter and render orders
            currentFilter = this.dataset.filter;
            renderOrders(currentFilter);
        });
    });
    
    // Order actions (view, complete, cancel)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-btn') || e.target.closest('.view-btn')) {
            const button = e.target.classList.contains('view-btn') ? e.target : e.target.closest('.view-btn');
            const orderId = parseInt(button.dataset.orderId);
            openOrderDetailsModal(orderId);
        } else if (e.target.classList.contains('complete-btn') || e.target.closest('.complete-btn')) {
            const button = e.target.classList.contains('complete-btn') ? e.target : e.target.closest('.complete-btn');
            const orderId = parseInt(button.dataset.orderId);
            updateOrderStatus(orderId, 'completed');
        } else if (e.target.classList.contains('cancel-btn') || e.target.closest('.cancel-btn')) {
            const button = e.target.classList.contains('cancel-btn') ? e.target : e.target.closest('.cancel-btn');
            const orderId = parseInt(button.dataset.orderId);
            if (button.closest('.modal-footer')) return; // Ignore modal close button
            updateOrderStatus(orderId, 'cancelled');
        }
    });
    
    // Modal close button
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            document.getElementById('orderDetailsModal').style.display = 'none';
        });
    }
    
    // Update status button in modal
    const updateStatusBtn = document.getElementById('updateStatusBtn');
    if (updateStatusBtn) {
        updateStatusBtn.addEventListener('click', function() {
            const orderId = parseInt(this.dataset.orderId);
            const currentStatus = this.dataset.status;
            
            // Determine next status
            let nextStatus;
            switch (currentStatus) {
                case 'pending':
                    nextStatus = 'preparing';
                    break;
                case 'preparing':
                    nextStatus = 'ready';
                    break;
                case 'ready':
                    nextStatus = 'completed';
                    break;
                default:
                    nextStatus = currentStatus;
            }
            
            updateOrderStatus(orderId, nextStatus);
            document.getElementById('orderDetailsModal').style.display = 'none';
        });
    }
    
    // Click outside modal to close
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('orderDetailsModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Render orders based on filter
function renderOrders(filter) {
    const ordersGrid = document.getElementById('ordersGrid');
    ordersGrid.innerHTML = '';
    
    // Filter orders
    let filteredOrders = allOrders;
    if (filter !== 'all') {
        filteredOrders = allOrders.filter(order => order.status === filter);
    }
    
    // If no orders, show message
    if (filteredOrders.length === 0) {
        ordersGrid.innerHTML = `
            <div class="empty-orders">
                <i class="fas fa-clipboard-list"></i>
                <p>No ${filter === 'all' ? '' : filter} orders found</p>
            </div>
        `;
        return;
    }
    
    // Render each order
    filteredOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = `order-card`;
        orderCard.dataset.orderId = order.id;
        orderCard.dataset.status = order.status;
        
        // Create order items HTML
        let orderItemsHTML = '';
        order.items.forEach(item => {
            orderItemsHTML += `
                <div class="order-item">
                    <div class="item-name">
                        <span class="item-quantity">${item.quantity}</span>
                        <span>${item.name}</span>
                    </div>
                    <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
        });
        
        // Create order card HTML
        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-number">Order #${order.id}</div>
                <div class="order-time">${order.time}</div>
            </div>
            <div class="order-info">
                <div class="order-table">Table: ${order.tableNumber}</div>
                <div class="order-status status-${order.status}">${capitalizeFirstLetter(order.status)}</div>
                <div class="order-items">
                    ${orderItemsHTML}
                </div>
                <div class="order-total">Total: $${order.total.toFixed(2)}</div>
            </div>
            <div class="order-actions">
                <button class="order-btn view-btn" data-order-id="${order.id}">View Details</button>
                <button class="order-btn complete-btn" data-order-id="${order.id}">Complete</button>
                <button class="order-btn cancel-btn" data-order-id="${order.id}">Cancel</button>
            </div>
        `;
        
        ordersGrid.appendChild(orderCard);
    });
}

// Open order details modal
function openOrderDetailsModal(orderId) {
    const order = allOrders.find(order => order.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('orderDetailsModal');
    
    // Set order details
    document.getElementById('modalOrderNumber').textContent = `Order #${order.id}`;
    document.getElementById('modalOrderTime').textContent = `${order.time} - ${order.date}`;
    document.getElementById('modalOrderTable').textContent = `Table: ${order.tableNumber}`;
    
    const statusElement = document.getElementById('modalOrderStatus');
    statusElement.textContent = capitalizeFirstLetter(order.status);
    statusElement.className = `modal-order-status status-${order.status}`;
    
    // Set order items
    const itemsContainer = document.getElementById('modalOrderItems');
    itemsContainer.innerHTML = '';
    
    order.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'modal-order-item';
        
        let optionsHTML = '';
        if (item.options && item.options.length > 0) {
            optionsHTML = item.options.join(', ');
        }
        
        itemElement.innerHTML = `
            <div class="modal-item-details">
                <div class="modal-item-name">${item.quantity}x ${item.name}</div>
                <div class="modal-item-options">${optionsHTML}</div>
            </div>
            <div class="modal-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        `;
        
        itemsContainer.appendChild(itemElement);
    });
    
    // Set order notes
    const notesElement = document.getElementById('modalOrderNotes');
    if (order.notes && order.notes.trim() !== '') {
        notesElement.textContent = order.notes;
        notesElement.style.display = 'block';
    } else {
        notesElement.style.display = 'none';
    }
    
    // Set order totals
    document.getElementById('modalSubtotal').textContent = `$${order.subtotal.toFixed(2)}`;
    document.getElementById('modalTax').textContent = `$${order.tax.toFixed(2)}`;
    document.getElementById('modalTotal').textContent = `$${order.total.toFixed(2)}`;
    
    // Set update status button
    const updateStatusBtn = document.getElementById('updateStatusBtn');
    updateStatusBtn.dataset.orderId = order.id;
    updateStatusBtn.dataset.status = order.status;
    
    // Adjust button text and visibility based on status
    if (order.status === 'completed' || order.status === 'cancelled') {
        updateStatusBtn.style.display = 'none';
    } else {
        updateStatusBtn.style.display = 'block';
        
        // Set button text based on current status
        switch (order.status) {
            case 'pending':
                updateStatusBtn.textContent = 'Mark as Preparing';
                break;
            case 'preparing':
                updateStatusBtn.textContent = 'Mark as Ready';
                break;
            case 'ready':
                updateStatusBtn.textContent = 'Mark as Completed';
                break;
            default:
                updateStatusBtn.textContent = 'Update Status';
        }
    }
    
    // Show modal
    modal.style.display = 'flex';
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
    // Find order
    const orderIndex = allOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return;
    
    // Update status
    allOrders[orderIndex].status = newStatus;
    
    // Save to local storage
    localStorage.setItem('tenverse_orders', JSON.stringify(allOrders));
    
    // Re-render orders
    renderOrders(currentFilter);
    
    // Notify KDS if status changed to preparing or ready
    if (newStatus === 'preparing' || newStatus === 'ready') {
        notifyKDS(allOrders[orderIndex]);
    }
}

// Notify Kitchen Display System of order status change
function notifyKDS(order) {
    // In a real app, this would use WebSockets or Server-Sent Events
    // For this demo, we'll just save to localStorage for KDS to read
    localStorage.setItem('tenverse_kds_notification', JSON.stringify({
        order: order,
        timestamp: new Date().getTime()
    }));
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to receive new orders from POS system
function receiveNewOrder(order) {
    // Add new order to the beginning of the array
    allOrders.unshift(order);
    
    // Save to local storage
    localStorage.setItem('tenverse_orders', JSON.stringify(allOrders));
    
    // Re-render orders if current filter matches
    if (currentFilter === 'all' || currentFilter === order.status) {
        renderOrders(currentFilter);
    }
    
    // Notify KDS
    notifyKDS(order);
}

// Listen for new orders from POS system
window.addEventListener('tenverse_new_order', function(e) {
    if (e.detail && e.detail.order) {
        receiveNewOrder(e.detail.order);
    }
});

// For demo purposes, simulate receiving a new order every few minutes
// In a real app, this would come from the POS system
function simulateNewOrder() {
    // Only simulate if we're on the orders page
    if (!document.getElementById('ordersGrid')) return;
    
    const randomItems = [
        { name: 'Classic Breakfast', price: 12.99, options: ['Size: Regular'] },
        { name: 'Pancake Stack', price: 9.99, options: ['Extra syrup'] },
        { name: 'Caesar Salad', price: 8.99, options: [] },
        { name: 'Cheeseburger', price: 10.99, options: ['Medium rare'] },
        { name: 'Grilled Salmon', price: 18.99, options: [] },
        { name: 'Iced Coffee', price: 4.50, options: [] }
    ];
    
    // Generate 1-3 random items
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let subtotal = 0;
    
    for (let i = 0; i < numItems; i++) {
        const randomItem = randomItems[Math.floor(Math.random() * randomItems.length)];
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
    
    // Create new order
    const newOrder = {
        id: 10000 + Math.floor(Math.random() * 90000),
        tableNumber: String(Math.floor(Math.random() * 10) + 1).padStart(2, '0'),
        status: 'pending',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString(),
        items: items,
        subtotal: subtotal,
        tax: tax,
        total: total,
        notes: ''
    };
    
    // Add new order
    receiveNewOrder(newOrder);
}

// Simulate new orders every 3-5 minutes
setInterval(simulateNewOrder, Math.floor(Math.random() * 120000) + 180000); 