const path = require('path');

var ffmpeg = require('fluent-ffmpeg');
var procffmpeg;

var numvideo = 0;
let videos = [];
let transcodingparametrs;

app.post('/transcode', (req, res) => {
	res.end();
	videos.unshift(req.body.cmd);
	numvideo += 1;
	transcodingparametrs = req.body['parameter1[]'];

	if (numvideo == 1) { processVideos() }
});

function transcodeVideo(video) {
	var filenamewithextension = video.split('\\').pop().split('/').pop();
	var filename = path.parse(filenamewithextension).name;
	var p = new Promise((resolve, reject) => {
		procffmpeg = ffmpeg(video)
			.on('end', function () {
				resolve();
				io.emit('transcodestatus', { data1: 'file has been converted succesfully' });
			})
			.on('error', function (err) {
				reject();
				io.emit('transcodestatus', { data1: err.message });
			})
			.on('progress', (data) => {
				try {
					io.emit('trancodepercent1', { percent1: (data.percent).toFixed(0) })
				}
				catch
				{

				}
			})
			.on('start', (data) => {
				console.log(data);
				io.emit('filenames', { originalfile1: video, transcodedfilename1: 'd:/test/' + filename + '_transcoded.mxf' });
			})
			.on('stderr', function (stderrLine) {
				io.emit('transcodestatus', { data1: stderrLine });
			})

			.outputOptions(transcodingparametrs)
			.save('d:/test/' + filename + '_transcoded.mxf');

	});
	return p;
}
function processVideos() {

	let video = videos.pop();
	if (video) {
		transcodeVideo(video).then(() => {
			console.log(`Completed Video - ${video}`);
			processVideos();
		}).catch(() => {
			console.log(`error in Transcoding Video - ${video}`);
			processVideos();
		});
	} else {
		numvideo = 0
	}
}

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