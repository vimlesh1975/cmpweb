const SerialPort = require('serialport');
// Promise approach
var portName;
var myPort;
function portopen(_portName) {
  SerialPort.list().then(ports => {
    portName =_portName;// ports[0].path;// 'COM2';

    ports.forEach(function (port) {
      console.log(port.path);
    });
    myPort = new SerialPort(portName, 38400);
    let Readline = SerialPort.parsers.Readline; // make instance of Readline parser
    let parser = new Readline; // make a new parser to read ASCII lines
    myPort.pipe(parser); // pipe the serial stream to the parser

    myPort.on('open', showPortOpen);
    //myPort.on('data', readSerialData);
    parser.on('data', readSerialData);
    myPort.on('close', showPortClose);
    myPort.on('error', showError);
  });
}

//portopen("COM1");

// setTimeout(() => {
//   portclose()
// }, 3000);

function portclose(){
  myPort.close();
}



function showPortOpen() {
  console.log(portName +' port open');
  io.emit('vtrstatus', { data1: "port open " });
}

function readSerialData(data) {
  console.log(data.toString());
  io.emit('vtrstatus', { data1: data.toString() });
}

function showPortClose() {
  console.log('port closed.');
  io.emit('vtrstatus', { data1: "port closed " });
}

function showError(error) {
  console.log('Serial port error: ' + error);
  io.emit('vtrstatus', { data1: error.toString()});
}

var gettc = String.fromCharCode(97) + String.fromCharCode(12) + String.fromCharCode(1) + String.fromCharCode(110);

function vtrcommand(a, b, c) {
  return (String.fromCharCode(a) + String.fromCharCode(b) + String.fromCharCode(c));
}
app.post('/frames/portopen', (req, res) => {
  portopen(req.body.portname);
  
  res.end();
});


app.post('/frames/portclose', (req, res) => {
  myPort.close();
  
  res.end();
});

app.post('/frames/vtrgettc', (req, res) => {
  myPort.write(gettc);// for gttting tc
  //console.log(gettc);
  //io.emit('vtrstatus', { data1:  "tc command"});
  res.end;
});
app.post('/frames/vtrstop', (req, res) => {
  myPort.write(vtrcommand(32, 0, 32));//play
  console.log(vtrcommand(32, 0, 32));
  io.emit('vtrstatus', { data1: "stop " });
  res.end();
});

app.post('/frames/vtrplay', (req, res) => {
  myPort.write(vtrcommand(32, 1, 33));//play
  io.emit('vtrstatus', { data1: "play " });
  res.end();
});
app.post('/frames/Rewind', (req, res) => {
  myPort.write(vtrcommand(32, 32, 64));//Rewind
  io.emit('vtrstatus', { data1: "Rewind " });
  res.end();
});
app.post('/frames/FastFW', (req, res) => {

  myPort.write(vtrcommand(32, 16, 48));//FastFW
  io.emit('vtrstatus', { data1: "FastFW " });
  res.end();
});
app.post('/frames/MarkIN', (req, res) => {

  myPort.write(vtrcommand(64, 16, 80));//MarkIN
  io.emit('vtrstatus', { data1: "MarkIN " });
  res.end();
});

app.post('/frames/MarkOut', (req, res) => {

  myPort.write(vtrcommand(64, 17, 81));//MarkOut
  io.emit('vtrstatus', { data1: "MarkOut " });
  res.end();
});

app.post('/frames/PreRoll', (req, res) => {

  myPort.write(vtrcommand(32, 48, 80));//PreRoll
  io.emit('vtrstatus', { data1: "PreRoll " });
  res.end();
});
app.post('/frames/Eject', (req, res) => {

  myPort.write(vtrcommand(32, 15, 47));//Eject
  io.emit('vtrstatus', { data1: "Eject " });
  res.end();
});

app.post('/frames/StandByOn', (req, res) => {

  myPort.write(vtrcommand(32, 5, 37));//StandByOn
  io.emit('vtrstatus', { data1: "StandByOn " });
  res.end();
});

app.post('/frames/StandByOff', (req, res) => {

  myPort.write(vtrcommand(32, 4, 36));//StandByOff
  io.emit('vtrstatus', { data1: "StandByOff " });
  res.end();
});
app.post('/frames/AssembleOn', (req, res) => {

  myPort.write(String.fromCharCode(66) + String.fromCharCode(48) + String.fromCharCode(32) + String.fromCharCode(0) + String.fromCharCode(66 + 48 + 32 + 0));//AssemblyOn
  io.emit('vtrstatus', { data1: "AssembleOn " });
  res.end();
});
app.post('/frames/AssembleOff', (req, res) => {

  myPort.write(String.fromCharCode(66) + String.fromCharCode(48) + String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(66 + 48 + 0 + 0));//AssemblyOn
  io.emit('vtrstatus', { data1: "AssembleOff " });
  res.end();
});

app.post('/frames/AssembleOff', (req, res) => {

  myPort.write(String.fromCharCode(66) + String.fromCharCode(48) + String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(66 + 48 + 0 + 0));//AssemblyOff
  io.emit('vtrstatus', { data1: "AssembleOff " });
  res.end();
});
app.post('/frames/Record', (req, res) => {
  myPort.write(vtrcommand(32, 2, 34));//Record
  io.emit('vtrstatus', { data1: "Record " });
  res.end();
});
app.post('/frames/AutoEdit', (req, res) => {
  myPort.write(vtrcommand(32, 66, 32 + 66));//AutoEdit
  io.emit('vtrstatus', { data1: "AutoEdit " });
  res.end();
});

app.post('/frames/Preview', (req, res) => {
  myPort.write(vtrcommand(32, 64, 32 + 64));//Preview
  io.emit('vtrstatus', { data1: "Preview " });
  res.end();
});

app.post('/frames/Review', (req, res) => {
  myPort.write(vtrcommand(32, 65, 32 + 65));//Review
  io.emit('vtrstatus', { data1: "Review " });
  res.end();
});

app.post('/frames/jog', (req, res) => {
  console.log(req.body.cmd);
  if (req.body.cmd > 0) {
    myPort.write(String.fromCharCode(33) + String.fromCharCode(17) + String.fromCharCode(req.body.cmd) + String.fromCharCode(33 + 17 + req.body.cmd));//jog
  }
  else {
    myPort.write(String.fromCharCode(33) + String.fromCharCode(33) + String.fromCharCode(Math.abs(req.body.cmd)) + String.fromCharCode(33 + 33 + Math.abs(req.body.cmd)));//jog
  }

  io.emit('vtrstatus', { data1: "jog = " + req.body.cmd });
  res.end();
});

app.post('/frames/varf', (req, res) => {
  console.log(req.body.cmd);
  if (req.body.cmd > 0) {
    myPort.write(String.fromCharCode(33) + String.fromCharCode(18) + String.fromCharCode(req.body.cmd) + String.fromCharCode(33 + 18 + req.body.cmd));//varf
  }
  else {
    myPort.write(String.fromCharCode(33) + String.fromCharCode(34) + String.fromCharCode(Math.abs(req.body.cmd)) + String.fromCharCode(33 + 34 + Math.abs(req.body.cmd)));//jog
  }

  io.emit('vtrstatus', { data1: "varf = " + req.body.cmd });
  res.end();
});

app.post('/frames/shuttle', (req, res) => {
  console.log(req.body.cmd);
  if (req.body.cmd > 0) {
    myPort.write(String.fromCharCode(33) + String.fromCharCode(19) + String.fromCharCode(req.body.cmd) + String.fromCharCode(33 + 19 + req.body.cmd));//shuttle
  }
  else {
    myPort.write(String.fromCharCode(33) + String.fromCharCode(35) + String.fromCharCode(Math.abs(req.body.cmd)) + String.fromCharCode(33 + 35 + Math.abs(req.body.cmd)));//jog
  }

  io.emit('vtrstatus', { data1: "shuttle = " + req.body.cmd });
  res.end();
});
app.post('/frames/portclose', (req, res) => {
  myPort.close();
  io.emit('vtrstatus', { data1: "Port Closed" });
})

app.post('/frames/cue', (req, res) => {
  var aa = (req.body.cmd).split(":");
  aa[0] = parseInt(aa[0]);
  aa[1] = parseInt(aa[1]);
  aa[2] = parseInt(aa[2]);
  aa[3] = parseInt(aa[3]);

  myPort.write(String.fromCharCode(36) + String.fromCharCode(49) + String.fromCharCode(parseInt(aa[3], 16)) + String.fromCharCode(parseInt(aa[2], 16)) + String.fromCharCode(parseInt(aa[1], 16)) + String.fromCharCode(parseInt(aa[0], 16)) + String.fromCharCode(36 + 49 + parseInt(aa[3], 16) + parseInt(aa[2], 16) + parseInt(aa[1], 16) + parseInt(aa[0], 16)));
  io.emit('vtrstatus', { data1: "cue at " + req.body.cmd });
  res.end();
});



app.post('/frames/oneframeback', (req, res) => {
  var aa = (req.body.cmd).split(":");
  aa[0] = parseInt(aa[0]);
  aa[1] = parseInt(aa[1]);
  aa[2] = parseInt(aa[2]);
  aa[3] = parseInt(aa[3]);

  myPort.write(String.fromCharCode(36) + String.fromCharCode(49) + String.fromCharCode(parseInt(aa[3] - 1, 16)) + String.fromCharCode(parseInt(aa[2], 16)) + String.fromCharCode(parseInt(aa[1], 16)) + String.fromCharCode(parseInt(aa[0], 16)) + String.fromCharCode(36 + 49 + parseInt(aa[3] - 1, 16) + parseInt(aa[2], 16) + parseInt(aa[1], 16) + parseInt(aa[0], 16)));
  io.emit('vtrstatus', { data1: "-1 " + req.body.cmd });
  res.end();
});

app.post('/frames/oneframeforward', (req, res) => {
  var aa = (req.body.cmd).split(":");
  aa[0] = parseInt(aa[0]);
  aa[1] = parseInt(aa[1]);
  aa[2] = parseInt(aa[2]);
  aa[3] = parseInt(aa[3]);

  myPort.write(String.fromCharCode(36) + String.fromCharCode(49) + String.fromCharCode(parseInt(aa[3] + 1, 16)) + String.fromCharCode(parseInt(aa[2], 16)) + String.fromCharCode(parseInt(aa[1], 16)) + String.fromCharCode(parseInt(aa[0], 16)) + String.fromCharCode(36 + 49 + parseInt(aa[3] + 1, 16) + parseInt(aa[2], 16) + parseInt(aa[1], 16) + parseInt(aa[0], 16)));
  io.emit('vtrstatus', { data1: "+1 " + req.body.cmd });
  res.end();
});

// setInterval(() => { 
//   myPort.write("1212121"+"\r\n"); 
//   console.log("ll");
// }, 1000);