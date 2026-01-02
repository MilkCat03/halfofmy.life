// Detect if user is on mobile and show warning popup
(function() {
    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.innerWidth <= 768;
    
    if (isMobile) {
        // Create popup overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        `;
        
        // Create popup box
        const popup = document.createElement('div');
        popup.style.cssText = `
            background-color: black;
            border: 2px solid yellow;
            padding: 20px;
            border-radius: 10px;
            max-width: 80%;
            position: relative;
            color: white;
            font-family: 'Comic Mono', monospace;
        `;
        
        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'X';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: transparent;
            border: 2px solid yellow;
            color: yellow;
            font-size: 20px;
            cursor: pointer;
            width: 30px;
            height: 30px;
            border-radius: 5px;
            font-family: 'Comic Mono', monospace;
        `;
        
        // Create message
        const message = document.createElement('p');
        message.textContent = 'this website was made to be viewed on desktop. it might be very broken on mobile. good luck';
        message.style.cssText = `
            margin: 10px 30px 10px 10px;
            line-height: 1.5;
        `;
        
        // Close popup when X is clicked
        closeBtn.onclick = function() {
            document.body.removeChild(overlay);
        };
        
        // Assemble popup
        popup.appendChild(closeBtn);
        popup.appendChild(message);
        overlay.appendChild(popup);
        
        // Add to page when DOM is ready
        if (document.body) {
            document.body.appendChild(overlay);
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                document.body.appendChild(overlay);
            });
        }
    }
})();
