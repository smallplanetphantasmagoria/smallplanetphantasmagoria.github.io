window.addEventListener('load', function() {
    const navButton = document.getElementById('map-button');
    const overlay = document.getElementById('popupoverlay');
    const popupImage = document.getElementById('popupImage');

    navButton.addEventListener('click', () => {
        overlay.style.display = 'flex';
    });

    overlay.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    popupImage.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the overlay click event from firing
        overlay.style.display = 'none';
    });

    
      document.body.style.opacity = '1';

          // Select all links on the page
              var links = document.querySelectorAll('a');

          // Loop through each link
          links.forEach(function(link) {
              // Add click event listener to each link
              link.addEventListener('click', function(event) {
                  // Prevent the default action to control navigation manually
                  event.preventDefault();
                  
                  // Change body opacity to 0
                  document.body.style.opacity = '0';
                  
                  // Use setTimeout to navigate to the link's href after the opacity change
                  setTimeout(function() {
                      window.location.href = link.href;
                  }, 2000); // Delay should match the transition duration or be slightly longer
              });
          });


// Add event listener for the close button
document.getElementById('closepage').addEventListener('click', function() {
document.body.style.opacity = '0';
setTimeout(function() {
  window.parent.postMessage('closeIframe', '*');
}, 500);

const audioUrl = 'sounds/nav00.m4a'; // Don't change this per loc page
window.top.postMessage({
  action: 'changeAudio',
  url: audioUrl,
  title: 'Small Planet Phantasmagoria'
}, '*'); // Ensure that '*' is replaced with the specific origin if security is a concern
});

// Function to handle back button and trigger custom actions
function handleBackNavigation(event) {
// Prevent the default back navigation
event.preventDefault();

// Capture the current scroll position
const scrollPosition = {
  left: window.scrollX,
  top: window.scrollY
};

// Restore the scroll position after navigation
setTimeout(() => {
  window.scrollTo(scrollPosition.left, scrollPosition.top);
}, 0);

document.body.style.opacity = '0';
setTimeout(function() {
  window.parent.postMessage('closeIframe', '*');
}, 500);

const audioUrl = 'sounds/nav00.m4a'; // Don't change this per loc page
window.top.postMessage({
  action: 'changeAudio',
  url: audioUrl,
  title: 'Small Planet Phantasmagoria'
}, '*'); // Ensure that '*' is replaced with the specific origin if security is a concern
}

// Listen for the popstate event
window.addEventListener('popstate', function(event) {
handleBackNavigation(event);
});

// Initialize a state to prevent the initial popstate event from being fired
history.pushState(null, null, window.location.href);

});