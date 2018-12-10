// Max Simons
// 12389285
var consConf = "../data/world_co2_emissions.json"

var world_countries = "../data/world_countries.json"

var requests = [d3.json(world_countries), d3.json(consConf)];

var dataset = 0

Promise.all(requests).then(function(response) {
  dataset = response
  data = response[0];
  var co2 = response[1];
  readyFn(data, co2);

}).catch(function(e){
    throw(e);
});

function readyFn(data, co2) {

  var format = d3.format(",");

  var margin = {top: 0, right: 0, bottom: 0, left: 0},
              width = 960 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

  // // Set tooltips
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([0, 0])
              .html(function(d) {
                return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>CO2 emmission: </strong><span class='details'>" + format(d.co2_2012) +"</span>";
              })

  var color = d3.scaleThreshold()
      .domain([10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
      .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);

  var path = d3.geoPath();

  var svg = d3.select("body")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .append('g')
              .attr('class', 'map');

  var projection = d3.geoMercator()
                    .scale(130)
                    .translate( [width / 2, height / 1.5]);

  var path = d3.geoPath()
               .projection(projection);

  svg.call(tip);

  var co2ByCountry = {};

  co2.forEach(function(d) {
    co2ByCountry[d.Country] = +d.co2_2012; });
  data.features.forEach(function(d) {
    d.co2_2012 = co2ByCountry[d.id] });

  svg.append("g")
      .attr("class", "countries")
    .selectAll("path")
      .data(data.features)
    .enter().append("path")
      .attr("d", path)
      .style("fill", function(d) { return color(co2ByCountry[d.id]); })
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity",0.8)
      // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          tip.show(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","blue")
            .style("stroke-width",3);
        })
        .on('mouseout', function(d){
          tip.hide(d);

          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","white")
            .style("stroke-width",0.3);
        });

  svg.append("path")
      .datum(topojson.mesh(data.features, function(a, b) {
        // console.log(a.id);
        // console.log(b.id);
        return a.id !== b.id; }))
       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      .attr("class", "names")
      .attr("d", path);
}
