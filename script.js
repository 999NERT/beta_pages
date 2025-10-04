// Minimal JavaScript for performance
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Simple intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target.querySelector('img');
                    if (img && img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });

        // Observe player image for lazy loading
        const playerImage = document.querySelector('.player-image');
        if (playerImage) {
            observer.observe(playerImage);
        }
    }

    // Add subtle hover effects
    function addHoverEffects() {
        const settingGroups = document.querySelectorAll('.setting-group');
        const gearItems = document.querySelectorAll('.gear-item');

        settingGroups.forEach(group => {
            group.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            group.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        gearItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // Initialize hover effects after a short delay to prevent blocking initial render
    setTimeout(addHoverEffects, 100);

    // Simple performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log('Page load time:', loadTime + 'ms');
        });
    }

    // Optimize scroll performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                scrollTimeout = null;
                // Handle scroll events here if needed
            }, 100);
        }
    }, { passive: true });

    // Preload critical images
    function preloadCriticalImages() {
        const criticalImages = [
            'angelka.png'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    // Preload after initial render
    setTimeout(preloadCriticalImages, 500);
});

// Service Worker registration for caching (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('SW registered: ', registration);
        }).catch(function(registrationError) {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
