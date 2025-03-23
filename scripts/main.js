/* Name: Manjot kaur and Subhana Hashimi
   Student ID: 100951033, 100949958
   Date: 2025-02-23
*/
import { CheckLogin, LoadHeader, updateActiveNewLink } from "./header.js";
import { Router } from "./router.js";
import { AuthGuard } from "./authguard.js";
import { initializeContactForm } from "./contact.js";
import { renderOpportunityCards } from "./opportunities.js";
const pageTitles = {
    "/": "Home",
    "/home": "Home",
    "/about": "About",
    "/contact": "Contact",
    "/events": "Events",
    "/gallery": "Gallery",
    "/login": "Login Page",
    "/news": "News",
    "/event-planning": "Event Planning",
    "/eventsList": "Event List",
    "/edit": "Edit",
    "/opportunities": "Opportunities",
    "/privacyPolicy": "Privacy Policy",
    "/termsOfService": "Terms of Service",
    "/statistics": "Statistics",
    "/donate": "Donate",
    "/404": "404 Page Not Found"
};
const routes = {
    "/": "views/pages/home.html",
    "/about": "views/pages/about.html",
    "/contact": "views/pages/contact.html",
    "/contact-feedback": "views/pages/contact-feedback.html",
    "/events": "views/pages/events.html",
    "/gallery": "views/pages/gallery.html",
    "/donate": "views/pages/donate.html",
    "/login": "views/pages/login.html",
    "/news": "views/pages/news.html",
    "/event-planning": "views/pages/event-planning.html",
    "/eventsList": "views/pages/eventsList.html",
    "/edit": "views/pages/edit.html",
    "/opportunities": "views/pages/opportunities.html",
    "/privacyPolicy": "views/pages/privacyPolicy.html",
    "/termsOfService": "views/pages/termsOfService.html",
    "/statistics": "views/pages/statistics.html",
    "/404": "views/pages/404.html"
};
const router = new Router(routes);
// Event Planning
/**
 * Redirect the user back to events-list.html
 */
function handleCancelClick() {
    //location.href="eventsList.html";
    router.navigate("/eventsList");
}
/**
 * Handle the process of editing an existing contact
 * @param event
 * @param eventsPlanning
 * @param page
 */
function handleEditClick(event, eventsPlanning, page) {
    event.preventDefault();
    if (!validateForm()) {
        alert("Invalid data! Please check your inputs");
        return;
    }
    // read in form fields
    const eventName = document.getElementById("eventName").value;
    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;
    const eventDate = document.getElementById("eventDate").value;
    const eventTime = document.getElementById("eventTime").value;
    // Update the event details
    eventsPlanning.eventName = eventName;
    eventsPlanning.location = location;
    eventsPlanning.description = description;
    eventsPlanning.eventDate = eventDate;
    eventsPlanning.eventTime = eventTime;
    localStorage.setItem(page, eventsPlanning.serialize());
    // redirect
    router.navigate("/eventsList");
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
    const eventName = document.getElementById("eventName").value;
    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;
    const eventDate = document.getElementById("eventDate").value;
    const eventTime = document.getElementById("eventTime").value;
    // Create and save new event
    AddEvents(eventName, location, description, eventDate, eventTime);
    // redirect to events list
    router.navigate("/eventsList");
}
function addEventListenerOnce(elementId, eventName, handler) {
    const element = document.getElementById(elementId);
    if (element) {
        // Remove any *existing* listener of the same type
        element.removeEventListener(eventName, handler); // Use the SAME handler
        element.addEventListener(eventName, handler);
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
    return (validateInput("eventName") &&
        validateInput("location") &&
        validateInput("description"));
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
 * @type {{eventName: {regex: RegExp, errorMessage: string}, location:
 * {regex: RegExp, errorMessage: string}, description: {regex: RegExp, errorMessage: string}}}
 */
const VALIDATION_RULES = {
    eventName: {
        regex: /^[A-Za-z\s]+$/, // allows for only letters and spaces
        errorMessage: "Event Name must be contain only letters and spaces"
    },
    location: {
        regex: /^[A-Za-z\s.,!@-]+$/,
        errorMessage: "Location must be contain only letters and spaces"
    },
    description: {
        regex: /^[A-Za-z\s.,!@-]+$/,
        errorMessage: "Description must be contain only letters and spaces"
    }
};
function AddEvents(eventName, location, description, eventDate, eventTime) {
    console.log("[DEBUG] AddEvent() triggered...");
    if (!validateForm()) {
        alert("Form contains errors. Please correct your input before submitting.");
        return;
    }
    let eventsPlanning = new EventsPlanning(eventName, location, description);
    eventsPlanning.eventDate = eventDate;
    eventsPlanning.eventTime = eventTime; // Using the user-selected time
    const serializedEvents = eventsPlanning.serialize();
    if (serializedEvents) {
        // Save the event with a unique key based on current timestamp
        let key = `events_${Date.now()}`;
        localStorage.setItem(key, serializedEvents);
    }
    else {
        console.error(`[ERROR] Event serialize failed`);
    }
    // Redirect to events list page after successful submission
    router.navigate("/eventsList");
}
// Display the event editing page
function DisplayEditPage() {
    console.log("DisplayEditPage() called...");
    const hashParts = location.hash.split("#");
    const page = hashParts.length > 2 ? hashParts[2] : "";
    const editButton = document.getElementById("editButton");
    const pageTitle = document.querySelector("main > h1");
    if (!pageTitle) {
        console.error("[ERROR] Main title element not found");
        return;
    }
    if (page === "add") {
        pageTitle.textContent = "Add Event";
        if (editButton) {
            editButton.innerHTML = `<i class="fas fa-plus-circle fa-sm"></i> Add`;
            editButton.classList.remove("btn-primary");
            editButton.classList.add("btn-success");
        }
        addEventListenerOnce("editButton", "click", handleAddClick);
        addEventListenerOnce("cancelButton", "click", handleCancelClick);
    }
    else {
        const eventsListData = localStorage.getItem(page);
        if (!eventsListData) {
            console.warn("[WARNING] No event data found");
            return;
        }
        const eventsPlanning = new EventsPlanning();
        eventsPlanning.deserialize(eventsListData);
        // Assuming eventsPlanning is the object holding the current event details
        document.getElementById("eventName").value = eventsPlanning.eventName;
        document.getElementById("location").value = eventsPlanning.location;
        document.getElementById("description").value = eventsPlanning.description;
        // Set the event date and time from eventsPlanning object
        document.getElementById("eventDate").value = eventsPlanning.eventDate; // Set the event date
        document.getElementById("eventTime").value = eventsPlanning.eventTime;
        if (editButton) {
            editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit`;
            editButton.classList.remove("btn-success");
            editButton.classList.add("btn-primary");
        }
        addEventListenerOnce("editButton", "click", (event) => handleEditClick(event, eventsPlanning, page));
        addEventListenerOnce("cancelButton", "click", handleCancelClick);
    }
}
// Display the events list page
function DisplayEventsListPage() {
    console.log("Called DisplayEventsListPage");
    const eventsList = document.getElementById("eventsList");
    if (!eventsList) {
        console.warn("[WARNING] Element with ID 'eventsList' not found");
        return;
    }
    let data = "";
    let keys = Object.keys(localStorage);
    let index = 1;
    keys.forEach((key) => {
        if (key.startsWith("events_")) {
            const eventsListData = localStorage.getItem(key);
            if (!eventsListData) {
                console.warn(`[WARNING] No data found for key: ${key}. Skipping...`);
                return;
            }
            try {
                let eventsPlanning = new EventsPlanning();
                eventsPlanning.deserialize(eventsListData);
                data += `<tr>
                            <th scope="row" class="text-center">${index}</th>
                            <td>${eventsPlanning.eventName}</td>
                            <td>${eventsPlanning.location}</td>
                            <td>${eventsPlanning.eventDate}</td>
                            <td>${eventsPlanning.eventTime}</td>
                            <td>${eventsPlanning.description}</td>
                            <td class="text-center">
                                <button value="${key}" class="btn btn-warning btn-sm edit">
                                    <i class="fa-solid fa-pen-to-square"></i> Edit
                                </button>
                            </td>
                            <td class="text-center">
                                <button value="${key}" class="btn btn-danger btn-sm delete">
                                    <i class="fa-solid fa-trash"></i> Delete
                                </button>
                            </td>
                         </tr>`;
                index++;
            }
            catch (error) {
                console.error("[ERROR] Error deserializing event data", error);
            }
        }
        else {
            console.warn(`Skipping non-event (events_) key: ${key}`);
        }
    });
    eventsList.innerHTML = data;
    const addButton = document.getElementById("addButton");
    if (addButton) {
        addButton.addEventListener("click", () => {
            router.navigate("/edit#add");
        });
    }
    const deleteButtons = document.querySelectorAll("button.delete");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const eventsPlanningKey = this.value;
            console.log(`[DEBUG] Deleting event: ${eventsPlanningKey}`);
            if (!eventsPlanningKey.startsWith("events_")) {
                console.error("[ERROR] Invalid events key format: ", eventsPlanningKey);
                return;
            }
            if (confirm("Delete event? Please confirm.")) {
                localStorage.removeItem(this.value);
                DisplayEventsListPage();
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
function DisplayEventsPlanningPage() {
    console.log("Calling EventsPlanningPage()...");
    const sendButton = document.getElementById("sendButton");
    const subscribeCheckbox = document.getElementById("subscribeCheckbox");
    const eventsListButton = document.getElementById("showEventsList");
    if (!sendButton) {
        console.warn("[WARNING] Element with ID 'sendButton' not found");
        return;
    }
    // **Crucial:  Use addEventListenerOnce**
    addEventListenerOnce("sendButton", "click", handleSendButtonClick);
    if (eventsListButton) {
        eventsListButton.addEventListener("click", function (event) {
            event.preventDefault();
            router.navigate("/eventsList");
        });
    }
}
// **Define handleSendButtonClick outside DisplayEventsPlanningPage**
function handleSendButtonClick(event) {
    event.preventDefault();
    if (!validateForm()) {
        alert("Please fix your errors before submitting");
        return;
    }
    const subscribeCheckbox = document.getElementById("subscribeCheckbox");
    if (subscribeCheckbox && subscribeCheckbox.checked) {
        // Capture the input values for eventName, location, description, and eventDate
        const eventName = document.getElementById("eventName").value;
        const location = document.getElementById("location").value;
        const description = document.getElementById("description").value;
        const eventDate = document.getElementById("eventDate").value;
        // Get the event time in HH:MM format from the time input field
        const eventTime = document.getElementById("eventTime").value;
        // Ensure the event time is in a valid format (HH:MM)
        const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
        if (!timeRegex.test(eventTime)) {
            alert("Invalid event time format. Please enter time in HH:MM format.");
            return;
        }
        // Add the event with the captured values
        AddEvents(eventName, location, description, eventDate, eventTime);
    }
    alert("Form submitted successfully");
}
export function handleLogout(event) {
    event.preventDefault();
    sessionStorage.removeItem("user"); // Clear user session
    console.log("[INFO] User logged out. Updating UI...");
    LoadHeader().then(() => {
        CheckLogin();
        router.navigate("/"); // Redirect to home page after logout
    });
}
function DisplayLoginPage() {
    console.log("[INFO] DisplayLoginPage called...");
    if (sessionStorage.getItem("user")) {
        router.navigate("/");
        return;
    }
    const messageArea = document.getElementById("messageArea");
    const loginButton = document.getElementById("loginButton");
    const cancelButton = document.getElementById("cancelButton");
    const loginForm = document.getElementById("loginForm");
    if (!loginButton) {
        console.error("[ERROR] Login button not found in the DOM.");
        return;
    }
    loginButton.addEventListener("click", async (event) => {
        // Prevent default form submission
        event.preventDefault();
        // Retrieve form parameters
        const userName = document.getElementById("userName").value.trim();
        const password = document.getElementById("password").value.trim();
        try {
            // Fetch user data from JSON
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
            // Check if user exists
            for (const user of users) {
                if (user.Username === userName && user.Password === password) {
                    success = true;
                    authenticatedUser = user;
                    break;
                }
            }
            if (success) {
                // Save user session
                sessionStorage.setItem("user", JSON.stringify({
                    DisplayName: authenticatedUser.DisplayName,
                    EmailAddress: authenticatedUser.EmailAddress,
                    UserName: authenticatedUser.UserName,
                }));
                // Hide error message
                if (messageArea) {
                    messageArea.classList.remove("alert", "alert-danger");
                    messageArea.style.display = "none";
                }
                // Load header and navigate to home page
                await LoadHeader();
                CheckLogin(); // Ensure login state is updated
                router.navigate("/");
            }
            else {
                // Show error message for invalid credentials
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
    // Handle cancel event
    if (cancelButton && loginButton) {
        cancelButton.addEventListener("click", (event) => {
            loginForm.reset();
            router.navigate("/");
        });
    }
    else {
        console.warn("[WARNING] Cancel button not found");
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
    // Update page title
    document.title = pageTitles[path] || "Untitled Page";
    // Check Authentication level for protected pages
    const protectedRoutes = ["/statistics", "/event-planning"];
    if (protectedRoutes.includes(path)) {
        if (!sessionStorage.getItem("user")) {
            console.log("[AUTHGUARD] Unauthorized access detected. Redirecting to login page");
            location.hash = "/login";
            return; // Stop further execution
        }
        AuthGuard(); // This will reset the session timeout
    }
    async function Start() {
        console.log("Starting...");
        await LoadHeader();
        router.loadRoute(location.pathname || "/");
    }
    window.addEventListener("DOMContentLoaded", Start);
    window.addEventListener("hashchange", () => {
        router.loadRoute(location.hash.slice(1) || "/");
    });
    document.addEventListener("routeLoaded", async (event) => {
        if (event instanceof CustomEvent) {
            const newPath = event.detail;
            console.log(`[INFO] Route Loaded: ${newPath}`);
            updateActiveNewLink();
            CheckLogin();
            initializeFilters();
            renderOpportunityCards();
            validateForm();
            initializeGallery();
            if (path === '/contact') {
                initializeContactForm();
            }
        }
    });
    // Donate
    function addDonateLink() {
        const navbarNav = document.querySelector('.navbar-nav');
        if (!navbarNav) {
            console.error("Navbar list not found!");
            return;
        }
        const donateItem = document.createElement('li');
        donateItem.className = 'nav-item me-1';
        const donateLink = document.createElement('a');
        donateLink.className = 'nav-link';
        donateLink.textContent = 'Donate';
        donateLink.href = '#';
        donateLink.addEventListener('click', (e) => {
            e.preventDefault();
            router.navigate('/donate');
        });
        donateItem.appendChild(donateLink);
        navbarNav.appendChild(donateItem);
        console.log("Donate link added successfully");
    }
    addDonateLink();
    async function fetchWithRetry(url, retries = 3) {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url);
                if (!response.ok)
                    throw new Error('Network response was not ok');
                return response;
            }
            catch (err) {
                if (i === retries - 1)
                    throw err;
                await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 1 second before retrying
            }
        }
        throw new Error('Failed to fetch after retries');
    }
    function DisplayTime() {
        const userTimezone = "America/Toronto"; // Replace with desired timezone
        const timeDataElement = document.getElementById("time-data");
        if (!timeDataElement)
            return;
        try {
            // Use Intl.DateTimeFormat to get localized time
            const localizedTime = new Intl.DateTimeFormat("en-US", {
                timeZone: userTimezone,
                dateStyle: "medium",
                timeStyle: "short",
            }).format(new Date());
            // Update the DOM with the current time
            timeDataElement.innerHTML = `Current time in ${userTimezone}: ${localizedTime}`;
        }
        catch (error) {
            console.error("Error formatting time:", error);
            timeDataElement.innerHTML = "Error displaying time.";
        }
    }
    function initializeTimeDisplay() {
        DisplayTime();
        setInterval(DisplayTime, 60000); // Update every minute
    }
    // Ensure the DOM is loaded before initializing
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeTimeDisplay);
    }
    else {
        initializeTimeDisplay();
    }
    // Define the toggleNearbyPlaces function and attach it to the window object
    window.toggleNearbyPlaces = function () {
        const placeContainer = document.getElementById("place-container");
        const toggleButton = document.getElementById("toggle-button");
        if (!placeContainer || !toggleButton) {
            console.error("Required DOM elements not found");
            return;
        }
        // Always fetch and show places when the button is clicked
        findNearbyPlaces().catch((error) => {
            console.error("Error fetching places:", error);
        });
    };
    /**
     * Finds nearby places using the Foursquare API.
     */
    function findNearbyPlaces() {
        // API key
        const apiKey = "fsq3kSvyOGdNRJ3teXgvsoi8KiBgAymNN8h5zftEnzwDqLA=";
        const placeContainer = document.getElementById("place-container");
        if (!placeContainer) {
            console.error("Place container not found");
            return Promise.reject("Place container not found");
        }
        return new Promise((resolve, reject) => {
            // Get the user's current location
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                // Construct the API URL with user's location
                const url = `https://api.foursquare.com/v3/places/nearby?ll=${lat},${lon}&radius=1000&limit=5`;
                // Fetch nearby places from Foursquare API
                fetch(url, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": apiKey
                    }
                })
                    .then(response => response.json())
                    .then((data) => {
                    // Check if there are any results
                    if (data.results.length === 0) {
                        placeContainer.innerHTML = "<p>No nearby places found.</p>";
                        resolve();
                        return;
                    }
                    // Create HTML content for each place and display it
                    placeContainer.innerHTML = data.results.map(place => `
                            <div class="place-card">
                                <div class="place-name">${place.name}</div>
                                <div class="place-address">${place.location.address || "No address available"}</div>
                            </div>
                        `).join("");
                    resolve();
                })
                    .catch(error => {
                    console.error("Error fetching places:", error);
                    placeContainer.innerHTML = "<p>Failed to load nearby places.</p>";
                    reject(error);
                });
            }, 
            // Handle location access denial
            () => {
                placeContainer.innerHTML = "<p>Location access denied.</p>";
                reject("Location access denied");
            });
        });
    }
    // Add an event listener to initialize the toggle button functionality
    document.addEventListener('DOMContentLoaded', () => {
        const toggleButton = document.getElementById("toggle-button");
        if (toggleButton) {
            toggleButton.addEventListener('click', window.toggleNearbyPlaces); // Explicitly reference window.toggleNearbyPlaces
        }
    });
    // Get Involved button
    document.addEventListener('click', (event) => {
        const target = event.target;
        if (target instanceof HTMLElement && target.id === "GetInvolvedBtn") {
            console.log("Get Involved button clicked!");
            if (router && typeof router.navigate === 'function') {
                router.navigate("/opportunities");
            }
            else {
                console.error("Router is not defined or navigate method is missing");
            }
        }
    });
    console.log("Script ended");
    /**
     * Handles search functionality and redirects users based on their query.
     * @param event
     */
    // Attach the searchSite function to the window object
    window.searchSite = function (event) {
        event.preventDefault();
        // Get the search query from the input field
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) {
            console.error("Search input element not found");
            return;
        }
        const query = searchInput.value.toLowerCase().trim();
        // Define routes for SPA navigation
        const routes = {
            'event': '/events',
            'opportunities': '/opportunities',
            'news': '/news',
            'gallery': '/gallery',
            'contact': '/contact',
            'about': '/about',
            'login': '/login'
        };
        // Check if the query matches any of the predefined keywords
        for (const keyword in routes) {
            if (query.includes(keyword)) {
                // Navigate to the matched route using your SPA router
                if (typeof router !== 'undefined' && typeof router.navigate === 'function') {
                    router.navigate(routes[keyword]); // Use your SPA router's navigate method
                    return;
                }
                else {
                    console.error("Router is not defined or navigate method is missing");
                    return;
                }
            }
        }
        // If no match is found, show an alert to the user
        alert('No results found. Try searching for "events," "volunteer," "news," etc.');
    };
    // Event and filter
    function initializeFilters() {
        console.log("Initializing filters...");
        // Get filter elements
        const eventFilter = document.getElementById("eventFilter");
        const eventLocation = document.getElementById("eventLocation");
        const eventDateInput = document.getElementById("eventDate");
        const eventsContainer = document.getElementById("eventsContainer");
        // Ensure elements exist
        if (!eventFilter || !eventLocation || !eventDateInput || !eventsContainer) {
            console.error("One or more filter elements are missing.");
            return;
        }
        console.log("Filter elements found:", { eventFilter, eventLocation, eventDateInput });
        // Event listeners for filters
        eventFilter.addEventListener("change", applyFilter);
        eventLocation.addEventListener("change", applyFilter);
        eventDateInput.addEventListener("change", applyFilter);
        function applyFilter() {
            console.log("Applying filters...");
            // Get filter values
            const category = eventFilter.value;
            const location = eventLocation.value;
            const selectedDate = eventDateInput.value;
            console.log("Filter values:", { category, location, selectedDate });
            // Loop through all event cards
            const eventCards = document.querySelectorAll(".col-md-4");
            console.log("Number of event cards found:", eventCards.length);
            let visibleCount = 0;
            eventCards.forEach(eventCard => {
                const eventCategory = eventCard.getAttribute("data-category");
                const eventLocation = eventCard.getAttribute("data-location");
                const eventDate = eventCard.getAttribute("data-date");
                console.log("Event card data:", { eventCategory, eventLocation, eventDate });
                let showEvent = true;
                // Filter by category
                if (category !== "all" && eventCategory !== category) {
                    showEvent = false;
                }
                // Filter by location
                if (location !== "all" && eventLocation !== location) {
                    showEvent = false;
                }
                // Filter by date (if selected)
                if (selectedDate && eventDate !== selectedDate) {
                    showEvent = false;
                }
                // Show or hide the event
                eventCard.style.display = showEvent ? "block" : "none";
                if (showEvent)
                    visibleCount++;
                console.log(`Event ${showEvent ? 'shown' : 'hidden'}:`, eventCard);
            });
            console.log(`Total visible events after filtering: ${visibleCount}`);
        }
        console.log("Filters initialized successfully");
        applyFilter(); // Apply filter immediately to set initial state
    }
    let galleryData = null;
    function initializeGallery() {
        console.log("Initializing gallery...");
        // Get gallery elements
        const galleryContainer = document.getElementById("gallery");
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lightbox-img");
        const lightboxText = document.getElementById("lightbox-text");
        const closeButton = document.getElementById("close");
        // Ensure elements exist
        if (!galleryContainer || !lightbox || !lightboxImg || !lightboxText || !closeButton) {
            console.error("One or more gallery elements are missing.");
            return;
        }
        console.log("Gallery elements found");
        // Load gallery data and render
        function loadGallery() {
            if (galleryData) {
                renderGallery(galleryData);
            }
            else {
                fetch('data/events-image.json')
                    .then(response => response.json())
                    .then((data) => {
                    console.log('Gallery data loaded:', data);
                    galleryData = data;
                    renderGallery(data);
                })
                    .catch(err => console.error('Error loading images:', err));
            }
        }
        // Render gallery content
        function renderGallery(data) {
            console.log("Rendering gallery...");
            if (galleryContainer) {
                galleryContainer.innerHTML = '';
            }
            data['events-image'].forEach((image, index) => {
                const imgElement = document.createElement('img');
                imgElement.src = image.src;
                imgElement.alt = image.alt;
                imgElement.classList.add('img-thumbnail', 'mb-3');
                imgElement.dataset.index = index.toString();
                if (galleryContainer) {
                    galleryContainer.appendChild(imgElement);
                }
                imgElement.addEventListener('click', () => openLightbox(index));
            });
        }
        // Lightbox functions
        function openLightbox(index) {
            console.log("Opening lightbox for index:", index);
            if (galleryData && galleryData['events-image'] && galleryData['events-image'][index]) {
                const image = galleryData['events-image'][index];
                if (lightboxImg && lightboxText && lightbox) {
                    lightboxImg.src = image.src;
                    lightboxImg.alt = image.alt;
                    lightboxText.textContent = image.alt;
                    lightbox.style.display = 'flex';
                }
            }
        }
        function closeLightbox() {
            console.log("Closing lightbox");
            if (lightbox) {
                lightbox.style.display = 'none';
            }
        }
        // Event listeners
        closeButton.addEventListener('click', closeLightbox);
        // Initial load
        loadGallery();
        console.log("Gallery initialized successfully");
    }
    // Function to check if we're on the gallery page
    function isGalleryPage() {
        return !!document.getElementById("gallery");
    }
    // MutationObserver to watch for DOM changes (for SPA compatibility)
    const galleryObserver = new MutationObserver((mutations) => {
        if (isGalleryPage()) {
            console.log("Gallery page detected, initializing...");
            galleryObserver.disconnect();
            initializeGallery();
        }
    });
    // Start observing the DOM for changes
    galleryObserver.observe(document.body, { childList: true, subtree: true });
    // Check immediately in case the page is already loaded
    if (isGalleryPage()) {
        console.log("Gallery page already loaded, initializing...");
        initializeGallery();
    }
    switch (path) {
        case "/Home":
            break;
        case "/About":
            break;
        case "/Contact":
            break;
        case "/ContactFeedback":
            break;
        case "/Events":
            initializeFilters();
            break;
        case "/EventGallery":
            break;
        case "/login":
            DisplayLoginPage();
            break;
        case "/event-planning":
            DisplayEventsPlanningPage();
            attachValidationListeners();
            break;
        case "/eventsList":
            DisplayEventsListPage();
            break;
        case "/edit":
            DisplayEditPage();
            attachValidationListeners();
            break;
        case "/News":
            break;
        case "/Opportunities":
            break;
        case "/Privacy Policy":
            break;
        case "/Terms of Service":
            break;
        default:
            console.error("No matching case fot the title page");
    }
}
//# sourceMappingURL=main.js.map