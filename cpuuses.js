var os = require('os-utils');
setInterval(() => {
	os.cpuUsage(function (v) {
		io.emit('cpustatus', { data1:  (v * 100).toFixed(0) + '%'});
	});
}, 1000)