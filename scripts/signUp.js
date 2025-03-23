"use strict";
class SignUp {
    _name;
    _emailAddress;
    _preferredRole;
    constructor(name = "", emailAddress = "", preferredRole = "") {
        this._name = name;
        this._emailAddress = emailAddress;
        this._preferredRole = preferredRole;
    }
    set name(name) {
        if (typeof name !== "string" || name.trim() === "") {
            throw new Error("Invalid Name: Must be a non-empty string");
        }
        this._name = name;
    }
    set emailAddress(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email address: Must be a valid format");
        }
        this._emailAddress = email;
    }
    set preferredRole(role) {
        const validRoles = ['Admin', 'User', 'Volunteer', 'Manager'];
        if (!role || !validRoles.includes(role)) {
            throw new Error("Invalid Role: Must be one of the predefined roles");
        }
        this._preferredRole = role;
    }
    toString() {
        return `Name: ${this._name}, Email: ${this._emailAddress}, Preferred Role: ${this._preferredRole}`;
    }
    serialize() {
        if (!this._name || !this._emailAddress || !this._preferredRole) {
            console.error("One or more properties are missing or invalid");
            return null;
        }
        return `${this._name},${this._emailAddress},${this._preferredRole}`;
    }
    deserialize(data) {
        if (typeof data !== "string" || data.split(",").length !== 3) {
            console.error("Invalid data format");
            return;
        }
        const proArray = data.split(",");
        this._name = proArray[0];
        this._emailAddress = proArray[1];
        this._preferredRole = proArray[2];
    }
}
function initializeSignupForm() {
    console.log('Initializing signup form...');
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) {
        console.error('Signup form not found in the DOM');
        return;
    }
    // Remove any existing event listeners to prevent duplicates
    const newForm = signupForm.cloneNode(true);
    signupForm.parentNode.replaceChild(newForm, signupForm);
    newForm.addEventListener('submit', function (e) {
        console.log('Form submit event triggered');
        e.preventDefault();
        const nameInput = this.querySelector('#name');
        const emailInput = this.querySelector('#email');
        const preferredRoleInput = this.querySelector('#preferredRole');
        if (!nameInput || !emailInput || !preferredRoleInput) {
            console.error('One or more form inputs not found');
            return;
        }
        try {
            const signup = new SignUp(nameInput.value, emailInput.value, preferredRoleInput.value);
            const serializedData = signup.serialize();
            if (serializedData) {
                console.log("Form submitted successfully. Serialized data:", serializedData);
                alert("Form submitted successfully!");
                // Close modal
                const modal = document.getElementById('signup-modal');
                const modalOverlay = document.getElementById('modal-overlay');
                if (modal && modalOverlay) {
                    modal.style.display = 'none';
                    modalOverlay.style.display = 'none';
                }
                this.reset();
            }
        }
        catch (error) {
            console.error('Error in form submission:', error.message);
            alert(error.message);
        }
    });
    console.log('Signup form initialized successfully');
}
function setupModalListeners() {
    document.addEventListener('click', function (event) {
        const target = event.target;
        if (target.classList.contains('signup-button')) {
            console.log('Signup button clicked');
            const modal = document.getElementById('signup-modal');
            const modalOverlay = document.getElementById('modal-overlay');
            if (modal && modalOverlay) {
                modal.style.display = 'block';
                modalOverlay.style.display = 'block';
                initializeSignupForm(); // Re-initialize form when modal opens
            }
        }
    });
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function () {
            const modal = document.getElementById('signup-modal');
            if (modal) {
                modal.style.display = 'none';
                this.style.display = 'none';
            }
        });
    }
}
function observeDOM() {
    console.log('Starting DOM observation...');
    const observer = new MutationObserver((mutations) => {
        if (document.getElementById('cards-container')) {
            console.log('Opportunities page detected');
            observer.disconnect();
            setupModalListeners();
            initializeSignupForm();
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
// Start observing the DOM for changes
observeDOM();
// Check immediately in case the opportunities page is already loaded
if (document.getElementById('cards-container')) {
    console.log('Opportunities page already loaded');
    setupModalListeners();
    initializeSignupForm();
}
console.log('Script execution completed');
//# sourceMappingURL=signUp.js.map