const SerialPort = require('serialport');
// Promise approach
SerialPort.list().then(ports => {
  ports.forEach(function(port) {
 console.log(port.path);
    // console.log(port.pnpId);
    // console.log(port.manufacturer);
  });
});
var portName='COM2';
var myPort = new SerialPort(portName, 9600);
let Readline = SerialPort.parsers.Readline; // make instance of Readline parser
let parser = new Readline(); // make a new parser to read ASCII lines
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
    console.log(data);
  }
   
  function showPortClose() {
    console.log('port closed.');
  }
   
  function showError(error) {
    console.log('Serial port error: ' + error);
  }

  var gettc = String.fromCharCode(97)+String.fromCharCode(12)+String.fromCharCode(1)+String.fromCharCode(110);

  function vtrcommand(a,b,c){
    return(String.fromCharCode(a)+String.fromCharCode(b)+String.fromCharCode(c));
  }
   //setInterval(()=>{ myPort.write(vtrcommand(32,0,32) +"\r\n")}, 1000);//play
   //setInterval(()=>{ myPort.write(vtrcommand(32,1,33) +"\r\n")}, 1000);//stop
  //setInterval(()=>{ myPort.write("a♀☺n" +"\r\n")}, 500);// for gttting tc
  setInterval(()=>{ myPort.write(gettc +"\r\n")}, 500);// for gttting tc