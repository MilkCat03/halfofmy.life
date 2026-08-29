(function () {
    const DEFAULT_TEXTS = [
        "time flies, doesn't it?",
        "precariously placed trees",
        "not able to breathe",
        "wish i could've seen what you'd grow into",
        "can't get clean.",
        "watch my life circle down",
        "darkness cold and",
        "screaming loud",
        "trembling pulling",
        "all my hair out",
        "gasping, lashing",
        "blacking out",
        "you weren't there",
        "when i could've written my end",
        "faceless regretment",
        "wondering where it went wrong",
        "lost, afraid",
        "no going back home",
        "frigid, naked, afraid",
        "self inflicted headaches",
        "split open left to ache",
        "and i like things clearer",
        "but you're frosted glass",
        "i'll go ask the mirror",
        "if this day will be my last",
        "i am lost, you are lost",
        "and im the cause",
        "makes people feel like they NEED the product",
        "stuck in past-time",
        "is this goodbye?",
        "and you'll laugh again",
        "against the pavement",
        "and we'll all wonder",
        "what happened to you?",
        "and you're talking in riddles",
        "and i just don't understand",
        "pacing in circles",
        "tryna be the better man",
        "and the days are getting clearer",
        "and the sky doesn't seem so grey",
        "my feet don't drag on pavement",
        "and the people smile back at me",
        "hopeless hoping",
        "sleepless nights",
        "wakeless mornings",
        "sun will not rise.",
        "leave me.",
        "leave me behind.",
        "and i'm running in circles",
        "trapped behind doors again",
        "oh please just hear me screaming",
        "falling away from me",
        "running away from me",
        "and one day",
        "ill finally be me",
        "down the street",
        "theres a kid",
        "in a house",
        "trapped again",
        "there's no bright lights",
        "to fill up the night",
        "just stay alive",
        "you'd look so pretty",
        "numbers said, overfed.",
        "pretty.",
        "in a brief moment of your existence",
    ];

    function randomFrom(list) {
        return list[Math.floor(Math.random() * list.length)];
    }

    function createScrollingTextBG(textOptions) {
        const textList = Array.isArray(textOptions)
            ? textOptions.filter(Boolean)
            : typeof textOptions === 'string' && textOptions.trim()
                ? [textOptions]
                : DEFAULT_TEXTS;

        if (!textList.length) {
            console.warn('createScrollingTextBG: no valid text provided');
            return;
        }

        const CONFIG = {
            fontSize: 24,
            lineHeight: 40,
            minSpeed: 0.4,
            maxSpeed: 2.2,
            minOpacity: 0.12,
            maxOpacity: 0.45,
            backgroundColor: '#111111',
            textColor: '#ffffff',
            maxRows: 50,
            fadeDistance: 600,
            gap: 120
        };

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
            opacity: '1'
        });

        document.body.prepend(canvas);

        const ctx = canvas.getContext('2d');
        const rows = [];
        let lastFrame = 0;

        function buildPhrase() {
            const count = 2 + Math.floor(Math.random() * 3);
            const picked = [];
            const pool = [...textList];

            for (let i = 0; i < count && pool.length; i++) {
                const index = Math.floor(Math.random() * pool.length);
                picked.push(pool.splice(index, 1)[0]);
            }

            return picked.join(' - ');
        }

        function resetRow(row) {
            row.text = buildPhrase();
            row.speed = CONFIG.minSpeed + Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed);
            row.opacity = CONFIG.minOpacity + Math.random() * (CONFIG.maxOpacity - CONFIG.minOpacity);
            row.width = ctx.measureText(row.text).width;
            row.offset = -Math.random() * canvas.width - row.width - 120;
        }

        function buildRows() {
            const rowCount = Math.min(Math.ceil(canvas.height / CONFIG.lineHeight), CONFIG.maxRows);
            rows.length = 0;

            ctx.font = `${CONFIG.fontSize}px Comic Mono, monospace`;

            for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
                const row = {
                    text: '',
                    speed: 0,
                    opacity: 0,
                    width: 0,
                    offset: 0,
                    y: rowIndex * CONFIG.lineHeight + 20 + Math.random() * 12
                };
                resetRow(row);
                rows.push(row);
            }
        }

        function resize() {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.textBaseline = 'top';
            buildRows();
        }

        function drawRow(row) {
            const phraseWidth = row.width;
            const cycleLength = phraseWidth + CONFIG.gap;
            const repeats = Math.ceil((canvas.width + cycleLength * 2) / cycleLength) + 2;

            for (let i = -1; i < repeats; i++) {
                const x = row.offset + i * cycleLength;
                const endX = x + phraseWidth;
                let alpha = row.opacity;

                if (x < 0) {
                    alpha *= Math.max(0, (x + cycleLength) / cycleLength);
                }

                if (endX > canvas.width) {
                    alpha *= Math.max(0, (canvas.width - x) / CONFIG.fadeDistance);
                }

                if (alpha > 0.01 && x < canvas.width + CONFIG.fadeDistance && endX > -CONFIG.fadeDistance) {
                    ctx.fillStyle = `rgba(255,255,255,${Math.min(1, alpha)})`;
                    ctx.fillText(row.text, x, row.y);
                }
            }

            row.offset += row.speed;

            if (row.offset > canvas.width + phraseWidth + CONFIG.gap) {
                resetRow(row);
            }
        }

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

            rows.forEach(drawRow);
            requestAnimationFrame(animate);
        }

        resize();
        window.addEventListener('resize', resize);
        requestAnimationFrame(animate);
    }

    window.createScrollingTextBG = createScrollingTextBG;
})();