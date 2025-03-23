/* Name: Manjot kaur and Subhana Hashimi
   Student ID: 100951033, 100949958
   Date: 2025-02-23
*/

document.addEventListener("DOMContentLoaded", function () {
    const eventsContainer = document.getElementById("eventsContainer") as HTMLElement; // Get the container where events will be displayed
    const eventTypeFilter = document.getElementById("eventType") as HTMLSelectElement; // Get the event type filter dropdown
    const eventLocationFilter = document.getElementById("eventLocation") as HTMLSelectElement; // Get the event location filter dropdown
    const eventDateFilter = document.getElementById("eventDate") as HTMLInputElement; // Get the event date filter input field

    let eventsData: { title: string; description: string; type: string; location: string; date: string }[] = []; // Initialize an empty array to hold events data

    // Fetch events from JSON file
    function loadEvents(): void {
        fetch("data/events.json") // Fetch events data from the JSON file
            .then(response => response.json()) // Parse the response as JSON
            .then(data => {
                eventsData = data; // Store the fetched events data in eventsData array
                displayEvents(eventsData); // Display all events initially
            })
            .catch(error => console.error("Error loading events:", error)); // Handle errors if fetching fails
    }

    // Display events in the DOM
    function displayEvents(events: { title: string; description: string; type: string; location: string; date: string }[]): void {
        eventsContainer.innerHTML = ""; // Clear the events container before displaying new events
        events.forEach(event => { // Loop through each event and create an HTML card for it
            const eventCard = `
                <div class="col-md-4" data-category="${event.type}" data-location="${event.location}" data-date="${event.date}">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${event.title}</h5>
                            <p class="card-text">${event.description}</p>
                            <p class="card-text"><small class="text-muted">Location: ${event.location}</small></p>
                            <p class="card-text"><small class="text-muted">Date: ${event.date}</small></p>
                        </div>
                    </div>
                </div>
            `;
            eventsContainer.innerHTML += eventCard; // Append the event card to the container
        });
    }

    // Filter events based on selected filters
    function filterEvents(): void {
        let filteredEvents = eventsData; // Start with all events data

        const selectedType = eventTypeFilter.value; // Get selected event type
        const selectedLocation = eventLocationFilter.value; // Get selected event location
        const selectedDate = eventDateFilter.value; // Get selected event date

        if (selectedType !== "all") { // If a specific event type is selected
            filteredEvents = filteredEvents.filter(event => event.type === selectedType); // Filter events by type
        }

        if (selectedLocation !== "all") { // If a specific location is selected
            filteredEvents = filteredEvents.filter(event => event.location === selectedLocation); // Filter events by location
        }

        if (selectedDate) { // If a specific date is selected
            filteredEvents = filteredEvents.filter(event => event.date === selectedDate); // Filter events by date
        }

        displayEvents(filteredEvents); // Display the filtered events
    }

    // Event listeners for filter changes
    eventTypeFilter.addEventListener("change", filterEvents); // Listen for changes in event type filter
    eventLocationFilter.addEventListener("change", filterEvents); // Listen for changes in event location filter
    eventDateFilter.addEventListener("input", filterEvents); // Listen for changes in event date filter

    loadEvents(); // Load and display events when the page is loaded
});
