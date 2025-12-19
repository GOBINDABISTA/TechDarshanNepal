/**
 * Particles Background Effect
 * Creates an interactive particle system for section backgrounds
 */

document.addEventListener('DOMContentLoaded', function() {
    // Sections to apply particles background to
    const particleSections = ['.hero', '.about', '.services', '.success'];
    
    // Create particles container for each section
    particleSections.forEach(sectionClass => {
        const section = document.querySelector(sectionClass);
        if (!section) return;
        
        // Create particles container
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles-container';
        
        // Insert as first child to be behind other content
        if (section.firstChild) {
            section.insertBefore(particlesContainer, section.firstChild);
        } else {
            section.appendChild(particlesContainer);
        }
        
        // Initialize particles
        createParticles(particlesContainer);
    });
    
    // Create particles in container
    function createParticles(container) {
        const particleCount = window.innerWidth < 768 ? 30 : 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = Math.random() * 5 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const opacity = Math.random() * 0.5 + 0.1;
            const animDuration = Math.random() * 20 + 10;
            const animDelay = Math.random() * 10;
            
            // Apply styles
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.opacity = opacity;
            particle.style.animationDuration = `${animDuration}s`;
            particle.style.animationDelay = `${animDelay}s`;
            
            // Add to container
            container.appendChild(particle);
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Remove existing particles
        document.querySelectorAll('.particles-container').forEach(container => {
            container.innerHTML = '';
            createParticles(container);
        });
    });
}); 