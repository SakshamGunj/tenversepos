// Payment Modal JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the payment modal
    initPaymentModal();
});

// Sample customer data
const customers = [
    {
        id: 1,
        name: 'John Smith',
        phone: '555-123-4567',
        email: 'john.smith@example.com',
        address: '123 Main St, Anytown, USA',
        orders: [
            { id: 'ORD-001', date: 'May 10, 2025', total: 45.99 },
            { id: 'ORD-008', date: 'May 3, 2025', total: 32.50 }
        ]
    },
    {
        id: 2,
        name: 'Jane Doe',
        phone: '555-987-6543',
        email: 'jane.doe@example.com',
        address: '456 Oak Ave, Somewhere, USA',
        orders: [
            { id: 'ORD-003', date: 'May 8, 2025', total: 78.25 }
        ]
    },
    {
        id: 3,
        name: 'Robert Johnson',
        phone: '555-456-7890',
        email: 'robert.johnson@example.com',
        address: '789 Pine Rd, Nowhere, USA',
        orders: [
            { id: 'ORD-005', date: 'May 5, 2025', total: 55.75 },
            { id: 'ORD-012', date: 'April 29, 2025', total: 42.30 },
            { id: 'ORD-018', date: 'April 22, 2025', total: 67.80 }
        ]
    }
];

// Sample gift card data (same as in gift-coupons.js)
const giftCards = [
    {
        id: 'GC001',
        number: 'GC001',
        balance: 50.00,
        originalAmount: 50.00,
        issuedDate: 'May 10, 2025',
        expiryDate: 'May 10, 2026',
        customer: 'John Smith',
        status: 'active'
    },
    {
        id: 'GC002',
        number: 'GC002',
        balance: 100.00,
        originalAmount: 100.00,
        issuedDate: 'May 12, 2025',
        expiryDate: 'May 12, 2026',
        customer: 'Jane Doe',
        status: 'active'
    }
];

// Sample coupon data (same as in gift-coupons.js)
const coupons = [
    {
        id: 'CP001',
        code: 'WELCOME25',
        type: 'Percentage',
        value: 25,
        minOrder: 20.00,
        validFrom: 'May 1, 2025',
        validUntil: 'June 30, 2025',
        status: 'active'
    },
    {
        id: 'CP002',
        code: 'SUMMER10',
        type: 'Fixed',
        value: 10,
        minOrder: 50.00,
        validFrom: 'May 1, 2025',
        validUntil: 'August 31, 2025',
        status: 'active'
    },
    {
        id: 'CP003',
        code: 'SPRING15',
        type: 'Percentage',
        value: 15,
        minOrder: 30.00,
        validFrom: 'March 1, 2025',
        validUntil: 'April 30, 2025',
        status: 'expired'
    }
];

// Global variables for payment processing
let currentBillTotal = 0;
let currentDiscount = 0;
let discountType = 'percentage';
let discountValue = 0;
let appliedCoupon = null;
let appliedGiftCard = null;
let selectedCustomer = null;

// Initialize Payment Modal
function initPaymentModal() {
    // Set up tab switching
    setupTabs();
    
    // Set up customer search
    setupCustomerSearch();
    
    // Set up discount functionality
    setupDiscountFunctionality();
    
    // Set up coupon functionality
    setupCouponFunctionality();
    
    // Set up gift card functionality
    setupGiftCardFunctionality();
    
    // Listen for bill modal open event
    document.addEventListener('billModalOpened', function(e) {
        // Reset all fields and selections
        resetPaymentModal();
        
        // Set current bill total
        if (e.detail && e.detail.total) {
            currentBillTotal = parseFloat(e.detail.total);
        }
    });
}

// Set up tab switching
function setupTabs() {
    const tabBtns = document.querySelectorAll('.payment-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.payment-tabs .tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const tabId = this.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// Set up customer search
function setupCustomerSearch() {
    const searchInput = document.getElementById('customerSearch');
    const searchButton = document.getElementById('searchCustomerBtn');
    const resultsContainer = document.getElementById('customerSearchResults');
    
    // Search button click
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            searchCustomers(searchTerm);
        }
    });
    
    // Search input enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim().toLowerCase();
            if (searchTerm) {
                searchCustomers(searchTerm);
            }
        }
    });
    
    // Sample coupon click events
    const sampleCoupons = document.querySelectorAll('.sample-coupon');
    sampleCoupons.forEach(coupon => {
        coupon.addEventListener('click', function() {
            const couponCode = this.dataset.code;
            document.getElementById('couponCode').value = couponCode;
            applyCoupon(couponCode);
        });
    });
    
    // Sample gift card click events
    const sampleGiftCards = document.querySelectorAll('.sample-gift-card');
    sampleGiftCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardId = this.dataset.id;
            document.getElementById('giftCardNumber').value = cardId;
            checkGiftCard(cardId);
        });
    });
}

// Search customers
function searchCustomers(searchTerm) {
    const resultsContainer = document.getElementById('customerSearchResults');
    resultsContainer.innerHTML = '';
    
    // Filter customers based on search term
    const matchingCustomers = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm) || 
        customer.phone.includes(searchTerm)
    );
    
    if (matchingCustomers.length === 0) {
        resultsContainer.innerHTML = '<div class="no-results">No customers found</div>';
    } else {
        matchingCustomers.forEach(customer => {
            const resultItem = document.createElement('div');
            resultItem.className = 'customer-result-item';
            resultItem.dataset.id = customer.id;
            
            const nameElement = document.createElement('div');
            nameElement.className = 'customer-result-name';
            nameElement.textContent = customer.name;
            
            const phoneElement = document.createElement('div');
            phoneElement.className = 'customer-result-phone';
            phoneElement.textContent = customer.phone;
            
            resultItem.appendChild(nameElement);
            resultItem.appendChild(phoneElement);
            
            resultItem.addEventListener('click', function() {
                selectCustomer(customer);
            });
            
            resultsContainer.appendChild(resultItem);
        });
    }
    
    resultsContainer.classList.add('active');
}

// Select customer
function selectCustomer(customer) {
    selectedCustomer = customer;
    
    // Update customer fields
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerPhone').value = customer.phone;
    
    // Hide search results
    document.getElementById('customerSearchResults').classList.remove('active');
    
    // Show selected customer info
    const customerInfoContainer = document.getElementById('selectedCustomerInfo');
    customerInfoContainer.innerHTML = '';
    
    const infoHeader = document.createElement('div');
    infoHeader.className = 'customer-info-header';
    
    const nameElement = document.createElement('div');
    nameElement.className = 'customer-info-name';
    nameElement.textContent = customer.name;
    
    const clearButton = document.createElement('button');
    clearButton.className = 'clear-customer-btn';
    clearButton.innerHTML = '<i class="fas fa-times"></i>';
    clearButton.addEventListener('click', function() {
        clearSelectedCustomer();
    });
    
    infoHeader.appendChild(nameElement);
    infoHeader.appendChild(clearButton);
    
    const infoDetails = document.createElement('div');
    infoDetails.className = 'customer-info-details';
    
    // Phone
    const phoneDetail = document.createElement('div');
    phoneDetail.className = 'customer-info-detail';
    
    const phoneLabel = document.createElement('div');
    phoneLabel.className = 'customer-info-label';
    phoneLabel.textContent = 'Phone:';
    
    const phoneValue = document.createElement('div');
    phoneValue.className = 'customer-info-value';
    phoneValue.textContent = customer.phone;
    
    phoneDetail.appendChild(phoneLabel);
    phoneDetail.appendChild(phoneValue);
    
    // Email
    const emailDetail = document.createElement('div');
    emailDetail.className = 'customer-info-detail';
    
    const emailLabel = document.createElement('div');
    emailLabel.className = 'customer-info-label';
    emailLabel.textContent = 'Email:';
    
    const emailValue = document.createElement('div');
    emailValue.className = 'customer-info-value';
    emailValue.textContent = customer.email;
    
    emailDetail.appendChild(emailLabel);
    emailDetail.appendChild(emailValue);
    
    // Previous orders
    const ordersDetail = document.createElement('div');
    ordersDetail.className = 'customer-info-detail';
    
    const ordersLabel = document.createElement('div');
    ordersLabel.className = 'customer-info-label';
    ordersLabel.textContent = 'Orders:';
    
    const ordersValue = document.createElement('div');
    ordersValue.className = 'customer-info-value';
    ordersValue.textContent = `${customer.orders.length} previous orders`;
    
    ordersDetail.appendChild(ordersLabel);
    ordersDetail.appendChild(ordersValue);
    
    infoDetails.appendChild(phoneDetail);
    infoDetails.appendChild(emailDetail);
    infoDetails.appendChild(ordersDetail);
    
    customerInfoContainer.appendChild(infoHeader);
    customerInfoContainer.appendChild(infoDetails);
    customerInfoContainer.classList.add('active');
}

// Clear selected customer
function clearSelectedCustomer() {
    selectedCustomer = null;
    
    // Clear customer fields
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    
    // Hide selected customer info
    document.getElementById('selectedCustomerInfo').classList.remove('active');
}

// Set up discount functionality
function setupDiscountFunctionality() {
    // Discount type radio buttons
    const discountTypeRadios = document.querySelectorAll('input[name="discountType"]');
    discountTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            discountType = this.value;
        });
    });
    
    // Apply discount button
    const applyDiscountBtn = document.getElementById('applyDiscountBtn');
    applyDiscountBtn.addEventListener('click', function() {
        const discountValueInput = document.getElementById('discountValue');
        const value = parseFloat(discountValueInput.value);
        
        if (isNaN(value) || value <= 0) {
            alert('Please enter a valid discount value');
            return;
        }
        
        applyDiscount(value);
    });
}

// Apply discount
function applyDiscount(value) {
    discountValue = value;
    
    // Calculate discount amount
    if (discountType === 'percentage') {
        if (value > 100) {
            alert('Percentage discount cannot exceed 100%');
            return;
        }
        
        currentDiscount = (currentBillTotal * value) / 100;
    } else {
        if (value > currentBillTotal) {
            alert('Fixed discount cannot exceed the bill total');
            return;
        }
        
        currentDiscount = value;
    }
    
    // Update discount summary
    const discountSummary = document.getElementById('discountSummary');
    discountSummary.innerHTML = '';
    
    const discountTypeText = document.createElement('div');
    discountTypeText.className = 'discount-type';
    discountTypeText.textContent = `Discount Type: ${discountType === 'percentage' ? 'Percentage' : 'Fixed Amount'}`;
    
    const discountValueText = document.createElement('div');
    discountValueText.className = 'discount-value';
    discountValueText.textContent = `Discount Value: ${discountType === 'percentage' ? value + '%' : '$' + value.toFixed(2)}`;
    
    const discountAmountText = document.createElement('div');
    discountAmountText.className = 'discount-amount';
    discountAmountText.textContent = `Discount Amount: $${currentDiscount.toFixed(2)}`;
    
    const newTotalText = document.createElement('div');
    newTotalText.className = 'new-total';
    newTotalText.textContent = `New Total: $${(currentBillTotal - currentDiscount).toFixed(2)}`;
    
    const removeDiscountBtn = document.createElement('button');
    removeDiscountBtn.className = 'remove-discount-btn';
    removeDiscountBtn.textContent = 'Remove Discount';
    removeDiscountBtn.addEventListener('click', function() {
        removeDiscount();
    });
    
    discountSummary.appendChild(discountTypeText);
    discountSummary.appendChild(discountValueText);
    discountSummary.appendChild(discountAmountText);
    discountSummary.appendChild(newTotalText);
    discountSummary.appendChild(removeDiscountBtn);
    
    discountSummary.classList.add('active');
    
    // Update bill total
    updateBillTotal();
}

// Remove discount
function removeDiscount() {
    discountValue = 0;
    currentDiscount = 0;
    
    // Hide discount summary
    document.getElementById('discountSummary').classList.remove('active');
    
    // Clear discount value input
    document.getElementById('discountValue').value = '';
    
    // Update bill total
    updateBillTotal();
}

// Set up coupon functionality
function setupCouponFunctionality() {
    // Apply coupon button
    const applyCouponBtn = document.getElementById('applyCouponBtn');
    applyCouponBtn.addEventListener('click', function() {
        const couponCode = document.getElementById('couponCode').value.trim();
        if (couponCode) {
            applyCoupon(couponCode);
        } else {
            showCouponMessage('Please enter a coupon code', 'error');
        }
    });
    
    // Sample coupon click events
    const sampleCoupons = document.querySelectorAll('.sample-coupon');
    sampleCoupons.forEach(coupon => {
        coupon.addEventListener('click', function() {
            const couponCode = this.dataset.code;
            document.getElementById('couponCode').value = couponCode;
            applyCoupon(couponCode);
        });
    });
}

// Apply coupon
function applyCoupon(couponCode) {
    // Find coupon
    const coupon = coupons.find(c => c.code === couponCode);
    
    if (!coupon) {
        showCouponMessage('Invalid coupon code', 'error');
        return;
    }
    
    if (coupon.status === 'expired') {
        showCouponMessage('This coupon has expired', 'error');
        return;
    }
    
    if (currentBillTotal < coupon.minOrder) {
        showCouponMessage(`Minimum order amount for this coupon is $${coupon.minOrder.toFixed(2)}`, 'error');
        return;
    }
    
    // Calculate discount
    let couponDiscount = 0;
    if (coupon.type === 'Percentage') {
        couponDiscount = (currentBillTotal * coupon.value) / 100;
    } else {
        couponDiscount = coupon.value;
    }
    
    // Apply coupon
    appliedCoupon = coupon;
    currentDiscount = couponDiscount;
    
    // Show success message
    const discountText = coupon.type === 'Percentage' ? `${coupon.value}%` : `$${coupon.value.toFixed(2)}`;
    showCouponMessage(`Coupon applied: ${discountText} off`, 'success');
    
    // Update bill total
    updateBillTotal();
}

// Show coupon message
function showCouponMessage(message, type) {
    const messageContainer = document.getElementById('couponMessage');
    messageContainer.textContent = message;
    messageContainer.className = `coupon-message ${type}`;
}

// Set up gift card functionality
function setupGiftCardFunctionality() {
    // Check gift card button
    const checkGiftCardBtn = document.getElementById('checkGiftCardBtn');
    checkGiftCardBtn.addEventListener('click', function() {
        const giftCardNumber = document.getElementById('giftCardNumber').value.trim();
        if (giftCardNumber) {
            checkGiftCard(giftCardNumber);
        } else {
            alert('Please enter a gift card number');
        }
    });
    
    // Sample gift card click events
    const sampleGiftCards = document.querySelectorAll('.sample-gift-card');
    sampleGiftCards.forEach(card => {
        card.addEventListener('click', function() {
            const cardId = this.dataset.id;
            document.getElementById('giftCardNumber').value = cardId;
            checkGiftCard(cardId);
        });
    });
}

// Check gift card
function checkGiftCard(giftCardNumber) {
    // Find gift card
    const giftCard = giftCards.find(card => card.id === giftCardNumber);
    
    if (!giftCard) {
        alert('Invalid gift card number');
        return;
    }
    
    if (giftCard.status !== 'active') {
        alert('This gift card is no longer active');
        return;
    }
    
    if (giftCard.balance <= 0) {
        alert('This gift card has no remaining balance');
        return;
    }
    
    // Show gift card details
    const giftCardDetails = document.getElementById('giftCardDetails');
    giftCardDetails.innerHTML = '';
    
    const cardInfo = document.createElement('div');
    cardInfo.className = 'gift-card-info';
    
    // Card number
    const numberRow = document.createElement('div');
    numberRow.className = 'gift-card-info-row';
    
    const numberLabel = document.createElement('div');
    numberLabel.className = 'gift-card-info-label';
    numberLabel.textContent = 'Card Number:';
    
    const numberValue = document.createElement('div');
    numberValue.className = 'gift-card-info-value';
    numberValue.textContent = giftCard.id;
    
    numberRow.appendChild(numberLabel);
    numberRow.appendChild(numberValue);
    
    // Expiry date
    const expiryRow = document.createElement('div');
    expiryRow.className = 'gift-card-info-row';
    
    const expiryLabel = document.createElement('div');
    expiryLabel.className = 'gift-card-info-label';
    expiryLabel.textContent = 'Expires:';
    
    const expiryValue = document.createElement('div');
    expiryValue.className = 'gift-card-info-value';
    expiryValue.textContent = giftCard.expiryDate;
    
    expiryRow.appendChild(expiryLabel);
    expiryRow.appendChild(expiryValue);
    
    // Balance
    const balanceRow = document.createElement('div');
    balanceRow.className = 'gift-card-info-row gift-card-balance-row';
    
    const balanceLabel = document.createElement('div');
    balanceLabel.className = 'gift-card-info-label';
    balanceLabel.textContent = 'Balance:';
    
    const balanceValue = document.createElement('div');
    balanceValue.className = 'gift-card-info-value';
    balanceValue.textContent = `$${giftCard.balance.toFixed(2)}`;
    
    balanceRow.appendChild(balanceLabel);
    balanceRow.appendChild(balanceValue);
    
    cardInfo.appendChild(numberRow);
    cardInfo.appendChild(expiryRow);
    cardInfo.appendChild(balanceRow);
    
    // Apply button
    const applyButton = document.createElement('button');
    applyButton.className = 'apply-btn';
    applyButton.textContent = 'Apply to Bill';
    applyButton.addEventListener('click', function() {
        applyGiftCard(giftCard);
    });
    
    const cardActions = document.createElement('div');
    cardActions.className = 'gift-card-actions';
    cardActions.appendChild(applyButton);
    
    giftCardDetails.appendChild(cardInfo);
    giftCardDetails.appendChild(cardActions);
    giftCardDetails.classList.add('active');
}

// Apply gift card
function applyGiftCard(giftCard) {
    // Determine amount to apply
    const amountToApply = Math.min(giftCard.balance, currentBillTotal);
    
    // Apply gift card
    appliedGiftCard = {
        id: giftCard.id,
        amountApplied: amountToApply
    };
    
    // Update gift card details
    const giftCardDetails = document.getElementById('giftCardDetails');
    
    const appliedInfo = document.createElement('div');
    appliedInfo.className = 'gift-card-applied';
    appliedInfo.innerHTML = `<strong>Applied:</strong> $${amountToApply.toFixed(2)}`;
    
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-gift-card-btn';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', function() {
        removeGiftCard();
    });
    
    // Clear previous content and add new info
    giftCardDetails.innerHTML = '';
    giftCardDetails.appendChild(appliedInfo);
    giftCardDetails.appendChild(removeButton);
    
    // Update bill total
    updateBillTotal();
}

// Remove gift card
function removeGiftCard() {
    appliedGiftCard = null;
    
    // Hide gift card details
    document.getElementById('giftCardDetails').classList.remove('active');
    
    // Clear gift card number input
    document.getElementById('giftCardNumber').value = '';
    
    // Update bill total
    updateBillTotal();
}

// Update bill total
function updateBillTotal() {
    let finalTotal = currentBillTotal;
    
    // Apply discount or coupon
    if (currentDiscount > 0) {
        finalTotal -= currentDiscount;
    }
    
    // Apply gift card
    if (appliedGiftCard) {
        finalTotal -= appliedGiftCard.amountApplied;
    }
    
    // Ensure total doesn't go below zero
    finalTotal = Math.max(finalTotal, 0);
    
    // Update total display
    document.getElementById('billTotal').textContent = `$${finalTotal.toFixed(2)}`;
    
    // Enable/disable mark as paid button
    const markAsPaidBtn = document.getElementById('markAsPaidBtn');
    markAsPaidBtn.disabled = finalTotal > 0 ? false : true;
}

// Reset payment modal
function resetPaymentModal() {
    // Reset variables
    currentDiscount = 0;
    discountType = 'percentage';
    discountValue = 0;
    appliedCoupon = null;
    appliedGiftCard = null;
    selectedCustomer = null;
    
    // Reset customer tab
    document.getElementById('customerSearch').value = '';
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('billNotes').value = '';
    document.getElementById('customerSearchResults').classList.remove('active');
    document.getElementById('selectedCustomerInfo').classList.remove('active');
    
    // Reset discount tab
    document.getElementById('discountValue').value = '';
    document.getElementById('discountSummary').classList.remove('active');
    document.querySelector('input[name="discountType"][value="percentage"]').checked = true;
    
    // Reset coupon tab
    document.getElementById('couponCode').value = '';
    document.getElementById('couponMessage').className = 'coupon-message';
    
    // Reset gift card tab
    document.getElementById('giftCardNumber').value = '';
    document.getElementById('giftCardDetails').classList.remove('active');
    
    // Reset active tab
    const tabBtns = document.querySelectorAll('.payment-tabs .tab-btn');
    const tabContents = document.querySelectorAll('.payment-tabs .tab-content');
    
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    
    document.querySelector('.payment-tabs .tab-btn[data-tab="customer-tab"]').classList.add('active');
    document.getElementById('customer-tab').classList.add('active');
}
