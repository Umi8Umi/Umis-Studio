document.addEventListener("DOMContentLoaded", function(event) {

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

	/////////////////////////////////////////////////////////////

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

	///////////////////////////////////////////////////

	const hatCtx = new (window.AudioContext || window.webkitAudioContext)();
	hatCtx.ratios = [1, 1.3420, 1.2312, 1.6532, 1.9523, 2.1523];
	hatCtx.tone = 130.81;
	hatCtx.decay = 0.5;
	hatCtx.volume = 1;

	function hihat(time){

		console.log("i am in the hihat function!!!")
		const oscEnvelope = hatCtx.createGain();
		var bandpass = hatCtx.createBiquadFilter();
		bandpass.type = 'bandpass';
		bandpass.frequency.value = 20000;
		bandpass.Q.value = 0.2;
		highpass = hatCtx.createBiquadFilter();
		highpass.type = 'highpass';
		highpass.frequency.value = 5000;
		bandpass.connect(highpass).connect(oscEnvelope).connect(hatCtx.destination);

		hatCtx.ratios.forEach((ratio) =>{
			var osc = hatCtx.createOscillator();
			osc.type = "square";
			osc.frequency.value = hatCtx.tone * ratio;
			osc.connect(bandpass);
			osc.start(time);
			osc.stop(time + hatCtx.decay);
		});
		oscEnvelope.gain.setValueAtTime(0.00001 * hatCtx.volume, time);
		oscEnvelope.gain.exponentialRampToValueAtTime(1 * hatCtx.volume, time + 0.067 * hatCtx.decay);
		oscEnvelope.gain.exponentialRampToValueAtTime(0.3 * hatCtx.volume, time + 0.1 * hatCtx.decay);
		oscEnvelope.gain.exponentialRampToValueAtTime(0.00001 * hatCtx.volume, time + hatCtx.decay);
	}

	const hatButton = document.getElementById('hihat');
	hatButton.addEventListener('click', function() {
		var now = audioCtx.currentTime;
		hihat(now);
	}, false);

}, false);