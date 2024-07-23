document.addEventListener('DOMContentLoaded', function() {
    var video = document.getElementById('video');
    var fallbackImage = document.getElementById('fallbackImage');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
      video.addEventListener('loadedmetadata', function() {
        video.play().catch(() => showFallback());
      });
      video.addEventListener('error', function() {
        showFallback();
      });
    } else if (Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {
        video.play().catch(() => showFallback());
      });
      hls.on(Hls.Events.ERROR, function(event, data) {
        console.error('HLS.js Error:', data.fatal, data);
        showFallback();
      });
    } else {
      console.error('This browser does not support HLS.');
      showFallback();
    }
  });    document.addEventListener('DOMContentLoaded', function() {
      var video = document.getElementById('video');
      var fallbackImage = document.getElementById('fallbackImage');

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', function() {
          video.play().catch(() => showFallback());
        });
        video.addEventListener('error', function() {
          showFallback();
        });
      } else if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
          video.play().catch(() => showFallback());
        });
        hls.on(Hls.Events.ERROR, function(event, data) {
          console.error('HLS.js Error:', data.fatal, data);
          showFallback();
        });
      } else {
        console.error('This browser does not support HLS.');
        showFallback();
      }
    });

    function showFallback() {
      const video = document.getElementById('video');
      const fallbackImage = document.getElementById('fallbackImage');
      video.style.display = 'none'; // Hide the video element
      fallbackImage.style.display = 'block'; // Show the fallback image
    }