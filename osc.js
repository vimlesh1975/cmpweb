var oscClient = require('osc-min');
var udpConnection = require("dgram");
var oscdatafull = [];
sock = udpConnection.

	createSocket("udp4", function (msg, rinfo) {
		var error, error1;
		try {
			oscMessages = oscClient.fromBuffer(msg);
			oscMessages.elements.forEach(function (oscMessage) {
				io.emit('oscmessage', oscMessage);
			});

		} catch (error1) {
			error = error1;
		}
	});

sock.bind(6250);