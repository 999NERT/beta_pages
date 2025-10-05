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
        
        // Setup hover effects (lightweight)
        setupHoverEffects();
        
        // Initialize crosshair preview
        setupCrosshairPreview();
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
        const isWhiteBtn = button.classList.contains('white-copy-btn');
        
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
        
        if (isWhiteBtn) {
            button.style.background = '#00aa00';
            button.style.borderColor = '#00aa00';
            button.style.color = '#fff';
        } else {
            button.style.background = '#00ff00';
            button.style.borderColor = '#00ff00';
            button.style.color = '#000';
        }
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = '';
            button.style.borderColor = '';
            button.style.color = '';
        }, 1500);
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
        // Simple crosshair setup - no heavy animations
        updateCrosshairPreview();
    }
    
    function updateCrosshairPreview() {
        const crosshairElement = document.querySelector('.crosshair');
        if (!crosshairElement) return;
        
        // Simple static crosshair - no dynamic calculations for performance
        crosshairElement.innerHTML = '';
        
        const horizontalLine = document.createElement('div');
        horizontalLine.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 2px;
            background: #00ff00;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 1px #000;
        `;
        
        const verticalLine = document.createElement('div');
        verticalLine.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 2px;
            height: 20px;
            background: #00ff00;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 1px #000;
        `;
        
        crosshairElement.appendChild(horizontalLine);
        crosshairElement.appendChild(verticalLine);
    }
    
    function setupHoverEffects() {
        // Lightweight hover effects only
        const cards = document.querySelectorAll('.config-card, .gear-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.borderColor = '#AEA6FD';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.borderColor = '#333';
            });
        });
    }
    
    // Simple keyboard shortcuts
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
    });
    
})();
