/**
 * Neural Network Background Animation
 * A 3D rotating neural network visualization for the hero section
 */

document.addEventListener('DOMContentLoaded', function() {
    const networkBg = document.querySelector('.neural-network-bg');
    if (!networkBg) return;

    // Create canvas element for the animation
    const canvas = document.createElement('canvas');
    networkBg.appendChild(canvas);

    // Performance optimization variables
    let lastFrameTime = 0;
    const targetFPS = 30; // Lower for mobile devices
    const frameInterval = 1000 / targetFPS;
    let animationId;

    // Detect if mobile device for lower node count
    const isMobile = window.innerWidth <= 768;
    const nodeCount = isMobile ? 40 : 80; // Reduce nodes for mobile

    // Set canvas to full size of container
    canvas.width = networkBg.offsetWidth;
    canvas.height = networkBg.offsetHeight;

    // Handle resize
    window.addEventListener('resize', function() {
        canvas.width = networkBg.offsetWidth;
        canvas.height = networkBg.offsetHeight;
    });

    // Set up the canvas context
    const ctx = canvas.getContext('2d');

    // Neural network parameters
    const nodes = [];
    const dataParticles = [];
    const nodeRadius = 2;
    const connectionDistance = 150;
    const rotationSpeed = 0.002;

    // Colors
    const primaryColor = '#2962FF';
    const secondaryColor = '#FF6D00';
    
    // 3D rotation variables
    let angle = 0;

    // Create nodes with 3D positions
    function createNodes() {
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width - canvas.width / 2,
                y: Math.random() * canvas.height - canvas.height / 2,
                z: Math.random() * 200 - 100,
                radius: Math.random() * nodeRadius + 1,
                color: Math.random() > 0.8 ? secondaryColor : primaryColor,
                speed: Math.random() * 0.2 + 0.1,
                pulseSpeed: Math.random() * 0.1 + 0.05,
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    // Create a data particle that travels between nodes
    function createDataParticle() {
        // Only maintain a limited number of particles
        if (dataParticles.length > 15) return;
        
        // Select two random nodes that are close enough
        let startNode, endNode;
        let attempts = 0;
        
        do {
            const startIdx = Math.floor(Math.random() * nodes.length);
            const endIdx = Math.floor(Math.random() * nodes.length);
            
            if (startIdx === endIdx) continue;
            
            startNode = nodes[startIdx];
            endNode = nodes[endIdx];
            
            const dx = startNode.x - endNode.x;
            const dy = startNode.y - endNode.y;
            const dz = startNode.z - endNode.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            if (distance < connectionDistance) {
                dataParticles.push({
                    startNode: startIdx,
                    endNode: endIdx,
                    progress: 0,
                    speed: Math.random() * 0.02 + 0.01,
                    color: Math.random() > 0.5 ? primaryColor : secondaryColor,
                    size: Math.random() * 2 + 1
                });
                return;
            }
            
            attempts++;
        } while (attempts < 10); // Limit attempts to find a valid pair
    }

    // Draw nodes and connections
    function drawNetwork() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Sort nodes by z-position for proper depth rendering
        nodes.sort((a, b) => a.z - b.z);
        
        // Draw connections
        ctx.strokeStyle = 'rgba(41, 98, 255, 0.1)';
        ctx.lineWidth = 0.5;
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dz = nodes[i].z - nodes[j].z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    // Opacity based on distance and z-position
                    const opacity = (1 - distance / connectionDistance) * 
                                   (0.5 + Math.abs(nodes[i].z) / 200) * 
                                   (0.5 + Math.abs(nodes[j].z) / 200);
                    
                    ctx.strokeStyle = `rgba(41, 98, 255, ${opacity})`;
                    
                    // Transform 3D coordinates to 2D screen coordinates
                    const x1 = nodes[i].x + canvas.width / 2;
                    const y1 = nodes[i].y + canvas.height / 2;
                    const x2 = nodes[j].x + canvas.width / 2;
                    const y2 = nodes[j].y + canvas.height / 2;
                    
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                    
                    // Occasionally add highlight connections
                    if (Math.random() > 0.995) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 109, 0, ${opacity * 2})`;
                        ctx.lineWidth = 1.5;
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.stroke();
                        ctx.lineWidth = 0.5;
                    }
                }
            }
        }
        
        // Draw data particles
        for (let i = 0; i < dataParticles.length; i++) {
            const particle = dataParticles[i];
            const startNode = nodes[particle.startNode];
            const endNode = nodes[particle.endNode];
            
            // Interpolate position
            const x = startNode.x + (endNode.x - startNode.x) * particle.progress;
            const y = startNode.y + (endNode.y - startNode.y) * particle.progress;
            const z = startNode.z + (endNode.z - startNode.z) * particle.progress;
            
            // Transform to screen coordinates
            const screenX = x + canvas.width / 2;
            const screenY = y + canvas.height / 2;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(screenX, screenY, particle.size, 0, Math.PI * 2);
            
            // Add glow effect based on particle color
            const gradient = ctx.createRadialGradient(
                screenX, screenY, 0,
                screenX, screenY, particle.size * 4
            );
            
            if (particle.color === primaryColor) {
                gradient.addColorStop(0, 'rgba(41, 98, 255, 0.8)');
                gradient.addColorStop(1, 'rgba(41, 98, 255, 0)');
            } else {
                gradient.addColorStop(0, 'rgba(255, 109, 0, 0.8)');
                gradient.addColorStop(1, 'rgba(255, 109, 0, 0)');
            }
            
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Update particle progress
            particle.progress += particle.speed;
            if (particle.progress >= 1) {
                // Remove completed particles
                dataParticles.splice(i, 1);
                i--;
            }
        }
        
        // Draw nodes
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            
            // Calculate screen position
            const screenX = node.x + canvas.width / 2;
            const screenY = node.y + canvas.height / 2;
            
            // Scale radius based on z-position for 3D effect
            const scaleFactor = (node.z + 100) / 200;
            
            // Add pulsing effect to node size
            const pulse = Math.sin(Date.now() * node.pulseSpeed + node.pulsePhase) * 0.5 + 1;
            const adjustedRadius = node.radius * (0.5 + scaleFactor) * pulse;
            
            // Draw the node with opacity based on z-position
            const opacity = 0.5 + scaleFactor * 0.5;
            
            ctx.beginPath();
            ctx.arc(screenX, screenY, adjustedRadius, 0, Math.PI * 2);
            ctx.fillStyle = node.color.replace(')', `, ${opacity})`).replace('rgb', 'rgba');
            ctx.fill();
            
            // Add glow effect
            const gradient = ctx.createRadialGradient(
                screenX, screenY, 0,
                screenX, screenY, adjustedRadius * 4
            );
            gradient.addColorStop(0, node.color.replace(')', ', 0.3)').replace('rgb', 'rgba'));
            gradient.addColorStop(1, 'rgba(41, 98, 255, 0)');
            
            ctx.beginPath();
            ctx.arc(screenX, screenY, adjustedRadius * 4, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
    }

    // Update node positions and apply 3D rotation
    function updateNodes() {
        angle += rotationSpeed;
        
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            
            // Apply 3D rotation around Y axis
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);
            
            const x = node.x;
            const z = node.z;
            
            node.x = x * cosA - z * sinA;
            node.z = z * cosA + x * sinA;
            
            // Slight movement in Y direction for more dynamic effect
            node.y += Math.sin(Date.now() * 0.001 + i) * 0.1;
            
            // Wrap around if nodes go too far
            if (node.y > canvas.height / 2) node.y = -canvas.height / 2;
            if (node.y < -canvas.height / 2) node.y = canvas.height / 2;
        }
        
        // Occasionally create a new data particle
        if (Math.random() > 0.95) {
            createDataParticle();
        }
    }

    // Animation loop with fps throttling
    function animate(timestamp) {
        animationId = requestAnimationFrame(animate);
        
        // Skip frames to maintain target FPS
        if (timestamp - lastFrameTime < frameInterval) return;
        
        lastFrameTime = timestamp;
        
        updateNodes();
        drawNetwork();
    }

    // Add event listeners for visibility changes to pause animation when tab is not visible
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animationId = requestAnimationFrame(animate);
        }
    });

    // Initialize and start animation
    createNodes();
    animationId = requestAnimationFrame(animate);
}); 