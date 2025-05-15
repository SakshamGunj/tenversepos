// Billing System JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the billing system
    initializeBillingSystem();
});

// Global variables
let currentTableBills = {};
let currentBillDetails = null;

// Initialize Billing System
function initializeBillingSystem() {
    // Load billing data
    loadBillingData();
    
    // Setup event listeners
    setupBillingEventListeners();
}

// Load billing data from local storage
function loadBillingData() {
    // Try to get billing data from local storage
    const savedBills = localStorage.getItem('tenverse_bills');
    
    if (savedBills) {
        currentTableBills = JSON.parse(savedBills);
    }
}

// Setup billing event listeners
function setupBillingEventListeners() {
    // Bill payment button in POS interface
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('bill-payment-btn') || e.target.closest('.bill-payment-btn')) {
            const button = e.target.classList.contains('bill-payment-btn') ? e.target : e.target.closest('.bill-payment-btn');
            const tableNumber = button.dataset.table;
            
            if (tableNumber) {
                openBillingModal(tableNumber);
            }
        }
    });
    
    // Bill modal close button
    const closeBillModalBtn = document.querySelector('#billModal .close-modal');
    if (closeBillModalBtn) {
        closeBillModalBtn.addEventListener('click', function() {
            document.getElementById('billModal').style.display = 'none';
        });
    }
    
    // Click outside modal to close
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('billModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Payment method selection
    const paymentMethodBtns = document.querySelectorAll('#billModal .payment-method-btn');
    paymentMethodBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            paymentMethodBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update payment method
            if (currentBillDetails) {
                currentBillDetails.paymentMethod = this.dataset.method;
            }
        });
    });
    
    // Print bill button
    const printBillBtn = document.getElementById('printBillBtn');
    if (printBillBtn) {
        printBillBtn.addEventListener('click', function() {
            printBill();
        });
    }
    
    // Mark as paid button
    const markAsPaidBtn = document.getElementById('markAsPaidBtn');
    if (markAsPaidBtn) {
        markAsPaidBtn.addEventListener('click', function() {
            if (currentBillDetails) {
                completeBill(currentBillDetails);
            }
        });
    }
    
    // Customer name input
    const customerNameInput = document.getElementById('customerName');
    if (customerNameInput) {
        customerNameInput.addEventListener('input', function() {
            if (currentBillDetails) {
                currentBillDetails.customerName = this.value;
            }
        });
    }
    
    // Bill notes input
    const billNotesInput = document.getElementById('billNotes');
    if (billNotesInput) {
        billNotesInput.addEventListener('input', function() {
            if (currentBillDetails) {
                currentBillDetails.notes = this.value;
            }
        });
    }
    
    // KOT reprint button
    const reprintKOTBtn = document.getElementById('reprintKOTBtn');
    if (reprintKOTBtn) {
        reprintKOTBtn.addEventListener('click', function() {
            if (currentBillDetails) {
                printKOT(currentBillDetails);
            }
        });
    }
}

// Open billing modal for a table
function openBillingModal(tableNumber) {
    // Check if all orders for this table are completed or ready
    if (!areAllOrdersReadyForBilling(tableNumber)) {
        showToast('Not all orders for this table are ready for billing', 'warning');
        return;
    }
    
    // Get all orders for this table
    const tableOrders = getOrdersForTable(tableNumber);
    
    if (tableOrders.length === 0) {
        showToast('No orders found for this table', 'error');
        return;
    }
    
    // Create bill details
    currentBillDetails = createBillDetails(tableNumber, tableOrders);
    
    // Populate modal with bill details
    populateBillModal(currentBillDetails);
    
    // Show modal
    document.getElementById('billModal').style.display = 'flex';
}

// Check if all orders for a table are ready for billing
function areAllOrdersReadyForBilling(tableNumber) {
    // Get all orders for this table
    const allOrders = getAllOrders();
    const tableOrders = allOrders.filter(order => order.tableNumber === tableNumber);
    
    // Check if all orders are completed or ready
    return tableOrders.every(order => order.status === 'completed' || order.status === 'ready');
}

// Get all orders from local storage
function getAllOrders() {
    const savedOrders = localStorage.getItem('tenverse_orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
}

// Get all orders for a specific table
function getOrdersForTable(tableNumber) {
    const allOrders = getAllOrders();
    return allOrders.filter(order => order.tableNumber === tableNumber);
}

// Create bill details object
function createBillDetails(tableNumber, tableOrders) {
    // Combine all items from all orders
    const allItems = [];
    let subtotal = 0;
    
    tableOrders.forEach(order => {
        order.items.forEach(item => {
            // Check if item already exists in allItems
            const existingItem = allItems.find(i => 
                i.name === item.name && 
                JSON.stringify(i.options) === JSON.stringify(item.options)
            );
            
            if (existingItem) {
                // Update existing item
                existingItem.quantity += item.quantity;
                existingItem.subtotal += item.price * item.quantity;
            } else {
                // Add new item
                allItems.push({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    options: item.options || [],
                    subtotal: item.price * item.quantity
                });
            }
            
            subtotal += item.price * item.quantity;
        });
    });
    
    // Calculate tax and total
    const taxRate = 0.10; // 10% tax
    const tax = subtotal * taxRate;
    const total = subtotal + tax;
    
    // Create bill details
    return {
        id: generateBillId(),
        tableNumber: tableNumber,
        items: allItems,
        subtotal: subtotal,
        tax: tax,
        total: total,
        timestamp: new Date().getTime(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        paymentMethod: 'cash', // Default payment method
        customerName: '',
        notes: '',
        status: 'pending',
        orders: tableOrders.map(order => order.id)
    };
}

// Generate a unique bill ID
function generateBillId() {
    return 'BILL-' + Math.floor(100000 + Math.random() * 900000);
}

// Populate bill modal with bill details
function populateBillModal(billDetails) {
    // Set bill header
    document.getElementById('billModalTableNumber').textContent = billDetails.tableNumber;
    document.getElementById('billModalId').textContent = billDetails.id;
    document.getElementById('billModalDateTime').textContent = `${billDetails.date} ${billDetails.time}`;
    
    // Set bill items
    const billItemsContainer = document.getElementById('billItems');
    billItemsContainer.innerHTML = '';
    
    billDetails.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'bill-item';
        
        let optionsHTML = '';
        if (item.options && item.options.length > 0) {
            optionsHTML = `<div class="bill-item-options">${item.options.join(', ')}</div>`;
        }
        
        itemElement.innerHTML = `
            <div class="bill-item-details">
                <div class="bill-item-name">${item.name}</div>
                ${optionsHTML}
            </div>
            <div class="bill-item-quantity">${item.quantity}x</div>
            <div class="bill-item-price">$${item.price.toFixed(2)}</div>
            <div class="bill-item-subtotal">$${item.subtotal.toFixed(2)}</div>
        `;
        
        billItemsContainer.appendChild(itemElement);
    });
    
    // Set bill totals
    document.getElementById('billSubtotal').textContent = `$${billDetails.subtotal.toFixed(2)}`;
    document.getElementById('billTax').textContent = `$${billDetails.tax.toFixed(2)}`;
    document.getElementById('billTotal').textContent = `$${billDetails.total.toFixed(2)}`;
    
    // Reset payment method buttons
    const paymentMethodBtns = document.querySelectorAll('#billModal .payment-method-btn');
    paymentMethodBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.method === billDetails.paymentMethod) {
            btn.classList.add('active');
        }
    });
    
    // Reset customer name and notes
    document.getElementById('customerName').value = billDetails.customerName || '';
    document.getElementById('billNotes').value = billDetails.notes || '';
}

// Print bill
function printBill() {
    if (!currentBillDetails) return;
    
    // In a real app, this would open a print dialog with a formatted receipt
    // For this demo, we'll create a printable div and use window.print()
    
    // Create print container
    const printContainer = document.createElement('div');
    printContainer.className = 'bill-print-container';
    
    // Add restaurant info
    printContainer.innerHTML = `
        <div class="print-header">
            <h1>TenVerse Restaurant</h1>
            <p>123 Main Street, Anytown, USA</p>
            <p>Tel: (123) 456-7890</p>
            <p>Email: info@tenverse.com</p>
        </div>
        <div class="print-bill-info">
            <p><strong>Bill #:</strong> ${currentBillDetails.id}</p>
            <p><strong>Date:</strong> ${currentBillDetails.date}</p>
            <p><strong>Time:</strong> ${currentBillDetails.time}</p>
            <p><strong>Table:</strong> ${currentBillDetails.tableNumber}</p>
            ${currentBillDetails.customerName ? `<p><strong>Customer:</strong> ${currentBillDetails.customerName}</p>` : ''}
        </div>
        <div class="print-bill-items">
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Add items
    currentBillDetails.items.forEach(item => {
        printContainer.querySelector('tbody').innerHTML += `
            <tr>
                <td>
                    ${item.name}
                    ${item.options && item.options.length > 0 ? `<br><small>${item.options.join(', ')}</small>` : ''}
                </td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${item.subtotal.toFixed(2)}</td>
            </tr>
        `;
    });
    
    // Add totals
    printContainer.innerHTML += `
                </tbody>
            </table>
        </div>
        <div class="print-bill-totals">
            <div class="total-row"><span>Subtotal:</span><span>$${currentBillDetails.subtotal.toFixed(2)}</span></div>
            <div class="total-row"><span>Tax (10%):</span><span>$${currentBillDetails.tax.toFixed(2)}</span></div>
            <div class="total-row grand-total"><span>Total:</span><span>$${currentBillDetails.total.toFixed(2)}</span></div>
        </div>
        <div class="print-payment-info">
            <p><strong>Payment Method:</strong> ${capitalizeFirstLetter(currentBillDetails.paymentMethod)}</p>
        </div>
        <div class="print-footer">
            <p>Thank you for dining with us!</p>
            <p>GST/Tax No: 123456789</p>
        </div>
    `;
    
    // Add to document, print, then remove
    document.body.appendChild(printContainer);
    
    // In a real app, we would use window.print() here
    // For this demo, we'll just show a toast
    document.body.removeChild(printContainer);
    showToast('Bill printed successfully', 'success');
    
    // Update bill status to indicate it was printed
    currentBillDetails.printed = true;
    
    // Enable mark as paid button if bill was printed
    document.getElementById('markAsPaidBtn').disabled = false;
}

// Print KOT (Kitchen Order Ticket)
function printKOT(billDetails) {
    // In a real app, this would print a kitchen order ticket
    // For this demo, we'll just show a toast
    showToast('KOT reprinted successfully', 'success');
}

// Complete bill
function completeBill(billDetails) {
    // Update bill status
    billDetails.status = 'completed';
    billDetails.completedAt = new Date().getTime();
    
    // Save bill to local storage
    saveBillToLocalStorage(billDetails);
    
    // Update orders status
    updateOrdersStatus(billDetails.orders, 'completed');
    
    // Update table status
    updateTableStatus(billDetails.tableNumber, 'available');
    
    // Close modal
    document.getElementById('billModal').style.display = 'none';
    
    // Show success message
    showToast('Payment completed successfully', 'success');
    
    // Reset current bill details
    currentBillDetails = null;
}

// Save bill to local storage
function saveBillToLocalStorage(billDetails) {
    // Add bill to current table bills
    if (!currentTableBills[billDetails.tableNumber]) {
        currentTableBills[billDetails.tableNumber] = [];
    }
    
    currentTableBills[billDetails.tableNumber].push(billDetails);
    
    // Save to local storage
    localStorage.setItem('tenverse_bills', JSON.stringify(currentTableBills));
    
    // Also save to bills history
    let billsHistory = [];
    const savedBillsHistory = localStorage.getItem('tenverse_bills_history');
    
    if (savedBillsHistory) {
        billsHistory = JSON.parse(savedBillsHistory);
    }
    
    billsHistory.unshift(billDetails);
    
    // Limit history to 100 bills
    if (billsHistory.length > 100) {
        billsHistory = billsHistory.slice(0, 100);
    }
    
    localStorage.setItem('tenverse_bills_history', JSON.stringify(billsHistory));
}

// Update orders status
function updateOrdersStatus(orderIds, status) {
    // Get all orders
    const allOrders = getAllOrders();
    
    // Update status for matching orders
    const updatedOrders = allOrders.map(order => {
        if (orderIds.includes(order.id)) {
            return { ...order, status: status };
        }
        return order;
    });
    
    // Save updated orders
    localStorage.setItem('tenverse_orders', JSON.stringify(updatedOrders));
    
    // Notify orders dashboard if available
    if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('tenverse_orders_updated'));
    }
}

// Update table status
function updateTableStatus(tableNumber, status) {
    // Get tables data
    let tables = [];
    const savedTables = localStorage.getItem('tenverse_tables');
    
    if (savedTables) {
        tables = JSON.parse(savedTables);
    }
    
    // Update status for matching table
    const updatedTables = tables.map(table => {
        if (table.number === tableNumber) {
            return { ...table, status: status };
        }
        return table;
    });
    
    // Save updated tables
    localStorage.setItem('tenverse_tables', JSON.stringify(updatedTables));
    
    // Notify POS system if available
    if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('tenverse_tables_updated'));
    }
}

// Show toast message
function showToast(message, type = '') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
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