// Open item customization modal
function openItemModal(menuItem) {
    const modal = document.getElementById('itemCustomizationModal');
    
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
    // Add item to the current order
    currentOrder.items.push(orderItem);
    
    // Update order display
    updateOrderDisplay();
    
    // Show success message
    showToast(`Added ${orderItem.quantity}x ${orderItem.name} to order`);
}

// Update order display
function updateOrderDisplay() {
    const orderItemsContainer = document.getElementById('orderItemsContainer');
    const emptyOrderMessage = document.getElementById('emptyOrderMessage');
    
    // Show or hide empty order message
    if (currentOrder.items.length === 0) {
        emptyOrderMessage.style.display = 'block';
        orderItemsContainer.innerHTML = '';
        document.getElementById('cartItemCount').textContent = '0';
        updateOrderTotals();
        return;
    }
    
    // Hide empty message and display order items
    emptyOrderMessage.style.display = 'none';
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
    
    // Calculate total
    const total = subtotal + tax;
    
    // Update order object
    currentOrder.subtotal = subtotal;
    currentOrder.tax = tax;
    currentOrder.total = total;
    
    // Update display
    document.getElementById('subtotalAmount').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxAmount').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
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
    
    // Checkout
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        if (currentOrder.items.length === 0) {
            showToast('Cannot checkout an empty order');
            return;
        }
        
        openPaymentModal();
    });
}

// Setup payment modal
function setupPaymentModal() {
    const modal = document.getElementById('paymentModal');
    const closeModal = modal.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelPaymentBtn');
    const completeBtn = document.getElementById('completePaymentBtn');
    const paymentMethodBtns = document.querySelectorAll('.payment-method-btn');
    const amountReceived = document.getElementById('amountReceived');
    
    // Close modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    cancelBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Payment method selection
    paymentMethodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            paymentMethodBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding payment details
            const method = this.dataset.method;
            document.querySelectorAll('.payment-details').forEach(detail => {
                detail.classList.remove('active');
            });
            document.getElementById(`${method}PaymentDetails`).classList.add('active');
        });
    });
    
    // Amount received input
    amountReceived.addEventListener('input', updateChangeAmount);
    
    // Complete payment
    completeBtn.addEventListener('click', function() {
        // In a real app, this would process the payment
        // For demo, we'll just show the success modal
        modal.style.display = 'none';
        openOrderSuccessModal();
    });
    
    // Click outside to close
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Open payment modal
function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    
    // Populate payment summary
    const summaryItemsContainer = document.getElementById('paymentSummaryItems');
    summaryItemsContainer.innerHTML = '';
    
    currentOrder.items.forEach(item => {
        const paymentItem = document.createElement('div');
        paymentItem.className = 'payment-item';
        
        paymentItem.innerHTML = `
            <div class="payment-item-details">
                <div class="payment-item-name">${item.name}</div>
                <div class="payment-item-quantity">${item.quantity}x $${item.totalPrice.toFixed(2)}</div>
            </div>
            <div class="payment-item-total">$${(item.totalPrice * item.quantity).toFixed(2)}</div>
        `;
        
        summaryItemsContainer.appendChild(paymentItem);
    });
    
    // Update payment totals
    document.getElementById('paymentSubtotal').textContent = `$${currentOrder.subtotal.toFixed(2)}`;
    document.getElementById('paymentTax').textContent = `$${currentOrder.tax.toFixed(2)}`;
    document.getElementById('paymentTotal').textContent = `$${currentOrder.total.toFixed(2)}`;
    
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
    
    // Event listeners for success actions
    document.getElementById('printReceiptBtn').addEventListener('click', function() {
        // In a real app, this would print the receipt
        showToast('Printing receipt...');
    });
    
    document.getElementById('newOrderBtn').addEventListener('click', function() {
        // Reset order and close modal
        resetOrder();
        modal.style.display = 'none';
        
        // Go back to table selection
        document.getElementById('posInterface').style.display = 'none';
        document.getElementById('tableSelectionArea').style.display = 'block';
    });
    
    // Show modal
    modal.style.display = 'flex';
    
    // In a real app, this would mark the table as occupied
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