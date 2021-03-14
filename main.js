
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

const io = require("socket.io")(http);
global.io=io;
global.app=app;
io.on('connection', (socket) => {
	console.log("Socket Server connected");
	io.emit('casparstatus', { data1: connected.toString() });
});


var connected = false;

var net = require('net');
var client = net.Socket();
async function connecttocasparcg(host1, port1,res) {

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
	res.end();
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
	connecttocasparcg(req.body.host, req.body.port,res);
	//res.end();
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
	//res.send(product);
	res.end(product);
});
//app.get('/favicon.ico', (req, res) => res.status(204));

const nms1=require("./nms.js");
var osc1=require("./osc.js");
const ffmpeg1=require("./ffmpeg.js");
const cpuuses1=require("./cpuuses.js");
const vtrcontrol1=require("./vtrcontrol.js");
const mysql1=require("./sql.js");
const xdcamcontrol1=require("./xdcamcontrol.js");




