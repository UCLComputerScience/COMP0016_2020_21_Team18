const record = $('#record');
const stop = $('#stop');
const constraints = { audio: true };
let chunks = [];

if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function (stream) {
        const mediaRecorder = new MediaRecorder(stream);
        
        record.onclick = function() {
            mediaRecorder.start();
            record.addClass("invisible");
            stop.removeClass("invisible");
            chunks = [];
        };

        stop.onclick = function() {
            mediaRecorder.stop();
        };

        mediaRecorder.onstop = function(e) {
            const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
            const audioURL = URL.createObjectURL(blob);
            audio.src = audioURL;

            console.log(audioURL);
        }

        mediaRecorder.ondataavailable = function(e) {
            chunks.push(e.data);
        }
    })
}
