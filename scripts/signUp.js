"use strict";

class SignUp {

    constructor(name = "", emailAddress = "", preferredRole = "") {
        this._name = name;
        this._emailAddress = emailAddress;
        this._preferredRole = preferredRole;
    }

    // Name validation (similar to fullName in Contact)
    set name(name) {
        if (typeof name !== "string" || name.trim() === "") {
            throw new Error("Invalid Name: Must be a non-empty string");
        }
        this._name = name;
    }

    // Email validation (similar to Contact's email validation)
    set emailAddress(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // email format validation
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email address: Must be a valid format");
        }
        this._emailAddress = email;
    }

    // Preferred role validation (checks if it's a non-empty string or one of the predefined roles)
    set preferredRole(role) {
        const validRoles = ['Admin', 'User', 'Volunteer', 'Manager'];  // Example roles
        if (!role || !validRoles.includes(role)) {
            throw new Error("Invalid Role: Must be one of the predefined roles");
        }
        this._preferredRole = role;
    }

    // ToString method
    toString() {
        return `Name: ${this._name}, Email: ${this._emailAddress}, Preferred Role: ${this._preferredRole}`;
    }

    // Serialize data for storage
    serialize() {
        if (!this._name || !this._emailAddress || !this._preferredRole) {
            console.error("One or more properties are missing or invalid");
            return null;
        }
        return `${this._name},${this._emailAddress},${this._preferredRole}`;
    }

    // Deserialize data and update properties
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


// Event listener for SignUp form submission
document.addEventListener('DOMContentLoaded', () => {
    // Handle SignUp Form Submission
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();  // Prevent form from reloading the page

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const preferredRole = document.getElementById('preferredRole').value;

        try {
            const signup = new SignUp(name, email, preferredRole);
            const serializedData = signup.serialize();

            if (serializedData) {
                alert("Form submitted successfully!");

                const modal = document.getElementById('signup-modal');
                const modalOverlay = document.getElementById('modal-overlay');
                modal.classList.remove('active');
                modalOverlay.classList.remove('active');
            }
        } catch (error) {
            alert(error.message);
        }
    });
});