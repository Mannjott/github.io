"use strict";

// Contact Class
class Contact {
    /**
     * Constructor for the Contact class.
     * Initializes the contact properties with default or provided values.
     * @param {string} fullName - The full name of the contact.
     * @param {string} emailAddress - The email address of the contact.
     * @param {string} subject - The subject of the contact message.
     * @param {string} message - The message content from the contact.
     */

    constructor(fullName = "", emailAddress = "", subject= "", message = "") {
        this._fullName = fullName;
        this._emailAddress = emailAddress;
        this._subject = subject;
        this._message = message;
    }

    // Setter for fullName
    set fullName(name) {
        // Validate the name to ensure it's a non-empty string
        if (typeof name !== "string" || name.trim() === "") {
            throw new Error("Invalid Name: Must be a non-empty string");
        }
        this._fullName = name;
    }

    // Setter for emailAddress
    set emailAddress(email) {
        // Validate the email format using a regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email address: Must be a valid format");
        }
        this._emailAddress = email;
    }

    // Setter for subject
    set subject(sub) {
        // Ensure the subject is a non-empty string
        if (typeof sub !== "string" || sub.trim() === "") {
            throw new Error("Subject cannot be empty");
        }
        this._message = sub;
    }

    // Setter for message
    set message(msg) {
        // Ensure the message is a non-empty string
        if (typeof msg !== "string" || msg.trim() === "") {
            throw new Error("Invalid Message: Message cannot be empty");
        }
        this._message = msg;
    }

    /**
     * Converts the contact object to a string for display or debugging.
     * @returns {string} - A string representation of the contact object.
     */
    toString() {
        return `Full Name: ${this._fullName}, Email: ${this._emailAddress}, Subject: ${this._subject}, Message: ${this._message}`;
    }

    /**
     * Serializes the contact object into a comma-separated string.
     * Useful for storing or transmitting the contact data.
     * @returns {string|null} - The serialized string or null if data is invalid.
     */
    serialize() {
        if (!this._fullName || !this._emailAddress || !this._subject || !this._message) {
            console.error("One or more properties are missing or invalid");
            return null;
        }
        return `${this._fullName},${this._emailAddress},${this._subject}, ${this._message}`;
    }

    /**
     * Deserializes a comma-separated string into a contact object.
     * Useful for loading stored contact data.
     * @param {string} data - The serialized contact data string.
     */
    deserialize(data) {
        if (typeof data !== "string" || data.split(",").length !== 3) {
            console.error("Invalid data format");
            return;
        }
        const proArray = data.split(",");
        this._fullName = proArray[0];
        this._emailAddress = proArray[1];
        this._subject = proArray[2];
        this._message = proArray[3];
    }
}

const form = document.querySelector('form');
// Select the success message element from the DOM
const successMessage = document.getElementById('success-message');

// Initially hide the success message
successMessage.style.display = 'none';

// Add an event listener for form submission
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    // Show the "Thank You" message
    successMessage.textContent = 'Thank You for your submission!';
    successMessage.style.display = 'block';

    // Hide the "Thank You" message after 5 seconds and redirect
    setTimeout(() => {
        successMessage.style.display = 'none'; // Hide the "Thank You" message
        window.location.href = 'index.html'; // Redirect to the Home Page
    }, 5000); // 5000 milliseconds = 5 seconds

    // Optionally reset the form
    form.reset();
});

