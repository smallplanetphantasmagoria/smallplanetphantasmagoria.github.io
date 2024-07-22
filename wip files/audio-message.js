// audio-message.js - sends a message from an iframe to the main frame html to change the audio file
document.querySelectorAll('a[data-audio]').forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent default link behavior
      const audioUrl = this.getAttribute('data-audio');
      // Send a message to the parent window with the audio URL
      window.parent.postMessage({ action: 'changeAudio', url: audioUrl }, '*');
      // Optionally navigate to the new URL
      window.location.href = this.href;
    });
  });