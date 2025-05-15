// Menu Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeTabNavigation();
    initializeModals();
    initializeMenuItemForm();
    initializeCategoryForm();
    initializeComboForm();
    initializeSettingsForm();
    initializeDataTables();
    
    // Set up event listeners for action buttons
    setupActionButtons();
});

// Tab Navigation
function initializeTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the corresponding tab pane
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId + '-tab').classList.add('active');
        });
    });
}

// Modals
function initializeModals() {
    // Menu Item Modal
    const menuItemModal = document.getElementById('menuItemModal');
    const addItemBtn = document.getElementById('addItemBtn');
    const closeItemModal = menuItemModal.querySelector('.close-modal');
    const cancelItemBtn = document.getElementById('cancelItemBtn');
    
    addItemBtn.addEventListener('click', function() {
        // Reset form and show modal
        document.getElementById('menuItemForm').reset();
        document.getElementById('menuItemModalTitle').textContent = 'Add Menu Item';
        document.getElementById('imagePreview').innerHTML = '';
        document.getElementById('variantsContainer').innerHTML = '';
        document.getElementById('addonsContainer').innerHTML = '';
        menuItemModal.style.display = 'flex';
    });
    
    closeItemModal.addEventListener('click', function() {
        menuItemModal.style.display = 'none';
    });
    
    cancelItemBtn.addEventListener('click', function() {
        menuItemModal.style.display = 'none';
    });
    
    // Category Modal
    const categoryModal = document.getElementById('categoryModal');
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    const closeCategoryModal = categoryModal.querySelector('.close-modal');
    const cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
    
    addCategoryBtn.addEventListener('click', function() {
        // Reset form and show modal
        document.getElementById('categoryForm').reset();
        document.getElementById('categoryModalTitle').textContent = 'Add Category';
        document.getElementById('iconPreview').innerHTML = '<i class="fas fa-utensils"></i>';
        categoryModal.style.display = 'flex';
    });
    
    closeCategoryModal.addEventListener('click', function() {
        categoryModal.style.display = 'none';
    });
    
    cancelCategoryBtn.addEventListener('click', function() {
        categoryModal.style.display = 'none';
    });
    
    // Combo Modal
    const comboModal = document.getElementById('comboModal');
    const createComboBtn = document.getElementById('createComboBtn');
    const closeComboModal = comboModal.querySelector('.close-modal');
    const cancelComboBtn = document.getElementById('cancelComboBtn');
    
    createComboBtn.addEventListener('click', function() {
        // Reset form and show modal
        document.getElementById('comboForm').reset();
        document.getElementById('comboModalTitle').textContent = 'Create Combo';
        document.getElementById('comboImagePreview').innerHTML = '';
        document.getElementById('comboItemsContainer').innerHTML = `
            <div class="combo-placeholder">
                <p>No items added to this combo yet. Use the button below to add items.</p>
            </div>
        `;
        comboModal.style.display = 'flex';
    });
    
    closeComboModal.addEventListener('click', function() {
        comboModal.style.display = 'none';
    });
    
    cancelComboBtn.addEventListener('click', function() {
        comboModal.style.display = 'none';
    });
    
    // Close modals when clicking outside content
    window.addEventListener('click', function(event) {
        if (event.target === menuItemModal) {
            menuItemModal.style.display = 'none';
        }
        if (event.target === categoryModal) {
            categoryModal.style.display = 'none';
        }
        if (event.target === comboModal) {
            comboModal.style.display = 'none';
        }
    });
}

// Menu Item Form
function initializeMenuItemForm() {
    const menuItemForm = document.getElementById('menuItemForm');
    const itemImageInput = document.getElementById('itemImage');
    const imagePreview = document.getElementById('imagePreview');
    const addVariantGroupBtn = document.getElementById('addVariantGroup');
    const addAddonGroupBtn = document.getElementById('addAddonGroup');
    const variantsContainer = document.getElementById('variantsContainer');
    const addonsContainer = document.getElementById('addonsContainer');
    
    // Item image preview
    itemImageInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            
            reader.readAsDataURL(this.files[0]);
        }
    });
    
    // Add variant group
    addVariantGroupBtn.addEventListener('click', function() {
        const groupId = 'variant-' + Date.now();
        const variantGroup = document.createElement('div');
        variantGroup.className = 'variant-group';
        variantGroup.id = groupId;
        variantGroup.innerHTML = `
            <div class="group-header">
                <div class="group-title">
                    <input type="text" placeholder="Variant Group Name (e.g., Size)" required>
                </div>
                <div class="group-actions">
                    <button type="button" class="remove-group" data-group="${groupId}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="option-items"></div>
            <div class="add-option">
                <input type="text" placeholder="Option name (e.g., Small)">
                <input type="number" placeholder="Price adjustment" min="0" step="0.01">
                <button type="button" class="add-option-btn" data-group="${groupId}">
                    <i class="fas fa-plus"></i> Add
                </button>
            </div>
        `;
        
        variantsContainer.appendChild(variantGroup);
        
        // Add option button event
        const addOptionBtn = variantGroup.querySelector('.add-option-btn');
        addOptionBtn.addEventListener('click', function() {
            addVariantOption(this.getAttribute('data-group'));
        });
        
        // Remove group button event
        const removeGroupBtn = variantGroup.querySelector('.remove-group');
        removeGroupBtn.addEventListener('click', function() {
            document.getElementById(this.getAttribute('data-group')).remove();
        });
    });
    
    // Add addon group
    addAddonGroupBtn.addEventListener('click', function() {
        const groupId = 'addon-' + Date.now();
        const addonGroup = document.createElement('div');
        addonGroup.className = 'addon-group';
        addonGroup.id = groupId;
        addonGroup.innerHTML = `
            <div class="group-header">
                <div class="group-title">
                    <input type="text" placeholder="Add-on Group Name (e.g., Extra Toppings)" required>
                </div>
                <div class="group-actions">
                    <button type="button" class="remove-group" data-group="${groupId}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="option-items"></div>
            <div class="add-option">
                <input type="text" placeholder="Add-on name (e.g., Cheese)">
                <input type="number" placeholder="Price" min="0" step="0.01">
                <button type="button" class="add-option-btn" data-group="${groupId}">
                    <i class="fas fa-plus"></i> Add
                </button>
            </div>
        `;
        
        addonsContainer.appendChild(addonGroup);
        
        // Add option button event
        const addOptionBtn = addonGroup.querySelector('.add-option-btn');
        addOptionBtn.addEventListener('click', function() {
            addAddonOption(this.getAttribute('data-group'));
        });
        
        // Remove group button event
        const removeGroupBtn = addonGroup.querySelector('.remove-group');
        removeGroupBtn.addEventListener('click', function() {
            document.getElementById(this.getAttribute('data-group')).remove();
        });
    });
    
    // Form submission
    menuItemForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Here, you would collect all form data including variants and add-ons
        // Then send it to the server or store it locally
        
        // For demo, just show an alert and close the modal
        alert('Menu item saved successfully!');
        document.getElementById('menuItemModal').style.display = 'none';
    });
}

// Add variant option
function addVariantOption(groupId) {
    const group = document.getElementById(groupId);
    const inputs = group.querySelectorAll('.add-option input');
    const optionName = inputs[0].value.trim();
    const priceAdjustment = parseFloat(inputs[1].value) || 0;
    
    if (optionName) {
        const optionItems = group.querySelector('.option-items');
        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        optionItem.innerHTML = `
            <div class="option-name">${optionName}</div>
            <div class="option-price">${priceAdjustment > 0 ? '+$' + priceAdjustment.toFixed(2) : 'No adjustment'}</div>
            <div class="option-actions">
                <button type="button" class="remove-option">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        optionItems.appendChild(optionItem);
        
        // Clear input fields
        inputs[0].value = '';
        inputs[1].value = '';
        
        // Remove option event
        const removeBtn = optionItem.querySelector('.remove-option');
        removeBtn.addEventListener('click', function() {
            optionItem.remove();
        });
    }
}

// Add addon option
function addAddonOption(groupId) {
    const group = document.getElementById(groupId);
    const inputs = group.querySelectorAll('.add-option input');
    const optionName = inputs[0].value.trim();
    const price = parseFloat(inputs[1].value) || 0;
    
    if (optionName) {
        const optionItems = group.querySelector('.option-items');
        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        optionItem.innerHTML = `
            <div class="option-name">${optionName}</div>
            <div class="option-price">$${price.toFixed(2)}</div>
            <div class="option-actions">
                <button type="button" class="remove-option">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        optionItems.appendChild(optionItem);
        
        // Clear input fields
        inputs[0].value = '';
        inputs[1].value = '';
        
        // Remove option event
        const removeBtn = optionItem.querySelector('.remove-option');
        removeBtn.addEventListener('click', function() {
            optionItem.remove();
        });
    }
}

// Category Form
function initializeCategoryForm() {
    const categoryForm = document.getElementById('categoryForm');
    const categoryIcon = document.getElementById('categoryIcon');
    const iconPreview = document.getElementById('iconPreview');
    
    // Icon preview update
    categoryIcon.addEventListener('input', function() {
        const iconValue = this.value.trim();
        
        // Check if input is a FontAwesome class or an image URL
        if (iconValue.startsWith('fa-')) {
            iconPreview.innerHTML = `<i class="fas ${iconValue}"></i>`;
        } else if (iconValue.match(/\.(jpeg|jpg|gif|png)$/i)) {
            iconPreview.innerHTML = `<img src="${iconValue}" alt="Icon">`;
        } else if (iconValue.startsWith('http')) {
            iconPreview.innerHTML = `<img src="${iconValue}" alt="Icon">`;
        } else {
            iconPreview.innerHTML = `<i class="fas fa-utensils"></i>`;
        }
    });
    
    // Form submission
    categoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // For demo, just show an alert and close the modal
        alert('Category saved successfully!');
        document.getElementById('categoryModal').style.display = 'none';
    });
}

// Combo Form
function initializeComboForm() {
    const comboForm = document.getElementById('comboForm');
    const comboImage = document.getElementById('comboImage');
    const comboImagePreview = document.getElementById('comboImagePreview');
    const timeBoundCheck = document.getElementById('timeBound');
    const timeBoundOptions = document.querySelector('.time-bound-options');
    const addComboItemBtn = document.getElementById('addComboItem');
    const comboItemsContainer = document.getElementById('comboItemsContainer');
    
    // Image preview
    comboImage.addEventListener('input', function() {
        const imageUrl = this.value.trim();
        
        if (imageUrl && imageUrl.match(/\.(jpeg|jpg|gif|png)$/i) || imageUrl.startsWith('http')) {
            comboImagePreview.innerHTML = `<img src="${imageUrl}" alt="Combo">`;
        } else {
            comboImagePreview.innerHTML = '';
        }
    });
    
    // Time-bound toggle
    timeBoundCheck.addEventListener('change', function() {
        if (this.checked) {
            timeBoundOptions.style.display = 'block';
        } else {
            timeBoundOptions.style.display = 'none';
        }
    });
    
    // Add combo item (mock implementation)
    addComboItemBtn.addEventListener('click', function() {
        // In a real app, you would show a product selector
        // For demo, we'll add a mock item
        
        // Remove placeholder if it exists
        const placeholder = comboItemsContainer.querySelector('.combo-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
        
        // Add sample combo item
        const comboItem = document.createElement('div');
        comboItem.className = 'combo-item';
        comboItem.innerHTML = `
            <div class="combo-item-details">
                <img src="assets/products/coffee.jpg" alt="Cappuccino" class="combo-item-img">
                <div class="combo-item-info">
                    <div class="combo-item-name">Cappuccino</div>
                    <div class="combo-item-category">Beverages</div>
                </div>
            </div>
            <div class="combo-item-price">$4.50</div>
            <div class="option-actions">
                <button type="button" class="remove-option">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        comboItemsContainer.appendChild(comboItem);
        
        // Remove option event
        const removeBtn = comboItem.querySelector('.remove-option');
        removeBtn.addEventListener('click', function() {
            comboItem.remove();
            
            // If no items, show placeholder
            if (comboItemsContainer.children.length === 0) {
                comboItemsContainer.innerHTML = `
                    <div class="combo-placeholder">
                        <p>No items added to this combo yet. Use the button below to add items.</p>
                    </div>
                `;
            }
        });
    });
    
    // Form submission
    comboForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // For demo, just show an alert and close the modal
        alert('Combo saved successfully!');
        document.getElementById('comboModal').style.display = 'none';
    });
}

// Settings Form
function initializeSettingsForm() {
    const settingsForm = document.getElementById('menuSettingsForm');
    const showCostPrice = document.getElementById('showCostPrice');
    
    // Show/hide cost price column based on checkbox
    showCostPrice.addEventListener('change', function() {
        const costPriceColumn = document.querySelectorAll('.data-table th:nth-child(5), .data-table td:nth-child(5)');
        
        costPriceColumn.forEach(cell => {
            cell.style.display = this.checked ? 'table-cell' : 'none';
        });
    });
    
    // Form submission
    settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // For demo, just show an alert
        alert('Settings saved successfully!');
    });
}

// Data Tables
function initializeDataTables() {
    // For a real application, you would implement:
    // - Pagination
    // - Sorting
    // - Filtering
    // - CRUD operations
    
    // For this demo, we'll just initialize event listeners for table actions
    const editButtons = document.querySelectorAll('.action-icon.edit');
    const deleteButtons = document.querySelectorAll('.action-icon.delete');
    const toggleButtons = document.querySelectorAll('.action-icon.toggle');
    const viewButtons = document.querySelectorAll('.action-icon.view');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real app, you would load data for editing
            // For demo, just show a message
            alert('Edit functionality to be implemented');
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this item?')) {
                // In a real app, you would delete the item
                alert('Delete functionality to be implemented');
            }
        });
    });
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real app, you would toggle item availability
            alert('Toggle availability functionality to be implemented');
        });
    });
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real app, you would show item details
            alert('View details functionality to be implemented');
        });
    });
}

// Setup Action Buttons
function setupActionButtons() {
    // Bulk Import Button (placeholder functionality)
    const bulkImportBtn = document.getElementById('bulkImportBtn');
    
    bulkImportBtn.addEventListener('click', function() {
        alert('Bulk import functionality to be implemented');
    });
} 