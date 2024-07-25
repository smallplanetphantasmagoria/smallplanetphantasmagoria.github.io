document.addEventListener('DOMContentLoaded', () => {
    // Constants and Global Variables
    const canvas = document.getElementById('globeCanvas');
    const ctx = canvas.getContext('2d');
    const frameInfo = document.getElementById('frameInfo');
    const totalFrames = 150;
    const frameWidth = 350;
    const frameHeight = 350;
    const cols = 15;
    const initialFrameInterval = 1000 / 16;  // 16 fps for initial animation
    const buttonFrameInterval = 1000 / 32;  // 32 fps for button press animation
    const scrollFrameInterval = 1000 / 256;  // 256 fps for smoother scroll wheel animation
    const maxGestureDistance = 1000;  // Maximum distance for gesture calculation
    const sensitivityFactor = 40;  // Adjusted for less frames cycled per unit distance
    const inertiaBaseFactor = 1500; // Base factor for inertia calculation
    const maxFrameChange = 150; // Maximum frames to cycle due to inertia
    let currentFrame = 10;  // Start at frame 5
    let animationInterval;
    let animationDirection = 1; // 1 for forward, -1 for backward
    let isAnimating = false; // Flag to track if animation is running
    let keyPressed = false; // Flag to track if a key is pressed
    let lastScrollTime = 0;
    const spriteSheet = new Image();
    spriteSheet.src = 'sprite.webp';

    // Initialize
    spriteSheet.onload = () => {
        resizeCanvas(); // Initial draw
        drawFrame(currentFrame); // Ensure initial frame is drawn
        window.addEventListener('resize', resizeCanvas);
        startAnimation(true, initialFrameInterval); // Start initial animation at 16fps
    };

    // Resize Canvas
    function resizeCanvas() {
        const size = Math.min(canvas.parentNode.offsetWidth, canvas.parentNode.offsetHeight);
        canvas.width = size;
        canvas.height = size;
        drawFrame(currentFrame);
    }

    // Draw Frame
    function drawFrame(frameIndex) {
        const x = ((frameIndex - 1) % cols) * frameWidth;
        const y = Math.floor((frameIndex - 1) / cols) * frameHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(spriteSheet, x, y, frameWidth, frameHeight, 0, 0, canvas.width, canvas.height);

        // Update frame info
        frameInfo.textContent = `Frame: ${frameIndex}`;
    }

    // Start Animation
    function startAnimation(forward = true, interval = initialFrameInterval) {
        clearInterval(animationInterval);  // Clear any existing interval
        animationDirection = forward ? 1 : -1;

        if (isAnimating && interval === buttonFrameInterval) {
            animationInterval = setInterval(updateFrame, interval);
            return; // Prevent starting multiple button animations
        }

        isAnimating = true;
        animationInterval = setInterval(updateFrame, interval);
    }

    // Update Frame
    function updateFrame() {
        currentFrame = (currentFrame + animationDirection - 1 + totalFrames) % totalFrames + 1;
        drawFrame(currentFrame);
    }

    // Stop Animation
    function stopAnimation(direction = animationDirection) {
        clearInterval(animationInterval);
        animationInterval = setInterval(() => {
            currentFrame = (currentFrame + direction - 1 + totalFrames) % totalFrames + 1;
            drawFrame(currentFrame);

            // Stop on next multiple of 10 in the correct direction
            if (currentFrame % 10 === 0) {
                clearInterval(animationInterval);
                isAnimating = false; // Reset the flag
            }
        }, buttonFrameInterval);
    }

    // Stop Animation at Nearest Multiple of 10 in the Correct Direction
    function stopAnimationNearest(direction) {
        clearInterval(animationInterval);
        animationInterval = setInterval(() => {
            currentFrame = (currentFrame + direction - 1 + totalFrames) % totalFrames + 1;
            drawFrame(currentFrame);

            // Ensure stopping on next multiple of 10 in the correct direction
            if (currentFrame % 10 === 0) {
                clearInterval(animationInterval);
                isAnimating = false; // Reset the flag
            }
        }, buttonFrameInterval);
    }

    // Handle Key Down
    function handleKeyDown(event) {
        if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && !keyPressed) {
            keyPressed = true;
            startAnimation(event.key === 'ArrowRight', buttonFrameInterval);
        }
    }

    // Handle Key Up
    function handleKeyUp(event) {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            keyPressed = false;
            stopAnimationNearest(event.key === 'ArrowRight' ? 1 : -1);
        }
    }

    // Handle Scroll
    function handleScroll(event) {
        const now = Date.now();
        if (now - lastScrollTime < scrollFrameInterval) return;
        lastScrollTime = now;

        clearInterval(animationInterval);  // Stop any currently running animations
        isAnimating = false; // Reset the flag

        const delta = event.deltaY > 0 ? 1 : -1;
        animationDirection = delta;  // Set the animation direction based on the scroll direction
        currentFrame = (currentFrame + delta - 1 + totalFrames) % totalFrames + 1;
        drawFrame(currentFrame);

        // Ensure the animation stops on multiples of 10
        stopAnimationNearest(delta);
    }

    // Add event listeners
    function addEventListeners() {
        // Horizontal buttons
        document.getElementById('leftButtonHorizontal').addEventListener('mousedown', () => startAnimation(false, buttonFrameInterval));
        document.getElementById('rightButtonHorizontal').addEventListener('mousedown', () => startAnimation(true, buttonFrameInterval));
        document.getElementById('leftButtonHorizontal').addEventListener('mouseup', () => stopAnimationNearest(-1));
        document.getElementById('rightButtonHorizontal').addEventListener('mouseup', () => stopAnimationNearest(1));

        // Vertical buttons
        document.getElementById('leftButtonVertical').addEventListener('mousedown', () => startAnimation(false, buttonFrameInterval));
        document.getElementById('rightButtonVertical').addEventListener('mousedown', () => startAnimation(true, buttonFrameInterval));
        document.getElementById('leftButtonVertical').addEventListener('mouseup', () => stopAnimationNearest(-1));
        document.getElementById('rightButtonVertical').addEventListener('mouseup', () => stopAnimationNearest(1));

        // Refresh buttons
        document.getElementById('refreshButton').addEventListener('click', () => startAnimation(true, initialFrameInterval));
        document.getElementById('refreshButtonVertical').addEventListener('click', () => startAnimation(true, initialFrameInterval));
        document.getElementById('refreshButtonBottomRight').addEventListener('click', () => startAnimation(true, initialFrameInterval));

        // Keyboard buttons
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        // Scroll wheel
        canvas.addEventListener('wheel', handleScroll);

        // Tap on canvas to stop animation
        if (isAnimating = true) {
        canvas.addEventListener('click', () => {
            clearInterval(animationInterval);  // Clear any existing interval

            stopAnimation();
        });
        }}

    // Add event listeners
    addEventListeners();
});
