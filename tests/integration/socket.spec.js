const app = require("../../src/app");
const io = require("socket.io");
const ioOptions = { 
    transports: ['websocket'],
    forceNew: true, 
    reconnection: false
};
const data = {
    "message": "what patients have the condition viral sinusitis (disorder)?",
    "response": "This patients with this condition are: Mr.Aaron697 Brekke496"
}


describe('Chat Events', () => {
    var sender, receiver;

    beforeEach(async done => {
      sender = io('http://localhost:3001/', ioOptions);
      receiver = io('http://localhost:3001/', ioOptions);
      
      done();
    });

    afterEach(done => {
      sender.disconnect();
      receiver.disconnect();
      
      done();
    });

    it('client should receive a correct answer', done => {
      receiver.emit('chatMessage', data.message);

      sender.on('chatMessage', () => {
        sender.emit('message', data.response);
      });

      receiver.on('message', (msg) => {
        expect(msg).to.equal(data.response);
        done();
      });
    });

});