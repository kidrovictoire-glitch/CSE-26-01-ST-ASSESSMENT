document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        let isValid = true;

        // Function to set error state
        const setError = (element, message) => {
            isValid = false;
            element.classList.add('is-invalid');
            const feedback = element.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.textContent = message;
                feedback.style.display = 'block';
            }
        };

        // Function to clear error state and set valid state
        const setValid = (element) => {
            element.classList.remove('is-invalid');
            element.classList.add('is-valid');
            const feedback = element.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
                feedback.style.display = 'none';
            }
        };

        // List of all required inputs to check for emptiness
        const inputs = [
            document.getElementById('firstName'),
            document.getElementById('lastName'),
            document.getElementById('dob'),
            document.getElementById('placeOfBirth'),
            document.getElementById('nationality'),
            document.getElementById('maritalStatus'),
            document.getElementById('settlementCamp'),
            document.getElementById('dateOfJoining')
        ];

        // 1. Check for empty fields and specific constraints
        inputs.forEach(input => {
            const val = input.value.trim();
            const id = input.id;
            
            if (!val) {
                // For select boxes and empty text inputs
                setError(input, 'Invalid field');
                return;
            }

            // Rules: First name, Last name, and Place of birth must be at least 2 characters long
            if ((id === 'firstName' || id === 'lastName' || id === 'placeOfBirth') && val.length < 2) {
                setError(input, 'Invalid field');
                return;
            }

            // Rules for dates
            if (id === 'dob' || id === 'dateOfJoining') {
                const inputDate = new Date(val);
                // "Today" at midnight for accurate date comparison without time issues
                const today = new Date();
                today.setHours(0,0,0,0);

                if (id === 'dob' && inputDate >= today) {
                    // Date of birth must be *before* date of registration (today)
                    setError(input, 'Invalid field');
                    return;
                }
                
                if (id === 'dateOfJoining' && inputDate <= today) {
                    // Date of joining settlement camp must be *after* date of registration (today)
                    setError(input, 'Invalid field');
                    return;
                }
            }

            // If it passes all checks
            setValid(input);
        });

        // If form is valid, submit data to backend!
        if (isValid) {
            const formData = {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                dateOfBirth: document.getElementById('dob').value,
                placeOfBirth: document.getElementById('placeOfBirth').value.trim(),
                gender: document.querySelector('input[name="gender"]:checked').value,
                nationality: document.getElementById('nationality').value,
                maritalStatus: document.getElementById('maritalStatus').value,
                settlementCamp: document.getElementById('settlementCamp').value,
                dateOfJoining: document.getElementById('dateOfJoining').value
            };

            // Disable button during submission
            const submitBtn = document.querySelector('.btn-submit');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Registering...';
            submitBtn.disabled = true;

            fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    // This handles cases like 405 Method Not Allowed or 404
                    throw new Error(`Server returned ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.id || data.message === 'Beneficiary registered successfully!') {
                    // Show the success alert at the top
                    document.getElementById('successAlert').style.display = 'flex';
                    
                    // Reset all fields (clears text and resets selects/dates to default)
                    form.reset();
                    
                    // Reset "is-valid" borders to default state
                    inputs.forEach(input => {
                        input.classList.remove('is-valid');
                    });
                    
                    // Reset gender to default (Female) per rules just to be safe
                    document.getElementById('genderFemale').checked = true;
                } else {
                    alert('Registration failed: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred during registration. Check server connection.');
            })
            .finally(() => {
                // Restore button state
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        }
    });
});

// Function to handle closing the success alert
function closeSuccessAlert() {
    const alertBox = document.getElementById('successAlert');
    alertBox.style.display = 'none';
}
