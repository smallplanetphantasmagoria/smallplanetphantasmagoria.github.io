document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('globeCanvas');
    const ctx = canvas.getContext('2d');
    const leftButtonHorizontal = document.getElementById('leftButtonHorizontal');
    const rightButtonHorizontal = document.getElementById('rightButtonHorizontal');
    const leftButtonVertical = document.getElementById('leftButtonVertical');
    const rightButtonVertical = document.getElementById('rightButtonVertical');

    let currentFrame = 0;
    const totalFrames = 150;
    const frameWidth = 350;
    const frameHeight = 350;
    const cols = 15;
    const spriteSheet = new Image();
    spriteSheet.src = 'sprite.webp';

    let initialAnimationInterval;
    let buttonAnimationInterval;
    let holdTimeout;
    let shouldStop = false;
    const initialFrameInterval = 1000 / 16;  // 16 fps for initial animation
    const buttonFrameInterval = 1000 / 32;  // 32 fps for button press animation
    const debounceInterval = 1000 / 100;  // Debounce interval for key presses
    let isAnimating = false;

    function resizeCanvas() {
        canvas.width = canvas.parentNode.offsetWidth;
        canvas.height = canvas.parentNode.offsetHeight;
        drawFrame(currentFrame);
    }

    function drawFrame(frameIndex) {
        const x = (frameIndex % cols) * frameWidth;
        const y = Math.floor(frameIndex / cols) * frameHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(spriteSheet, x, y, frameWidth, frameHeight, 0, 0, canvas.width, canvas.height);
    }

    function updateFrame(delta) {
        currentFrame = (currentFrame + delta + totalFrames) % totalFrames;
        drawFrame(currentFrame);
    }

    function animateFrames(delta) {
        if (isAnimating) return;
        isAnimating = true;
        clearInterval(buttonAnimationInterval);
        clearInterval(initialAnimationInterval); // Stop the initial animation
        shouldStop = false;
        buttonAnimationInterval = setInterval(() => {
            updateFrame(delta);
            if (shouldStop && currentFrame % 5 === 0) {
                clearInterval(buttonAnimationInterval);
                isAnimating = false;
            }
        }, buttonFrameInterval);
    }

    function animateNext10Frames(delta) {
        let frameCount = 0;
        clearInterval(buttonAnimationInterval);
        clearInterval(initialAnimationInterval); // Ensure initial animation stops
        buttonAnimationInterval = setInterval(() => {
            if (frameCount < 10) {
                updateFrame(delta);
                frameCount++;
            } else {
                stopAnimationOnMultipleOf5(delta);
            }
        }, buttonFrameInterval);
    }

    function stopAnimationOnMultipleOf5(delta) {
        clearInterval(buttonAnimationInterval);
        buttonAnimationInterval = setInterval(() => {
            updateFrame(delta);
            if (currentFrame % 5 === 0) {
                clearInterval(buttonAnimationInterval);
                isAnimating = false;
            }
        }, buttonFrameInterval);
    }

    function startInitialAnimation() {
        initialAnimationInterval = setInterval(() => {
            updateFrame(1);
        }, initialFrameInterval);
    }

    function stopAnimation() {
        shouldStop = true;
    }

    function addButtonHoldListeners(button, delta) {
        const hammer = new Hammer(button);
        hammer.on('tap', () => {
            clearInterval(buttonAnimationInterval); // Ensure any ongoing animation is stopped
            animateNext10Frames(delta);
        });
        button.addEventListener('mousedown', () => {
            clearInterval(buttonAnimationInterval); // Ensure any ongoing animation is stopped
            animateFrames(delta);
        });
        button.addEventListener('mouseup', stopAnimation);
        button.addEventListener('mouseleave', stopAnimation);
    }

    function debounce(func, delay) {
        let debounceTimer;
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }

    function handleKeyDown(event) {
        if (event.key === 'ArrowLeft') {
            animateFrames(-1);
        } else if (event.key === 'ArrowRight') {
            animateFrames(1);
        }
    }

    function handleKeyUp(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            stopAnimation();
        }
    }

    document.addEventListener('keydown', debounce(handleKeyDown, debounceInterval));
    document.addEventListener('keyup', handleKeyUp);

    addButtonHoldListeners(leftButtonHorizontal, -1);
    addButtonHoldListeners(rightButtonHorizontal, 1);
    addButtonHoldListeners(leftButtonVertical, -1);
    addButtonHoldListeners(rightButtonVertical, 1);

    // Touch interaction with Hammer.js
    const hammerCanvas = new Hammer(canvas);

    hammerCanvas.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });

    hammerCanvas.on('swipeleft', () => {
        clearInterval(buttonAnimationInterval); // Ensure any ongoing animation is stopped
        animateNext10Frames(1);
    });

    hammerCanvas.on('swiperight', () => {
        clearInterval(buttonAnimationInterval); // Ensure any ongoing animation is stopped
        animateNext10Frames(-1);
    });

    spriteSheet.onload = () => {
        resizeCanvas(); // Initial draw
        window.addEventListener('resize', resizeCanvas);
        startInitialAnimation(); // Start initial animation at 16fps
    };
});
