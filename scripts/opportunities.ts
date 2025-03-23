"use strict";

interface Opportunity {
    title: string;
    description: string;
    date: string;
}

const opportunities: Opportunity[] = [
    { title: "Beach Cleanup", description: "Help clean up the beach!", date: "2025-03-22" },
    { title: "Park Restoration", description: "Join us to restore the beauty of the local park!", date: "2025-03-29" },
    { title: "Community Garden Setup", description: "Help create a community garden for everyone to enjoy.", date: "2025-04-05" }
];

/**
 * Renders opportunity cards into the #cards-container element.
 */
export function renderOpportunityCards(): void {
    console.log("Attempting to render opportunity cards...");

    // Find the #cards-container element
    const cardsContainer = document.getElementById('cards-container');

    if (!cardsContainer) {
        console.error("ERROR: #cards-container element not found!");
        return;
    }

    // Clear existing content
    cardsContainer.innerHTML = '';

    // Add a card for each opportunity
    opportunities.forEach((opportunity) => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${opportunity.title}</h5>
                    <p class="card-text">${opportunity.description}</p>
                    <p class="card-text"><small class="text-muted">Date: ${opportunity.date}</small></p>
                    <button class="btn btn-primary signup-button" data-title="${opportunity.title}">Sign Up</button>
                </div>
            </div>
        `;
        cardsContainer.appendChild(card);
    });

    console.log("Opportunity cards rendered successfully.");
}

// Expose the render function globally for SPA environments
(window as any).renderOpportunityCards = renderOpportunityCards;

// Automatically render cards when the script loads (if DOM is ready)
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded. Attempting to render cards...");
    renderOpportunityCards();
});
