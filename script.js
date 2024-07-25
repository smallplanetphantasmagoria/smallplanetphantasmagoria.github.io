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
    const originalFrameWidth = 350;
    const originalFrameHeight = 350;
    let currentFrame = 10;  // Start at frame 10
    let animationInterval;
    let animationDirection = 1; // 1 for forward, -1 for backward
    let isAnimating = false; // Flag to track if animation is running
    let keyPressed = false; // Flag to track if a key is pressed
    let lastScrollTime = 0;
    const spriteSheet = new Image();
    spriteSheet.src = 'sprite.webp';

    const clickableAreas = [
        {
            imageIndex: 10, // Frame index starts from 1
            areas: [
                { x: 0, y: 0, width: 100, height: 100, href: 'location/altair.html' },
                { x: 250, y: 250, width: 100, height: 100, href: 'location/bakery.html' }
            ]
        },
        {
            imageIndex: 20,
            areas: [
                { x: 0, y: 250, width: 100, height: 100, href: 'location/cinema.html' },
                { x: 250, y: 0, width: 100, height: 100, href: 'location/liquor.html' }
            ]
        }
        // Add more frames and their areas as needed
    ];

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

        // Draw clickable areas with a red outline
        const currentFrameAreas = clickableAreas.find(area => area.imageIndex === frameIndex);
        if (currentFrameAreas) {
            const scaleX = canvas.width / originalFrameWidth;
            const scaleY = canvas.height / originalFrameHeight;
            ctx.strokeStyle = 'red';
            currentFrameAreas.areas.forEach((area) => {
                ctx.strokeRect(area.x * scaleX, area.y * scaleY, area.width * scaleX, area.height * scaleY);
            });
        }

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

    // Handle Touch Start
    function handleTouchStart(event) {
        event.preventDefault();
        const button = event.target;
        button.style.opacity = '1';

        if (button.id.includes('leftButton')) {
            startAnimation(false, buttonFrameInterval);
        } else if (button.id.includes('rightButton')) {
            startAnimation(true, buttonFrameInterval);
        }

        button.addEventListener('touchend', function touchEnd() {
            button.style.opacity = '0.1';
            stopAnimationNearest(button.id.includes('rightButton') ? 1 : -1);
            button.removeEventListener('touchend', touchEnd);
        });

        button.addEventListener('touchmove', function touchMove() {
            button.style.opacity = '0.1';
            stopAnimationNearest(button.id.includes('rightButton') ? 1 : -1);
            button.removeEventListener('touchmove', touchMove);
        });
    }

    // Handle Touch Start for Refresh Buttons
    function handleRefreshTouchStart(event) {
        event.preventDefault();
        const button = event.target;
        button.style.opacity = '1';

        startAnimation(true, initialFrameInterval); // Mimic the click behavior

        button.addEventListener('touchend', function touchEnd() {
            button.style.opacity = '0.1';
            button.removeEventListener('touchend', touchEnd);
        });

        button.addEventListener('touchmove', function touchMove() {
            button.style.opacity = '0.1';
            button.removeEventListener('touchmove', touchMove);
        });
    }

    // Handle Click Events
    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const currentFrameAreas = clickableAreas.find(area => area.imageIndex === currentFrame);
        if (currentFrameAreas) {
            const scaleX = canvas.width / originalFrameWidth;
            const scaleY = canvas.height / originalFrameHeight;
            currentFrameAreas.areas.forEach((area) => {
                if (x > area.x * scaleX && x < area.x * scaleX + area.width * scaleX &&
                    y > area.y * scaleY && y < area.y * scaleY + area.height * scaleY) {
                    handleClick(area.href);
                }
            });
        }
    });

    // Handle iframe src change
    function handleClick(href) {
        if (href) {
            let iframe = document.getElementById('clickableIframe');
            iframe.src = href;
            iframe.style.display = 'block'; // Show the iframe
        }
    }

    // Cursor change on hover
    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const currentFrameAreas = clickableAreas.find(area => area.imageIndex === currentFrame);
        if (currentFrameAreas) {
            const scaleX = canvas.width / originalFrameWidth;
            const scaleY = canvas.height / originalFrameHeight;
            let isHovering = false;

            currentFrameAreas.areas.forEach((area) => {
                if (x > area.x * scaleX && x < area.x * scaleX + area.width * scaleX &&
                    y > area.y * scaleY && y < area.y * scaleY + area.height * scaleY) {
                    isHovering = true;
                }
            });

            canvas.style.cursor = isHovering ? 'pointer' : 'default';
        } else {
            canvas.style.cursor = 'default';
        }
    });

    // Add event listeners
    function addEventListeners() {
        // Horizontal buttons
        document.getElementById('leftButtonHorizontal').addEventListener('mousedown', () => startAnimation(false, buttonFrameInterval));
        document.getElementById('rightButtonHorizontal').addEventListener('mousedown', () => startAnimation(true, buttonFrameInterval));
        document.getElementById('leftButtonHorizontal').addEventListener('mouseup', () => stopAnimationNearest(-1));
        document.getElementById('rightButtonHorizontal').addEventListener('mouseup', () => stopAnimationNearest(1));

        // Add touch event listeners for horizontal buttons
        document.getElementById('leftButtonHorizontal').addEventListener('touchstart', handleTouchStart);
        document.getElementById('rightButtonHorizontal').addEventListener('touchstart', handleTouchStart);

        // Vertical buttons
        document.getElementById('leftButtonVertical').addEventListener('mousedown', () => startAnimation(false, buttonFrameInterval));
        document.getElementById('rightButtonVertical').addEventListener('mousedown', () => startAnimation(true, buttonFrameInterval));
        document.getElementById('leftButtonVertical').addEventListener('mouseup', () => stopAnimationNearest(-1));
        document.getElementById('rightButtonVertical').addEventListener('mouseup', () => stopAnimationNearest(1));

        // Add touch event listeners for vertical buttons
        document.getElementById('leftButtonVertical').addEventListener('touchstart', handleTouchStart);
        document.getElementById('rightButtonVertical').addEventListener('touchstart', handleTouchStart);

        // Refresh buttons
        document.getElementById('refreshButton').addEventListener('click', () => startAnimation(true, initialFrameInterval));
        document.getElementById('refreshButtonVertical').addEventListener('click', () => startAnimation(true, initialFrameInterval));
        document.getElementById('refreshButtonBottomRight').addEventListener('click', () => startAnimation(true, initialFrameInterval));

        // Add touch event listeners for refresh buttons
        document.getElementById('refreshButton').addEventListener('touchstart', handleRefreshTouchStart);
        document.getElementById('refreshButtonVertical').addEventListener('touchstart', handleRefreshTouchStart);
        document.getElementById('refreshButtonBottomRight').addEventListener('touchstart', handleRefreshTouchStart);

        // Keyboard buttons
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        // Scroll wheel
        canvas.addEventListener('wheel', handleScroll);
    }

    // Add event listeners
    addEventListeners();
});
