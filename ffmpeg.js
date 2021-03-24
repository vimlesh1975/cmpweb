const path = require('path');

var ffmpeg = require('fluent-ffmpeg');
var procffmpeg;

app.post('/transcode', (req, res) => {
	var aa = req.body.cmd;
	var filenamewithextension = aa.split('\\').pop().split('/').pop();
	var filename = path.parse(filenamewithextension).name;

	procffmpeg = ffmpeg(aa)

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
		res.end();
});

var fluentffmpegutil = require('fluent-ffmpeg-util');
app.post('/pauseffmpeg', (req, res) => {
	fluentffmpegutil.pause(procffmpeg);
	res.end();
});

app.post('/resumeffmpeg', (req, res) => {
	fluentffmpegutil.resume(procffmpeg);
	res.end();
});

app.post('/killffmpeg', (req, res) => {
	procffmpeg.kill();
	res.end();

});