/* eslint-disable no-undef */

const record = $("#record");
const stop = $("#stop");
const messageInput = $("#msg");
const recordWrapper = $("#recordWrapper");
const stopWrapper = $("#stopWrapper");
let recognition;

if ("speechSynthesis" in window) {
  const SpeechRecognition = window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    console.log("test");
    const current = event.resultIndex;
    const { transcript } = event.results[current][0];

    console.log(transcript);

    messageInput.val(transcript);
  };

  record.click(() => {
    recognition.start();
    console.log("start test");
    recordWrapper.addClass("invisible");
    stopWrapper.removeClass("invisible");
  });

  stop.click(() => {
    recognition.stop();
    console.log("stop test");
    recordWrapper.removeClass("invisible");
    stopWrapper.addClass("invisible");
  });
} else {
  console.log("Speech recognition not supported 😢");
}
