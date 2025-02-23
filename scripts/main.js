/* Name: Manjot kaur and Subhana Hashimi
   Student ID: 100951033, 100949958
   Date: 2025-02-23
*/


/**
 * Fetches and displays the current time for  America/Toronto time zone.
 * This function update in every 5 seconds.
 * @returns {Promise<void>}
 * @constructor
 */

async function DisplayTime() {
    // Api key
    const apiKey = "8AMCCXP6UVMO";
    const zone = "America/Toronto";

    // Construct the URL with the correct query parameters
    const url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=zone&zone=${zone}`;

    try {
        // fetch data from the API
        const response = await fetch(url);

        // check if the response is successful
        if (!response.ok) {
            throw new Error("Failed to fetch timezone");
        }

        // Parse the response data to JSON format
        const data = await response.json();
        console.log("Time zone data:", data);


        // Get the HTML element where time will be displayed
        const timeDataElement = document.getElementById("time-data");


        // Check if the API response is valid and update the page
        if (data.status === "OK" && data.formatted) {
            timeDataElement.innerHTML = `Current time in ${zone}: ${data.formatted}`;
        } else {
            timeDataElement.innerHTML = "Error fetching time data.";
        }

    // update the page with error message
    } catch (error) {
        console.log("Error fetching timezone:", error);
        const timeDataElement = document.getElementById("time-data");
        timeDataElement.innerHTML = "Error fetching time data.";
    }
}

// call the function first and then update it in every 5 second.
DisplayTime().then(() => {
    setInterval(DisplayTime, 5000);
});


/**
 * Fetches and display news.
 * @returns {Promise<void>}
 */
async function fetchNews() {
    // API keys
    const apiKey = "8d1a3740ffe3465c9fe352f15e78c2ad";  // Your API key
    const url = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${apiKey}`;


    try {
        // Fetch data from the API
        const response = await fetch(url);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error("Error fetching news data.");
        }

        // Parse the response data as JSON
        const data = await response.json();

        // Log data to the console (optional for debugging)
        console.log("News API response: ", data);

        // Get the container element to display the news articles
        const newsDataElement = document.getElementById("news-data");

        // Clear any existing content in the news container
        newsDataElement.innerHTML = '';

        // Check if the data contains articles
        if (data.status === "ok" && data.articles.length > 0) {
            // Limit to 3 or 4 articles (change the number to 4 if needed)
            const limitedArticles = data.articles.slice(0, 4); // Shows 4 articles

            // Iterate through the articles and create HTML elements
            limitedArticles.forEach(article => {
                console.log("Appending article: ", article.title);
                // Create a container for each article
                const articleElement = document.createElement("div");
                articleElement.classList.add("news-article");

                // Add the article title
                const articleTitle = document.createElement("h3");
                articleTitle.textContent = article.title;

                // Add the article description
                const articleDescription = document.createElement("p");
                articleDescription.textContent = article.description;

                // Add an image if it exists
                if (article.urlToImage) {
                    const articleImage = document.createElement("img");
                    articleImage.src = article.urlToImage;
                    articleImage.alt = article.title;
                    articleElement.appendChild(articleImage);
                }

                // Add a link to the full article
                const articleLink = document.createElement("a");
                articleLink.href = article.url;
                articleLink.textContent = "Read more";
                articleLink.target = "_blank";

                // Append the article content to the article element
                articleElement.appendChild(articleTitle);
                articleElement.appendChild(articleDescription);
                articleElement.appendChild(articleLink);

                // Append the article element to the news container
                newsDataElement.appendChild(articleElement);
            });
        } else {
            // If there are no articles, display a message
            newsDataElement.innerHTML = "No news available at the moment.";
        }
    } catch (error) {
        // Handle any errors that occur during the fetch operation
        console.error("Error:", error);
        const newsDataElement = document.getElementById("news-data");
        newsDataElement.innerHTML = "Failed to load news.";
    }
}

// Call fetchNews immediately to load the news when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Fetch the news immediately when the page loads
    fetchNews().then(() => {
        console.log("Initial news fetch successful.");

        // Start the interval after the initial fetch (for updates every 60 seconds)
        setInterval(() => {
            console.log("Fetching news...");
            fetchNews(); // Update the news every 60 seconds
        }, 60000); // 60 seconds
    }).catch(error => {
        console.error("Error during initial fetch:", error);
    });
});


/**
 * Toggles the display of nearby places.
 *  If places are already shown, it hides them.
 *  Otherwise, it fetches and displays nearby places.
 */
function toggleNearbyPlaces() {
    const placeContainer = document.getElementById("place-container");
    const toggleButton = document.getElementById("toggle-button");

    if (placeContainer.innerHTML) {
        // If places are already shown, hide them
        placeContainer.innerHTML = "";
        toggleButton.textContent = "Find Nearby Places";
    } else {
        // Otherwise, fetch and show places
        findNearbyPlaces();
    }
}

/**
 * find nearby places with using the Foursquare API.
 */
function findNearbyPlaces() {
    // API key
    const apiKey = "fsq3kSvyOGdNRJ3teXgvsoi8KiBgAymNN8h5zftEnzwDqLA=";
    const placeContainer = document.getElementById("place-container");
    const toggleButton = document.getElementById("toggle-button");

    // Check if the browser supports geolocation
    if (!navigator.geolocation) {
        placeContainer.innerHTML = "<p>Geolocation is not supported by this browser.</p>";
        return;
    }

    // Get the user's current location
    navigator.geolocation.getCurrentPosition(
        position => {
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
                .then(data => {
                    // Check if there are any results
                    if (data.results.length === 0) {
                        placeContainer.innerHTML = "<p>No nearby places found.</p>";
                        return;
                    }

                    // Create HTML content for each place and display it
                    placeContainer.innerHTML = data.results.map(place => `
                    <div class="place-card">
                        <div class="place-name">${place.name}</div>
                        <div class="place-address">${place.location.address || "No address available"}</div>
                    </div>
                `).join("");

                    // Change button text to "Hide Places"
                    toggleButton.textContent = "Hide Places";
                })
                .catch(error => {
                    console.error("Error fetching places:", error);
                    placeContainer.innerHTML = "<p>Failed to load nearby places.</p>";
                });
        },
        // Handle location access denial
        () => placeContainer.innerHTML = "<p>Location access denied.</p>"
    );
}

/**
 * Handles search functionality and redirects users based on their query.
 * @param event
 */
function searchSite(event) {
    event.preventDefault(); // Prevent form submission refresh
    // Get the search input value and convert it to lowercase for case-insensitive matching
    let query = document.getElementById('searchInput').value.toLowerCase();

    // Check for keywords in the search query and redirect accordingly
    if (query.includes('event')) {
        window.location.href = 'events.html';
    } else if (query.includes('volunteer') || query.includes('opportunity')) {
        window.location.href = 'opportunities.html';
    } else if (query.includes('news')) {
        window.location.href = 'news.html';
    } else if (query.includes('gallery')) {
        window.location.href = 'gallery.html';
    } else if (query.includes('contact')) {
        window.location.href = 'contact.html';
    } else if (query.includes('about')) {
        window.location.href = 'about.html';
    } else if (query.includes('about')) {
        window.location.href = 'login.html';
    } else {
        // Show an alert if no matching results are found
        alert('No results found. Try searching for "events," "volunteer," or "news".');
    }
}

document.addEventListener("DOMContentLoaded", function () {
    console.log("JavaScript Loaded");

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

        // Loop through all event cards
        document.querySelectorAll(".col-md-4").forEach(eventCard => {
            const eventCategory = eventCard.getAttribute("data-category");
            const eventLocation = eventCard.getAttribute("data-location");
            const eventDate = eventCard.getAttribute("data-date");

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
        });
    }

    console.log("Event filtering script initialized.");
});


document.addEventListener("DOMContentLoaded", function () {
    // Navbar active link highlight
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (window.location.href.includes(link.href)) {
            link.classList.add('active');
        }
    });

    // "Get Involved" button redirection
    const GetInvolvedBtn = document.getElementById("GetInvolvedBtn");
    if (GetInvolvedBtn) {
        GetInvolvedBtn.addEventListener("click", function () {
            location.href = "opportunities.html";
        });
    }

    // Array of opportunities
    const opportunities = [
        {title: "Beach Cleanup", description: "Help clean up the beach!", date: "2025-02-01"},
        {
            title: "Park Restoration",
            description: "Join us to restore the beauty of the local park!",
            date: "2025-02-15"
        },
        {
            title: "Tree Planting Drive",
            description: "Plant trees to help the environment and beautify the community.",
            date: "2025-03-01"
        },
        {
            title: "Community Garden Setup",
            description: "Help create a community garden for everyone to enjoy.",
            date: "2025-03-15"
        },
        {
            title: "Neighborhood Cleanup",
            description: "Clean up the streets and public spaces in your neighborhood.",
            date: "2025-04-01"
        },
        {
            title: "Riverbank Cleanup",
            description: "Remove trash and debris from the riverbank to protect wildlife.",
            date: "2025-04-15"
        },
        {
            title: "Recycling Workshop",
            description: "Learn about recycling and help educate the community.",
            date: "2025-05-01"
        },
    ];

    // DOM references
    const cardsContainer = document.getElementById('cards-container');
    const modal = document.getElementById('signup-modal');
    const modalOverlay = document.getElementById('modal-overlay');

    // Create cards dynamically
    opportunities.forEach(opportunity => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${opportunity.title}</h3>
            <p>${opportunity.description}</p>
            <p><strong>Date:</strong> ${opportunity.date}</p>
            <button class="signup-button">Sign Up</button>
        `;
        cardsContainer.appendChild(card);

        const button = card.querySelector('.signup-button');
        button.addEventListener('click', () => openModal(opportunity.title));
    });

    // Open modal
    function openModal(title) {
        const modalTitle = document.getElementById('modal-title');
        modalTitle.textContent = 'Sign Up for ${title}';
        modal.classList.add('active');
        modalOverlay.classList.add('active');
    }

    // Close modal
    modalOverlay.addEventListener('click', () => {
        modal.classList.remove('active');
        modalOverlay.classList.remove('active');
    });

    // Handle form submission inside the modal
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const preferredRole = document.getElementById('preferredRole').value.trim();

        if (!name || !email || !preferredRole) {
            alert("Please fill out all fields!");
            return; // Stop further execution if fields are empty
        }

        try {
            const signup = new SignUp(name, email, preferredRole);
            const serializedData = signup.serialize();
            if (serializedData) {
                alert("Form submitted successfully!");
                modal.classList.remove('active');
                modalOverlay.classList.remove('active');

                // Optionally, reset the form
                signupForm.reset();
            }
        } catch (error) {
            alert(error.message);
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const navbarList = document.querySelector('.navbar-nav');

    if (!navbarList) {
        console.error("Navbar list not found!");
        return;
    }

    const donateLink = document.createElement('a');
    donateLink.href = '/donate';
    donateLink.textContent = 'Donate';
    donateLink.classList.add('nav-link');

    const donateItem = document.createElement('li');
    donateItem.classList.add('nav-item', 'me-4');
    donateItem.appendChild(donateLink);

    navbarList.appendChild(donateItem);

});

// Gallery

// Function to open the lightbox and show the clicked image
function openLightbox(index, data) {
    const lightbox = document.getElementById('lightbox'); // Get the lightbox element
    const lightboxImg = document.getElementById('lightbox-img'); // Get the lightbox image element
    const lightboxText = document.getElementById('lightbox-text'); // Get the lightbox caption element

    // Access the "events-image" key in the data (which holds the image details)
    const images = data['events-image'];

    // Check if the image exists and display it
    if (images && images[index]) {
        const image = images[index]; // Get the image based on the index

        // Set the image source and alt text
        lightboxImg.src = image.src; // Set the image source
        lightboxImg.alt = image.alt; // Set the alt text for the image
        lightboxText.textContent = image.alt;  // Set the alt text as the caption text

        // Show the lightbox
        lightbox.style.display = 'flex'; // Display the lightbox
    } else {
        console.error('Image not found or invalid index'); // Log an error if the image is not found or index is invalid
    }
}

// Fetch the images data from the JSON file
fetch('data/events-image.json') // Fetch the JSON file containing image data
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
        const gallery = document.getElementById('gallery'); // Get the gallery container

        // Loop through the images and create img elements for each
        data['events-image'].forEach((image, index) => {
            const imgElement = document.createElement('img'); // Create an img element for each image
            imgElement.src = image.src; // Set the image source
            imgElement.alt = image.alt; // Set the image alt text
            imgElement.classList.add('img-thumbnail', 'mb-3'); // Add CSS classes for styling
            imgElement.dataset.index = index;  // Store the index for later use in lightbox
            gallery.appendChild(imgElement); // Append the image to the gallery

            // Add click event to open the lightbox and pass the entire data object
            imgElement.addEventListener('click', () => openLightbox(index, data)); // Open the lightbox on image click
        });
    })
    .catch(err => console.error('Error loading images:', err)); // Log an error if the images can't be fetched

// Close the lightbox when the close button is clicked
document.getElementById('close').addEventListener('click', () => {
    const lightbox = document.getElementById('lightbox'); // Get the lightbox element
    lightbox.style.display = 'none';  // Hide the lightbox when the close button is clicked
});







