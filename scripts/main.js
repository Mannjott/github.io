document.addEventListener('DOMContentLoaded', function () {
    // Select the filter dropdown
    const eventFilter = document.getElementById('eventFilter');
    // Select all event cards
    const eventCards = document.querySelectorAll('.col-md-4');  // Make sure this matches the HTML structure

    // Attach the filter change event listener
    if (eventFilter) {
        eventFilter.addEventListener('change', function () {
            const selectedCategory = eventFilter.value; // Get the selected category

            eventCards.forEach(function (card) {
                const cardCategory = card.getAttribute('data-category'); // Get the card's category

                // Show or hide cards based on the selected filter
                card.style.display =
                    selectedCategory === 'all' || cardCategory === selectedCategory
                        ? 'block'
                        : 'none';
            });
        });
    }
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
        { title: "Beach Cleanup", description: "Help clean up the beach!", date: "2025-02-01" },
        { title: "Park Restoration", description: "Join us to restore the beauty of the local park!", date: "2025-02-15" },
        { title: "Tree Planting Drive", description: "Plant trees to help the environment and beautify the community.", date: "2025-03-01" },
        { title: "Community Garden Setup", description: "Help create a community garden for everyone to enjoy.", date: "2025-03-15" },
        { title: "Neighborhood Cleanup", description: "Clean up the streets and public spaces in your neighborhood.", date: "2025-04-01" },
        { title: "Riverbank Cleanup", description: "Remove trash and debris from the riverbank to protect wildlife.", date: "2025-04-15" },
        { title: "Recycling Workshop", description: "Learn about recycling and help educate the community.", date: "2025-05-01" },
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




document.addEventListener('DOMContentLoaded', function() {
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