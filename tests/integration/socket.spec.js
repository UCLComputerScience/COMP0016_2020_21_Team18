/* eslint-disable no-undef */
const io = require("socket.io-client");

const ioOptions = {
  transports: ["websocket"],
  forceNew: true,
  reconnection: false,
};

const data = {
  message: "what patients have the condition viral sinusitis (disorder)?",
  response: "This patients with this condition are: Mr.Aaron697 Brekke496",
};

describe("Chat Events", () => {
  it("client should receive a correct answer", (done) => {
    const sender = io("http://localhost:3001/", ioOptions);
    const receiver = io("http://localhost:3001/", ioOptions);

    receiver.emit("chatMessage", data.message);

    sender.on("chatMessage", () => {
      sender.emit("message", data.response);
    });

    receiver.on("message", (msg) => {
      expect(msg).to.equal(data.response);
    });

    sender.disconnect();
    receiver.disconnect();
    done();
  });
});
