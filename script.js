document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('globeCanvas');
    const ctx = canvas.getContext('2d');
    const frameInfo = document.getElementById('frameInfo');

    let currentFrame = 1;  // Start at frame 1
    const totalFrames = 150;
    const frameWidth = 350;
    const frameHeight = 350;
    const cols = 15;
    const spriteSheet = new Image();
    spriteSheet.src = 'sprite.webp';

    const initialFrameInterval = 1000 / 16;  // 16 fps for initial animation
    const buttonFrameInterval = 1000 / 32;  // 32 fps for button press animation
    let animationInterval;
    let animationDirection = 1; // 1 for forward, -1 for backward
    let isAnimating = false; // Flag to track if animation is running
    let keyPressed = false; // Flag to track if a key is pressed

    function resizeCanvas() {
        const size = Math.min(canvas.parentNode.offsetWidth, canvas.parentNode.offsetHeight);
        canvas.width = size;
        canvas.height = size;
        drawFrame(currentFrame);
    }

    function drawFrame(frameIndex) {
        const x = ((frameIndex - 1) % cols) * frameWidth;
        const y = Math.floor((frameIndex - 1) / cols) * frameHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(spriteSheet, x, y, frameWidth, frameHeight, 0, 0, canvas.width, canvas.height);

        // Update frame info
        frameInfo.textContent = `Frame: ${frameIndex}`;
    }

    function startAnimation(forward = true, interval = initialFrameInterval) {
        clearInterval(animationInterval);  // Clear any existing interval
        animationDirection = forward ? 1 : -1;

        if (isAnimating && interval === buttonFrameInterval) {
            animationInterval = setInterval(() => {
                currentFrame = (currentFrame + animationDirection - 1 + totalFrames) % totalFrames + 1;
                drawFrame(currentFrame);
            }, interval);
            return; // Prevent starting multiple button animations
        }

        isAnimating = true;
        animationInterval = setInterval(() => {
            currentFrame = (currentFrame + animationDirection - 1 + totalFrames) % totalFrames + 1;
            drawFrame(currentFrame);
        }, interval);
    }

    function stopAnimation() {
        clearInterval(animationInterval);

        animationInterval = setInterval(() => {
            currentFrame = (currentFrame + animationDirection - 1 + totalFrames) % totalFrames + 1;
            drawFrame(currentFrame);

            if (currentFrame % 5 === 0 || currentFrame === 1) {
                clearInterval(animationInterval);
                isAnimating = false; // Reset the flag
            }
        }, buttonFrameInterval);
    }

    spriteSheet.onload = () => {
        resizeCanvas(); // Initial draw
        drawFrame(currentFrame); // Ensure initial frame is drawn
        window.addEventListener('resize', resizeCanvas);
        startAnimation(true, initialFrameInterval); // Start initial animation at 16fps
    };

    // Event listeners for horizontal buttons
    document.getElementById('leftButtonHorizontal').addEventListener('mousedown', () => startAnimation(false, buttonFrameInterval));
    document.getElementById('rightButtonHorizontal').addEventListener('mousedown', () => startAnimation(true, buttonFrameInterval));
    document.getElementById('leftButtonHorizontal').addEventListener('mouseup', stopAnimation);
    document.getElementById('rightButtonHorizontal').addEventListener('mouseup', stopAnimation);

    // Event listeners for vertical buttons
    document.getElementById('leftButtonVertical').addEventListener('mousedown', () => startAnimation(false, buttonFrameInterval));
    document.getElementById('rightButtonVertical').addEventListener('mousedown', () => startAnimation(true, buttonFrameInterval));
    document.getElementById('leftButtonVertical').addEventListener('mouseup', stopAnimation);
    document.getElementById('rightButtonVertical').addEventListener('mouseup', stopAnimation);

    // Event listeners for refresh buttons
    document.getElementById('refreshButton').addEventListener('click', () => startAnimation(true, initialFrameInterval));
    document.getElementById('refreshButtonVertical').addEventListener('click', () => startAnimation(true, initialFrameInterval));
    document.getElementById('refreshButtonBottomRight').addEventListener('click', () => startAnimation(true, initialFrameInterval));

    // Event listeners for keyboard buttons
    document.addEventListener('keydown', (event) => {
        if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight') && !keyPressed) {
            keyPressed = true;
            startAnimation(event.key === 'ArrowRight', buttonFrameInterval);
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            keyPressed = false;
            stopAnimation();
        }
    });
});
