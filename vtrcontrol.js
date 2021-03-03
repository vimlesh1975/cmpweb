const SerialPort = require('serialport');
// Promise approach
SerialPort.list().then(ports => {
  ports.forEach(function (port) {
    console.log(port.path);
    // console.log(port.pnpId);
    // console.log(port.manufacturer);
  });
});
var portName = 'COM2';
var myPort = new SerialPort(portName, 38400);
let Readline = SerialPort.parsers.Readline; // make instance of Readline parser
let parser = new Readline; // make a new parser to read ASCII lines
myPort.pipe(parser); // pipe the serial stream to the parser

myPort.on('open', showPortOpen);
//myPort.on('data', readSerialData);
parser.on('data', readSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

function showPortOpen() {
  console.log('port open');
}

function readSerialData(data) {
  console.log(data.toString());
  io.emit('vtrstatus', { data1: data.toString() });
}

function showPortClose() {
  console.log('port closed.');
}

function showError(error) {
  console.log('Serial port error: ' + error);
}

var gettc = String.fromCharCode(97) + String.fromCharCode(12) + String.fromCharCode(1) + String.fromCharCode(110);

function vtrcommand(a, b, c) {
  return (String.fromCharCode(a) + String.fromCharCode(b) + String.fromCharCode(c));
}
app.post('/frames/vtrgettc', (req, res) => {
  myPort.write(gettc);// for gttting tc
  //console.log(gettc);
  //io.emit('vtrstatus', { data1:  "tc command"});
  res.end;
});
app.post('/frames/vtrstop', (req, res) => {
  res.end;
  myPort.write(vtrcommand(32, 0, 32));//play
  console.log(vtrcommand(32, 0, 32));
  io.emit('vtrstatus', { data1: "stop " });
});

app.post('/frames/vtrplay', (req, res) => {
  res.end;
  myPort.write(vtrcommand(32, 1, 33));//play
  io.emit('vtrstatus', { data1: "play " });
});
app.post('/frames/Rewind', (req, res) => {
  res.end;
  myPort.write(vtrcommand(32, 32, 64));//Rewind
  io.emit('vtrstatus', { data1: "Rewind " });
});
app.post('/frames/FastFW', (req, res) => {
  res.end;
  myPort.write(vtrcommand(32, 16, 48));//FastFW
  io.emit('vtrstatus', { data1: "FastFW " });
});
app.post('/frames/MarkIN', (req, res) => {
  res.end;
  myPort.write(vtrcommand(64, 16, 80));//MarkIN
  io.emit('vtrstatus', { data1: "MarkIN " });
});

app.post('/frames/MarkOut', (req, res) => {
  res.end;
  myPort.write(vtrcommand(64, 17, 81));//MarkOut
  io.emit('vtrstatus', { data1: "MarkOut " });
});

app.post('/frames/PreRoll', (req, res) => {
  res.end;
  myPort.write(vtrcommand(32, 48, 80));//PreRoll
  io.emit('vtrstatus', { data1: "PreRoll " });
});
app.post('/frames/Eject', (req, res) => {
  res.end;
  myPort.write(vtrcommand(32, 15, 47));//Eject
  io.emit('vtrstatus', { data1: "Eject " });
});

app.post('/frames/StandByOn', (req, res) => {
  res.end;
  myPort.write(vtrcommand(32, 5, 37));//StandByOn
  io.emit('vtrstatus', { data1: "StandByOn " });
});

app.post('/frames/StandByOff', (req, res) => {
  res.end;
  myPort.write(vtrcommand(32, 4, 36));//StandByOff
  io.emit('vtrstatus', { data1: "StandByOff " });
});
app.post('/frames/AssembleOn', (req, res) => {
  res.end;
  myPort.write(String.fromCharCode(66) + String.fromCharCode(48) + String.fromCharCode(32) + String.fromCharCode(0) + String.fromCharCode(66 + 48 + 32 + 0));//AssemblyOn
  io.emit('vtrstatus', { data1: "AssembleOn " });
});
app.post('/frames/AssembleOff', (req, res) => {
  res.end;
  myPort.write(String.fromCharCode(66) + String.fromCharCode(48) + String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(66 + 48 + 0 + 0));//AssemblyOn
  io.emit('vtrstatus', { data1: "AssembleOff " });
});

app.post('/frames/AssembleOff', (req, res) => {
  res.end;
  myPort.write(String.fromCharCode(66) + String.fromCharCode(48) + String.fromCharCode(0) + String.fromCharCode(0) + String.fromCharCode(66 + 48 + 0 + 0));//AssemblyOff
  io.emit('vtrstatus', { data1: "AssembleOff " });
});
app.post('/frames/Record', (req, res) => {
  res.end;
  myPort.write(vtrcommand(32, 2, 34));//Record
  io.emit('vtrstatus', { data1: "Record " });
});
app.post('/frames/AutoEdit', (req, res) => {
  res.end;
  myPort.write(vtrcommand(32, 66, 32 + 66));//AutoEdit
  io.emit('vtrstatus', { data1: "AutoEdit " });
});

app.post('/frames/Preview', (req, res) => {
  res.end;
  myPort.write(vtrcommand(32, 64, 32 + 64));//Preview
  io.emit('vtrstatus', { data1: "Preview " });
});

app.post('/frames/Review', (req, res) => {
  res.end;
  myPort.write(vtrcommand(32, 65, 32 + 65));//Review
  io.emit('vtrstatus', { data1: "Review " });
});

app.post('/frames/jog', (req, res) => {
  res.end;
  console.log(req.body.cmd);
  if (req.body.cmd > 0) {
    myPort.write(String.fromCharCode(33) + String.fromCharCode(17) + String.fromCharCode(req.body.cmd) + String.fromCharCode(33 + 17 + req.body.cmd));//jog
  }
  else {
    myPort.write(String.fromCharCode(33) + String.fromCharCode(33) + String.fromCharCode(Math.abs(req.body.cmd)) + String.fromCharCode(33 + 33 + Math.abs(req.body.cmd)));//jog
  }

  io.emit('vtrstatus', { data1: "jog = " + req.body.cmd });
});

app.post('/frames/varf', (req, res) => {
  res.end;
  console.log(req.body.cmd);
  if (req.body.cmd > 0) {
    myPort.write(String.fromCharCode(33) + String.fromCharCode(18) + String.fromCharCode(req.body.cmd) + String.fromCharCode(33 + 18 + req.body.cmd));//varf
  }
  else {
    myPort.write(String.fromCharCode(33) + String.fromCharCode(34) + String.fromCharCode(Math.abs(req.body.cmd)) + String.fromCharCode(33 + 34 + Math.abs(req.body.cmd)));//jog
  }

  io.emit('vtrstatus', { data1: "varf = " + req.body.cmd });
});

app.post('/frames/shuttle', (req, res) => {
  res.end;
  console.log(req.body.cmd);
  if (req.body.cmd > 0) {
    myPort.write(String.fromCharCode(33) + String.fromCharCode(19) + String.fromCharCode(req.body.cmd) + String.fromCharCode(33 + 19 + req.body.cmd));//shuttle
  }
  else {
    myPort.write(String.fromCharCode(33) + String.fromCharCode(35) + String.fromCharCode(Math.abs(req.body.cmd)) + String.fromCharCode(33 + 35 + Math.abs(req.body.cmd)));//jog
  }

  io.emit('vtrstatus', { data1: "shuttle = " + req.body.cmd });
});
app.post('/frames/portclose', (req, res) => {
  res.end;
  myPort.close();
  io.emit('vtrstatus', { data1: "Port Closed" });
});

app.post('/frames/cue', (req, res) => {
  res.end;
  var aa = (req.body.cmd).split(":");
  myPort.write(String.fromCharCode(36) + String.fromCharCode(49) + String.fromCharCode(parseInt(aa[3], 16)) + String.fromCharCode((parseInt(aa[2], 16)) + String.fromCharCode(parseInt(aa[1], 16)) + String.fromCharCode(parseInt(aa[0], 16)) + String.fromCharCode(36 + 49 + parseInt(aa[3], 16) + parseInt(aa[2], 16) + parseInt(aa[1], 16) + parseInt(aa[0], 16))));
  io.emit('vtrstatus', { data1: "cue at " + req.body.cmd });
});

app.post('/frames/oneframeforward', (req, res) => {
  res.end;
  var aa = (req.body.cmd).split(":");
  myPort.write(String.fromCharCode(36) + String.fromCharCode(49) + String.fromCharCode(parseInt(aa[3], 16) + 1) + String.fromCharCode(parseInt(aa[2], 16)) + String.fromCharCode(parseInt(aa[1], 16)) + String.fromCharCode(parseInt(aa[0], 16)) + String.fromCharCode(36 + 49 + parseInt(aa[3] + 1, 16) + parseInt(aa[2], 16) + parseInt(aa[1], 16) + parseInt(aa[0], 16)));
  io.emit('vtrstatus', { data1: "1rame +  " + req.body.cmd });
});

app.post('/frames/oneframeback', (req, res) => {
  res.end;
  var aa = (req.body.cmd).split(":");
  myPort.write(String.fromCharCode(36) + String.fromCharCode(49) + String.fromCharCode(parseInt(aa[3], 16) - 1) + String.fromCharCode(parseInt(aa[2], 16)) + String.fromCharCode(parseInt(aa[1], 16)) + String.fromCharCode(parseInt(aa[0], 16)) + String.fromCharCode(36 + 49 + parseInt(aa[3] - 1, 16) + parseInt(aa[2], 16) + parseInt(aa[1], 16) + parseInt(aa[0], 16)));
  io.emit('vtrstatus', { data1: "1frame -  " + req.body.cmd });
});

