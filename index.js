var NUM_CHANNELS  = 3;
var NUM_HEADERS   = 4;
var DEFAULT_ALPHA = 255;

var myImageData;
var width;
var height;

var canvas = document.getElementById('canvas');
var ctx    = canvas.getContext('2d');

parsePPM = function(data) {
  data = new Uint8Array(data);

  var headers    = [];
  var headerSize = 0;

  var buf = "";
  for (var i=0; headers.length < NUM_HEADERS; i++, headerSize++) {
    var ch = String.fromCharCode(data[i]);
    if (/\s/.test(ch)) {
      headers.push(buf);
      buf = "";
    } else {
      buf += ch;
    }
  }
  
  width  = headers[1];
  height = headers[2];
  maxval = headers[3];

  if (!(maxval >= 0 && maxval <= 255)) throw "Bit depth of image must be no more than 8";

  var raster = data.slice(headerSize);

  //canvas requires alpha channel
  var lenWithAlpha = (raster.length/NUM_CHANNELS) + raster.length;
  var bytes = new Uint8ClampedArray(lenWithAlpha);  

  var index = 0;
  for (var i=0; i < lenWithAlpha; i++) {
  	if (i%4 === NUM_CHANNELS) bytes[i] = DEFAULT_ALPHA;
    else bytes[i] = raster[index++];
  }

  myImageData = new ImageData(bytes, width, height);
};

upload = function() {

  var f = document.getElementById('file').files[0],
    r = new FileReader();

  r.onloadend = function(e) {
    try {
      parsePPM(e.target.result);
      resizeCanvas();
      ctx.putImageData(myImageData, 0, 0);
    } catch (err) {
      console.log(err);
    }
  }
  r.readAsArrayBuffer(f);
};

resizeCanvas = function() {
  canvas.width = width;
  canvas.height = height;
};