var soap = require('soap');
var url = "xdcam-station-044.wsdl";
var endpoint1 = "http://admin:pdw-hd1550@192.168.5.10/webservice";
var args1 = { "PlayerId": "Player_1" }
var client1;

function setserver(_endpoint1) {
    endpoint1 = _endpoint1;
    soap.createClientAsync(url, { forceSoap12Headers: true }).then((client) => {
        client.setEndpoint(endpoint1);
        client1 = client;
        setInterval(() => xdcamgettc(), 40);
    });

}
// setTimeout(() => {
//     setserver(endpoint1)
// }, 1000);
function xdcammethod(args1, method1) {
    try {
      
        client1[method1](args1, (err, result1) => {
            console.log(result1);
        });
    } catch (error) {

    }
}


app.post('/frames/xdcamset', (req, res) => {
    setserver(req.body.cmd);
    console.log("xdcamset command");
    console.log(req.body.cmd);
    io.emit('xdcamstatus', { data1: "xdcamset " });
    res.end();
});

app.post('/frames/xdcampause', (req, res) => {
    xdcammethod(args1, "Pause");
    console.log("xdcam pause command");
    io.emit('xdcamstatus', { data1: "pause " });
    res.end();
});
app.post('/frames/xdcamresume', (req, res) => {
    xdcammethod(args1, "Play");
    console.log("xdcam play command");
    io.emit('xdcamstatus', { data1: "play " });
    res.end();
});

app.post('/frames/FastForward', (req, res) => {
    xdcammethod(args1, "FastForward");
    console.log("FastForwardRequestcommand");
    io.emit('xdcamstatus', { data1: "FastForwardRequest " });
    res.end();
});

app.post('/frames/FastRewind', (req, res) => {
    xdcammethod(args1, "Rewind");
    console.log("Rewind");
    io.emit('xdcamstatus', { data1: "Rewind " });
    res.end();
});

function xdcamgettc() {
    try {
        //client1.setEndpoint(endpoint1);
        client1['GetPlayerStatus'](args1, (err, result1) => {
            //console.log(result1['Status']['Port'][0]['Video']['LTC']['Time']);
            io.emit('xdcamtc', { data1: result1['Status']['Port'][0]['Video']['LTC']['Time'] +":"+ ("0" + result1['Status']['Port'][0]['Video']['LTC']['Frame']).slice(-2) });
            io.emit('xdcamplayerotherstatus', { data1: JSON.stringify(result1)});
        });
    } catch (error) {
        console.log(error)
    }
}

