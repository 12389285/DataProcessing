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
  Map(data, co2, 2012);

  // make empty svg for barchart
  var svgBar = d3.select("#barchart")
      .append("svg")
      .attr("width", 500)
      .attr("height", 500)
      .append('g')
      .attr('class', 'bar');

  // on click function for update map
  d3.selectAll(".m")
    .on("click", function(d) {
      var index = this.getAttribute("value");
      updateMap(data, co2, index, svgBar)
    })

  // on click function for barchart
  d3.selectAll("path")
    .on("click", function(d) {
      Barchart(co2, d.properties.name, svgBar)
    })

}).catch(function(e){
    throw(e);
});

function updateMap(data, co2, index, svgBar) {

  // start index zero
  var index_start = 0

  // year 2012
  if (index == 0) {
    year = "2012";
  }

  // year 2013
  if (index == 1) {
    year = "2013";
  }

  // year 2014
  if (index == 2) {
    year = "2014"
  }

  Map(data, co2, year, svgBar)
}

function Map(data, co2, year, svgBar) {

  d3.select(".mapsvg")
    .remove();

  var margin = {top: 0, right: 0, bottom: 0, left: 0},
              width = 820 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

  // Set tooltips
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .html(function(d) {
                return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>CO2 emmission: </strong><span class='details'>" + d['co2_' + year] +"</span>";
              })

  // colorscale for countries
  var color = d3.scaleThreshold()
      .domain([0,100,1000,10000,100000,1000000,10000000,100000000,1000000000,10000000000,10000000000,500000000000,1000000000000])
      .range(["#ffe6e6", "#ffcccc", "#ffb3b3", "#ff9999", "#ff6666","#ff4d4d","#ff1a1a","#ff0000","#e60000", "#cc0000", "#b3000","#990000","#660000"]);

  var path = d3.geoPath();

  // empty svg for worldmap
  var svg = d3.select("#map")
              .append("svg")
              .attr("class", "mapsvg")
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
    co2ByCountry[d.Country] = d['co2_' + year]; });
  data.features.forEach(function(d) {
    d['co2_' + year] = co2ByCountry[d.properties.name] });

  // worldmap settings
  svg.append("g")
      .attr("class", "countries")
    .selectAll("path")
      .data(data.features)
    .enter().append("path")
      .attr("d", path)
      .style("fill", function(d) {
        if(d['co2_' + year] != undefined) {
          var num = d['co2_' + year];
          if(num.startsWith("0")) {
            num = Number(num);
          }
          else {
            num = num.replace(/\./g, "");
            num = Number(num);
          };
        return color(num); }
      })
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

  // update barchart with all years
  d3.selectAll("path")
    .on("click", function(d) {
      Barchart(co2, d.properties.name, svgBar)
    })

  svg.append("path")
      .datum(topojson.mesh(data.features, function(a, b) {
        return a.id !== b.id; }))
      .attr("class", "names")
      .attr("d", path);
}

function Barchart(co2, name, svg) {

  svg.selectAll("text")
    .remove()

  svg.selectAll("g")
    .remove()

  var margin = {top: 15, right: 25, bottom: 15, left: 60},
              width = 500 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

  // transform coordinates for x and y position
  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var country = "No data available"

  // make usable datastructure for countries
  var co2_value =[];
  var co2_country = [];

  for(i = 0; i < co2.length; i++) {
    if(name == co2[i]["Country"]) {
      co2_12 = co2[i]["co2_2012"]
      co2_13 = co2[i]["co2_2013"]
      co2_14 = co2[i]["co2_2014"]
      if(co2_12.startsWith("0")) {
        co2_12 = Number(co2_12);
      }
      else {
        co2_12 = co2_12.replace(/\./g, "");
        co2_12 = Number(co2_12);
      };
      if(co2_13.startsWith("0")) {
        co2_13 = Number(co2_13);
      }
      else {
        co2_13 = co2_13.replace(/\./g, "");
        co2_13 = Number(co2_13);
      };
      if(co2_14.startsWith("0")) {
        co2_14 = Number(co2_14);
      }
      else {
        co2_14 = co2_14.replace(/\./g, "");
        co2_14 = Number(co2_14);
      };
      co2_value.push(co2_12)
      co2_value.push(co2_13)
      co2_value.push(co2_14)
      country = co2[i]["Country"]
      }
  }

  co2_value.forEach(function(d, i) {
      var time = 2014
      var singleObj = {}
      singleObj['year'] = time - i;
      singleObj['value'] = d;
      co2_country.push(singleObj);
  });

  // create title
  svg.append("text")
    .attr("class", "title")
    .attr("x", width/1.8)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .text(country)

  // set scaling x
  var x_scale = d3.scaleLinear()
      .domain([0, d3.max(co2_country, function (d) {
        return d.value;
      })])
      .range([0, width]);

  // set scaling y
  var y_scale = d3.scaleBand()
      .domain(co2_country.map(function(d) {
        return d.year; }))
      .range([height-240, 100]);

  // set y axis
  var yAxis = d3.axisLeft()
      .tickSize(0)
      .scale(y_scale);

  var bars = svg.selectAll("bar")
      .data(co2_country)
      .enter()
      .append("g")

  // add the y axis
  var gy = svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + (margin.left) + ",0)")
            .call(yAxis)

  // add the x Axis
   var gx = svg.append("g")
            .attr("transform", "translate(60," + 235 + ")")
            .call(d3.axisBottom(x_scale))
            .selectAll("text")
              .style("text-anchor", "end")
              .attr("transform", "rotate(-45)" );

  // add the horizontal bars
  bars.append("rect")
      .attr("class", "bar")
      // vraag over i * 50
      .attr("y", function (d,i) {
          bars = (i * 50) + 100;
          return bars;
      })
      .attr("height", 30)
      .attr("x", margin.left)
      .attr("width", function (d) {
          return x_scale(d.value);
      })

}
