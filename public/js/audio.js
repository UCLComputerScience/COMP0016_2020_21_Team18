const record = $('#record');
const stop = $('#stop');
const messageInput = $('#msg');

if ('speechSynthesis' in window) {
    const SpeechRecognition = window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
  
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
      
        messageInput.value = transcript;
    }

    record.click(function() {
        recognition.start();
        record.addClass("invisible");
        stop.removeClass("invisible");
    });
        
    stop.click(function() {
        recognition.stop();
        record.removeClass("invisible");
        stop.addClass("invisible");

    });

} else {
    console.log('Speech recognition not supported 😢');
}