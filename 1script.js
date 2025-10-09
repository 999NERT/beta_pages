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
        
        // Setup autoexec copy functionality
        setupAutoexecCopy();
        
        // Setup binds copy functionality
        setupBindsCopy();
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
                const bindsContainer = this.closest('.binds-commands-container');
                
                if (commandsContainer) {
                    textToCopy = commandsContainer.querySelector('.commands-text').textContent;
                } else if (launchContainer) {
                    textToCopy = launchContainer.querySelector('.launch-options-text').textContent;
                } else if (bindsContainer) {
                    textToCopy = bindsContainer.querySelector('.binds-commands-text').textContent;
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
    
    function setupAutoexecCopy() {
        const copyAutoexecBtn = document.querySelector('.copy-autoexec-btn');
        
        if (copyAutoexecBtn) {
            copyAutoexecBtn.addEventListener('click', function() {
                const autoexecCode = document.querySelector('.autoexec-code');
                if (!autoexecCode) return;
                
                const textToCopy = autoexecCode.textContent;
                
                // Copy to clipboard
                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Visual feedback
                    showAutoexecCopyFeedback(this);
                }).catch(err => {
                    console.error('Failed to copy autoexec: ', err);
                    fallbackCopyText(textToCopy, this);
                });
            });
        }
    }
    
    function setupBindsCopy() {
        const copyBindsBtn = document.querySelector('.binds-commands-container .copy-btn');
        
        if (copyBindsBtn) {
            copyBindsBtn.addEventListener('click', function() {
                const bindsCommands = document.querySelector('.binds-commands-text');
                if (!bindsCommands) return;
                
                const textToCopy = bindsCommands.textContent;
                
                // Copy to clipboard
                navigator.clipboard.writeText(textToCopy).then(() => {
                    // Visual feedback
                    showCopyFeedback(this);
                }).catch(err => {
                    console.error('Failed to copy binds: ', err);
                    fallbackCopyText(textToCopy, this);
                });
            });
        }
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
    
    function showAutoexecCopyFeedback(button) {
        const originalHTML = button.innerHTML;
        const originalBackground = button.style.background;
        const originalBorder = button.style.borderColor;
        const originalColor = button.style.color;
        
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
        `;
        
        button.style.background = '#00aa00';
        button.style.borderColor = '#00aa00';
        button.style.color = '#fff';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = originalBackground;
            button.style.borderColor = originalBorder;
            button.style.color = originalColor;
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
                if (button.classList.contains('copy-autoexec-btn')) {
                    showAutoexecCopyFeedback(button);
                } else {
                    showCopyFeedback(button);
                }
            }
        } catch (err) {
            console.error('Fallback copy failed: ', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    function setupCrosshairPreview() {
        // Create crosshair based on the new settings
        updateCrosshairPreview();
    }
    
    function updateCrosshairPreview() {
        const crosshairElement = document.querySelector('.crosshair');
        if (!crosshairElement) return;
        
        crosshairElement.innerHTML = '';
        
        // Crosshair settings from the commands
        const crosshairStyle = 4; // cl_crosshairstyle 4
        const crosshairSize = 1; // cl_crosshairsize 1
        const crosshairThickness = 0.5; // cl_crosshairthickness 0.5
        const crosshairGap = -2; // cl_crosshairgap -2
        const drawOutline = true; // cl_crosshair_drawoutline 1
        const outlineThickness = 1; // cl_crosshair_outlinethickness 1
        const crosshairColor = '#ffff00'; // cl_crosshaircolor 5 (Yellow)
        const crosshairDot = false; // cl_crosshairdot 0
        
        // Calculate dimensions based on settings
        const armLength = crosshairSize * 3; // Length of crosshair arms
        const gapSize = Math.abs(crosshairGap) * 0.5; // Gap from center
        
        // Create crosshair elements
        if (crosshairStyle === 4) { // Classic Static
            // Horizontal line
            const horizontalLine = document.createElement('div');
            horizontalLine.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: ${armLength * 2}px;
                height: ${crosshairThickness}px;
                background: ${crosshairColor};
                transform: translate(-50%, -50%);
            `;
            
            // Vertical line
            const verticalLine = document.createElement('div');
            verticalLine.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: ${crosshairThickness}px;
                height: ${armLength * 2}px;
                background: ${crosshairColor};
                transform: translate(-50%, -50%);
            `;
            
            // Add outline if enabled
            if (drawOutline) {
                const outlineColor = '#000000';
                
                const horizontalOutline = document.createElement('div');
                horizontalOutline.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: ${(armLength * 2) + (outlineThickness * 2)}px;
                    height: ${crosshairThickness + (outlineThickness * 2)}px;
                    background: ${outlineColor};
                    transform: translate(-50%, -50%);
                    z-index: -1;
                `;
                
                const verticalOutline = document.createElement('div');
                verticalOutline.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: ${crosshairThickness + (outlineThickness * 2)}px;
                    height: ${(armLength * 2) + (outlineThickness * 2)}px;
                    background: ${outlineColor};
                    transform: translate(-50%, -50%);
                    z-index: -1;
                `;
                
                crosshairElement.appendChild(horizontalOutline);
                crosshairElement.appendChild(verticalOutline);
            }
            
            crosshairElement.appendChild(horizontalLine);
            crosshairElement.appendChild(verticalLine);
            
            // Add center dot if enabled
            if (crosshairDot) {
                const centerDot = document.createElement('div');
                centerDot.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: ${crosshairThickness}px;
                    height: ${crosshairThickness}px;
                    background: ${crosshairColor};
                    transform: translate(-50%, -50%);
                    border-radius: 50%;
                `;
                crosshairElement.appendChild(centerDot);
            }
        }
    }
    
    function setupHoverEffects() {
        // Lightweight hover effects only
        const cards = document.querySelectorAll('.config-card, .gear-category');
        
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
            const commandContainer = activeElement.closest('.commands-container, .launch-options-container, .binds-commands-container');
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
