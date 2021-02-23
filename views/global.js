var multimodulechek = false;
var filenamewithoutextensioncheck = true;
var fps = 25.0;

var modulestartpoint = [0, 60];
var modulesize = [1228, 957];
var modulegbsize = [1220, 950];

var casparwindowstartpoint = [1230, 55];

var casparwindowssize = [692, 620];

var client;// = TcpClient;
var NetStream;// = NetworkStream;

var osd2;// = SaveFileDialog;

var ofd2;// = OpenFileDialog;

var ofd1;// = OpenFileDialog;

var picofd;//= OpenFileDialog;
var cd1;// = ColorDialog;
var tempRow;// = DataGridViewRow;

var CasparCGDataCollectio;// = CasparCGDataCollection;
//var WithEvents CasparDevice As New Svt.Caspar.CasparDevice

var g_int_ChannelNumber = 1;
var g_int_PlaylistLayer = 1;

var mediafullpath = "c:/casparcg/_media/";
var masterfilename

//for subclip
var clipseek;
var cliplength;
var currrow;

//for template
var templatepath = "c:/casparcg/";
var templatefullpath = "c:/casparcg/";

var iclippauseresume = 1;
var seconndchannelloopvideoname;

//Declaring some constants to use with the SendMessage API
const WM_SYSCOMMAND = 274;
const SC_MAXIMIZE = 61488;

var parentedProcess2;

var iaddimage = 1;

//' Dim tempRow As DataGridViewRow
var timeinterval;
var clipsleftduration;
var dropedclipsleftduration;
var mediapath = "c:/casparcg/_media/";

var thumbnailspath = "c:/casparcg/_thumbnails";
var thumbnailsfullpath = "c:/casparcg/_thumbnails/";

var initialpath = "D:\CasparCG Server 2.0.7\Server";

var logpath = "";
var datapath = "";
var fontpath = "c:/windows/fonts";

var formname;

var islowmotion;

var ChannelName;

var deinterlaced = " filter yadif=1:0";
var g_int_NumberOfChannels;
var m_PerformanceCounter;//As New System.Diagnostics.PerformanceCounter("Processor", "% Processor Time", "_Total") ' for cup uses
var ServerVersion = 1;
var lastlayout = "C:/casparcg/mydata/layouts/lastlayout.xml";

//for composition------------------------------------------------------------------
var fillstring;
var intElements = 1;
var params = '{"input-repeat=65535"}';
var elementmove;//As Boolean
var ndi1;

var xx = 0;
var yy = 0;

//' for osc
var audiovalue1;//As Double
var audiovalue2;// As Double
var framesPlayed;//As Integer
var framesTotal;// As Integer
var playingfilename;// As String
//for osc end

var msPerFrame;// = 1000/fps;//fps



var currenttime;
var totlatime;
var currentframe;
var totalframe;
var currentclip;


var flvPlayer;
function flvplayerstart() {

    if (flvjs.isSupported()) {
        var videoElement = document.getElementById('videoElement');
        flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: 'http://localhost:8001/live/STREAM_NAME.flv'
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
    }
}
flvplayerstart();
function sendstring(str) {
    $.post("endpoint", {
        cmd: str
    },
        function (data, status) {
            $('#ServerResponse').html(data + $('#ServerResponse').html());
        });
}
function getcliplist(str) {
    $.post("endpoint", {
        cmd: str
    },
        function (data, status) {
            $('#tblclipgrid').empty();
            var aa = data.split("\n");
            for (var i = 2; i < aa.length; i++) {
                var bb = aa[i].split('"');
                if (bb[1] !== undefined) {
                    inesrtintoclipgrid(bb[1].replaceAll("\\", "/"));
                }
            }
        });
}

function gettemplatelist(str) {
    $.post("endpoint", {
        cmd: str
    },
        function (data, status) {
            $('#lsttemplate').empty();
            var aa = data.split("\n");
            //for (var i = 1; i < aa.length; i++) {
            if (ServerVersion == 2.3) {
                //alert(ServerVersion);
                //var bb = aa[i].split('"');
                for (var i = 1; i < aa.length; i++) {
                    var bb = aa[i];//
                    $('#lsttemplate').append($('<option>').val(bb).text(bb));
                }
            }
            else {
                for (var i = 1; i < aa.length; i++) {
                    var bb = aa[i].split('"');
                    bb[1] = bb[1].replaceAll("\\", "/");
                    $('#lsttemplate').append($('<option>').val(bb[1]).text(bb[1]));
                }
            }


            //}
        });
}
var playlisttimer;
function startplaylist() {
    sendstring('play 1-1 "' + ($("tr.selected td:first").text()).split(".")[0] + '"');
    playlisttimer = setInterval(() => {
        if (clipsleftduration < 1) {
            if (selected[0]) selected[0].className = '';
            selecteplaylistrow += 1;
            if (selecteplaylistrow == $('#tblplaylist tr').length + 1) { selecteplaylistrow = 2 }
            $('#tblplaylist tr:nth-child(' + selecteplaylistrow + ')').addClass('selected');
            playclip();
        }
    }, 1000);
}

function stopplaylist() {
    //sendstring('stop 1-1');
    clearInterval(playlisttimer);
}



function playclip() {
    sendstring('play 1-1 "' + ($("tr.selected td:first").text()).split(".")[0] + '"');
}

function playclipfromclipgrid() {
    sendstring('play 1-1 "' + ($("tr.selected2 td:first").text()).split(".")[0] + '"');
}
function pauseclip() {
    sendstring('pause 1-1');
}
function resumeclip() {
    sendstring('resume 1-1');
}

function stopclip() {
    sendstring('stop 1-1');
}

function stoptemplate() {
    sendstring('stop 1-96');
}

function updatetemplate() {
    var aa = '"<templateData>';
    var bb;
    $('#templatevariables tr').each(function () {
        bb += '<componentData id=\\"' + this.cells[0].innerHTML + '\\"><data value=\\"' + this.cells[1].innerHTML + '\\" /></componentData>';
    });
    var cc = '</templateData>"';
    var dd = aa + bb + cc;
    sendstring('cg 1-96 update 96 ' + dd)
}

function playtemplate() {

    var aa = '"<templateData>';
    var bb;
    $('#templatevariables tr').each(function () {
        bb += '<componentData id=\\"' + this.cells[0].innerHTML + '\\"><data value=\\"' + this.cells[1].innerHTML + '\\" /></componentData>';
    });
    var cc = '</templateData>"';
    var dd = aa + bb + cc;
    sendstring('cg 1-96 add 96 ' + ($('#lsttemplate option:selected').text()).replace(/(\r\n|\n|\r)/gm, "") + ' 1 ' + dd)


}
function gettemplatevariables() {
    $.post("endpoint", {
        cmd: 'info template ' + $("#lsttemplate option:selected").text()
    },
        function (data, status) {
            var aa = document.getElementById('templatevariables');
            var bb = data.replace(/(\r\n|\n|\r)/gm, "");
            var cc = bb.replace("201 INFO TEMPLATE OK", "");

            $(function () {
                //Sample XML    
                var xml = cc;

                //Parse the givn XML
                var xmlDoc = $.parseXML(xml);

                var $xml = $(xmlDoc);

                // Find instance Tag
                var $person = $xml.find("instance");
                $("#templatevariables").empty();
                $person.each(function () {
                    var name = $(this).attr('name');
                    $("#templatevariables").append('<tr><td id=id' + name + '>' + name + '</td><td id=value' + name + '> ' + name + '</td></tr>');
                });
                $("#templatevariables").append('<tr><td id=idloader1>loader1</td><td id=valueloader1>C:\\\\casparcg\\\\mydata\\\\photo\\\\india\\\\anjum.jpeg</td></tr>');
                $("#templatevariables").append('<tr><td id=idloader2>loader2</td><td id=valueloader2>C:\\\\casparcg\\\\mydata\\\\photo\\\\india\\\\anrchana.jpeg</td></tr>');
                $("#templatevariables").append('<tr><td id=idloader3>loader3</td><td id=valueloader3>C:\\\\casparcg\\\\mydata\\\\photo\\\\india\\\\ekta.jpeg</td></tr>');
                $("#templatevariables").append('<tr><td id=idloader4>loader4</td><td id=valueloader4>C:\\\\casparcg\\\\mydata\\\\photo\\\\india\\\\gauhar.jpeg</td></tr>');
                $("#templatevariables").append('<tr><td id=idloader5>loader5</td><td id=valueloader5>C:\\\\casparcg\\\\mydata\\\\photo\\\\india\\\\jhulan.jpeg</td></tr>');
                $("#templatevariables").append('<tr><td id=idloader6>loader6</td><td id=valueloader6>C:\\\\casparcg\\\\mydata\\\\photo\\\\india\\\\poonam.jpeg</td></tr>');
                $("#templatevariables").append('<tr><td id=idloader51>loader51</td><td id=valueloader51>C:\\\\casparcg\\\\mydata\\\\photo\\\\india\\\\mamta.jpeg</td></tr>');
                $("#templatevariables").append('<tr><td id=idloader52>loader52</td><td id=valueloader52>C:\\\\casparcg\\\\mydata\\\\photo\\\\india\\\\nooshin.jpeg</td></tr>');
                $("#templatevariables").append('<tr><td id=idloader55>loader55</td><td id=valueloader55>C:\\\\casparcg\\\\mydata\\\\photo\\\\india\\\\sunita.jpeg</td></tr>');
                $("#templatevariables").append('<tr><td id=idloader56>loader56</td><td id=valueloader56>C:\\\\casparcg\\\\mydata\\\\photo\\\\india\\\\rumeli.jpeg</td></tr>');
            });
        });
}



function msToTime(duration) {
    var frames = parseInt((duration % 1000) / msPerFrame)
        , seconds = parseInt((duration / 1000) % 60)
        , minutes = parseInt((duration / (1000 * 60)) % 60)
        , hours = parseInt((duration / (1000 * 60 * 60)) % 24);
    frames = (frames < 10) ? "0" + frames : frames;
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds + ":" + frames;
}

var seekbarmousedown = false;
$("#input2").mousedown(function () {
    seekbarmousedown = true;
});

$("#input2").mouseup(function () {
    seekbarmousedown = false;
});


// for scocket starts

var socket = io();
socket.on('oscmessage', function (msg) {

    var element = document.getElementById(msg.address);
    if (typeof (element) != 'undefined' && element != null) {
        try {
            document.getElementById(msg.address).cells[1].innerHTML = msg.args[0].value;
            document.getElementById(msg.address).cells[2].innerHTML = msg.args[1].value;
        } catch (error1) {
        }
    }


    document.getElementById('/channel/1/stage/layer/1/file/time').cells[1].innerHTML = (parseFloat(document.getElementById('/channel/1/stage/layer/1/file/time').cells[1].innerHTML)).toFixed(2);
    document.getElementById('/channel/1/stage/layer/1/file/time').cells[2].innerHTML = (parseFloat(document.getElementById('/channel/1/stage/layer/1/file/time').cells[2].innerHTML)).toFixed(2);

    document.getElementById('/channel/1/stage/layer/1/foreground/file/time').cells[1].innerHTML = (parseFloat(document.getElementById('/channel/1/stage/layer/1/foreground/file/time').cells[1].innerHTML)).toFixed(2);
    document.getElementById('/channel/1/stage/layer/1/foreground/file/time').cells[2].innerHTML = (parseFloat(document.getElementById('/channel/1/stage/layer/1/foreground/file/time').cells[2].innerHTML)).toFixed(2);

    if (ServerVersion == 2.3) {
        fps = document.getElementById('/channel/1/stage/layer/1/foreground/file/streams/0/fps').cells[1].innerHTML;
    }
    else {
        fps = document.getElementById('/channel/1/stage/layer/1/file/fps').cells[1].innerHTML;
    }



    msPerFrame = 1000 / fps;
    if (ServerVersion == 2.3) {
        currentclip = (document.getElementById('/channel/1/stage/layer/1/foreground/file/name').cells[1].innerHTML).split(".")[0];
    }
    else {
        currentclip = (document.getElementById('/channel/1/stage/layer/1/file/path').cells[1].innerHTML).split(".")[0];
    }


    $('#currentclip').html("filename= " + currentclip);


    if (ServerVersion == 2.3) {
        currenttime = document.getElementById('/channel/1/stage/layer/1/foreground/file/time').cells[1].innerHTML;
        totlatime = document.getElementById('/channel/1/stage/layer/1/foreground/file/time').cells[2].innerHTML;
    }
    else {
        currenttime = document.getElementById('/channel/1/stage/layer/1/file/time').cells[1].innerHTML;
        totlatime = document.getElementById('/channel/1/stage/layer/1/file/time').cells[2].innerHTML;
    }


    currentframe = (currenttime * fps).toFixed(0);
    totalframe = (totlatime * fps).toFixed(0);

    // if (ServerVersion==2.3){
    //     document.getElementById('/channel/1/stage/layer/1/foreground/file/frame').cells[1].innerHTML = currentframe;
    //     document.getElementById('/channel/1/stage/layer/1/foreground/file/frame').cells[2].innerHTML = totalframe;
    // }
    // else{
    //     document.getElementById('/channel/1/stage/layer/1/file/frame').cells[1].innerHTML = currentframe;
    //     document.getElementById('/channel/1/stage/layer/1/file/frame').cells[2].innerHTML = totalframe;
    // }



    document.getElementById("input2").max = totalframe;


    if (seekbarmousedown == false) { $('#input2').val(currentframe); }

    $('#currentframe').html(currentframe);
    $('#totalframe').html(totalframe);

    clipsleftduration = totlatime - currenttime;
    $('#casparcgcountdown').html(msToTime(clipsleftduration * 1000));



    document.getElementById('/channel/1/profiler/time').cells[1].innerHTML = (parseInt(document.getElementById('/channel/1/profiler/time').cells[1].innerHTML)).toFixed(1);
    document.getElementById('/channel/1/profiler/time').cells[2].innerHTML = (parseInt(document.getElementById('/channel/1/profiler/time').cells[2].innerHTML)).toFixed(1);

    document.getElementById('/channel/1/stage/layer/1/profiler/time').cells[1].innerHTML = (parseInt(document.getElementById('/channel/1/stage/layer/1/profiler/time').cells[1].innerHTML)).toFixed(1);
    document.getElementById('/channel/1/stage/layer/1/profiler/time').cells[2].innerHTML = (parseInt(document.getElementById('/channel/1/stage/layer/1/profiler/time').cells[2].innerHTML)).toFixed(1);

    document.getElementById('/channel/1/stage/profiler/time').cells[1].innerHTML = (parseInt(document.getElementById('/channel/1/stage/profiler/time').cells[1].innerHTML)).toFixed(1);
    document.getElementById('/channel/1/stage/profiler/time').cells[2].innerHTML = (parseInt(document.getElementById('/channel/1/stage/profiler/time').cells[2].innerHTML)).toFixed(1);

    document.getElementById('/channel/1/mixer/audio/1/dBFS').cells[1].innerHTML = (parseInt(document.getElementById('/channel/1/mixer/audio/1/dBFS').cells[1].innerHTML)).toFixed(0);
    document.getElementById('/channel/1/mixer/audio/2/dBFS').cells[1].innerHTML = (parseInt(document.getElementById('/channel/1/mixer/audio/2/dBFS').cells[1].innerHTML)).toFixed(0);

    //audio bar
    if (ServerVersion == 2.3) {
        var aa = document.getElementById('/channel/1/mixer/audio/volume').cells[1].innerHTML;
        var bb = 20 * (Math.log10(aa / 2147483647));
        var cc = document.getElementById('/channel/1/mixer/audio/volume').cells[2].innerHTML;
        var dd = 20 * (Math.log10(cc / 2147483647));
        $('#audiobar1').val(bb);
        $('#audiobar2').val(dd);


    }
    else {
        $('#audiobar1').val(document.getElementById('/channel/1/mixer/audio/1/dBFS').cells[1].innerHTML);
        $('#audiobar2').val(document.getElementById('/channel/1/mixer/audio/2/dBFS').cells[1].innerHTML);

    }


    //audio bar

});

// for scocket end


// hover code
$('.dropdown').hover(function () {
    //$('.dropdown-toggle', this).trigger('click');
});
// hover code

// <!-- For Multilevel drop downd start -->
$('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
    if (!$(this).next().hasClass('show')) {
        $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
    }
    var $subMenu = $(this).next(".dropdown-menu");
    $subMenu.toggleClass('show');


    $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
        $('.dropdown-submenu .show').removeClass("show");
    });
    return false;
});
// <!-- For Multilevel drop downd end -->

//   for collapsing start
var $myGroup = $('#myGroup');
$myGroup.on('show.bs.collapse', '.collapse', function () {
    $myGroup.find('.collapse.show').collapse('hide');

});
//   for collapsing end

// for tooltip start

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

// for tooltip end

//for selected in playlist
var selecteplaylistrow;
function highlight(e) {
    if (selected[0]) selected[0].className = '';
    e.target.parentNode.className = 'selected';
    selecteplaylistrow = $(e.target.parentNode).index() + 1;
}

var table = document.getElementById('tblplaylist');
selected = table.getElementsByClassName('selected');
table.onclick = highlight;




//for selected in clipgrid
function highlight2(e) {
    if (selected2[0]) selected2[0].className = '';
    e.target.parentNode.className = 'selected2';
}

var table2 = document.getElementById('tblclipgrid');
selected2 = table2.getElementsByClassName('selected2');
table2.onclick = highlight2;

//for selected in anywhre
function highlight3(e) {
    if (selected3[0]) selected3[0].className = '';
    e.target.parentNode.className = 'selected3';
}

var table3 = document.getElementById('tblclipgridforanywhere');
selected3 = table3.getElementsByClassName('selected3');
table3.onclick = highlight3;



function inesrtintoclipgrid(str) {
    var table = document.getElementById("tblclipgrid");
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(-1);
    cell1.setAttribute("draggable", true);
    cell1.setAttribute("ondragstart", "drag(event)");
    cell1.innerHTML = str;

}

function getserverversion() {
    $.post("endpoint", {
        cmd: 'version server'
    },
        function (data, status) {
            data = data.split("\n")[1];
            $('#tblversion tr:nth-child(1) td:nth-child(2)').html(data);
            ServerVersion = data.slice(0, 3);
        });

}

function connecttocasparcg() {

    $.post("connect", {
        host: $('#host').val(),
        port: $("#port").val()
    },
        function (data, status) {
            getserverversion();
        });

    //setTimeout(function () { getserverversion() }, 1000);
    //setTimeout(function () { getcliplist('cls') }, 2000);
    //setTimeout(function () { gettemplatelist('tls') }, 3000);

}

var socket = io();
socket.on('casparstatus', function (data) {

    if (data.data1 == "true") {

        $('#connecttocasparcg').css('background-color', 'green');
        $('#connecttocasparcg').html('Connected');
        $('#host').prop("disabled", true);
        $('#port').prop("disabled", true);
    }
    else if (data.data1 == "false") {
        $('#connecttocasparcg').css('background-color', 'red');
        $('#connecttocasparcg').html('Disconnected');
        $('#host').prop("disabled", false);
        $('#port').prop("disabled", false);
    }

});

socket.on('transcodestatus', function (data) {
    $('#transcodestatus1').html(data.data1);
})
socket.on('trancodepercent1', function (data) {
    $('#transcodeprogress1').val(data.percent1);
    $('#percentvalue1').html(data.percent1+'%');
    
})
socket.on('filenames', function (data) {
    $('#originalfile1').html(data.originalfile1);
    $('#transcodedfile1').html(data.transcodedfilename1);
})

socket.on('cpustatus', function (data) {
    $('#cpuuses').html('CPU uses: '+data.data1);
})