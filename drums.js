document.addEventListener("DOMContentLoaded", function(event) {

	/////////////////////////////////////////////////////////////////
	//
	// all credits to Chris Lowis for the kick and snare sound
	// https://dev.opera.com/articles/drum-sounds-webaudio/
	//
	/////////////////////////////////////////////////////////////////

	//----------------- kick stuff ------------------------------------------------
	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	var compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50, audioCtx.currentTime);

	function kick() {
		var time = audioCtx.currentTime;
	    const osc = audioCtx.createOscillator();
	    osc.frequency.setValueAtTime(150, time);
	    const gainNode = audioCtx.createGain();
	    gainNode.gain.setValueAtTime(1, time);
		osc.connect(gainNode).connect(audioCtx.destination);

		osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
		gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

		osc.start();
		osc.stop(time + 0.5);
	}

	const kickButton = document.getElementById('kick');
	kickButton.addEventListener('click', function() {
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

		const osc = audioCtx.createOscillator();
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
	mixGain.gain.value = 0;
	filterGain.gain.value = 0;

	function hihat(){
		var gainOsc4 = audioCtx.createGain();
		var fundamental = 40;
		var ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];

		var bandpass = audioCtx.createBiquadFilter();
		bandpass.type = "bandpass";
		bandpass.frequency.value = 10000;

		var highpass = audioCtx.createBiquadFilter();
		highpass.type = "highpass";
		highpass.frequency.value = 7000;

		ratios.forEach(function(ratio) {

		        var osc4 = audioCtx.createOscillator();
		        osc4.type = "square";
		        osc4.frequency.value = fundamental * ratio;
		        osc4.connect(bandpass);

		        osc4.start(audioCtx.currentTime);
		        osc4.stop(audioCtx.currentTime + 0.05);
		        
		    });


		gainOsc4.gain.setValueAtTime(1, audioCtx.currentTime);
		gainOsc4.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

	    gainOsc4.gain.setValueAtTime(1, audioCtx.currentTime);
	    gainOsc4.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
	    
	    bandpass.connect(highpass);
	    highpass.connect(gainOsc4);
        gainOsc4.connect(mixGain);
    
	    mixGain.gain.value = 1;
	}

	const hatButton = document.getElementById('hihat');
	hatButton.addEventListener('click', function() {
		hihat();
	}, false);
	
}, false);