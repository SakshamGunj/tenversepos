// CONTINUATION: Staff deletion, roles, taxes, charges, rounding, modal, and utility functions

// Settings tab navigation logic for full-width layout
function setupSettingsTabs() {
    const navItems = document.querySelectorAll('.settings-nav-item');
    const tabs = document.querySelectorAll('.settings-tab');

    // If sidebar is hidden, make sure the first nav/tab is active
    let visibleNavItems = Array.from(navItems).filter(item => item.offsetParent !== null);
    if (visibleNavItems.length > 0 && !visibleNavItems.some(item => item.classList.contains('active'))) {
        visibleNavItems[0].classList.add('active');
        const firstTabId = visibleNavItems[0].dataset.tab;
        tabs.forEach(tab => {
            if (tab.id === firstTabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            const tabId = this.dataset.tab;
            tabs.forEach(tab => {
                if (tab.id === tabId) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupSettingsTabs();
});

// Delete staff
function deleteStaff(staffId) {
    if (confirm('Are you sure you want to delete this staff member?')) {
        staffMembers = staffMembers.filter(staff => staff.id !== staffId);
        localStorage.setItem('staffMembers', JSON.stringify(staffMembers));
        populateStaffList();
        showToast('Staff deleted successfully!', 'success');
    }
}

// Save staff and roles
function saveStaffAndRoles() {
    localStorage.setItem('staffMembers', JSON.stringify(staffMembers));
    localStorage.setItem('roles', JSON.stringify(roles));
    showToast('Staff and roles saved successfully!', 'success');
}

// Populate roles list
function populateRolesList() {
    const rolesList = document.getElementById('rolesList');
    rolesList.innerHTML = '';
    roles.forEach(role => {
        const roleItem = document.createElement('div');
        roleItem.className = 'role-item';
        const roleHeader = document.createElement('div');
        roleHeader.className = 'role-header';
        const roleName = document.createElement('div');
        roleName.className = 'role-name';
        roleName.textContent = role.name;
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'table-action-btn delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', function() {
            deleteRole(role.id);
        });
        roleHeader.appendChild(roleName);
        roleHeader.appendChild(deleteBtn);
        roleItem.appendChild(roleHeader);
        // Permissions
        const permsDiv = document.createElement('div');
        permsDiv.className = 'role-permissions';
        (role.permissions || []).forEach(perm => {
            const permDiv = document.createElement('div');
            permDiv.className = 'permission-item';
            permDiv.textContent = perm;
            permsDiv.appendChild(permDiv);
        });
        roleItem.appendChild(permsDiv);
        rolesList.appendChild(roleItem);
    });
}

function addNewRole() {
    const name = prompt('Enter role name:');
    if (!name) return;
    const perms = prompt('Enter permissions (comma separated):', 'manage_orders,process_payments');
    const permissions = perms ? perms.split(',').map(p => p.trim()) : [];
    const newId = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
    roles.push({ id: newId, name, permissions });
    localStorage.setItem('roles', JSON.stringify(roles));
    populateRolesList();
    showToast('Role added successfully!', 'success');
}

function deleteRole(roleId) {
    if (confirm('Are you sure you want to delete this role?')) {
        roles = roles.filter(role => role.id !== roleId);
        localStorage.setItem('roles', JSON.stringify(roles));
        populateRolesList();
        showToast('Role deleted successfully!', 'success');
    }
}

// Taxes & Charges Events
function setupTaxesChargesEvents() {
    document.getElementById('addTaxBtn').addEventListener('click', function() {
        showModal('addTaxModal');
    });
    document.getElementById('saveTaxesCharges').addEventListener('click', saveTaxesAndCharges);
    document.getElementById('confirmAddTax').addEventListener('click', addNewTax);
    document.getElementById('cancelAddTax').addEventListener('click', function() { hideModal('addTaxModal'); });
    document.getElementById('addChargeBtn').addEventListener('click', function() { showModal('addChargeModal'); });
    document.getElementById('confirmAddCharge').addEventListener('click', addNewCharge);
    document.getElementById('cancelAddCharge').addEventListener('click', function() { hideModal('addChargeModal'); });
    document.getElementById('enableTax').addEventListener('change', function() { saveTaxesAndCharges(); });
    document.getElementById('enableRounding').addEventListener('change', function() { saveRoundingSettings(); });
    document.getElementById('roundingRule').addEventListener('change', function() { saveRoundingSettings(); });
    document.getElementById('roundingValue').addEventListener('change', function() { saveRoundingSettings(); });
}

function populateTaxes() {
    const taxRates = document.getElementById('taxRates');
    taxRates.innerHTML = '';
    taxes.forEach(tax => {
        const taxItem = document.createElement('div');
        taxItem.className = 'tax-item';
        const taxInfo = document.createElement('div');
        taxInfo.className = 'tax-info';
        const taxName = document.createElement('div');
        taxName.className = 'tax-name';
        taxName.textContent = tax.name;
        const taxRate = document.createElement('div');
        taxRate.className = 'tax-rate';
        taxRate.textContent = `Rate: ${tax.rate}%`;
        taxInfo.appendChild(taxName);
        taxInfo.appendChild(taxRate);
        taxItem.appendChild(taxInfo);
        const taxActions = document.createElement('div');
        taxActions.className = 'tax-actions';
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'table-action-btn delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', function() { deleteTax(tax.id); });
        taxActions.appendChild(deleteBtn);
        taxItem.appendChild(taxActions);
        taxRates.appendChild(taxItem);
    });
}

function addNewTax() {
    const name = document.getElementById('taxName').value;
    const rate = parseFloat(document.getElementById('taxRate').value);
    const applyToAll = document.getElementById('taxApplyToAll').checked;
    if (!name || isNaN(rate)) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    const newId = taxes.length > 0 ? Math.max(...taxes.map(t => t.id)) + 1 : 1;
    taxes.push({ id: newId, name, rate, applyToAll });
    localStorage.setItem('taxes', JSON.stringify(taxes));
    populateTaxes();
    hideModal('addTaxModal');
    document.getElementById('taxName').value = '';
    document.getElementById('taxRate').value = '';
    showToast('Tax added successfully!', 'success');
}

function deleteTax(taxId) {
    if (confirm('Are you sure you want to delete this tax?')) {
        taxes = taxes.filter(tax => tax.id !== taxId);
        localStorage.setItem('taxes', JSON.stringify(taxes));
        populateTaxes();
        showToast('Tax deleted successfully!', 'success');
    }
}

function saveTaxesAndCharges() {
    localStorage.setItem('taxes', JSON.stringify(taxes));
    localStorage.setItem('charges', JSON.stringify(charges));
    showToast('Taxes and charges saved successfully!', 'success');
}

function populateCharges() {
    const chargesList = document.getElementById('chargesList');
    chargesList.innerHTML = '';
    charges.forEach(charge => {
        const chargeItem = document.createElement('div');
        chargeItem.className = 'charge-item';
        const chargeInfo = document.createElement('div');
        chargeInfo.className = 'charge-info';
        const chargeName = document.createElement('div');
        chargeName.className = 'charge-name';
        chargeName.textContent = charge.name;
        const chargeValue = document.createElement('div');
        chargeValue.className = 'charge-value';
        chargeValue.textContent = charge.type === 'percentage' ? `Value: ${charge.value}%` : `Value: ₹${charge.value}`;
        chargeInfo.appendChild(chargeName);
        chargeInfo.appendChild(chargeValue);
        chargeItem.appendChild(chargeInfo);
        const chargeActions = document.createElement('div');
        chargeActions.className = 'charge-actions';
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'table-action-btn delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.addEventListener('click', function() { deleteCharge(charge.id); });
        chargeActions.appendChild(deleteBtn);
        chargeItem.appendChild(chargeActions);
        chargesList.appendChild(chargeItem);
    });
}

function addNewCharge() {
    const name = document.getElementById('chargeName').value;
    const type = document.getElementById('chargeType').value;
    const value = parseFloat(document.getElementById('chargeValue').value);
    const applyToAll = document.getElementById('chargeApplyToAll').checked;
    if (!name || isNaN(value)) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    const newId = charges.length > 0 ? Math.max(...charges.map(c => c.id)) + 1 : 1;
    charges.push({ id: newId, name, type, value, applyToAll });
    localStorage.setItem('charges', JSON.stringify(charges));
    populateCharges();
    hideModal('addChargeModal');
    document.getElementById('chargeName').value = '';
    document.getElementById('chargeValue').value = '';
    showToast('Charge added successfully!', 'success');
}

function deleteCharge(chargeId) {
    if (confirm('Are you sure you want to delete this charge?')) {
        charges = charges.filter(charge => charge.id !== chargeId);
        localStorage.setItem('charges', JSON.stringify(charges));
        populateCharges();
        showToast('Charge deleted successfully!', 'success');
    }
}

function populateRoundingSettings() {
    document.getElementById('enableRounding').checked = roundingSettings.enabled;
    document.getElementById('roundingRule').value = roundingSettings.rule;
    document.getElementById('roundingValue').value = roundingSettings.value;
}

function saveRoundingSettings() {
    roundingSettings.enabled = document.getElementById('enableRounding').checked;
    roundingSettings.rule = document.getElementById('roundingRule').value;
    roundingSettings.value = document.getElementById('roundingValue').value;
    localStorage.setItem('roundingSettings', JSON.stringify(roundingSettings));
    showToast('Rounding settings saved!', 'success');
}

// Modal helpers
function showModal(id) {
    document.getElementById(id).style.display = 'block';
}
function hideModal(id) {
    document.getElementById(id).style.display = 'none';
}
function setupModalEvents() {
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            btn.closest('.modal').style.display = 'none';
        });
    });
    window.onclick = function(event) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    };
}

// Utility
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function showToast(message, type) {
    // Simple toast implementation
    let toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 2500);
}
