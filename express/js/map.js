var m = d3.marcon().width(window.innerWidth).height(window.innerHeight);
m.render();
var width = m.innerWidth(), height = m.innerHeight() * 0.9, svg = m.svg();

var colorRange = ['#d7191c', '#fdae61', '#ffffbf', '#a6d96a', '#1a9641'] //['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494']

var color = d3.scaleLinear().range(colorRange).domain([1, 2, 3, 4, 5]);

var linearGradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "linear-gradient")
    .attr("gradientTransform", "rotate(90)");

  linearGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", color(1));

  linearGradient.append("stop")
      .attr("offset", "25%")
      .attr("stop-color", color(2));

  linearGradient.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", color(3));

  linearGradient.append("stop")
      .attr("offset", "75%")
      .attr("stop-color", color(4));

  linearGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", color(5));

var projection = d3.geoMercator();

var path = d3.geoPath()
        .projection(projection);

d3.queue()
  .defer(d3.json, "data/delhi_ward_outline.json")
  .await(ready)
  
function ready(error, map){
  centerZoom(map);
  // tiles();
  drawSubUnits(map);
}

function centerZoom(data){
  var o = topojson.mesh(data, data.objects.polygons, function(a, b) { return a === b; });

  projection
      .scale(1)
      .translate([0, 0]);

  var b = path.bounds(o),
      s = 1 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
      t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

  projection
      .scale(s)
      .translate(t);

  return o;
}

function drawSubUnits(data){
  svg.selectAll(".subunit")
      .data(topojson.feature(data, data.objects.polygons).features)
      .attr("position", "absolute")
    .enter().append("path")
      .attr("class", "subunit")
      .attr("d", path)
      .attr("stroke", "url(#linear-gradient)");
  console.log(svg.selectAll(".subunit"))
}

function tiles(){
  var pi = Math.PI,
    tau = 2 * pi;

  var tiles = d3.tile()
      .size([width, height])
      .scale(projection.scale() * tau)
      .translate(projection([0, 0]))
      ();

  svg.selectAll("image")
      .data(tiles)
    .enter().append("image")
      .attr("xlink:href", function(d) { return "http://" + "abc"[d[1] % 3] + ".tile.openstreetmap.org/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
      .attr("x", function(d) { return (d[0] + tiles.translate[0]) * tiles.scale; })
      .attr("y", function(d) { return (d[1] + tiles.translate[1]) * tiles.scale; })
      .attr("width", tiles.scale)
      .attr("height", tiles.scale); 
}