/**
 * Digital Solution4All Nepal - Main JavaScript
 * Author: Digital Solution4All Team
 * Version: 1.0
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeAnnouncementBar();
    initializeBackToTop();
    initializeCookieConsent();
    initializeServiceCards();
    initializeTestimonials();
    initializeBlogFilters();
    initializeSuccessFilters();
    initializeVideoModals();
    initializeTypingText();
});

// Navigation functionality
function initializeNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const dropdowns = document.querySelectorAll('.has-dropdown');
    const submenus = document.querySelectorAll('.has-submenu');
    const menuBackdrop = document.querySelector('.menu-backdrop');
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            if (menuBackdrop) {
                menuBackdrop.classList.toggle('active');
            }
        });
    }
    
    // Close menu when clicking backdrop
    if (menuBackdrop) {
        menuBackdrop.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuBackdrop.classList.remove('active');
        });
    }

    // Dropdown menus
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        
        if (dropdownLink) {
            dropdownLink.addEventListener('click', (e) => {
            e.preventDefault();
                // Close other dropdowns
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('active');
                    }
                });
                dropdown.classList.toggle('active');
            });
        }
    });
    
    // Submenus
    submenus.forEach(submenu => {
        const submenuLink = submenu.querySelector('a');
        
        if (submenuLink) {
            submenuLink.addEventListener('click', (e) => {
            e.preventDefault();
                // Close other submenus
                submenus.forEach(other => {
                    if (other !== submenu) {
                        other.classList.remove('active');
                    }
                });
                submenu.classList.toggle('active');
            });
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-menu') && !e.target.closest('.menu-toggle')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
            if (menuBackdrop) {
                menuBackdrop.classList.remove('active');
            }
            // Close all dropdowns and submenus
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            submenus.forEach(submenu => submenu.classList.remove('active'));
        }
    });

    // Close menu when a nav link is clicked (mobile)
    navMenu.querySelectorAll('a:not(.has-dropdown a):not(.has-submenu a)').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
                if (menuBackdrop) {
                    menuBackdrop.classList.remove('active');
                }
            }
        });
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
                if (menuBackdrop) {
                    menuBackdrop.classList.remove('active');
                }
                // Reset all dropdowns and submenus
                dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
                submenus.forEach(submenu => submenu.classList.remove('active'));
            }
        }, 250);
    });

    // Sticky navigation
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
}

// Announcement bar functionality
function initializeAnnouncementBar() {
    const announcementBar = document.querySelector('.announcement-bar');
    const closeButton = document.querySelector('.close-announcement');

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            announcementBar.style.display = 'none';
            localStorage.setItem('announcementClosed', 'true');
        });
    }

    // Check if announcement was previously closed
    if (localStorage.getItem('announcementClosed') === 'true') {
        announcementBar.style.display = 'none';
    }
}

// Back to top button functionality
function initializeBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    }
}

// Cookie consent functionality
function initializeCookieConsent() {
    const cookieBanner = document.getElementById('cookie-consent');
    const acceptButton = document.getElementById('cookie-accept');
    const declineButton = document.getElementById('cookie-decline');

    if (cookieBanner && !localStorage.getItem('cookieConsent')) {
        cookieBanner.style.display = 'block';
    }

    if (acceptButton) {
        acceptButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'accepted');
            cookieBanner.style.display = 'none';
        });
    }

    if (declineButton) {
        declineButton.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'declined');
            cookieBanner.style.display = 'none';
        });
    }
}

// Service cards functionality
function initializeServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        const learnMoreBtn = card.querySelector('.learn-more-btn');
        const serviceDetails = card.querySelector('.service-details');
        
        if (learnMoreBtn && serviceDetails) {
            learnMoreBtn.addEventListener('click', () => {
                serviceDetails.classList.toggle('active');
                learnMoreBtn.textContent = serviceDetails.classList.contains('active') ? 'Show Less' : 'Learn More';
            });
        }
    });
}

// Testimonials slider functionality
function initializeTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev-testimonial');
    const nextBtn = document.querySelector('.next-testimonial');
    let currentIndex = 0;

    if (testimonials.length > 0) {
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.style.display = i === index ? 'block' : 'none';
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
                showTestimonial(currentIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % testimonials.length;
                showTestimonial(currentIndex);
            });
        }

        // Show first testimonial initially
        showTestimonial(currentIndex);
    }
}

// Blog filters functionality
function initializeBlogFilters() {
    const filterButtons = document.querySelectorAll('.category-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter blog cards
            blogCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Success stories filters functionality
function initializeSuccessFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const successCards = document.querySelectorAll('.success-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.filter;
                
                // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
                
                // Filter success cards
                successCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
// Video modal functionality
function initializeVideoModals() {
    const videoButtons = document.querySelectorAll('.video-play i, .blog-video-btn');
    const videoModal = document.getElementById('video-modal');
    const closeModal = document.querySelector('.close-modal');
    const videoFrame = document.getElementById('youtube-frame');

    videoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const videoUrl = button.dataset.video;
            if (videoFrame) {
                videoFrame.src = videoUrl;
            }
            if (videoModal) {
                videoModal.style.display = 'block';
            }
        });
    });

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (videoModal) {
                videoModal.style.display = 'none';
            }
            if (videoFrame) {
                videoFrame.src = '';
            }
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            if (videoFrame) {
                videoFrame.src = '';
            }
        }
        });
    }
    
    // Typing text animation
function initializeTypingText() {
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const texts = JSON.parse(typingElement.dataset.text);
        let textIndex = 0;
        let charIndex = 0;
            let isDeleting = false;
        let typingDelay = 100;
            
            function type() {
            const currentText = texts[textIndex];
                
                if (isDeleting) {
                typingElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingDelay = 50;
                } else {
                typingElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingDelay = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                    isDeleting = true;
                typingDelay = 2000;
            } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingDelay = 500;
            }

            setTimeout(type, typingDelay);
        }

        type();
    }
} 