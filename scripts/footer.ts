/* Name: Manjot Kaur and Subhana Hashimi
   Student ID: 100951033, 100949958
   Date: 2025-02-23
*/

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Create footer container
    const footer = document.createElement('footer');
    footer.classList.add('footer');

    // Create links dynamically
    const privacyPolicyLink : HTMLAnchorElement = document.createElement('a');
    privacyPolicyLink.href = '#/privacyPolicy'; // Using hash-based routing
    privacyPolicyLink.textContent = 'Privacy Policy';

    const termsOfServiceLink : HTMLAnchorElement = document.createElement('a');
    termsOfServiceLink.href = '#/termsOfService'; // Using hash-based routing
    termsOfServiceLink.textContent = 'Terms of Service';

    // Append links to the footer
    footer.appendChild(privacyPolicyLink);
    footer.appendChild(document.createTextNode(' | ')); // Add separator
    footer.appendChild(termsOfServiceLink);

    // Append footer to the body
    document.body.appendChild(footer);

    // Listen for hash changes
    window.addEventListener('hashchange', handleRouting);

    // Load the initial route
    handleRouting();
});

// Function to update content dynamically
function handleRouting() : void {
    const content = document.getElementById('app'); // Main content area
    if (!content) return;

    const route = window.location.hash.substring(2); // Remove `#/`

    switch (route) {
        case 'privacyPolicy':
            content.innerHTML = `<h2>Privacy Policy</h2><p>This is the Privacy Policy page.</p>`;
            break;
        case 'termsOfService':
            content.innerHTML = `<h2>Terms of Service</h2><p>This is the Terms of Service page.</p>`;
            break;
        default:
            content.innerHTML = `<h2>Welcome!</h2><p>Select an option from the footer.</p>`;
            break;
    }
}
