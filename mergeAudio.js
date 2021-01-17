document.addEventListener("DOMContentLoaded", function(event) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var compressor = audioCtx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-50, audioCtx.currentTime);

  var soundBites = document.getElementsByName("soundBite");
  var clicked = false;
  var chunks = [];
  var dest = audioCtx.createMediaStreamDestination();
  var mediaRecorder = new MediaRecorder(dest.stream);


  function mergeAudio() {
    // Create two sources.
    soundBites.forEach(function myFunction(audio) {
      const source = audioCtx.createMediaElementSource(audio);
      var gainNode = audioCtx.createGain();
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      gainNode.gain.setValueAtTime(1, time);
      source.start();
    });


 /*   // Start playback in a loop
    var onName = this.ctl1.source.start ? 'start' : 'noteOn';
    this.ctl1.source[onName](0);
    this.ctl2.source[onName](0);
    // Set the initial crossfade to be just source 1.
    this.crossfade(0);*/

  }

  mergeBtn.addEventListener('click', function(e) {
    if (!clicked) {
       mediaRecorder.start();
       clicked = true;
    } 
    /*else {
       clicked = false;
       mediaRecorder.stop();
      }*/
  }, false);

/*  CrossfadeSample.prototype.stop = function() {
    var offName = this.ctl1.source.stop ? 'stop' : 'noteOff';
    this.ctl1.source[offName](0);
    this.ctl2.source[offName](0);
  };

  // Fades between 0 (all source 1) and 1 (all source 2)
  CrossfadeSample.prototype.crossfade = function(element) {
    var x = parseInt(element.value) / parseInt(element.max);
    // Use an equal-power crossfading curve:
    var gain1 = Math.cos(x * 0.5*Math.PI);
    var gain2 = Math.cos((1.0 - x) * 0.5*Math.PI);
    this.ctl1.gainNode.gain.value = gain1;
    this.ctl2.gainNode.gain.value = gain2;
  };

  CrossfadeSample.prototype.toggle = function() {
    this.isPlaying ? this.stop() : this.play();
    this.isPlaying = !this.isPlaying;
  };*/

}, false);


/*var sources = ["/path/to/audoi1", "/path/to/audio2"];    
var description = "mix";
var chunks = [];
var channels = [[0, 1], [1, 0]];
//var audioCtx = new AudioContext();
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var player = new Audio();
var merger = audioCtx.createChannelMerger(2);
var splitter = audioCtx.createChannelSplitter(2);
var mixedAudio = audioCtx.createMediaStreamDestination();
var duration = 60000;
var context;
var recorder;
var audioDownload;

//////////////////////////////////////////////////////
const mergeBtn = document.getElementById('merge');
//////////////////////////////////////////////////////

player.controls = "controls";

function get(src) {
  return fetch(src)
    .then(function(response) {
      return response.arrayBuffer()
    })
}

function stopMix(duration, ...media) {
  setTimeout(function(media) {
    media.forEach(function(node) {
      node.stop()
    })
  }, duration, media)
}

Promise.all(sources.map(get)).then(function(data) {
    return Promise.all(data.map(function(buffer, index) {
        return audioCtx.decodeAudioData(buffer)
          .then(function(bufferSource) {
            var channel = channels[index];
            var source = audioCtx.createBufferSource();
            source.buffer = bufferSource;
            source.connect(splitter);
            splitter.connect(merger, channel[0], channel[1]);
            return source
          })
      }))
      .then(function(audionodes) {
        merger.connect(mixedAudio);
        merger.connect(audioCtx.destination);
        recorder = new MediaRecorder(mixedAudio.stream);
        recorder.start(0);
        audionodes.forEach(function(node) {
          node.start(0)
        });

        stopMix(duration, ...audionodes, recorder);

        recorder.ondataavailable = function(event) {
          chunks.push(event.data);
        };

        recorder.onstop = function(event) {
          var blob = new Blob(chunks, {
            "type": "audio/ogg; codecs=opus"
          });
          audioDownload = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.download = description + "." + blob.type.replace(/.+\/|;.+/g, "");
          a.href = audioDownload;
          a.innerHTML = a.download;
          player.src = audioDownload;
          document.body.appendChild(a);
          document.body.appendChild(player);
        };
      })
  })
  .catch(function(e) {
    console.log(e)
  });*/