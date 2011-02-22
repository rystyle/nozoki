var Nozoki = {};

Nozoki.pixler = function(x, y, r, g, b, a){
    this.pixelData[0] = 255;
    this.pixelData[1] = g;
    this.pixelData[2] = b;
    this.pixelData[3] = a;

    this.context.putImageData(this.pixelImageData, x, y);
}

Nozoki.map = function(){
    var seaLevel  = this.seaLevel;
    var shoreLine =   10;
    var hillLine  =  250;
    var treeLine  =  600;
    var snowLine  = 1800;
    var peakLine  = 3000;

    var landDither  = 11;
    var oceanDither = 39;

    var offset    = 0;

    var altitude  = 0;
    var intensity = 0;
    var color     = 0;


    for (var x = 0; x < this.mapImageData.width; x++){
        for (var y = 0; y < this.mapImageData.height; y++){
            offset = (x + y * this.canvas.width) * 4;

            altitude  = japan[y][x];
            intensity = 0;
            color     = []

            if (altitude < seaLevel){cd = 150 - (altitude * -1) / oceanDither;}
            else                    {cd = 25 + altitude / landDither;}

                 if (altitude < seaLevel) { color = [0.0, 0.0, 1.0]; }
            else if (altitude < shoreLine){ color = [0.0, 0.9, 0.1]; }
            else if (altitude < hillLine) { color = [0.6, 0.7, 0.2]; }
            else if (altitude < treeLine) { color = [0.4, 0.7, 0.2]; }
            else if (altitude < snowLine) { color = [0.6, 0.6, 0.1]; }
            else if (altitude < peakLine) { color = [1.0, 1.0, 1.0]; }

            this.mapImageData.data[offset + 0] = cd * color[0];
            this.mapImageData.data[offset + 1] = cd * color[1];
            this.mapImageData.data[offset + 2] = cd * color[2];
            this.mapImageData.data[offset + 3] = 255;
        }
    }
    this.context.putImageData(this.mapImageData, 0, 0);
}

Nozoki.poll = function(uri){
  $.getJSON(uri, function(data){
    $.each(data, function(){ Nozoki.pixler(this["x"], this["y"], this["r"], this["g"], this["b"], this["a"]); });
  });
}

Nozoki.loc         = function(term)  { this.map(); this.poll('loc/' + term); clearInterval(this.interval); }
Nozoki.pulse       = function()      { this.poll('pulse'); }
Nozoki.setSeaLevel = function(level) { this.seaLevel = level; this.map(); this.pulse(); }

Nozoki.setTermButton = function(id, term){ $(id).click(function(){Nozoki.loc(term)});}

Nozoki.init = function(){
  this.canvas         = document.getElementById('map');
  this.context        = this.canvas.getContext('2d');
  this.mapImageData   = this.context.createImageData(this.canvas.width, this.canvas.height);
  this.pixelImageData = this.context.createImageData(1, 1);
  this.pixelData      = this.pixelImageData.data;
  this.interval       = setInterval("Nozoki.pulse()", 60000);
  this.seaLevel       = 0;
  this.people         = {};

  this.map();
  this.pulse();

  this.setTermButton('#earthquake',    '地震');
  this.setTermButton('#hungry',        '腹');
  this.setTermButton('#memolane',      'memolane');
  this.setTermButton('#rain',          '雨');
  this.setTermButton('#ruby',          'ruby');
  this.setTermButton('#snow',          '雪');
  this.setTermButton('#train_station', '駅');

  $('#raise_sea').click(function(){Nozoki.setSeaLevel(Nozoki.seaLevel + 100)});
  $('#lower_sea').click(function(){Nozoki.setSeaLevel(Nozoki.seaLevel - 100)});
  $('#reset').click(function(){Nozoki.setSeaLevel(0); Nozoki.map(); Nozoki.pulse(); });

}
