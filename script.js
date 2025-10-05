// Navigation system for switching sections and copy functionality
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        // Initialize navigation system
        setupNavigation();
        
        // Setup copy functionality for all copy buttons
        setupCopyButtons();
        
        // Setup hover effects
        setupHoverEffects();
        
        // Initialize crosshair preview
        setupCrosshairPreview();
        
        // Performance monitoring
        monitorPerformance();
    }
    
    function setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.settings-section');
        
        navButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetSection = this.getAttribute('data-section');
                
                // Remove active class from all buttons and sections
                navButtons.forEach(btn => btn.classList.remove('active'));
                sections.forEach(section => section.classList.remove('active-section'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Show target section
                const targetElement = document.getElementById(targetSection + '-section');
                if (targetElement) {
                    targetElement.classList.add('active-section');
                    
                    // Update crosshair preview when switching to game section
                    if (targetSection === 'game') {
                        updateCrosshairPreview();
                    }
                }
            });
        });
        
        // Set initial active section (game-section)
        document.getElementById('game-section').classList.add('active-section');
    }
    
    function setupCopyButtons() {
        // Select all copy buttons (commands and launch options)
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', function() {
                let textToCopy = '';
                
                // Find the text to copy based on the container
                const commandsContainer = this.closest('.commands-container');
                const launchContainer = this.closest('.launch-options-container');
                
                if (commandsContainer) {
                    textToCopy = commandsContainer.querySelector('.commands-text').textContent;
                } else if (launchContainer) {
                    textToCopy = launchContainer.querySelector('.launch-options-text').textContent;
                }
                
                if (!textToCopy) return;
                
                // Copy to clipboard
                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Visual feedback
                    showCopyFeedback(this);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    fallbackCopyText(textToCopy, this);
                });
            });
        });
    }
    
    function showCopyFeedback(button) {
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
        button.style.background = '#00ff00';
        button.style.borderColor = '#00ff00';
        button.style.color = '#000';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = '';
            button.style.borderColor = '';
            button.style.color = '';
        }, 2000);
    }
    
    function fallbackCopyText(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                showCopyFeedback(button);
            }
        } catch (err) {
            console.error('Fallback copy failed: ', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    function setupCrosshairPreview() {
        // Create crosshair based on settings
        updateCrosshairPreview();
        
        // Add crosshair animation on hover
        const crosshairDisplay = document.querySelector('.crosshair-display');
        if (crosshairDisplay) {
            crosshairDisplay.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.transition = 'transform 0.2s ease';
            });
            
            crosshairDisplay.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        }
    }
    
    function updateCrosshairPreview() {
        const crosshairElement = document.querySelector('.crosshair');
        if (!crosshairElement) return;
        
        // Get crosshair settings from the page (you could make these dynamic)
        const size = 2.5;
        const thickness = 0.5;
        const gap = -2;
        const color = '#00ff00';
        const outline = true;
        
        // Update crosshair appearance based on settings
        const crosshairSize = Math.max(10, size * 8); // Convert to pixels
        const crosshairThickness = Math.max(1, thickness * 2);
        const crosshairGap = gap * 2;
        
        // Create crosshair using CSS
        crosshairElement.style.cssText = `
            position: relative;
            width: ${crosshairSize}px;
            height: ${crosshairSize}px;
            margin: 0 auto;
        `;
        
        // Clear previous crosshair
        crosshairElement.innerHTML = '';
        
        // Create horizontal line
        const horizontalLine = document.createElement('div');
        horizontalLine.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: ${crosshairSize}px;
            height: ${crosshairThickness}px;
            background: ${color};
            transform: translate(-50%, -50%);
            ${outline ? 'box-shadow: 0 0 1px #000;' : ''}
        `;
        
        // Create vertical line
        const verticalLine = document.createElement('div');
        verticalLine.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: ${crosshairThickness}px;
            height: ${crosshairSize}px;
            background: ${color};
            transform: translate(-50%, -50%);
            ${outline ? 'box-shadow: 0 0 1px #000;' : ''}
        `;
        
        // Add gap if specified
        if (crosshairGap !== 0) {
            const gapSize = Math.abs(crosshairGap);
            horizontalLine.style.mask = `linear-gradient(90deg, transparent 0%, transparent ${gapSize}px, black ${gapSize}px, black calc(100% - ${gapSize}px), transparent calc(100% - ${gapSize}px), transparent 100%)`;
            verticalLine.style.mask = `linear-gradient(0deg, transparent 0%, transparent ${gapSize}px, black ${gapSize}px, black calc(100% - ${gapSize}px), transparent calc(100% - ${gapSize}px), transparent 100%)`;
        }
        
        crosshairElement.appendChild(horizontalLine);
        crosshairElement.appendChild(verticalLine);
        
        // Add center dot for small gaps
        if (Math.abs(gap) >= 2) {
            const centerDot = document.createElement('div');
            centerDot.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: ${crosshairThickness}px;
                height: ${crosshairThickness}px;
                background: ${color};
                border-radius: 50%;
                transform: translate(-50%, -50%);
                ${outline ? 'box-shadow: 0 0 1px #000;' : ''}
            `;
            crosshairElement.appendChild(centerDot);
        }
    }
    
    function setupHoverEffects() {
        const cards = document.querySelectorAll('.config-card, .gear-card, .download-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4)';
                this.style.borderColor = '#AEA6FD';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
                this.style.borderColor = '#444';
            });
        });
        
        // Enhanced hover effects for buttons
        const buttons = document.querySelectorAll('.nav-btn, .download-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.02)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    function monitorPerformance() {
        // Log performance metrics
        window.addEventListener('load', function() {
            if ('performance' in window) {
                const navTiming = performance.getEntriesByType('navigation')[0];
                if (navTiming) {
                    const loadTime = navTiming.loadEventEnd - navTiming.fetchStart;
                    console.log('Page loaded in:', Math.round(loadTime) + 'ms');
                    
                    // Log largest contentful paint
                    const observer = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        const lastEntry = entries[entries.length - 1];
                        console.log('LCP:', Math.round(lastEntry.startTime) + 'ms');
                    });
                    observer.observe({entryTypes: ['largest-contentful-paint']});
                }
            }
        });
        
        // Monitor frame rate
        let frameCount = 0;
        let lastTime = performance.now();
        const fpsElement = document.createElement('div');
        fpsElement.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.8);
            color: #00ff00;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            font-family: monospace;
            z-index: 10000;
            display: none;
        `;
        document.body.appendChild(fpsElement);
        
        function checkFPS() {
            frameCount++;
            const currentTime = performance.now();
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                fpsElement.textContent = `FPS: ${fps}`;
                frameCount = 0;
                lastTime = currentTime;
            }
            requestAnimationFrame(checkFPS);
        }
        
        // Start FPS monitoring (commented out by default)
        // checkFPS();
        // fpsElement.style.display = 'block';
    }
    
    // Optimized scroll handling
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                // Add parallax effect to background
                const scrolled = window.pageYOffset;
                const parallax = document.querySelector('html');
                if (parallax) {
                    parallax.style.backgroundPosition = `center ${scrolled * 0.5}px`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+C to copy from focused command container
        if (e.ctrlKey && e.key === 'c') {
            const activeElement = document.activeElement;
            const commandContainer = activeElement.closest('.commands-container, .launch-options-container');
            if (commandContainer) {
                e.preventDefault();
                const copyButton = commandContainer.querySelector('.copy-btn');
                if (copyButton) {
                    copyButton.click();
                }
            }
        }
        
        // Number keys 1-3 for navigation
        if (e.key >= '1' && e.key <= '3') {
            const sectionIndex = parseInt(e.key) - 1;
            const navButtons = document.querySelectorAll('.nav-btn');
            if (navButtons[sectionIndex]) {
                navButtons[sectionIndex].click();
            }
        }
    });
    
    // Initialize smooth animations
    function initializeAnimations() {
        // Add loading animation to cards
        const cards = document.querySelectorAll('.config-card, .gear-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 + index * 100);
        });
    }
    
    // Initialize when page is fully loaded
    window.addEventListener('load', initializeAnimations);
    
})();
