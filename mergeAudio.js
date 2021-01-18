document.addEventListener("DOMContentLoaded", function(event) {

  var sources = [];
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var soundBites = [];
  var chunks = [];
  var dest = audioCtx.createMediaStreamDestination();
  var mediaRecorder = new MediaRecorder(dest.stream);

  //const theBand = document.getElementById('theBand');
  const theBand = document.getElementById('band-animation');

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
    startAnimation();
    soundBites = Array.from(document.getElementsByTagName('audio'));
    soundBites.forEach(function(audio) {
      audio.play();
      /*audio.onended(stopAnimation);*/
      audio.onended = function() {
          stopAnimation();
      };
    });
      
/*    if(!soundBites[0].paused){
      startAnimation();
    }
    else
      stopAnimation();*/
/*    if(!soundBites[0].paused){
      setTimeout(function(){ theBand.src = "band2.PNG"; }, 0);
      setTimeout(function(){ theBand.src = "band1.PNG"; }, 500);
    }*/
  }, false);

  var animating = false;
  var animateGo;
  function startAnimation() { 
    animating = true;
    var frames = document.getElementById("band-animation").children;
    var frameCount = frames.length;
    var i = 0;
    animateGo = setInterval(function () { 
      frames[i % frameCount].style.display = "none";
      frames[++i % frameCount].style.display = "block";
    }, 500);
  }

  function stopAnimation() {
    console.log("i am here");
    animating = false;
    clearInterval(animateGo);
  }

}, false);