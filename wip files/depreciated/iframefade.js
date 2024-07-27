$(document).ready(function() {
    // Create a black overlay
    var $overlay = $('<div id="iframeOverlay"></div>').css({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        zIndex: 100,
        opacity: 0, // Start with opacity 0
        display: 'none' // Initially hidden
    }).appendTo('body');

    // Select the iframe
    var $iframe = $('#main-frame'); // Ensure this ID matches your iframe ID

    // Variable to track start time for fade-out delay
    var startTime;

    // Function to show the overlay with discrete opacity steps
    function showOverlay(callback) {
        $overlay.show(); // Make sure the overlay is visible
        var opacity = 0;
        var increment = 0.1; // Moderate steps for opacity
        var interval = 100; // Moderate interval for opacity change

        function fadeIn() {
            opacity += increment;
            if (opacity >= 1) {
                opacity = 1;
                $overlay.css('opacity', opacity);
                if (callback) callback();
            } else {
                $overlay.css('opacity', opacity);
                setTimeout(fadeIn, interval); // Use setTimeout to create discrete steps
            }
        }

        fadeIn();
    }

    // Function to hide the overlay with discrete opacity steps
    function hideOverlay() {
        var loadTime = new Date().getTime() - startTime;
        var delay = Math.max(0, 500 - loadTime); // Ensure at least 500ms
        setTimeout(function() {
            var opacity = 1;
            var decrement = 0.1; // Moderate steps for opacity
            var interval = 100; // Moderate interval for opacity change

            function fadeOut() {
                opacity -= decrement;
                if (opacity <= 0) {
                    opacity = 0;
                    $overlay.css('opacity', opacity);
                    $overlay.hide(); // Hide the overlay completely
                } else {
                    $overlay.css('opacity', opacity);
                    setTimeout(fadeOut, interval); // Use setTimeout to create discrete steps
                }
            }

            fadeOut();
        }, delay);
    }

    // Function to show the overlay and handle link clicks
    function setupIframeLinkHandling() {
        var $iframeContents = $iframe.contents();
        $iframeContents.find('a').off('click').on('click', function(e) {
            e.preventDefault(); // Prevent the default link click behavior

            // Show the overlay and then navigate to the new URL
            showOverlay(function() { // Show the overlay with discrete steps
                // Record the start time
                startTime = new Date().getTime();

                // Navigate to the new URL
                var newUrl = $(this).attr('href');
                $iframe.attr('src', newUrl);

                // Wait for the iframe to load the new page
                $iframe.one('load', function() {
                    hideOverlay();
                    // Reapply link handling after loading new content
                    setupIframeLinkHandling();
                });
            }.bind(this));
        });
    }

    // Function to handle messages from the iframe
    function handleIframeMessage(event) {
        if (event.data.action === 'updateGrid') {
            // Reapply link handling after the grid update
            setupIframeLinkHandling();
        }
    }

    // Set up initial link handling
    setupIframeLinkHandling();

    // Listen for messages from the iframe
    window.addEventListener('message', handleIframeMessage);
});
