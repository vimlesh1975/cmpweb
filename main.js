//node media server code  starts
const NodeMediaServer = require('node-media-server');

const config = {
	rtmp: {
		port: 1935,
		chunk_size: 60000,
		gop_cache: true,
		ping: 30,
		ping_timeout: 60
	},
	http: {
		port: 8001,
		allow_origin: '*'
	}
};

var nms = new NodeMediaServer(config)
nms.run();
//nms.stop();



var response;

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require("ejs");
const path = require('path');
const app = express();
const routes = require("./routes/index.js")
app.use("/", routes);
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.set('views', './views')
app.set("view engine", "ejs");
//var serveStatic = require( "serve-static" );
//app.use('/media', serveStatic('z:\\'));

//console.log (" from main.js" + routes.connected.toString());



const port = 8080;
const http = require("http").Server(app)
http.listen(port, (req, res) => {
	console.log(`Server is liestemnig on ${port}`);
})


// OSC
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

const io = require("socket.io")(http);
//global.io=io;

io.on('connection', (socket) => {
	console.log("Socket Server connected");
	io.emit('casparstatus', { data1: connected.toString() });
});


var connected = false;

var net = require('net');
var client = net.Socket();
async function connecttocasparcg(host1, port1) {

	if (connected == false) {
		console.log("Connection Request from client");
		client = new net.Socket();
		var aa = await client.connect(port1, host1);
		//console.log(aa);
		connected = true;
	}
	else {
		console.log("Disconnection Request from client");
		client.end();
		//client.distroy();
		connected = false;
	}
	io.emit('casparstatus', { data1: connected.toString() });
}
function connectListener() {

}

client.on('error', function (err) {
	console.log(err)
	connected = false;
	io.emit('casparstatus', { data1: connected.toString() });
})

client.on('close', function () {
	console.log('Casparcg Connection closed');
	connected = false;
	io.emit('casparstatus', { data1: connected.toString() });
});
client.on('end', function () {
	console.log('Casparcg Connection closed');
	connected = false;
	io.emit('casparstatus', { data1: connected.toString() });
});

client.on('connect', function () {
	console.log('Casparcg connected');
	connected = true;
	io.emit('casparstatus', { data1: connected.toString() });
});
client.on('disconnect', function () {
	console.log('Casparcg disconnected');
	connected = false;
	io.emit('casparstatus', { data1: connected.toString() });
});


client.on('uncaughtException', function (err) {
	console.log("client uncaughtException error");
	connected = false;
	io.emit('casparstatus', { data1: connected.toString() });
});

process.on('uncaughtException', function (err) {
	console.log("client uncaughtException error, Server not running");
	connected = false;
	io.emit('casparstatus', { data1: connected.toString() });
});

app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

app.post('/endpoint', (req, res) => {
	if (connected == true) {
		var aa = (req.body.cmd).split("\n");
		for (i = 0; i < aa.length; i++) {
			client.removeAllListeners();
			client.write(aa[i] + `\r\n`);
			client.on('data', function (data) {
				res.end(data);
			});
		}
	}
});

app.post('/connect', (req, res) => {
	connecttocasparcg(req.body.host, req.body.port);
	res.end();
});



//main index file
app.get('/', (req, res) => {
	res.render("index", {});
	res.end();
});

const dirTree = require("directory-tree");
app.post('/getfilesforanywhere', (req, res) => {

	var product = [];
	const tree = dirTree(req.body.cmd, {}, (item, PATH, stats) => {
		product.push([item.path])

	})
	res.send(product);
	res.end;
});

var ffmpeg = require('fluent-ffmpeg');
var proc;

app.post('/transcode', (req, res) => {
	var aa = req.body.cmd;
	var filenamewithextension = aa.split('\\').pop().split('/').pop();
	var filename = path.parse(filenamewithextension).name;

	proc = ffmpeg(aa)

		.on('end', function () {
			io.emit('transcodestatus', { data1: 'file has been converted succesfully' });
		})
		.on('error', function (err) {
			io.emit('transcodestatus', { data1: err.message });
		})
		.on('progress', (data) => {
			io.emit('trancodepercent1', { percent1: (data.percent).toFixed(0) });
		})
		.on('start', (data) => {
			io.emit('filenames', { originalfile1: aa, transcodedfilename1: 'd:/test/' + filename + '_transcoded.mxf' });
		})
		.on('stderr', function (stderrLine) {
			io.emit('transcodestatus', { data1: stderrLine });
		})

		.outputOptions([
			'-b:v 10M', '-r 60'
		])
		.save('d:/test/' + filename + '_transcoded.mxf');
});

var fluentffmpegutil = require('fluent-ffmpeg-util');
app.post('/pauseffmpeg', (req, res) => {
	fluentffmpegutil.pause(proc);
});

app.post('/resumeffmpeg', (req, res) => {
	fluentffmpegutil.resume(proc);
});

app.post('/killffmpeg', (req, res) => {
	proc.kill();

});


// cpu uses code start
var os = require('os-utils');
setInterval(() => {
	os.cpuUsage(function (v) {
		io.emit('cpustatus', { data1:  (v * 100).toFixed(0) + '%'});
	});
}, 1000)

// cpu uses code end
