const record = $('#record');
const stop = $('#stop');
const messageInput = $('#msg');
const recordWrapper = $('#recordWrapper');
const stopWrapper = $('#stopWrapper');

if ('speechSynthesis' in window) {
    const SpeechRecognition = window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
  
    recognition.onstart = () => { 
        console.log('Voice recognition started. Try speaking into the microphone.');
    }

    recognition.onspeechend = function() {
        console.log("ended");
    }
      
    recognition.onerror = function(event) {
        if(event.error == 'no-speech') {
            console.log("no speech");
        };
    }
    
    recognition.onresult = function(event) {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;

        console.log(transcript);
      
        messageInput.val(transcript);
    }

    record.click(function() {
        recognition.start();
        recordWrapper.addClass("invisible");
        stopWrapper.removeClass("invisible");
    });
        
    stop.click(function() {
        recognition.stop();
        recordWrapper.removeClass("invisible");
        stopWrapper.addClass("invisible");

    });

} else {
    console.log('Speech recognition not supported 😢');
}