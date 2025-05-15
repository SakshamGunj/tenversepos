// POS System Orders Integration
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the orders integration if we're on the POS page
    if (document.getElementById('posInterface')) {
        initializeOrdersIntegration();
    }
});

// Initialize Orders Integration
function initializeOrdersIntegration() {
    // Hook into the order completion process
    hookOrderCompletion();
}

// Hook into the order completion process
function hookOrderCompletion() {
    // Get the complete payment button
    const completePaymentBtn = document.getElementById('completePaymentBtn');
    
    if (completePaymentBtn) {
        // Add event listener to intercept the complete payment action
        completePaymentBtn.addEventListener('click', function() {
            // Get the current order
            const currentOrder = window.currentOrder;
            
            if (!currentOrder || !currentOrder.items || currentOrder.items.length === 0) {
                return;
            }
            
            // Create order object for Orders dashboard and KDS
            const orderObject = {
                id: Math.floor(10000 + Math.random() * 90000), // Generate random order ID
                tableNumber: currentOrder.tableNumber,
                status: 'pending',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                date: new Date().toLocaleDateString(),
                items: currentOrder.items.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    options: item.options ? item.options.map(opt => `${opt.name}: ${opt.value}`).filter(opt => opt) : []
                })),
                subtotal: currentOrder.subtotal,
                tax: currentOrder.tax,
                total: currentOrder.total,
                notes: currentOrder.notes || ''
            };
            
            // Save order to localStorage for Orders dashboard and KDS
            saveOrderToLocalStorage(orderObject);
            
            // Dispatch event for real-time updates if on the same page
            dispatchOrderEvent(orderObject);
            
            // Set success order number for the success modal
            document.getElementById('successOrderNumber').textContent = orderObject.id;
        }, { capture: true }); // Use capture to ensure this runs before the original handler
    }
}

// Save order to localStorage
function saveOrderToLocalStorage(order) {
    // Save for Orders dashboard
    let orders = [];
    const savedOrders = localStorage.getItem('tenverse_orders');
    
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
    
    // Add new order to beginning of array
    orders.unshift(order);
    
    // Limit to 50 orders to prevent localStorage from getting too large
    if (orders.length > 50) {
        orders = orders.slice(0, 50);
    }
    
    // Save back to localStorage
    localStorage.setItem('tenverse_orders', JSON.stringify(orders));
    
    // Notify KDS
    localStorage.setItem('tenverse_kds_notification', JSON.stringify({
        order: order,
        timestamp: new Date().getTime()
    }));
}

// Dispatch custom event for real-time updates
function dispatchOrderEvent(order) {
    // Create and dispatch custom event
    const orderEvent = new CustomEvent('tenverse_new_order', {
        detail: { order: order }
    });
    
    window.dispatchEvent(orderEvent);
} 