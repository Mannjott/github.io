document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('feedback_form') as HTMLFormElement;
    const successMessage = document.getElementById('feedback-success-message') as HTMLElement;

    successMessage.style.display = 'none';

    form.addEventListener('submit', function (event: Event) {
        event.preventDefault();
        if (validateForm()) {
            submitForm();
        }
    });

    function validateForm(): boolean {
        const comments = (document.getElementById('feedback_comments') as HTMLInputElement).value.trim();
        const email = (document.getElementById('feedback_email') as HTMLInputElement).value.trim();
        const name = (document.getElementById('feedback_name') as HTMLInputElement).value.trim();

        let isValid = true;

        if (comments === '') {
            showError('feedback_comments', 'Comments cannot be empty');
            isValid = false;
        } else {
            clearError('feedback_comments');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '' || !emailRegex.test(email)) {
            showError('feedback_email', 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError('feedback_email');
        }

        const nameRegex = /^[A-Za-z\s]+$/;
        if (name === '' || !nameRegex.test(name)) {
            showError('feedback_name', 'Please enter a valid name (alphabetic characters only)');
            isValid = false;
        } else {
            clearError('feedback_name');
        }

        return isValid;
    }

    function showError(fieldId: string, message: string): void {
        const field = document.getElementById(fieldId) as HTMLInputElement;
        let errorDiv = field.nextElementSibling as HTMLElement | null;
        if (!errorDiv || !errorDiv.classList.contains('error-message')) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message text-danger';
            field.parentNode?.insertBefore(errorDiv, field.nextSibling);
        }
        errorDiv.textContent = message;
    }

    function clearError(fieldId: string): void {
        const field = document.getElementById(fieldId) as HTMLInputElement;
        const errorDiv = field.nextElementSibling as HTMLElement | null;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            errorDiv.remove();
        }
    }

    function submitForm(): void {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        simulateAjaxRequest(data)
            .then(response => {
                if (response.success) {
                    showConfirmationModal(data);
                    form.reset();
                } else {
                    throw new Error(response.message || 'An error occurred while submitting the form.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message || 'An error occurred while submitting the form. Please try again.');
            });
    }

    function simulateAjaxRequest(data: Record<string, FormDataEntryValue>): Promise<{ success: boolean; message: string }> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() < 0.9) {
                    resolve({ success: true, message: 'Feedback submitted successfully' });
                } else {
                    reject(new Error('Simulated network error'));
                }
            }, 1000);
        });
    }

    function showConfirmationModal(data: Record<string, FormDataEntryValue>): void {
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

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modalElement = document.getElementById('confirmationModal') as HTMLElement;
        if (modalElement) {
            const modal = new (window as any).bootstrap.Modal(modalElement); // Access Bootstrap globally
            modal.show();

            modalElement.addEventListener('hidden.bs.modal', function () {
                modalElement.remove(); // Remove modal from DOM
                location.hash = './index';
            });
        }
    }
});
