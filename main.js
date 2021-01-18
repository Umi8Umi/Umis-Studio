document.addEventListener("DOMContentLoaded", function(event) {
	const record = document.getElementById('record');
	const soundClips = document.getElementById('sound-clips');
	const mergeBtn = document.getElementById('merge');
	var clicked = false;

	// ----------- audio recording stuff ------------------------------------------------
	if (navigator.mediaDevices.getUserMedia) {
	  console.log('getUserMedia supported.');

	  const constraints = { audio: true };
	  var chunks = [];

	  function onSuccess(stream) {
	    const mediaRecorder = new MediaRecorder(stream);

	    record.addEventListener('click', function(e) {
			if (!clicked) {
			   record.style.background = "#FF00A6";
	           mediaRecorder.start();
	           e.target.textContent = "STOP";
	           clicked = true;
	         } else {
	           clicked = false;
	           record.style.background = "";
	      	   record.style.color = "";
	           mediaRecorder.stop();
	           e.target.textContent = "Mic Record";
	         }
		}, false);

	    mediaRecorder.onstop = function(e) {
	      console.log("data available after MediaRecorder.stop() called.");

	      const clipName = prompt('Name your soundbite:','New Recording');

	      const clipContainer = document.createElement('div');
	      const clipLabel = document.createElement('p');
	      const audio = document.createElement('audio');
	      const deleteButton = document.createElement('button');

	      clipContainer.classList.add('clip');
	      audio.setAttribute('controls', '');
	      audio.name = "soundBite"
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
	      if(soundClips.childElementCount > 1)
				mergeBtn.hidden = false;

	      audio.controls = true;
	      const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
	      chunks = [];
	      const audioURL = window.URL.createObjectURL(blob);
	      audio.src = audioURL;
	      console.log("recorder stopped");

	      deleteButton.onclick = function(e) {
	        var evtTgt = e.target;
	        evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
	        if(soundClips.childElementCount <= 1)
				mergeBtn.hidden = true;
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