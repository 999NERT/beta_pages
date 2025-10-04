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
        
        // Setup copy functionality
        setupCopyButtons();
        
        // Setup hover effects
        setupHoverEffects();
        
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
                }
            });
        });
        
        // Set initial active section (game-section)
        document.getElementById('game-section').classList.add('active-section');
    }
    
    function setupCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-btn');
        
        copyButtons.forEach(button => {
            button.addEventListener('click', function() {
                const launchOptionsText = this.parentNode.querySelector('.launch-options-text').textContent;
                
                // Copy to clipboard
                navigator.clipboard.writeText(launchOptionsText).then(() => {
                    // Visual feedback
                    const originalHTML = this.innerHTML;
                    this.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    `;
                    this.style.background = '#00ff00';
                    this.style.borderColor = '#00ff00';
                    this.style.color = '#000';
                    
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.style.background = '';
                        this.style.borderColor = '';
                        this.style.color = '';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });
        });
    }
    
    function setupHoverEffects() {
        const cards = document.querySelectorAll('.config-card, .gear-card, .download-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.borderColor = '#AEA6FD';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.borderColor = '#333';
            });
        });
    }
    
    function monitorPerformance() {
        // Log performance metrics
        window.addEventListener('load', function() {
            if ('performance' in window) {
                const navTiming = performance.getEntriesByType('navigation')[0];
                const loadTime = navTiming.loadEventEnd - performance.timing.navigationStart;
                console.log('Page loaded in:', Math.round(loadTime) + 'ms');
            }
        });
    }
    
    // Optimized scroll handling
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
})();
