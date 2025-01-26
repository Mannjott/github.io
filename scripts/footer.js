// Wait until the DOM is fully loaded before executing the script.

// Create footer container
document.addEventListener('DOMContentLoaded', function () {
    // Create footer container
    const footer = document.createElement('footer');
    // Add a class for styling the footer
    footer.classList.add('footer');

    // Create links
    // Create an anchor element for Privacy Policy.
    const privacyPolicyLink = document.createElement('a');
    // Set the URL to the Privacy Policy page.
    privacyPolicyLink.href = 'privacyPolicy.html';
    // Set the displayed text for the link.
    privacyPolicyLink.textContent = 'Privacy Policy';

    // Create an anchor element for Terms of Service.
    const termsOfServiceLink = document.createElement('a');
    // Set the URL to the Terms of Service page.
    termsOfServiceLink.href = 'termsOfService.html';
    // Set the displayed text for the link.
    termsOfServiceLink.textContent = 'Terms of Service';

    // Append links to the footer
    // Add the Privacy Policy link to the footer.
    footer.appendChild(privacyPolicyLink);
    // Add the Terms of Service link to the footer.
    footer.appendChild(termsOfServiceLink);

    // Append footer to the body
    // Add the footer to the end of the document body.
    document.body.appendChild(footer);
});