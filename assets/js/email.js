// Initialize EmailJS with your public key
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual EmailJS public key
})();

// Function to handle contact form submission
function sendEmail(e) {
    e.preventDefault();

    // Get form data
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    const formData = {
        name: form.querySelector('#name').value,
        email: form.querySelector('#email').value,
        phone: form.querySelector('#phone').value,
        subject: form.querySelector('#subject').value,
        message: form.querySelector('#message').value
    };

    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Send email using EmailJS
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
        .then(function(response) {
            // Show success message
            showNotification('Message sent successfully! We will get back to you soon.', 'success');
            
            // Reset form
            form.reset();
            
            // Reset button state
            submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
            submitBtn.disabled = false;
        })
        .catch(function(error) {
            // Show error message
            showNotification('Failed to send message. Please try again later.', 'error');
            
            // Reset button state
            submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
            submitBtn.disabled = false;
            
            console.error('EmailJS error:', error);
        });
}

// Function to handle career application submission
function sendApplication(e) {
    e.preventDefault();

    // Get form data
    const form = document.getElementById('careerForm');
    const submitBtn = form.querySelector('.submit-btn');
    
    // Get the resume file
    const resumeFile = form.querySelector('#career-resume').files[0];
    if (!resumeFile) {
        showNotification('Please upload your resume.', 'error');
        return;
    }

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append('name', form.querySelector('#career-name').value);
    formData.append('email', form.querySelector('#career-email').value);
    formData.append('phone', form.querySelector('#career-phone').value);
    formData.append('position', form.querySelector('#career-position').value);
    formData.append('experience', form.querySelector('#career-experience').value);
    formData.append('message', form.querySelector('#career-message').value);
    formData.append('resume', resumeFile);

    // Add other position if specified
    const otherPosition = form.querySelector('#other-position');
    if (otherPosition && otherPosition.value) {
        formData.append('other_position', otherPosition.value);
    }

    // Add client requirements if specified
    const clientRequirements = form.querySelector('#client-requirements');
    if (clientRequirements && clientRequirements.value) {
        formData.append('client_requirements', clientRequirements.value);
    }

    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;

    // Send application using EmailJS
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_CAREER_TEMPLATE_ID', formData)
        .then(function(response) {
            // Show success message
            showNotification('Application submitted successfully! We will review your application and get back to you soon.', 'success');
            
            // Reset form
            form.reset();
            
            // Reset button state
            submitBtn.innerHTML = 'Submit Application';
            submitBtn.disabled = false;
        })
        .catch(function(error) {
            // Show error message
            showNotification('Failed to submit application. Please try again later.', 'error');
            
            // Reset button state
            submitBtn.innerHTML = 'Submit Application';
            submitBtn.disabled = false;
            
            console.error('EmailJS error:', error);
        });
}

// Function to handle other position field visibility
function toggleOtherPosition() {
    const positionSelect = document.querySelector('#career-position');
    const otherPositionGroup = document.querySelector('#other-position-group');
    
    if (positionSelect.value === 'Other') {
        otherPositionGroup.style.display = 'block';
    } else {
        otherPositionGroup.style.display = 'none';
    }
}

// Function to handle client fields visibility
function toggleClientFields() {
    const clientCheckbox = document.querySelector('#career-client');
    const clientFields = document.querySelector('.client-fields');
    
    if (clientCheckbox.checked) {
        clientFields.style.display = 'block';
    } else {
        clientFields.style.display = 'none';
    }
}

// Function to show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Add notification to the page
    document.body.appendChild(notification);

    // Add show class after a small delay
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Add click event to close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', sendEmail);
    }

    // Career form
    const careerForm = document.getElementById('careerForm');
    if (careerForm) {
        careerForm.addEventListener('submit', sendApplication);
        
        // Add event listeners for dynamic fields
        const positionSelect = careerForm.querySelector('#career-position');
        if (positionSelect) {
            positionSelect.addEventListener('change', toggleOtherPosition);
        }

        const clientCheckbox = careerForm.querySelector('#career-client');
        if (clientCheckbox) {
            clientCheckbox.addEventListener('change', toggleClientFields);
        }
    }
});

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 1000;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification.success {
        border-left: 4px solid #2ecc71;
    }

    .notification.error {
        border-left: 4px solid #e74c3c;
    }

    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .notification-content i {
        font-size: 20px;
    }

    .notification.success i {
        color: #2ecc71;
    }

    .notification.error i {
        color: #e74c3c;
    }

    .notification-close {
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        padding: 5px;
        transition: color 0.3s ease;
    }

    .notification-close:hover {
        color: #333;
    }

    @media (max-width: 480px) {
        .notification {
            left: 20px;
            right: 20px;
            transform: translateY(-120%);
        }

        .notification.show {
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style); 