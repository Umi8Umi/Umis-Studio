document.addEventListener("DOMContentLoaded", function(event) {

  var sources = [];
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var soundBites = [];
  var chunks = [];
  var dest = audioCtx.createMediaStreamDestination();
  var mediaRecorder = new MediaRecorder(dest.stream);

  //////////////////////////////////////////////////////
  //
  // originally this was going to be a merge function
  // where you could mix the audio recordings into
  // a single audio file to download. Time constrains
  // meant that I have decided to just create a function
  // that can play all of the clips at once for a live
  // but temporary creative experience.
  //
  //////////////////////////////////////////////////////

  const mergeBtn = document.getElementById('merge');
  mergeBtn.addEventListener('click', function() {
    soundBites = Array.from(document.getElementsByTagName('audio'));
    soundBites.forEach(function(audio) {
      audio.play();
    });
  }, false);

}, false);
