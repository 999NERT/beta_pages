// Ultra lightweight JavaScript for performance
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        // Minimal hover effects
        setupHoverEffects();
        
        // Performance monitoring
        monitorPerformance();
    }
    
    function setupHoverEffects() {
        const cards = document.querySelectorAll('.config-card, .gear-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.borderColor = '#AEA6FD';
                this.style.transform = 'translateY(-2px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.borderColor = '#333';
                this.style.transform = 'translateY(0)';
            });
        });
    }
    
    function monitorPerformance() {
        // Log performance metrics
        window.addEventListener('load', function() {
            if ('performance' in window) {
                const navTiming = performance.getEntriesByType('navigation')[0];
                const loadTime = navTiming.loadEventEnd - navTiming.navigationStart;
                console.log('Page loaded in:', Math.round(loadTime) + 'ms');
            }
        });
    }
    
    // Optimized scroll handling
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                // Add any scroll-based effects here if needed
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
})();
