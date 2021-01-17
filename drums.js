document.addEventListener("DOMContentLoaded", function(event) {

	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	var compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, audioCtx.currentTime);

    const soundClips = document.getElementById('sound-clips');
	const drumsRecBtn = document.getElementById('drums_rec');
	const kick_img = document.getElementById('kick');
	const snare_img = document.getElementById('snare');
	const hihat_img = document.getElementById('hihat');
	var clicked = false;
	var chunks = [];
	var dest = audioCtx.createMediaStreamDestination();
	var mediaRecorder = new MediaRecorder(dest.stream);

	drumsRecBtn.addEventListener('click', function(e) {
		if (!clicked) {
		   drumsRecBtn.style.background = "#FF00A6";
           mediaRecorder.start();
           e.target.textContent = "STOP";
           clicked = true;
         } else {
           clicked = false;
           drumsRecBtn.style.background = "";
	       drumsRecBtn.style.color = "";
           mediaRecorder.stop();
           e.target.textContent = "Record Drums";
           /*e.target.disabled = true;*/
         }
	}, false);

	mediaRecorder.ondataavailable = function(evt) {
       // push each chunk (blobs) in an array
       chunks.push(evt.data);
    };

    mediaRecorder.onstop = function(evt) {
		// Make blob out of our blobs, and open it.
		//var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
		//document.querySelector("audio").src = URL.createObjectURL(blob);

		const clipName = prompt('Name your soundbite:','New Recording');

		const clipContainer = document.createElement('div');
		const clipLabel = document.createElement('p');
		const audio = document.createElement('audio');
		const deleteButton = document.createElement('button');

		clipContainer.classList.add('clip');
		audio.setAttribute('controls', '');
		deleteButton.textContent = 'Delete';
		deleteButton.className = 'delete';

		if(clipName === null) {
			clipLabel.textContent = 'New Recording';
		} else {
			clipLabel.textContent = clipName;
		}

		clipContainer.appendChild(audio);
		clipContainer.appendChild(clipLabel);
		clipContainer.appendChild(deleteButton);
		soundClips.appendChild(clipContainer);

		audio.controls = true;
		const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
		chunks = [];
		const audioURL = window.URL.createObjectURL(blob);
		audio.src = audioURL;
		console.log("recorder stopped");

		deleteButton.onclick = function(e) {
			var evtTgt = e.target;
			evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
		}

		clipLabel.onclick = function() {
			const existingName = clipLabel.textContent;
			const newClipName = prompt('Rename your soundbite:');
			if(newClipName === null) {
			  clipLabel.textContent = existingName;
			} else {
			  clipLabel.textContent = newClipName;
			}
		}
    };

	/////////////////////////////////////////////////////////////////
	//
	// all credits to Chris Lowis for the kick and snare sound
	// https://dev.opera.com/articles/drum-sounds-webaudio/
	//
	/////////////////////////////////////////////////////////////////

	//----------------- kick stuff ------------------------------------------------
	function kick() {
		var time = audioCtx.currentTime;
	    const osc = audioCtx.createOscillator();
	    /*osc.connect(dest);*/
	    osc.frequency.setValueAtTime(150, time);
	    const gainNode = audioCtx.createGain();
	    gainNode.gain.setValueAtTime(1, time);
		osc.connect(gainNode).connect(audioCtx.destination);
		gainNode.connect(dest);

		osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
		gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

		osc.start();
		osc.stop(time + 0.5);
	}

	const kickButton = document.getElementById('kick');
	kickButton.addEventListener('click', function() {
		kick_img.firstChild.src = "kick_hit.PNG";
		setTimeout(function(){ kick_img.firstChild.src = "kick.PNG"; }, 500);
		kick();
	}, false);

	//----------------- snare stuff ------------------------------------------------
	function noiseBuffer() {
		var bufferSize = audioCtx.sampleRate;
		var buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
		var output = buffer.getChannelData(0);

		for (var i = 0; i < bufferSize; i++) {
			output[i] = Math.random() * 2 - 1;
		}

		return buffer;
	};

	function snare(time) {
		var noise = audioCtx.createBufferSource();
		noise.buffer = noiseBuffer();
		var noiseFilter = audioCtx.createBiquadFilter();
		noiseFilter.type = 'highpass';
		noiseFilter.frequency.value = 1000;
		noise.connect(noiseFilter);

		const noiseEnvelope = audioCtx.createGain();
		noiseFilter.connect(noiseEnvelope);
		noiseEnvelope.connect(audioCtx.destination);
		noiseEnvelope.connect(dest);

		const osc = audioCtx.createOscillator();
		/*osc.connect(dest);*/
		osc.type = 'triangle';
		const oscEnvelope = audioCtx.createGain();
		osc.connect(oscEnvelope).connect(audioCtx.destination);

		noiseEnvelope.gain.setValueAtTime(1, time);
		noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
		noise.start(time)

		osc.frequency.setValueAtTime(100, time);
		oscEnvelope.gain.setValueAtTime(0.7, time);
		oscEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
		osc.start(time)

		osc.stop(time + 0.2);
		noise.stop(time + 0.2);
	};

	const snareButton = document.getElementById('snare');
	snareButton.addEventListener('click', function() {
		snare_img.firstChild.src = "snare_hit.PNG";
		setTimeout(function(){ snare_img.firstChild.src = "snare.PNG"; }, 500);
		var now = audioCtx.currentTime;
		snare(now);
	}, false);

	/////////////////////////////////////////////////////////////////
	//
	// all credits to Aqilah Misuary for the hi-hat sound
	// https://sonoport.github.io/synthesising-sounds-webaudio.html
	//
	/////////////////////////////////////////////////////////////////

	//----------------- hi-hat stuff ------------------------------------------------
	var mixGain = audioCtx.createGain();
	var filterGain = audioCtx.createGain();
	mixGain.connect(audioCtx.destination);
	mixGain.connect(dest);
	mixGain.gain.value = 0;
	filterGain.gain.value = 0;

	function hihat(){
		var gainOsc = audioCtx.createGain();
		var fundamental = 40;
		var ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];

		var bandpass = audioCtx.createBiquadFilter();
		bandpass.type = "bandpass";
		bandpass.frequency.value = 10000;

		var highpass = audioCtx.createBiquadFilter();
		highpass.type = "highpass";
		highpass.frequency.value = 7000;

		ratios.forEach(function(ratio) {

		        var osc = audioCtx.createOscillator();
		        /*osc.connect(dest);*/
		        osc.type = "square";
		        osc.frequency.value = fundamental * ratio;
		        osc.connect(bandpass);

		        osc.start(audioCtx.currentTime);
		        osc.stop(audioCtx.currentTime + 0.05);
		        
		    });


		gainOsc.gain.setValueAtTime(1, audioCtx.currentTime);
		gainOsc.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

	    gainOsc.gain.setValueAtTime(1, audioCtx.currentTime);
	    gainOsc.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
	    
	    bandpass.connect(highpass);
	    highpass.connect(gainOsc);
        gainOsc.connect(mixGain);
    
	    mixGain.gain.value = 1;
	}

	const hatButton = document.getElementById('hihat');
	hatButton.addEventListener('click', function() {
		hihat_img.firstChild.src = "hihat_hit.PNG";
		setTimeout(function(){ hihat_img.firstChild.src = "hihat.PNG"; }, 500);
		hihat();
	}, false);
	
}, false);