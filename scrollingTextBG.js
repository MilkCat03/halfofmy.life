(function () {
    function createScrollingTextBG(text) {
        if (!text) {
            console.warn('createScrollingTextBG: no text provided');
            return;
        }

        // ================= CONFIG =================
        const CONFIG = {
            text: text,
            fontSize: 24,
            lineSpacing: 18,
            minSpeed: 1,
            maxSpeed: 1.6,
            minOpacity: 0.15,
            maxOpacity: 0.3,
            backgroundColor: '#111',
            textColor: 'white',
            maxRows: 50,
            fadeDistance: 300, // px distance for fade in/out
            xOffset: -500, // Start text further off-screen for smoother fade-in
            wordSpacing: 0, // Space between words
        };

        // ================= HELPERS =================
        // Split text into words while preserving spaces
        function splitIntoWords(text) {
            // Split by spaces but keep spaces as separate elements
            const parts = [];
            let currentWord = '';
            
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                if (char === ' ') {
                    if (currentWord) {
                        parts.push(currentWord);
                        currentWord = '';
                    }
                    parts.push(' ');
                } else {
                    currentWord += char;
                }
            }
            
            if (currentWord) {
                parts.push(currentWord);
            }
            
            return parts;
        }

        const words = splitIntoWords(CONFIG.text);

        // ================= CANVAS =================
        const canvas = document.createElement('canvas');
        canvas.id = 'bg-canvas';
        Object.assign(canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            zIndex: '-1',
            pointerEvents: 'none',
            backgroundColor: CONFIG.backgroundColor,
        });

        document.body.prepend(canvas);

        const ctx = canvas.getContext('2d');

        // ================= STATE =================
        let textPositions = [];
        let running = true;
        let textWidth, lastFrame = 0;

        // ================= TEXT CACHE =================
        function buildTextTexture() {
            ctx.font = `${CONFIG.fontSize}px Comic Mono, monospace`;
            const rows = Math.min(Math.ceil(canvas.height / (CONFIG.fontSize + CONFIG.lineSpacing)), CONFIG.maxRows);
            
            // Calculate total width of all words with spacing
            const wordWidths = words.map(w => ctx.measureText(w).width);
            const totalWordWidth = wordWidths.reduce((a, b) => a + b, 0) + (words.length - 1) * CONFIG.wordSpacing;
            
            textPositions = [];
            for (let row = 0; row < rows; row++) {
                const rowSpeed = CONFIG.minSpeed + Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed);
                const numRepeats = Math.ceil((canvas.width + Math.abs(CONFIG.xOffset) + CONFIG.fadeDistance) / totalWordWidth) + 2;
                
                for (let repeat = 0; repeat < numRepeats; repeat++) {
                    let xPos = repeat * totalWordWidth + CONFIG.xOffset;
                    
                    for (let i = 0; i < words.length; i++) {
                        textPositions.push({
                            word: words[i],
                            x: xPos,
                            y: row * (CONFIG.fontSize + CONFIG.lineSpacing),
                            speed: rowSpeed,
                            baseOpacity: CONFIG.minOpacity + Math.random() * (CONFIG.maxOpacity - CONFIG.minOpacity),
                            width: wordWidths[i]
                        });
                        xPos += wordWidths[i] + CONFIG.wordSpacing;
                    }
                }
            }
        }

        // ================= INIT =================
        function resize() {
            const dpr = window.devicePixelRatio || 1;

            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            buildTextTexture();
        }

        // ================= LOOP =================
        function animate(now) {
            if (now - lastFrame < 16) {
                requestAnimationFrame(animate);
                return;
            }
            lastFrame = now;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = CONFIG.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${CONFIG.fontSize}px Comic Mono, monospace`;

            // Smooth easing function (ease-in-out cubic)
            const easeInOutCubic = (t) => {
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            };

            for (let i = 0; i < textPositions.length; i++) {
                const pos = textPositions[i];
                const wordEndX = pos.x + pos.width;

                // Use baseOpacity for variation
                let opacity = pos.baseOpacity;

                // Fade in from xOffset to x=0 with smooth easing
                if (pos.x < 0) {
                    const fadeProgress = (pos.x - CONFIG.xOffset) / (-CONFIG.xOffset);
                    opacity *= easeInOutCubic(fadeProgress);
                } 
                // Fade out each word individually as it approaches the right edge
                else if (wordEndX > canvas.width - CONFIG.fadeDistance) {
                    const fadeProgress = (canvas.width - wordEndX) / CONFIG.fadeDistance;
                    opacity *= easeInOutCubic(Math.max(0, fadeProgress));
                }

                // Clamp opacity
                opacity = Math.max(0, Math.min(opacity, 1));

                // Only draw if visible
                if (opacity > 0.01 && pos.x < canvas.width && wordEndX > 0) {
                    ctx.fillStyle = `rgba(255,255,255,${opacity})`;
                    ctx.fillText(pos.word, pos.x, pos.y);
                }

                pos.x += pos.speed;
                
                // Reset word position when it goes off screen
                if (pos.x > canvas.width + CONFIG.fadeDistance) {
                    // Calculate total width for reset
                    const wordWidths = words.map(w => ctx.measureText(w).width);
                    const totalWordWidth = wordWidths.reduce((a, b) => a + b, 0) + (words.length - 1) * CONFIG.wordSpacing;
                    pos.x -= totalWordWidth * Math.ceil((pos.x - CONFIG.xOffset) / totalWordWidth);
                }
            }
            requestAnimationFrame(animate);
        }

        // ================= VISIBILITY =================
        document.addEventListener('visibilitychange', () => {
            running = !document.hidden;
        });

        // ================= START =================
        resize();
        window.addEventListener('resize', resize);
        requestAnimationFrame(animate);
    }

    // Expose globally
    window.createScrollingTextBG = createScrollingTextBG;
})();