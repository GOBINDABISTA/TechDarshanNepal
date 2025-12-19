// Initialize EmailJS
emailjs.init("YOUR_PUBLIC_KEY");

// Handle career application form submission
function sendApplication(e) {
    e.preventDefault();
    
    // Get form elements
    const form = document.getElementById('careerForm');
    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Get form data
    const formData = {
        name: form.querySelector('#career-name').value,
        email: form.querySelector('#career-email').value,
        phone: form.querySelector('#career-phone').value,
        position: form.querySelector('#career-position').value,
        experience: form.querySelector('#career-experience').value,
        message: form.querySelector('#career-message').value,
        clientInterest: form.querySelector('#career-client').checked,
        clientRequirements: form.querySelector('#client-requirements').value
    };
    
    // Handle file upload
    const resumeFile = form.querySelector('#career-resume').files[0];
    if (resumeFile) {
        // Here you would typically handle file upload to your server
        // For now, we'll just add the filename to the form data
        formData.resume = resumeFile.name;
    }
    
    // Send application using EmailJS
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
        .then(function() {
            // Show success message
            showNotification('Application submitted successfully! We will contact you soon.', 'success');
            
            // Reset form
            form.reset();
            
            // Hide client requirements if shown
            const clientFields = form.querySelector('.client-fields');
            if (clientFields) {
                clientFields.style.display = 'none';
            }
        })
        .catch(function(error) {
            // Show error message
            showNotification('Error submitting application. Please try again.', 'error');
            console.error('Error:', error);
        })
        .finally(function() {
            // Reset button state
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        });
}

// Toggle client requirements field
function toggleClientFields() {
    const clientCheckbox = document.getElementById('career-client');
    const clientFields = document.querySelector('.client-fields');
    
    if (clientCheckbox && clientFields) {
        clientFields.style.display = clientCheckbox.checked ? 'block' : 'none';
    }
}

// Toggle other position field
function toggleOtherPosition() {
    const positionSelect = document.getElementById('career-position');
    const otherPositionGroup = document.getElementById('other-position-group');
    
    if (positionSelect && otherPositionGroup) {
        otherPositionGroup.style.display = positionSelect.value === 'Other' ? 'block' : 'none';
    }
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="close-notification"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Add show class after a small delay for animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.close-notification');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const careerForm = document.getElementById('careerForm');
    const clientCheckbox = document.getElementById('career-client');
    const positionSelect = document.getElementById('career-position');
    
    if (careerForm) {
        careerForm.addEventListener('submit', sendApplication);
    }
    
    if (clientCheckbox) {
        clientCheckbox.addEventListener('change', toggleClientFields);
    }
    
    if (positionSelect) {
        positionSelect.addEventListener('change', toggleOtherPosition);
    }
});

// Add styles for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        background: white;
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
    
    .notification i {
        font-size: 20px;
    }
    
    .notification.success i {
        color: #2ecc71;
    }
    
    .notification.error i {
        color: #e74c3c;
    }
    
    .close-notification {
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
        padding: 5px;
        font-size: 16px;
    }
    
    .close-notification:hover {
        color: #333;
    }
    
    @media (max-width: 768px) {
        .notification {
            top: 10px;
            right: 10px;
            left: 10px;
            transform: translateY(-120%);
        }
        
        .notification.show {
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style); 