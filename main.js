document.addEventListener("DOMContentLoaded", function(event) {
	const record = document.getElementById('record');
	const stop = document.getElementById('stop');
	const soundClips = document.getElementById('sound-clips');

	// ----------- hide stop button -----------------------------------------------------
	stop.style.display = "none";

	// ----------- audio recording stuff ------------------------------------------------
	if (navigator.mediaDevices.getUserMedia) {
	  console.log('getUserMedia supported.');

	  const constraints = { audio: true };
	  var chunks = [];

	  function onSuccess(stream) {
	    const mediaRecorder = new MediaRecorder(stream);

	    record.onclick = function() {
	      mediaRecorder.start();
	      console.log(mediaRecorder.state);
	      console.log("recorder started");
	      record.style.background = "red";

	      stop.style.display = "block";
	      record.disabled = true;
	    }

	    stop.onclick = function() {
	      mediaRecorder.stop();
	      console.log(mediaRecorder.state);
	      console.log("recorder stopped");
	      record.style.background = "";
	      record.style.color = "";

	      //stop.disabled = true;
	      stop.style.display = "none";
	      record.disabled = false;
	    }

	    mediaRecorder.onstop = function(e) {
	      console.log("data available after MediaRecorder.stop() called.");

	      const clipName = prompt('Enter a name for your sound clip?','My unnamed clip');

	      const clipContainer = document.createElement('div');
	      const clipLabel = document.createElement('p');
	      const audio = document.createElement('audio');
	      const deleteButton = document.createElement('button');

	      clipContainer.classList.add('clip');
	      audio.setAttribute('controls', '');
	      deleteButton.textContent = 'Delete';
	      deleteButton.className = 'delete';

	      if(clipName === null) {
	        clipLabel.textContent = 'My unnamed clip';
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
	        let evtTgt = e.target;
	        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
	      }

	      clipLabel.onclick = function() {
	        const existingName = clipLabel.textContent;
	        const newClipName = prompt('Enter a new name for your sound clip?');
	        if(newClipName === null) {
	          clipLabel.textContent = existingName;
	        } else {
	          clipLabel.textContent = newClipName;
	        }
	      }
	    }

	    mediaRecorder.ondataavailable = function(e) {
	      chunks.push(e.data);
	    }
	  }

	  function onError(err) {
	    console.log('The following error occured: ' + err);
	  }

	  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

	} else {
	   console.log('getUserMedia not supported on your browser!');
	}

}, false);