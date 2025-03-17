"use strict";
import { Contact } from "./contact.js";
import { LoadHeader } from "./header.js";
import { Router } from "./router.js";
import { LoadFooter } from "./footer.js";
import { AuthGuard } from "./authguard.js";
const pageTitles = {
    "/": "Home",
    "/home": "Home",
    "/about": "About",
    "/products": "Products",
    "/services": "Services",
    "/contact": "Contact Us",
    "/contact-list": "Contact Lists",
    "/edit": "Edit Contact",
    "/login": "Login Page",
    "/register": "Register Page",
    "/404": "404 Page Not Found"
};
const routes = {
    "/": "views/pages/home.html",
    "/home": "views/pages/home.html",
    "/about": "views/pages/about.html",
    "/products": "views/pages/products.html",
    "/services": "views/pages/services.html",
    "/contact": "views/pages/contact.html",
    "/contact-list": "views/pages/contact-list.html",
    "/edit": "views/pages/edit.html",
    "/login": "views/pages/login.html",
    "/register": "views/pages/register.html",
    "/404": "views/pages/404.html"
};
const router = new Router(routes);
//IIFE - Immediately Invoked Functional  Expression
(function () {
    function DisplayLoginPage() {
        console.log("[INFO] DisplayLoginPage called...");
        if (sessionStorage.getItem("user")) {
            router.navigate("/contact-list");
            return;
        }
        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("loginButton");
        const cancelButton = document.getElementById("cancelButton");
        const loginForm = document.getElementById("loginForm");
        if (!loginButton) {
            console.error("[ERROR] Unable to login button not found");
            return;
        }
        loginButton.addEventListener("click", async (event) => {
            // prevent default form submission
            event.preventDefault();
            // retrieve passed in form parameters
            const userName = document.getElementById("userName").value.trim();
            const password = document.getElementById("password").value.trim();
            try {
                // the await keyword tells Javascript to pause here (thread) until the fetch request complete
                const response = await fetch("data/users.json");
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                const jsonData = await response.json();
                console.log("[DEBUG] Fetched JSON Data:", jsonData);
                const users = jsonData.users;
                if (!Array.isArray(users)) {
                    throw new Error("[ERROR] JSON data does not contain a valid array");
                }
                let success = false;
                let authenticatedUser = null;
                for (const user of users) {
                    if (user.Username === userName && user.Password === password) {
                        success = true;
                        authenticatedUser = user;
                        break;
                    }
                }
                if (success) {
                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName: authenticatedUser.DisplayName,
                        EmailAddress: authenticatedUser.EmailAddress,
                        UserName: authenticatedUser.UserName,
                    }));
                    if (messageArea) {
                        messageArea.classList.remove("alert", "alert-danger");
                        messageArea.style.display = "none";
                    }
                    LoadHeader().then(() => {
                        router.navigate("/contact-list");
                    });
                }
                else {
                    if (messageArea) {
                        messageArea.classList.add("alert", "alert-danger");
                        messageArea.textContent = "Invalid username or password. Please try again.";
                        messageArea.style.display = "block";
                    }
                    document.getElementById("userName").focus();
                    document.getElementById("userName").select();
                }
            }
            catch (error) {
                console.error("[ERROR] Login failed", error);
            }
        });
        // handle cancel event
        if (cancelButton) {
            cancelButton.addEventListener("click", (event) => {
                loginForm.reset();
                router.navigate("/");
            });
        }
        else {
            console.warn("[WARNING] cancelButton not found");
        }
    }
    function DisplayRegisterPage() {
        console.log("[INFO] DisplayRegisterPage called...");
    }
    /**
     * Redirect the user back to contact-list.html
     */
    function handleCancelClick() {
        //location.href="contact-list.html";
        router.navigate("/contact-list");
    }
    /**
     * Handle the process of editing an existing contact
     * @param event
     * @param contact
     * @param page
     */
    function handleEditClick(event, contact, page) {
        event.preventDefault();
        if (!validateForm()) {
            alert("Invalid data! Please check your inputs");
            return;
        }
        // read in form field
        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;
        // Update the contact information
        contact.fullName = fullName;
        contact.contactNumber = contactNumber;
        contact.emailAddress = emailAddress;
        localStorage.setItem(page, contact.serialize());
        //redirect
        router.navigate("/contact-list");
    }
    /**
     * Handles the process of adding a new contact
     * @param event - the event object to prevent default form submission
     */
    function handleAddClick(event) {
        // prevent form default form submission
        event.preventDefault();
        if (!validateForm()) {
            alert("Form contains errors. Please correct them before submitting");
            return;
        }
        // read in form fields
        const fullName = document.getElementById("fullName").value;
        const contactNumber = document.getElementById("contactNumber").value;
        const emailAddress = document.getElementById("emailAddress").value;
        // Create and save new contact
        AddContact(fullName, contactNumber, emailAddress);
        // redirect to contact list
        router.navigate("/contact-list");
    }
    function addEventListenerOnce(elementId, event, handler) {
        // retrieve the element from the DOM
        const element = document.getElementById(elementId);
        if (element) {
            element.removeEventListener(event, handler);
            element.addEventListener(event, handler);
        }
        else {
            console.warn(`[WARN] Element with ID '${elementId}' not found`);
        }
    }
    /**
     * Validate the entire form by checking the validity of each input field
     * @return {boolean} - return ture if all fields pass validation, false otherwise
     */
    function validateForm() {
        return (validateInput("fullName") &&
            validateInput("contactNumber") &&
            validateInput("emailAddress"));
    }
    /**
     * Validates on input field based on predefined validation rules
     * @param fieldId
     * @returns {boolean}
     */
    function validateInput(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(`${fieldId}-error`);
        const rule = VALIDATION_RULES[fieldId];
        if (!field || !errorElement || !rule) {
            console.warn(`[WARN] Validation rule not found for ${fieldId}`);
            return false;
        }
        // Test for empty input
        if (field.value.trim() === "") {
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;
        }
        // check if the input fails match to the
        if (!rule.regex.test(field.value)) {
            errorElement.textContent = rule.errorMessage;
            errorElement.style.display = "block";
            return false;
        }
        errorElement.textContent = "";
        errorElement.style.display = "none";
        return true;
    }
    function attachValidationListeners() {
        console.log("[INFO] attach Validation Listeners");
        Object.keys(VALIDATION_RULES).forEach((fieldId) => {
            const field = document.getElementById(fieldId);
            if (!fieldId) {
                console.warn(`[Warning] Field  '${fieldId}' not found. skipping listener attachment`);
                return;
            }
            addEventListenerOnce(fieldId, "input", () => validateInput(fieldId));
        });
    }
    /**
     * Centralized validation rules for form input fields
     * @type {{fullName: {regex: RegExp, errorMessage: string}, contactNumber:
     * {regex: RegExp, errorMessage: string}, emailAddress: {regex: RegExp, errorMessage: string}}}
     */
    const VALIDATION_RULES = {
        fullName: {
            regex: /^[A-Za-z\s]+$/, // allows for only letters and spaces
            errorMessage: "Full Name must be contain only letters and spaces"
        },
        contactNumber: {
            regex: /^\d{3}-\d{3}-\d{4}$/,
            errorMessage: "Contact Number must be a number in the format XXX-XXX-XXXX"
        },
        emailAddress: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessage: "Email address must be a valid email address"
        }
    };
    function AddContact(fullName, contactNumber, emailAddress) {
        console.log("[DEBUG] AddContact() triggered...");
        if (!validateForm()) {
            alert("Form contains errors. please correct your input before submitting ");
            return;
        }
        let contact = new Contact(fullName, contactNumber, emailAddress);
        const serializedContact = contact.serialize();
        if (serializedContact) {
            // the primary key for a contact --> contact_ + date and time
            let key = `contact_${Date.now()}`;
            localStorage.setItem(key, serializedContact);
        }
        else {
            console.error(`[ERROR] contact serialize failed`);
        }
        //redirects the user after successful submitting
        router.navigate("/contact-list");
    }
    function DisplayEditPage() {
        console.log("DisplayEditPage() called...");
        // Extract contact id from the path
        //const page = location.hash.split("#")[2];
        const hashParts = location.hash.split("#");
        const page = hashParts.length > 2 ? hashParts[2] : "";
        const editButton = document.getElementById("editButton");
        const pageTitle = document.querySelector("main > h1");
        if (!pageTitle) {
            console.error("[ERROR] main title element not found");
            return;
        }
        if (page === "add") {
            //document.title = "Add Contact";
            pageTitle.textContent = "Add Contact";
            if (editButton) {
                editButton.innerHTML = `<i class="fas fa-plus-circle fa-sm"></i> Add`;
                editButton.classList.remove("btn-primary");
                editButton.classList.add("btn-success");
            }
            addEventListenerOnce("editButton", "click", handleAddClick);
            addEventListenerOnce("cancelButton", "click", handleCancelClick);
        }
        else {
            if (!pageTitle) {
                console.error("[ERROR] main title element not found");
                return;
            }
            const contactData = localStorage.getItem(page);
            if (!contactData) {
                console.warn("[WARNING} No contact ");
                return;
            }
            const contact = new Contact();
            contact.deserialize(contactData);
            document.getElementById("fullName").value = contact.fullName;
            document.getElementById("contactNumber").value = contact.contactNumber;
            document.getElementById("emailAddress").value = contact.emailAddress;
            if (editButton) {
                editButton.innerHTML = ` <i class="fa-solid fa-pen-to-square"></i> Edit`;
                editButton.classList.remove("btn-success");
                editButton.classList.add("btn-primary");
            }
            // attach event listeners for edit and cancel buttons
            addEventListenerOnce("editButton", "click", (event) => handleEditClick(event, contact, page));
            addEventListenerOnce("cancelButton", "click", handleCancelClick);
        }
    }
    function DisplayWeather() {
        const apiKey = "e196011fc611a5ce31c5f2f583706ca9";
        const city = "Oshawa";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metrics`;
        fetch(url)
            .then(response => {
            if (!response.ok)
                throw new Error("Failed to fetch weather data");
            return response.json();
        })
            .then((data) => {
            const weatherElement = document.getElementById("weather-data");
            if (weatherElement) {
                weatherElement.innerHTML = `<strong>City: </strong> ${data.name} <br>
                                           <strong>Temperature: </strong> ${data.main.temp} <br>
                                            <strong>Weather: </strong> ${data.weather[0].description};`;
            }
            else {
                console.warn("[WARN] Element with Id 'weather-data' not found");
            }
        })
            .catch(error => {
            console.error("Error attempting to fetch data", error);
            const weatherElement = document.getElementById("weather-data");
            if (weatherElement) {
                weatherElement.textContent = "Unable to fetch weather data";
            }
        });
    }
    function DisplayContactListPage() {
        console.log("Called DisplayContactListPage");
        const contactList = document.getElementById("contactList");
        if (!contactList) {
            console.warn("[WARNING] Element with ID 'contactList' not found");
            return;
        }
        let data = "";
        let keys = Object.keys(localStorage);
        let index = 1;
        keys.forEach((key) => {
            if (key.startsWith("contact_")) {
                const contactData = localStorage.getItem(key);
                if (!contactData) {
                    console.warn(`[WARNING] No data found for key: ${key}. Skipping...`);
                    return;
                }
                try {
                    let contact = new Contact();
                    contact.deserialize(contactData);
                    data += `<tr>
                                 <th scope="row" class="text-center">${index}</th>
                                 <td>${contact.fullName}</td>
                                 <td>${contact.contactNumber}</td>
                                 <td>${contact.emailAddress}</td>
                                 <td class="text-center">
                                     <button value ="${key}" class="btn btn-warning btn-sm edit">
                                            <i class="fa-solid fa-pen-to-square"></i> Edit
                                     </button>
                                 </td>
                                 <td class="text-center">
                                    <button value ="${key}" class="btn btn-danger btn-sm delete">
                                            <i class="fa-solid fa-trash"></i> Delete
                                    </button>
                                 </td>
                                 </tr>`;
                    index++;
                }
                catch (error) {
                    console.error("[ERROR] Error deserializing contact data", error);
                }
            }
            else {
                console.warn(`Skipping non-contact (contact_) key: ${key}`);
            }
        });
        contactList.innerHTML = data;
        const addButton = document.getElementById("addButton");
        if (addButton) {
            addButton.addEventListener("click", () => {
                router.navigate("/edit#add");
            });
        }
        const deleteButtons = document.querySelectorAll("button.delete");
        deleteButtons.forEach((button) => {
            button.addEventListener("click", function () {
                const contactKey = this.value; // get the contact key from the button value
                console.log(`[DEBUG] Deleting contact ID: ${contactKey}`);
                if (!contactKey.startsWith("contact_")) {
                    console.error("[ERROR] Invalid contact key format: ", contactKey);
                    return;
                }
                if (confirm("Delete Contact, please confirm?")) {
                    localStorage.removeItem(this.value);
                    DisplayContactListPage();
                }
            });
        });
        const editButtons = document.querySelectorAll("button.edit");
        editButtons.forEach((button) => {
            button.addEventListener("click", function () {
                router.navigate(`/edit#${this.value}`);
            });
        });
    }
    function DisplayHomePage() {
        console.log("Calling DisplayHomePage()...");
        const AboutUsBtn = document.getElementById("AboutUsBtn");
        if (AboutUsBtn) {
            AboutUsBtn.addEventListener("click", () => {
                router.navigate("/about");
            });
        }
        DisplayWeather();
    }
    function DisplayAboutPage() {
        console.log("Calling AboutPage()...");
    }
    function DisplayProductsPage() {
        console.log("Calling ProductsPage()...");
    }
    function DisplayServicesPage() {
        console.log("Calling ServicesPage()...");
    }
    function DisplayContactPage() {
        console.log("Calling ContactsPage()...");
        let sendButton = document.getElementById("sendButton");
        let subscribeCheckbox = document.getElementById("subscribeCheckbox");
        let contactListButton = document.getElementById("showContactList");
        if (!sendButton) {
            console.warn("[WARNING] Element with ID 'sendButton' not found");
            return;
        }
        sendButton.addEventListener("click", function (event) {
            event.preventDefault();
            if (!validateForm()) {
                alert("Please fix your errors before submitting");
                return;
            }
            if (subscribeCheckbox && subscribeCheckbox.checked) {
                const fullName = document.getElementById("fullName").value;
                const contactNumber = document.getElementById("contactNumber").value;
                const emailAddress = document.getElementById("emailAddress").value;
                AddContact(fullName, contactNumber, emailAddress);
            }
            alert("Form submitted successfully");
        });
        if (contactListButton) {
            contactListButton.addEventListener("click", function (event) {
                event.preventDefault();
                router.navigate("/contact-list");
            });
        }
    }
    /**
     * Listen for changes and update the navigation links
     */
    document.addEventListener("routeLoaded", (event) => {
        if (!(event instanceof CustomEvent) || typeof event.detail !== "string") {
            console.warn("[WARNING] Received an invalid 'routeLoaded' event");
            return;
        }
        const newPath = event.detail;
        console.log(`[INFO] Route Loaded: ${newPath}`);
        LoadHeader().then(() => {
            handlePageLogic(newPath);
        });
    });
    /**
     * Session Expires, redirect the user to the login page.
     */
    window.addEventListener("sessionExpired", () => {
        console.warn("[SESSION] Redirecting to login page due to inactivity");
    });
    function handlePageLogic(path) {
        //Update page title
        document.title = pageTitles[path] || "Untitled Page";
        // Check Authentication level for protected pages
        const protectedRoutes = ["/contact-list", "/edit"];
        if (protectedRoutes.includes(path)) {
            AuthGuard(); //redirect user to login page
        }
        switch (path) {
            case "/":
            case "/home":
                DisplayHomePage();
                break;
            case "/about":
                DisplayAboutPage();
                break;
            case "/contact":
                DisplayContactPage();
                attachValidationListeners();
                break;
            case "/products":
                DisplayProductsPage();
                break;
            case "/services":
                DisplayServicesPage();
                break;
            case "/contact-list":
                DisplayContactListPage();
                break;
            case "/edit":
                DisplayEditPage();
                attachValidationListeners();
                break;
            case "/login":
                DisplayLoginPage();
                break;
            case "/register":
                DisplayRegisterPage();
                break;
            default:
                console.warn(`[WARN] No display logic found for: ${path}`);
        }
    }
    async function Start() {
        console.log("Starting...");
        console.log(`Current document title: ${document.title}`);
        // Load header first, then run CheckLogin after
        await LoadHeader();
        await LoadFooter();
        AuthGuard();
        const currentPath = location.hash.slice(1) || "/";
        router.loadRoute(currentPath);
        handlePageLogic(currentPath);
    }
    window.addEventListener("DOMContentLoaded", () => {
        console.log("DOM fully loaded and parsed");
        Start();
    });
})();
//# sourceMappingURL=app.js.map