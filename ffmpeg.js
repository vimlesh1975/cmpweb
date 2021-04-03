const path = require('path');

var ffmpeg = require('fluent-ffmpeg');
// var procffmpeg;

var numvideo = 0;
let videos = [];

app.post('/transcode', (req, res) => {
	res.end();
	var videoname = req.body.cmd;
	var trascodedfilename = req.body.trascodedfilename;
	var OutputDirectory = req.body.OutputDirectory;
	transcodingparametrs = req.body['parameter1[]'];
	videos.unshift([videoname, transcodingparametrs, OutputDirectory, trascodedfilename]);
	numvideo += 1;

	if (numvideo == 1) { processVideos() }
});

function transcodeVideo(video) {
	var filenamewithextension = video[0].split('\\').pop().split('/').pop();
	var filename = path.parse(filenamewithextension).name;
	var p = new Promise((resolve, reject) => {
		procffmpeg = ffmpeg(video[0])
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
				catch { }
			})
			.on('start', (data) => {
				console.log(data);
				io.emit('filenames', { originalfile1: video[0], transcodedfilename1: video[2] + filename + video[3] });
			})
			.on('stderr', function (stderrLine) {
				io.emit('transcodestatus', { data1: stderrLine });
			})
			.outputOptions(video[1])
			.save(video[2] + filename + video[3]);
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