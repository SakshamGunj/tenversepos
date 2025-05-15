// Kitchen Display System JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the KDS
    initializeKDS();
});

// Global variables
let kdsOrders = [];
let currentKdsFilter = 'all';
let currentView = 'grid';
let orderTimers = {};

// Initialize Kitchen Display System
function initializeKDS() {
    // Load kitchen orders
    loadKitchenOrders();
    
    // Setup event listeners
    setupKdsEventListeners();
    
    // Start order timers
    startOrderTimers();
    
    // Check for notifications from Orders dashboard
    checkForNotifications();
    
    // Set interval to check for notifications
    setInterval(checkForNotifications, 5000);
}

// Load kitchen orders from local storage or mock data
function loadKitchenOrders() {
    // Try to get orders from local storage
    const savedOrders = localStorage.getItem('tenverse_kds_orders');
    
    if (savedOrders) {
        kdsOrders = JSON.parse(savedOrders);
    } else {
        // If no saved orders, use mock data
        kdsOrders = generateMockKitchenOrders();
    }
    
    // Render orders
    renderKitchenOrders(currentKdsFilter);
}

// Generate mock kitchen orders for demo purposes
function generateMockKitchenOrders() {
    return [
        {
            id: 10024,
            tableNumber: '01',
            status: 'pending',
            time: '10:30 AM',
            timestamp: new Date().getTime() - 300000, // 5 minutes ago
            items: [
                { 
                    name: 'Classic Breakfast', 
                    quantity: 2, 
                    options: ['Size: Regular', 'Extra Bacon'],
                    special: 'No onions, please.',
                    checked: false
                },
                { 
                    name: 'Pancake Stack', 
                    quantity: 1, 
                    options: ['Extra syrup on the side'],
                    special: '',
                    checked: false
                }
            ]
        },
        {
            id: 10023,
            tableNumber: '03',
            status: 'preparing',
            time: '10:25 AM',
            timestamp: new Date().getTime() - 600000, // 10 minutes ago
            items: [
                { 
                    name: 'Caesar Salad', 
                    quantity: 1, 
                    options: ['No croutons'],
                    special: '',
                    checked: true
                },
                { 
                    name: 'Cheeseburger', 
                    quantity: 2, 
                    options: ['Medium well', 'Extra cheese'],
                    special: '',
                    checked: false
                }
            ]
        },
        {
            id: 10022,
            tableNumber: '05',
            status: 'ready',
            time: '10:15 AM',
            timestamp: new Date().getTime() - 900000, // 15 minutes ago
            items: [
                { 
                    name: 'Grilled Salmon', 
                    quantity: 1, 
                    options: [],
                    special: 'Medium rare, please.',
                    checked: true
                },
                { 
                    name: 'House Salad', 
                    quantity: 1, 
                    options: ['Dressing on the side'],
                    special: '',
                    checked: true
                }
            ]
        }
    ];
}

// Setup KDS event listeners
function setupKdsEventListeners() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update filter and render orders
            currentKdsFilter = this.dataset.filter;
            renderKitchenOrders(currentKdsFilter);
        });
    });
    
    // View toggle buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update view and render orders
            currentView = this.dataset.view;
            toggleView(currentView);
        });
    });
    
    // Item checkboxes
    document.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox' && e.target.closest('.kds-item')) {
            const checkbox = e.target;
            const itemContainer = checkbox.closest('.kds-item');
            const orderId = parseInt(checkbox.closest('.kds-card').dataset.orderId);
            const itemIndex = Array.from(itemContainer.parentNode.children).indexOf(itemContainer);
            
            // Update item checked status
            updateItemCheckedStatus(orderId, itemIndex, checkbox.checked);
        }
    });
    
    // KDS action buttons
    document.addEventListener('click', function(e) {
        // Start preparing button
        if (e.target.classList.contains('start-btn') || e.target.closest('.start-btn')) {
            const button = e.target.classList.contains('start-btn') ? e.target : e.target.closest('.start-btn');
            const orderId = parseInt(button.dataset.orderId);
            updateKitchenOrderStatus(orderId, 'preparing');
        }
        // Mark as ready button
        else if (e.target.classList.contains('ready-btn') || e.target.closest('.ready-btn')) {
            const button = e.target.classList.contains('ready-btn') ? e.target : e.target.closest('.ready-btn');
            const orderId = parseInt(button.dataset.orderId);
            updateKitchenOrderStatus(orderId, 'ready');
        }
        // Print button
        else if (e.target.classList.contains('print-btn') || e.target.closest('.print-btn')) {
            const button = e.target.classList.contains('print-btn') ? e.target : e.target.closest('.print-btn');
            const orderId = parseInt(button.dataset.orderId);
            printKitchenOrder(orderId);
        }
    });
}

// Toggle between grid and list view
function toggleView(view) {
    const gridView = document.getElementById('kdsGrid');
    const listView = document.getElementById('kdsList');
    
    if (view === 'grid') {
        gridView.classList.add('active');
        listView.classList.remove('active');
    } else {
        gridView.classList.remove('active');
        listView.classList.add('active');
    }
}

// Render kitchen orders based on filter
function renderKitchenOrders(filter) {
    // Render grid view
    renderGridView(filter);
    
    // Render list view
    renderListView(filter);
}

// Render grid view
function renderGridView(filter) {
    const kdsGrid = document.getElementById('kdsGrid');
    kdsGrid.innerHTML = '';
    
    // Filter orders
    let filteredOrders = kdsOrders;
    if (filter !== 'all') {
        filteredOrders = kdsOrders.filter(order => order.status === filter);
    }
    
    // If no orders, show message
    if (filteredOrders.length === 0) {
        kdsGrid.innerHTML = `
            <div class="empty-kds">
                <i class="fas fa-utensils"></i>
                <p>No ${filter === 'all' ? '' : filter} orders found</p>
            </div>
        `;
        return;
    }
    
    // Render each order
    filteredOrders.forEach(order => {
        const kdsCard = document.createElement('div');
        kdsCard.className = `kds-card ${order.status}`;
        kdsCard.dataset.orderId = order.id;
        kdsCard.dataset.status = order.status;
        
        // Create order items HTML
        let orderItemsHTML = '';
        order.items.forEach((item, index) => {
            const checkedClass = item.checked ? 'checked-item' : '';
            
            orderItemsHTML += `
                <div class="kds-item ${checkedClass}">
                    <div class="item-check">
                        <input type="checkbox" id="item-${order.id}-${index}" ${item.checked ? 'checked' : ''}>
                    </div>
                    <div class="item-details">
                        <label for="item-${order.id}-${index}" class="item-name">
                            <span class="item-quantity">${item.quantity}</span>
                            <span>${item.name}</span>
                        </label>
                        ${item.options && item.options.length > 0 ? 
                            `<div class="item-options">
                                ${item.options.map(option => `<div class="item-option">${option}</div>`).join('')}
                            </div>` : ''}
                        ${item.special ? `<div class="item-special">${item.special}</div>` : ''}
                    </div>
                </div>
            `;
        });
        
        // Create action buttons based on status
        let actionButtonsHTML = '';
        if (order.status === 'pending') {
            actionButtonsHTML = `
                <button class="kds-btn start-btn" data-order-id="${order.id}">Start Preparing</button>
                <button class="kds-btn print-btn" data-order-id="${order.id}"><i class="fas fa-print"></i></button>
            `;
        } else if (order.status === 'preparing') {
            actionButtonsHTML = `
                <button class="kds-btn ready-btn" data-order-id="${order.id}">Mark as Ready</button>
                <button class="kds-btn print-btn" data-order-id="${order.id}"><i class="fas fa-print"></i></button>
            `;
        } else {
            actionButtonsHTML = `
                <button class="kds-btn print-btn" data-order-id="${order.id}"><i class="fas fa-print"></i></button>
            `;
        }
        
        // Create order card HTML
        kdsCard.innerHTML = `
            <div class="kds-header">
                <div class="kds-order-info">
                    <div class="kds-order-number">Order #${order.id}</div>
                    <div class="kds-order-time">${order.time} (${getElapsedTimeString(order.timestamp)})</div>
                    <div class="kds-status status-${order.status}">${capitalizeFirstLetter(order.status)}</div>
                </div>
                <div class="kds-table">Table: ${order.tableNumber}</div>
            </div>
            <div class="kds-body">
                <div class="kds-items">
                    ${orderItemsHTML}
                </div>
                <div class="kds-timer">
                    <div class="timer-value" id="timer-${order.id}">00:00</div>
                    <div class="timer-label">Elapsed Time</div>
                </div>
            </div>
            <div class="kds-actions">
                ${actionButtonsHTML}
            </div>
        `;
        
        kdsGrid.appendChild(kdsCard);
    });
}

// Render list view
function renderListView(filter) {
    const kdsListBody = document.querySelector('#kdsList .kds-list-body');
    kdsListBody.innerHTML = '';
    
    // Filter orders
    let filteredOrders = kdsOrders;
    if (filter !== 'all') {
        filteredOrders = kdsOrders.filter(order => order.status === filter);
    }
    
    // If no orders, show message
    if (filteredOrders.length === 0) {
        kdsListBody.innerHTML = `
            <div class="empty-kds">
                <i class="fas fa-utensils"></i>
                <p>No ${filter === 'all' ? '' : filter} orders found</p>
            </div>
        `;
        return;
    }
    
    // Render each order
    filteredOrders.forEach(order => {
        const listItem = document.createElement('div');
        listItem.className = 'kds-list-item';
        listItem.dataset.orderId = order.id;
        listItem.dataset.status = order.status;
        
        // Create items summary
        const itemsSummary = order.items.map(item => {
            return `<span class="kds-list-item-count">${item.quantity}</span>${item.name}`;
        }).join(', ');
        
        // Create action buttons based on status
        let actionButtonsHTML = '';
        if (order.status === 'pending') {
            actionButtonsHTML = `
                <button class="kds-list-btn start-btn" data-order-id="${order.id}">Start</button>
                <button class="kds-list-btn print-btn" data-order-id="${order.id}"><i class="fas fa-print"></i></button>
            `;
        } else if (order.status === 'preparing') {
            actionButtonsHTML = `
                <button class="kds-list-btn ready-btn" data-order-id="${order.id}">Ready</button>
                <button class="kds-list-btn print-btn" data-order-id="${order.id}"><i class="fas fa-print"></i></button>
            `;
        } else {
            actionButtonsHTML = `
                <button class="kds-list-btn print-btn" data-order-id="${order.id}"><i class="fas fa-print"></i></button>
            `;
        }
        
        // Create list item HTML
        listItem.innerHTML = `
            <div class="kds-list-order">Order #${order.id}</div>
            <div class="kds-list-table">Table ${order.tableNumber}</div>
            <div class="kds-list-items">${itemsSummary}</div>
            <div class="kds-list-time">${order.time} (${getElapsedTimeString(order.timestamp)})</div>
            <div class="kds-list-actions">
                ${actionButtonsHTML}
            </div>
        `;
        
        kdsListBody.appendChild(listItem);
    });
}

// Start order timers
function startOrderTimers() {
    // Clear existing timers
    Object.keys(orderTimers).forEach(timerId => {
        clearInterval(orderTimers[timerId]);
    });
    
    orderTimers = {};
    
    // Start new timers for each order
    kdsOrders.forEach(order => {
        updateOrderTimer(order.id, order.timestamp);
        
        // Update every second
        orderTimers[order.id] = setInterval(() => {
            updateOrderTimer(order.id, order.timestamp);
        }, 1000);
    });
}

// Update a single order timer
function updateOrderTimer(orderId, timestamp) {
    const timerElements = document.querySelectorAll(`#timer-${orderId}`);
    if (timerElements.length === 0) return;
    
    const elapsedMs = Date.now() - timestamp;
    const minutes = Math.floor(elapsedMs / 60000);
    const seconds = Math.floor((elapsedMs % 60000) / 1000);
    
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    timerElements.forEach(element => {
        element.textContent = timeString;
    });
}

// Get elapsed time as a string (e.g., "5m ago")
function getElapsedTimeString(timestamp) {
    const elapsedMs = Date.now() - timestamp;
    const minutes = Math.floor(elapsedMs / 60000);
    
    if (minutes < 1) {
        return 'just now';
    } else if (minutes === 1) {
        return '1m ago';
    } else {
        return `${minutes}m ago`;
    }
}

// Update item checked status
function updateItemCheckedStatus(orderId, itemIndex, checked) {
    // Find order
    const orderIndex = kdsOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return;
    
    // Update item checked status
    kdsOrders[orderIndex].items[itemIndex].checked = checked;
    
    // Update UI
    const itemContainer = document.querySelector(`.kds-card[data-order-id="${orderId}"] .kds-item:nth-child(${itemIndex + 1})`);
    if (itemContainer) {
        if (checked) {
            itemContainer.classList.add('checked-item');
        } else {
            itemContainer.classList.remove('checked-item');
        }
    }
    
    // Save to local storage
    localStorage.setItem('tenverse_kds_orders', JSON.stringify(kdsOrders));
    
    // Check if all items are checked
    const allChecked = kdsOrders[orderIndex].items.every(item => item.checked);
    
    // If all items are checked and order is preparing, suggest marking as ready
    if (allChecked && kdsOrders[orderIndex].status === 'preparing') {
        showToast('All items are ready. Consider marking the order as ready.');
    }
}

// Update kitchen order status
function updateKitchenOrderStatus(orderId, newStatus) {
    // Find order
    const orderIndex = kdsOrders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return;
    
    // Update status
    kdsOrders[orderIndex].status = newStatus;
    
    // Save to local storage
    localStorage.setItem('tenverse_kds_orders', JSON.stringify(kdsOrders));
    
    // Re-render orders
    renderKitchenOrders(currentKdsFilter);
    
    // Notify Orders dashboard
    notifyOrdersDashboard(kdsOrders[orderIndex]);
    
    // Show toast
    showToast(`Order #${orderId} marked as ${newStatus}`);
}

// Print kitchen order
function printKitchenOrder(orderId) {
    // Find order
    const order = kdsOrders.find(order => order.id === orderId);
    if (!order) return;
    
    // In a real app, this would print the order
    showToast(`Printing order #${orderId}...`);
}

// Notify Orders dashboard of status change
function notifyOrdersDashboard(order) {
    // In a real app, this would use WebSockets or Server-Sent Events
    // For this demo, we'll just save to localStorage for Orders dashboard to read
    localStorage.setItem('tenverse_orders_notification', JSON.stringify({
        order: order,
        timestamp: new Date().getTime()
    }));
}

// Check for notifications from Orders dashboard
function checkForNotifications() {
    const notification = localStorage.getItem('tenverse_kds_notification');
    if (!notification) return;
    
    try {
        const data = JSON.parse(notification);
        
        // Check if notification is recent (within last 10 seconds)
        if (Date.now() - data.timestamp < 10000) {
            // Process the notification
            processOrderNotification(data.order);
            
            // Clear the notification
            localStorage.removeItem('tenverse_kds_notification');
        }
    } catch (e) {
        console.error('Error processing KDS notification:', e);
    }
}

// Process order notification from Orders dashboard
function processOrderNotification(order) {
    // Check if order already exists
    const existingOrderIndex = kdsOrders.findIndex(o => o.id === order.id);
    
    if (existingOrderIndex !== -1) {
        // Update existing order
        kdsOrders[existingOrderIndex].status = order.status;
        
        // Save to local storage
        localStorage.setItem('tenverse_kds_orders', JSON.stringify(kdsOrders));
        
        // Re-render if current filter matches
        if (currentKdsFilter === 'all' || currentKdsFilter === order.status) {
            renderKitchenOrders(currentKdsFilter);
        }
        
        // Show toast
        showToast(`Order #${order.id} updated to ${order.status}`);
    } else {
        // Add new order if it's pending or preparing
        if (order.status === 'pending' || order.status === 'preparing') {
            // Convert order to KDS format
            const kdsOrder = {
                id: order.id,
                tableNumber: order.tableNumber,
                status: order.status,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: Date.now(),
                items: order.items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    options: item.options || [],
                    special: '',
                    checked: false
                }))
            };
            
            // Add to KDS orders
            kdsOrders.unshift(kdsOrder);
            
            // Save to local storage
            localStorage.setItem('tenverse_kds_orders', JSON.stringify(kdsOrders));
            
            // Re-render if current filter matches
            if (currentKdsFilter === 'all' || currentKdsFilter === kdsOrder.status) {
                renderKitchenOrders(currentKdsFilter);
            }
            
            // Start timer for new order
            updateOrderTimer(kdsOrder.id, kdsOrder.timestamp);
            orderTimers[kdsOrder.id] = setInterval(() => {
                updateOrderTimer(kdsOrder.id, kdsOrder.timestamp);
            }, 1000);
            
            // Show toast
            showToast(`New order #${kdsOrder.id} received`);
            
            // Play notification sound
            playNotificationSound();
        }
    }
}

// Play notification sound
function playNotificationSound() {
    // In a real app, this would play a sound
    // For this demo, we'll just log to console
    console.log('Playing notification sound');
}

// Show toast message
function showToast(message) {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Add toast to container
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// For demo purposes, simulate receiving a new order every few minutes
// In a real app, this would come from the Orders dashboard
function simulateNewKitchenOrder() {
    // Only simulate if we're on the KDS page
    if (!document.getElementById('kdsGrid')) return;
    
    const randomItems = [
        { name: 'Classic Breakfast', options: ['Size: Regular'] },
        { name: 'Pancake Stack', options: ['Extra syrup'] },
        { name: 'Caesar Salad', options: [] },
        { name: 'Cheeseburger', options: ['Medium rare'] },
        { name: 'Grilled Salmon', options: [] }
    ];
    
    // Generate 1-3 random items
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = [];
    
    for (let i = 0; i < numItems; i++) {
        const randomItem = randomItems[Math.floor(Math.random() * randomItems.length)];
        const quantity = Math.floor(Math.random() * 2) + 1;
        
        items.push({
            name: randomItem.name,
            quantity: quantity,
            options: randomItem.options,
            special: '',
            checked: false
        });
    }
    
    // Create new order
    const newOrder = {
        id: 10000 + Math.floor(Math.random() * 90000),
        tableNumber: String(Math.floor(Math.random() * 10) + 1).padStart(2, '0'),
        status: 'pending',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        items: items
    };
    
    // Process as if it came from Orders dashboard
    processOrderNotification(newOrder);
}

// Simulate new orders every 3-5 minutes
setInterval(simulateNewKitchenOrder, Math.floor(Math.random() * 120000) + 180000); 