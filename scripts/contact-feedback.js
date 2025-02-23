/* Name: Manjot kaur and Subhana Hashimi
   Student ID: 100951033, 100949958
   Date: 2025-02-23
*/

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedback_form'); // Get the feedback form
    const successMessage = document.getElementById('feedback-success-message'); // Get success message element

    successMessage.style.display = 'none'; // Initially hide the success message

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting normally

        if (validateForm()) { // If the form is valid
            submitForm(); // Submit the form
        }
    });

    function validateForm() {
        const comments = document.getElementById('feedback_comments').value.trim(); // Get and trim the comments field
        const email = document.getElementById('feedback_email').value.trim(); // Get and trim the email field
        const name = document.getElementById('feedback_name').value.trim(); // Get and trim the name field

        let isValid = true; // Initialize the form validity status

        // Validate comments
        if (comments === '') {
            showError('feedback_comments', 'Comments cannot be empty'); // Show error for empty comments
            isValid = false;
        } else {
            clearError('feedback_comments'); // Clear error if comments are valid
        }

        // Validate email using regular expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '' || !emailRegex.test(email)) {
            showError('feedback_email', 'Please enter a valid email address'); // Show error for invalid email
            isValid = false;
        } else {
            clearError('feedback_email'); // Clear error if email is valid
        }

        // Validate name using regular expression (only alphabetic characters)
        const nameRegex = /^[A-Za-z\s]+$/;
        if (name === '' || !nameRegex.test(name)) {
            showError('feedback_name', 'Please enter a valid name (alphabetic characters only)'); // Show error for invalid name
            isValid = false;
        } else {
            clearError('feedback_name'); // Clear error if name is valid
        }

        return isValid; // Return the overall form validity status
    }

    function showError(fieldId, message) {
        const field = document.getElementById(fieldId); // Get the input field
        const errorDiv = field.nextElementSibling || document.createElement('div'); // Get the next sibling element or create a new div for error
        errorDiv.className = 'error-message text-danger'; // Set the class for the error message
        errorDiv.textContent = message; // Set the error message text
        if (!field.nextElementSibling) {
            field.parentNode.insertBefore(errorDiv, field.nextSibling); // Insert the error message after the input field
        }
    }

    function clearError(fieldId) {
        const field = document.getElementById(fieldId); // Get the input field
        const errorDiv = field.nextElementSibling; // Get the next sibling (error message)
        if (errorDiv && errorDiv.className === 'error-message text-danger') {
            errorDiv.remove(); // Remove the error message if it exists
        }
    }

    function submitForm() {
        const formData = new FormData(form); // Create a new FormData object from the form
        const data = Object.fromEntries(formData.entries()); // Convert the FormData to an object

        simulateAjaxRequest(data) // Simulate an AJAX request to submit the form
            .then(response => {
                if (response.success) {
                    showConfirmationModal(data); // If successful, show the confirmation modal
                    form.reset(); // Reset the form fields
                } else {
                    throw new Error(response.message || 'An error occurred while submitting the form.'); // Handle failure
                }
            })
            .catch(error => {
                console.error('Error:', error); // Log the error to the console
                alert(error.message || 'An error occurred while submitting the form. Please try again.'); // Show an error message to the user
            });
    }

    function simulateAjaxRequest(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() < 0.9) { // Simulate a 90% success rate
                    resolve({ success: true, message: 'Feedback submitted successfully' }); // Resolve with success message
                } else {
                    reject(new Error('Simulated network error')); // Reject with an error message
                }
            }, 1000); // Simulate a 1-second delay
        });
    }

    function showConfirmationModal(data) {
        const modalHTML = `
            <div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="confirmationModalLabel">Feedback Submitted</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Rating:</strong> ${data.rating}</p>
                            <p><strong>Comments:</strong> ${data.comments}</p>
                            <p><strong>Name:</strong> ${data.name}</p>
                            <p><strong>Email:</strong> ${data.email}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML); // Insert the modal HTML into the body

        const modal = new bootstrap.Modal(document.getElementById('confirmationModal')); // Create a new Bootstrap modal instance
        modal.show(); // Show the modal

        document.getElementById('confirmationModal').addEventListener('hidden.bs.modal', function () {
            this.remove(); // Remove the modal from the DOM after it is closed
            window.location.href = 'index.html'; // Redirect the user to the index page
        });
    }
});
