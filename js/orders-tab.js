// Orders Tab Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize orders tab
    initializeOrdersTab();
});

// Initialize orders tab
function initializeOrdersTab() {
    // Load orders when the orders tab is clicked
    document.querySelector('a[href="#orders"]').addEventListener('click', function() {
        loadOrders();
    });
    
    // Set up filter buttons
    setupOrderFilters();
}

// Set up order filters
function setupOrderFilters() {
    const filterButtons = document.querySelectorAll('.order-filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all filter buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter orders
            const filter = this.dataset.filter;
            filterOrders(filter);
        });
    });
}

// Filter orders
function filterOrders(filter) {
    const orderCards = document.querySelectorAll('.order-card');
    
    orderCards.forEach(card => {
        const status = card.dataset.status;
        
        if (filter === 'all' || status === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Load orders from localStorage
function loadOrders() {
    const ordersContainer = document.getElementById('ordersContainer');
    if (!ordersContainer) return;
    
    // Clear container
    ordersContainer.innerHTML = '';
    
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('tenverse_orders') || '[]');
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="no-orders">
                <i class="fas fa-receipt"></i>
                <p>No orders found</p>
            </div>
        `;
        return;
    }
    
    // Sort orders by date/time (newest first)
    orders.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateB - dateA;
    });
    
    // Create order cards
    orders.forEach(order => {
        const orderCard = createOrderCard(order);
        ordersContainer.appendChild(orderCard);
    });
    
    // Apply current filter
    const activeFilter = document.querySelector('.order-filter-btn.active');
    if (activeFilter) {
        filterOrders(activeFilter.dataset.filter);
    }
}

// Create order card
function createOrderCard(order) {
    const orderCard = document.createElement('div');
    orderCard.className = 'order-card';
    orderCard.dataset.status = order.status;
    orderCard.dataset.orderId = order.id;
    
    // Format status for display
    let statusClass = '';
    let statusText = '';
    
    switch (order.status) {
        case 'placed':
            statusClass = 'status-placed';
            statusText = 'Placed';
            break;
        case 'ready':
            statusClass = 'status-ready';
            statusText = 'Ready';
            break;
        case 'paid':
            statusClass = 'status-paid';
            statusText = 'Paid';
            break;
        case 'completed':
            statusClass = 'status-completed';
            statusText = 'Completed';
            break;
        default:
            statusClass = 'status-placed';
            statusText = 'Placed';
    }
    
    // Create items list
    const itemsList = order.items.map(item => 
        `<div class="order-item-summary">
            <span>${item.name} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>`
    ).join('');
    
    // Create order card HTML
    orderCard.innerHTML = `
        <div class="order-card-header">
            <div class="order-number">Order #${order.id}</div>
            <div class="order-status ${statusClass}">${statusText}</div>
        </div>
        <div class="order-card-body">
            <div class="order-info">
                <div class="order-info-item">
                    <i class="fas fa-table"></i> Table ${order.tableNumber}
                </div>
                <div class="order-info-item">
                    <i class="fas fa-clock"></i> ${order.time}
                </div>
                <div class="order-info-item">
                    <i class="fas fa-calendar"></i> ${order.date}
                </div>
            </div>
            <div class="order-items-summary">
                ${itemsList}
            </div>
            <div class="order-totals-summary">
                <div class="order-total-row">
                    <span>Subtotal</span>
                    <span>$${order.subtotal.toFixed(2)}</span>
                </div>
                <div class="order-total-row">
                    <span>Tax</span>
                    <span>$${order.tax.toFixed(2)}</span>
                </div>
                <div class="order-total-row grand-total">
                    <span>Total</span>
                    <span>$${order.total.toFixed(2)}</span>
                </div>
            </div>
            ${order.notes ? `<div class="order-notes-summary">${order.notes}</div>` : ''}
        </div>
        <div class="order-card-footer">
            <button class="order-action-btn print-btn" data-order-id="${order.id}">
                <i class="fas fa-print"></i> Print
            </button>
            ${order.status === 'placed' ? 
                `<button class="order-action-btn payment-btn" data-order-id="${order.id}">
                    <i class="fas fa-credit-card"></i> Payment
                </button>` : ''}
            ${order.status === 'paid' || order.status === 'completed' ? 
                `<button class="order-action-btn receipt-btn" data-order-id="${order.id}">
                    <i class="fas fa-receipt"></i> Receipt
                </button>` : ''}
        </div>
    `;
    
    // Add event listeners to buttons
    setTimeout(() => {
        const printBtn = orderCard.querySelector('.print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                // In a real app, this would print the order
                showToast('Printing order...');
            });
        }
        
        const paymentBtn = orderCard.querySelector('.payment-btn');
        if (paymentBtn) {
            paymentBtn.addEventListener('click', function() {
                // Load order for payment
                loadOrderForPayment(order.id);
            });
        }
        
        const receiptBtn = orderCard.querySelector('.receipt-btn');
        if (receiptBtn) {
            receiptBtn.addEventListener('click', function() {
                // In a real app, this would print the receipt
                showToast('Printing receipt...');
            });
        }
    }, 0);
    
    return orderCard;
}

// Load order for payment
function loadOrderForPayment(orderId) {
    // Get orders from localStorage
    const orders = JSON.parse(localStorage.getItem('tenverse_orders') || '[]');
    const order = orders.find(o => o.id == orderId);
    
    if (!order) {
        showToast('Order not found');
        return;
    }
    
    // Load order into current order
    window.currentOrder = {
        tableNumber: order.tableNumber,
        items: order.items,
        notes: order.notes,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        status: order.status,
        orderId: order.id,
        orderTime: order.time
    };
    
    // Switch to POS tab
    document.querySelector('a[href="#pos"]').click();
    
    // Update order display
    window.updateOrderDisplay();
    
    // Update checkout button to show payment
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.innerHTML = '<i class="fas fa-credit-card"></i> Payment';
        checkoutBtn.classList.add('payment-ready');
    }
    
    // Show toast
    window.showToast(`Order #${orderId} loaded for payment`);
} 