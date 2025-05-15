// Gift Cards & Coupons JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the gift cards and coupons system
    initGiftCouponsSystem();
});

// Sample data
const giftCards = [
    {
        id: 'GC001',
        number: 'GC001',
        balance: 50.00,
        originalAmount: 50.00,
        issuedDate: 'May 10, 2025',
        expiryDate: 'May 10, 2026',
        customer: 'John Smith',
        status: 'active',
        transactions: [
            { date: 'May 10, 2025', type: 'Issued', amount: 50.00, balance: 50.00 }
        ]
    },
    {
        id: 'GC002',
        number: 'GC002',
        balance: 100.00,
        originalAmount: 100.00,
        issuedDate: 'May 12, 2025',
        expiryDate: 'May 12, 2026',
        customer: 'Jane Doe',
        status: 'active',
        transactions: [
            { date: 'May 12, 2025', type: 'Issued', amount: 100.00, balance: 100.00 }
        ]
    },
    {
        id: 'GC003',
        number: 'GC003',
        balance: 0.00,
        originalAmount: 75.00,
        issuedDate: 'May 5, 2025',
        expiryDate: 'May 5, 2026',
        customer: 'Robert Johnson',
        status: 'used',
        transactions: [
            { date: 'May 5, 2025', type: 'Issued', amount: 75.00, balance: 75.00 },
            { date: 'May 8, 2025', type: 'Redeemed', amount: -75.00, balance: 0.00 }
        ]
    }
];

const coupons = [
    {
        id: 'CP001',
        code: 'WELCOME25',
        type: 'Percentage',
        value: '25%',
        minOrder: 20.00,
        validFrom: 'May 1, 2025',
        validUntil: 'June 30, 2025',
        usageLimit: '1 per customer',
        description: 'Welcome discount for new customers',
        status: 'active',
        usage: []
    },
    {
        id: 'CP002',
        code: 'SUMMER10',
        type: 'Fixed',
        value: '$10',
        minOrder: 50.00,
        validFrom: 'May 1, 2025',
        validUntil: 'August 31, 2025',
        usageLimit: 'Unlimited',
        description: 'Summer season discount',
        status: 'active',
        usage: []
    },
    {
        id: 'CP003',
        code: 'SPRING15',
        type: 'Percentage',
        value: '15%',
        minOrder: 30.00,
        validFrom: 'March 1, 2025',
        validUntil: 'April 30, 2025',
        usageLimit: 'Unlimited',
        description: 'Spring season discount',
        status: 'expired',
        usage: []
    }
];

// Initialize Gift Cards & Coupons System
function initGiftCouponsSystem() {
    // Set up tab switching
    setupTabs();
    
    // Set up modal events
    setupModalEvents();
    
    // Set up search functionality
    setupSearchFunctionality();
    
    // Set up redemption functionality
    setupRedemptionFunctionality();
}

// Set up tab switching
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
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

// Set up modal events
function setupModalEvents() {
    // Close modals when clicking on close button or outside modal
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Gift Card View Buttons
    const giftCardViewBtns = document.querySelectorAll('.view-btn[data-id^="GC"]');
    giftCardViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const giftCardId = this.dataset.id;
            openGiftCardModal(giftCardId);
        });
    });
    
    // Coupon View Buttons
    const couponViewBtns = document.querySelectorAll('.view-btn[data-id^="CP"]');
    couponViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const couponId = this.dataset.id;
            openCouponModal(couponId);
        });
    });
    
    // Gift Card Redeem Buttons
    const giftCardRedeemBtns = document.querySelectorAll('.redeem-btn[data-id^="GC"]:not([disabled])');
    giftCardRedeemBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const giftCardId = this.dataset.id;
            openRedeemGiftCardModal(giftCardId);
        });
    });
    
    // Coupon Redeem Buttons
    const couponRedeemBtns = document.querySelectorAll('.redeem-btn[data-id^="CP"]:not([disabled])');
    couponRedeemBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const couponId = this.dataset.id;
            openRedeemCouponModal(couponId);
        });
    });
    
    // Modal Button Events
    document.getElementById('closeGiftCardBtn').addEventListener('click', function() {
        document.getElementById('giftCardModal').style.display = 'none';
    });
    
    document.getElementById('closeCouponBtn').addEventListener('click', function() {
        document.getElementById('couponModal').style.display = 'none';
    });
    
    document.getElementById('redeemGiftCardBtn').addEventListener('click', function() {
        const giftCardId = document.getElementById('giftCardId').textContent;
        openRedeemGiftCardModal(giftCardId);
    });
    
    document.getElementById('redeemCouponBtn').addEventListener('click', function() {
        const couponCode = document.getElementById('couponCode').textContent;
        const couponId = getCouponIdByCode(couponCode);
        openRedeemCouponModal(couponId);
    });
    
    document.getElementById('cancelRedeemGiftCardBtn').addEventListener('click', function() {
        document.getElementById('redeemGiftCardModal').style.display = 'none';
    });
    
    document.getElementById('cancelRedeemCouponBtn').addEventListener('click', function() {
        document.getElementById('redeemCouponModal').style.display = 'none';
    });
    
    document.getElementById('confirmRedeemGiftCardBtn').addEventListener('click', function() {
        redeemGiftCard();
    });
    
    document.getElementById('confirmRedeemCouponBtn').addEventListener('click', function() {
        redeemCoupon();
    });
}

// Set up search functionality
function setupSearchFunctionality() {
    // Gift Card Search
    document.getElementById('giftCardSearchBtn').addEventListener('click', function() {
        document.getElementById('searchGiftCardModal').style.display = 'block';
    });
    
    document.getElementById('searchGiftCardBtn').addEventListener('click', function() {
        const searchTerm = document.getElementById('searchGiftCardNumber').value.trim();
        searchGiftCard(searchTerm);
    });
    
    // Coupon Search
    document.getElementById('couponSearchBtn').addEventListener('click', function() {
        document.getElementById('searchCouponModal').style.display = 'block';
    });
    
    document.getElementById('searchCouponBtn').addEventListener('click', function() {
        const searchTerm = document.getElementById('searchCouponCode').value.trim();
        searchCoupon(searchTerm);
    });
}

// Set up redemption functionality
function setupRedemptionFunctionality() {
    // Add Gift Card
    document.getElementById('addGiftCardBtn').addEventListener('click', function() {
        // Functionality to add a new gift card
        alert('Add Gift Card functionality will be implemented here.');
    });
    
    // Add Coupon
    document.getElementById('addCouponBtn').addEventListener('click', function() {
        // Functionality to add a new coupon
        alert('Add Coupon functionality will be implemented here.');
    });
}

// Open Gift Card Modal
function openGiftCardModal(giftCardId) {
    const giftCard = getGiftCardById(giftCardId);
    
    if (giftCard) {
        // Populate modal with gift card details
        document.getElementById('giftCardNumber').textContent = `Gift Card #${giftCard.number}`;
        document.getElementById('giftCardStatus').textContent = capitalizeFirstLetter(giftCard.status);
        document.getElementById('giftCardStatus').className = `status ${giftCard.status}`;
        document.getElementById('giftCardId').textContent = giftCard.id;
        document.getElementById('giftCardBalance').textContent = `$${giftCard.balance.toFixed(2)}`;
        document.getElementById('giftCardOriginal').textContent = `$${giftCard.originalAmount.toFixed(2)}`;
        document.getElementById('giftCardIssued').textContent = giftCard.issuedDate;
        document.getElementById('giftCardExpiry').textContent = giftCard.expiryDate;
        document.getElementById('giftCardCustomer').textContent = giftCard.customer;
        
        // Populate transactions
        const transactionsContainer = document.getElementById('giftCardTransactions');
        transactionsContainer.innerHTML = '';
        
        giftCard.transactions.forEach(transaction => {
            const row = document.createElement('tr');
            
            const dateCell = document.createElement('td');
            dateCell.textContent = transaction.date;
            
            const typeCell = document.createElement('td');
            typeCell.textContent = transaction.type;
            
            const amountCell = document.createElement('td');
            amountCell.textContent = transaction.amount > 0 ? `+$${transaction.amount.toFixed(2)}` : `-$${Math.abs(transaction.amount).toFixed(2)}`;
            
            const balanceCell = document.createElement('td');
            balanceCell.textContent = `$${transaction.balance.toFixed(2)}`;
            
            row.appendChild(dateCell);
            row.appendChild(typeCell);
            row.appendChild(amountCell);
            row.appendChild(balanceCell);
            
            transactionsContainer.appendChild(row);
        });
        
        // Enable/disable redeem button based on status
        const redeemBtn = document.getElementById('redeemGiftCardBtn');
        if (giftCard.status === 'active' && giftCard.balance > 0) {
            redeemBtn.disabled = false;
        } else {
            redeemBtn.disabled = true;
        }
        
        // Show modal
        document.getElementById('giftCardModal').style.display = 'block';
    }
}

// Open Coupon Modal
function openCouponModal(couponId) {
    const coupon = getCouponById(couponId);
    
    if (coupon) {
        // Populate modal with coupon details
        document.getElementById('couponNumber').textContent = `Coupon #${coupon.id}`;
        document.getElementById('couponStatus').textContent = capitalizeFirstLetter(coupon.status);
        document.getElementById('couponStatus').className = `status ${coupon.status}`;
        document.getElementById('couponCode').textContent = coupon.code;
        document.getElementById('couponType').textContent = coupon.type;
        document.getElementById('couponValue').textContent = coupon.value;
        document.getElementById('couponMinOrder').textContent = `$${coupon.minOrder.toFixed(2)}`;
        document.getElementById('couponValidFrom').textContent = coupon.validFrom;
        document.getElementById('couponValidUntil').textContent = coupon.validUntil;
        document.getElementById('couponUsageLimit').textContent = coupon.usageLimit;
        document.getElementById('couponDescription').textContent = coupon.description;
        
        // Populate usage history
        const usageContainer = document.getElementById('couponUsage');
        usageContainer.innerHTML = '';
        
        if (coupon.usage.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 4;
            cell.textContent = 'No usage history available';
            cell.style.textAlign = 'center';
            row.appendChild(cell);
            usageContainer.appendChild(row);
        } else {
            coupon.usage.forEach(usage => {
                const row = document.createElement('tr');
                
                const dateCell = document.createElement('td');
                dateCell.textContent = usage.date;
                
                const orderCell = document.createElement('td');
                orderCell.textContent = usage.order;
                
                const customerCell = document.createElement('td');
                customerCell.textContent = usage.customer;
                
                const amountCell = document.createElement('td');
                amountCell.textContent = `$${usage.amount.toFixed(2)}`;
                
                row.appendChild(dateCell);
                row.appendChild(orderCell);
                row.appendChild(customerCell);
                row.appendChild(amountCell);
                
                usageContainer.appendChild(row);
            });
        }
        
        // Enable/disable redeem button based on status
        const redeemBtn = document.getElementById('redeemCouponBtn');
        if (coupon.status === 'active') {
            redeemBtn.disabled = false;
        } else {
            redeemBtn.disabled = true;
        }
        
        // Show modal
        document.getElementById('couponModal').style.display = 'block';
    }
}

// Open Redeem Gift Card Modal
function openRedeemGiftCardModal(giftCardId) {
    const giftCard = getGiftCardById(giftCardId);
    
    if (giftCard) {
        // Populate redeem modal with gift card details
        document.getElementById('redeemGiftCardId').value = giftCard.id;
        document.getElementById('redeemGiftCardBalance').value = `$${giftCard.balance.toFixed(2)}`;
        document.getElementById('redeemGiftCardAmount').value = giftCard.balance.toFixed(2);
        
        // Show modal
        document.getElementById('redeemGiftCardModal').style.display = 'block';
    }
}

// Open Redeem Coupon Modal
function openRedeemCouponModal(couponId) {
    const coupon = getCouponById(couponId);
    
    if (coupon) {
        // Populate redeem modal with coupon details
        document.getElementById('redeemCouponCode').value = coupon.code;
        document.getElementById('redeemCouponDiscount').value = coupon.value;
        
        // Show modal
        document.getElementById('redeemCouponModal').style.display = 'block';
    }
}

// Redeem Gift Card
function redeemGiftCard() {
    const giftCardId = document.getElementById('redeemGiftCardId').value;
    const amount = parseFloat(document.getElementById('redeemGiftCardAmount').value);
    const orderNumber = document.getElementById('redeemGiftCardOrder').value;
    const notes = document.getElementById('redeemGiftCardNotes').value;
    
    // Validate input
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount to redeem.');
        return;
    }
    
    const giftCard = getGiftCardById(giftCardId);
    
    if (giftCard) {
        if (amount > giftCard.balance) {
            alert('Redemption amount cannot exceed the available balance.');
            return;
        }
        
        // Update gift card balance
        giftCard.balance -= amount;
        
        // Add transaction
        const today = new Date();
        const dateString = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        giftCard.transactions.push({
            date: dateString,
            type: 'Redeemed',
            amount: -amount,
            balance: giftCard.balance
        });
        
        // Update status if balance is 0
        if (giftCard.balance === 0) {
            giftCard.status = 'used';
        }
        
        // Close modal
        document.getElementById('redeemGiftCardModal').style.display = 'none';
        
        // Show success message
        alert(`Gift Card ${giftCardId} has been redeemed for $${amount.toFixed(2)}.`);
        
        // Refresh the page to show updated data
        location.reload();
    }
}

// Redeem Coupon
function redeemCoupon() {
    const couponCode = document.getElementById('redeemCouponCode').value;
    const orderNumber = document.getElementById('redeemCouponOrder').value;
    const orderAmount = parseFloat(document.getElementById('redeemCouponAmount').value);
    const customer = document.getElementById('redeemCouponCustomer').value;
    const notes = document.getElementById('redeemCouponNotes').value;
    
    // Validate input
    if (!orderNumber) {
        alert('Please enter an order number.');
        return;
    }
    
    if (isNaN(orderAmount) || orderAmount <= 0) {
        alert('Please enter a valid order amount.');
        return;
    }
    
    const coupon = getCouponByCode(couponCode);
    
    if (coupon) {
        if (orderAmount < coupon.minOrder) {
            alert(`Order amount must be at least $${coupon.minOrder.toFixed(2)} to use this coupon.`);
            return;
        }
        
        // Calculate discount amount
        let discountAmount = 0;
        
        if (coupon.type === 'Percentage') {
            const percentValue = parseFloat(coupon.value);
            discountAmount = orderAmount * (percentValue / 100);
        } else {
            // Fixed amount discount
            discountAmount = parseFloat(coupon.value.replace('$', ''));
        }
        
        // Add usage record
        const today = new Date();
        const dateString = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        coupon.usage.push({
            date: dateString,
            order: orderNumber,
            customer: customer || 'Guest',
            amount: discountAmount
        });
        
        // Close modal
        document.getElementById('redeemCouponModal').style.display = 'none';
        
        // Show success message
        alert(`Coupon ${couponCode} has been redeemed for $${discountAmount.toFixed(2)}.`);
        
        // Refresh the page to show updated data
        location.reload();
    }
}

// Search Gift Card
function searchGiftCard(searchTerm) {
    const resultsContainer = document.getElementById('giftCardSearchResults');
    resultsContainer.innerHTML = '';
    
    if (!searchTerm) {
        resultsContainer.innerHTML = '<p>Please enter a gift card number to search.</p>';
        return;
    }
    
    const matchingGiftCards = giftCards.filter(card => 
        card.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        card.number.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (matchingGiftCards.length === 0) {
        resultsContainer.innerHTML = '<p>No gift cards found matching your search.</p>';
        return;
    }
    
    matchingGiftCards.forEach(card => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.dataset.id = card.id;
        
        const resultHeader = document.createElement('div');
        resultHeader.className = 'search-result-header';
        
        const resultTitle = document.createElement('h4');
        resultTitle.textContent = `Gift Card #${card.number}`;
        
        const resultStatus = document.createElement('span');
        resultStatus.className = `status ${card.status}`;
        resultStatus.textContent = capitalizeFirstLetter(card.status);
        
        resultHeader.appendChild(resultTitle);
        resultHeader.appendChild(resultStatus);
        
        const resultDetails = document.createElement('div');
        resultDetails.className = 'search-result-details';
        
        const balanceDetail = document.createElement('div');
        balanceDetail.className = 'search-result-detail';
        balanceDetail.innerHTML = `Balance: <strong>$${card.balance.toFixed(2)}</strong>`;
        
        const issuedDetail = document.createElement('div');
        issuedDetail.className = 'search-result-detail';
        issuedDetail.innerHTML = `Issued: <strong>${card.issuedDate}</strong>`;
        
        const customerDetail = document.createElement('div');
        customerDetail.className = 'search-result-detail';
        customerDetail.innerHTML = `Customer: <strong>${card.customer}</strong>`;
        
        resultDetails.appendChild(balanceDetail);
        resultDetails.appendChild(issuedDetail);
        resultDetails.appendChild(customerDetail);
        
        resultItem.appendChild(resultHeader);
        resultItem.appendChild(resultDetails);
        
        resultItem.addEventListener('click', function() {
            document.getElementById('searchGiftCardModal').style.display = 'none';
            openGiftCardModal(card.id);
        });
        
        resultsContainer.appendChild(resultItem);
    });
}

// Search Coupon
function searchCoupon(searchTerm) {
    const resultsContainer = document.getElementById('couponSearchResults');
    resultsContainer.innerHTML = '';
    
    if (!searchTerm) {
        resultsContainer.innerHTML = '<p>Please enter a coupon code to search.</p>';
        return;
    }
    
    const matchingCoupons = coupons.filter(coupon => 
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
        coupon.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (matchingCoupons.length === 0) {
        resultsContainer.innerHTML = '<p>No coupons found matching your search.</p>';
        return;
    }
    
    matchingCoupons.forEach(coupon => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.dataset.id = coupon.id;
        
        const resultHeader = document.createElement('div');
        resultHeader.className = 'search-result-header';
        
        const resultTitle = document.createElement('h4');
        resultTitle.textContent = `${coupon.code} (${coupon.id})`;
        
        const resultStatus = document.createElement('span');
        resultStatus.className = `status ${coupon.status}`;
        resultStatus.textContent = capitalizeFirstLetter(coupon.status);
        
        resultHeader.appendChild(resultTitle);
        resultHeader.appendChild(resultStatus);
        
        const resultDetails = document.createElement('div');
        resultDetails.className = 'search-result-details';
        
        const discountDetail = document.createElement('div');
        discountDetail.className = 'search-result-detail';
        discountDetail.innerHTML = `Discount: <strong>${coupon.value}</strong>`;
        
        const validDetail = document.createElement('div');
        validDetail.className = 'search-result-detail';
        validDetail.innerHTML = `Valid Until: <strong>${coupon.validUntil}</strong>`;
        
        const minOrderDetail = document.createElement('div');
        minOrderDetail.className = 'search-result-detail';
        minOrderDetail.innerHTML = `Min Order: <strong>$${coupon.minOrder.toFixed(2)}</strong>`;
        
        resultDetails.appendChild(discountDetail);
        resultDetails.appendChild(validDetail);
        resultDetails.appendChild(minOrderDetail);
        
        resultItem.appendChild(resultHeader);
        resultItem.appendChild(resultDetails);
        
        resultItem.addEventListener('click', function() {
            document.getElementById('searchCouponModal').style.display = 'none';
            openCouponModal(coupon.id);
        });
        
        resultsContainer.appendChild(resultItem);
    });
}

// Helper Functions
function getGiftCardById(id) {
    return giftCards.find(card => card.id === id);
}

function getCouponById(id) {
    return coupons.find(coupon => coupon.id === id);
}

function getCouponByCode(code) {
    return coupons.find(coupon => coupon.code === code);
}

function getCouponIdByCode(code) {
    const coupon = coupons.find(coupon => coupon.code === code);
    return coupon ? coupon.id : null;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
