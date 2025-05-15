// POS Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize POS features
    initializeProductCards();
    initializeOrderItems();
    initializeFilterButtons();
    initializeViewToggle();
    initializePaymentModal();
});

// Initialize product cards
function initializeProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            const productName = this.querySelector('h3').textContent;
            const productPrice = this.querySelector('.price').textContent;
            
            // Add item to order (implement actual logic)
            addItemToOrder(productName, productPrice);
        });
    });
}

// Add item to order
function addItemToOrder(name, price) {
    // Check if item already exists in order
    const orderItems = document.querySelectorAll('.order-item');
    let itemExists = false;
    
    orderItems.forEach(item => {
        if (item.querySelector('h3').textContent === name) {
            // Increment quantity
            const quantityEl = item.querySelector('.quantity');
            let quantity = parseInt(quantityEl.textContent);
            quantity++;
            quantityEl.textContent = quantity;
            
            // Update total
            const priceValue = parseFloat(price.replace('$', ''));
            const totalEl = item.querySelector('.item-total');
            totalEl.textContent = `$${(priceValue * quantity).toFixed(2)}`;
            
            itemExists = true;
        }
    });
    
    // If item doesn't exist, add new item
    if (!itemExists) {
        const orderItemsContainer = document.querySelector('.order-items');
        const priceValue = parseFloat(price.replace('$', ''));
        
        const newItem = document.createElement('div');
        newItem.className = 'order-item';
        newItem.innerHTML = `
            <div class="item-details">
                <h3>${name}</h3>
                <p class="item-price">${price}</p>
            </div>
            <div class="item-quantity">
                <button class="quantity-btn dec">-</button>
                <span class="quantity">1</span>
                <button class="quantity-btn inc">+</button>
            </div>
            <p class="item-total">$${priceValue.toFixed(2)}</p>
            <button class="remove-item"><i class="fas fa-times"></i></button>
        `;
        
        orderItemsContainer.appendChild(newItem);
        
        // Add event listeners for new order item
        attachOrderItemEvents(newItem);
    }
    
    // Update order summary
    updateOrderSummary();
}

// Initialize order items
function initializeOrderItems() {
    const orderItems = document.querySelectorAll('.order-item');
    orderItems.forEach(item => {
        attachOrderItemEvents(item);
    });
    
    // Initial calculation
    updateOrderSummary();
}

// Attach events to order item
function attachOrderItemEvents(item) {
    const decBtn = item.querySelector('.quantity-btn.dec');
    const incBtn = item.querySelector('.quantity-btn.inc');
    const removeBtn = item.querySelector('.remove-item');
    
    decBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const quantityEl = item.querySelector('.quantity');
        let quantity = parseInt(quantityEl.textContent);
        if (quantity > 1) {
            quantity--;
            quantityEl.textContent = quantity;
            
            // Update item total
            updateItemTotal(item, quantity);
            // Update order summary
            updateOrderSummary();
        }
    });
    
    incBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const quantityEl = item.querySelector('.quantity');
        let quantity = parseInt(quantityEl.textContent);
        quantity++;
        quantityEl.textContent = quantity;
        
        // Update item total
        updateItemTotal(item, quantity);
        // Update order summary
        updateOrderSummary();
    });
    
    removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        item.remove();
        // Update order summary
        updateOrderSummary();
    });
}

// Update item total
function updateItemTotal(item, quantity) {
    const priceEl = item.querySelector('.item-price');
    const totalEl = item.querySelector('.item-total');
    const priceValue = parseFloat(priceEl.textContent.replace('$', ''));
    
    totalEl.textContent = `$${(priceValue * quantity).toFixed(2)}`;
}

// Update order summary
function updateOrderSummary() {
    const orderItems = document.querySelectorAll('.order-item');
    let subtotal = 0;
    
    orderItems.forEach(item => {
        const totalText = item.querySelector('.item-total').textContent;
        const totalValue = parseFloat(totalText.replace('$', ''));
        subtotal += totalValue;
    });
    
    const taxRate = 0.10; // 10% tax
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    // Update summary
    document.querySelector('.summary-row:nth-child(1) span:last-child').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.summary-row:nth-child(2) span:last-child').textContent = `$${tax.toFixed(2)}`;
    document.querySelector('.summary-row.total span:last-child').textContent = `$${total.toFixed(2)}`;
    
    // Update payment modal total if open
    const paymentTotal = document.querySelector('.payment-details .detail-row .amount');
    if (paymentTotal) {
        paymentTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Update mobile cart count
    const cartCount = document.querySelector('.mobile-cart-toggle .cart-count');
    if (cartCount) {
        let itemCount = 0;
        orderItems.forEach(item => {
            const quantity = parseInt(item.querySelector('.quantity').textContent);
            itemCount += quantity;
        });
        cartCount.textContent = itemCount;
    }
}

// Initialize filter buttons
function initializeFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter products (to be implemented with actual data)
            const category = this.textContent.trim().toLowerCase();
            filterProducts(category);
        });
    });
}

// Filter products by category
function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    
    // This is a demo implementation; in a real app, you would have category data for each product
    if (category === 'all') {
        productCards.forEach(card => {
            card.style.display = 'block';
        });
    } else {
        // Simulate filtering based on product names for this demo
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            
            if (category === 'food' && (productName.includes('sandwich') || productName.includes('burger') || productName.includes('salad') || productName.includes('pasta'))) {
                card.style.display = 'block';
            } else if (category === 'beverages' && (productName.includes('coffee') || productName.includes('juice') || productName.includes('tea'))) {
                card.style.display = 'block';
            } else if (category === 'desserts' && (productName.includes('cake') || productName.includes('ice cream') || productName.includes('brownie'))) {
                card.style.display = 'block';
            } else if (category === 'special' && productName.includes('special')) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Initialize view toggle
function initializeViewToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const productsGrid = document.querySelector('.products-grid');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Toggle view (list/grid)
            if (this.querySelector('i').classList.contains('fa-list')) {
                productsGrid.classList.add('list-view');
            } else {
                productsGrid.classList.remove('list-view');
            }
        });
    });
}

// Initialize payment modal
function initializePaymentModal() {
    const payBtn = document.querySelector('.pay-btn');
    const paymentModal = document.getElementById('paymentModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const confirmBtn = document.querySelector('.confirm-btn');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const receivedAmount = document.getElementById('received-amount');
    const changeAmount = document.querySelector('.change-amount .amount');
    
    // Show payment modal
    payBtn.addEventListener('click', function() {
        paymentModal.style.display = 'flex';
        
        // Get total amount from order summary
        const totalAmount = document.querySelector('.summary-row.total span:last-child').textContent;
        const totalValue = parseFloat(totalAmount.replace('$', ''));
        
        // Set default received amount slightly higher than total
        receivedAmount.value = (Math.ceil(totalValue) + 1).toFixed(2);
        
        // Calculate initial change
        calculateChange();
    });
    
    // Close modal
    closeModalBtn.addEventListener('click', closePaymentModal);
    cancelBtn.addEventListener('click', closePaymentModal);
    
    // Close when clicking outside modal
    window.addEventListener('click', function(event) {
        if (event.target === paymentModal) {
            closePaymentModal();
        }
    });
    
    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide received amount input based on payment method
            const paymentInput = document.querySelector('.payment-input');
            const changeAmountRow = document.querySelector('.change-amount');
            
            if (this.textContent.trim() === 'Cash') {
                paymentInput.style.display = 'block';
                changeAmountRow.style.display = 'flex';
            } else {
                paymentInput.style.display = 'none';
                changeAmountRow.style.display = 'none';
            }
        });
    });
    
    // Calculate change on input
    receivedAmount.addEventListener('input', calculateChange);
    
    // Confirm payment
    confirmBtn.addEventListener('click', function() {
        // Simulate payment processing
        const paymentMethod = document.querySelector('.payment-method.active').textContent.trim();
        
        alert(`Payment confirmed with ${paymentMethod}`);
        
        // Clear order items
        const orderItems = document.querySelector('.order-items');
        orderItems.innerHTML = '';
        
        // Update summary
        updateOrderSummary();
        
        // Close modal
        closePaymentModal();
    });
}

// Calculate change
function calculateChange() {
    const totalAmount = document.querySelector('.payment-details .detail-row .amount').textContent;
    const totalValue = parseFloat(totalAmount.replace('$', ''));
    const receivedValue = parseFloat(document.getElementById('received-amount').value);
    const changeAmount = document.querySelector('.change-amount .amount');
    
    if (!isNaN(receivedValue) && receivedValue >= totalValue) {
        const change = receivedValue - totalValue;
        changeAmount.textContent = `$${change.toFixed(2)}`;
        changeAmount.style.color = 'var(--success-color)';
    } else {
        changeAmount.textContent = 'Insufficient';
        changeAmount.style.color = 'var(--danger-color)';
    }
}

// Close payment modal
function closePaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    paymentModal.style.display = 'none';
} 