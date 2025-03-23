// Contact Class
export class Contact {
    _fullName;
    _subject;
    _message;
    _emailAddress;
    /**
     * Constructs a new contact instance
     * @param fullName
     * @param subject
     * @param message
     * @param emailAddress
     */
    constructor(fullName = "", emailAddress = "", subject = "", message = "") {
        this._fullName = fullName;
        this._emailAddress = emailAddress;
        this._subject = subject;
        this._message = message;
    }
    set fullName(name) {
        if (name.trim() === "") {
            throw new Error("Invalid Name: Must be a non-empty string");
        }
        this._fullName = name;
    }
    set emailAddress(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email address: Must be a valid format");
        }
        this._emailAddress = email;
    }
    set subject(sub) {
        if (sub.trim() === "") {
            throw new Error("Subject cannot be empty");
        }
        this._subject = sub;
    }
    set message(msg) {
        if (msg.trim() === "") {
            throw new Error("Invalid Message: Message cannot be empty");
        }
        this._message = msg;
    }
    toString() {
        return `Full Name: ${this._fullName}, Email: ${this._emailAddress}, Subject: ${this._subject}, Message: ${this._message}`;
    }
    serialize() {
        if (!this._fullName || !this._emailAddress || !this._subject || !this._message) {
            console.error("One or more properties are missing or invalid");
            return null;
        }
        return `${this._fullName},${this._emailAddress},${this._subject},${this._message}`;
    }
    deserialize(data) {
        if (data.split(",").length !== 4) {
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
// Function to wait for the contact form and initialize it
function waitForContactForm(retries = 20) {
    console.log("Checking if contact form is available...");
    const form = document.querySelector('form');
    const successMessage = document.getElementById('success-message');
    if (form && successMessage) {
        console.log("Contact form found! Initializing...");
        initializeContactForm();
    }
    else if (retries > 0) {
        console.log(`Retrying... (${retries} attempts left)`);
        setTimeout(() => waitForContactForm(retries - 1), 500); // Retry every 500ms
    }
    else {
        console.error("Contact form not found after multiple attempts.");
    }
}
// Function to initialize the contact form
export function initializeContactForm() {
    console.log("Attempting to initialize contact form...");
    const form = document.querySelector('form');
    const successMessage = document.getElementById('success-message');
    if (!form || !successMessage) {
        console.error("Form or success message not found in DOM");
        return;
    }
    console.log("Form and success message found, attaching event listener");
    // Remove any existing event listeners to prevent duplication
    form.removeEventListener('submit', handleSubmit);
    form.addEventListener('submit', handleSubmit);
}
// Function to handle form submission
function handleSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior
    console.log("Form submitted");
    const successMessage = document.getElementById('success-message');
    successMessage.style.display = 'block';
    successMessage.scrollIntoView({ behavior: 'smooth' });
    console.log("Success message should be visible now");
    // Hide the "Thank You" message after 3 seconds and then redirect
    setTimeout(() => {
        successMessage.style.display = 'none';
        console.log("Success message hidden");
        window.location.hash = '/'; // Redirect to home page
    }, 3000);
    // Reset the form fields
    event.target.reset();
}
// Function to check if we're on the contact page
function isContactPage() {
    console.log("Current hash:", window.location.hash);
    return window.location.hash.includes('/contact'); // Adjust this based on your routing logic
}
// Tie initialization to SPA route changes or DOM updates
window.addEventListener('hashchange', () => {
    console.log("Hash changed. Checking if contact page is loaded...");
    if (isContactPage()) {
        setTimeout(() => waitForContactForm(), 300); // Give time for SPA router to load content
    }
});
// Ensure it runs on page load as well
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded. Checking if contact page is active...");
    if (isContactPage()) {
        setTimeout(() => waitForContactForm(), 300);
    }
});
//# sourceMappingURL=contact.js.map