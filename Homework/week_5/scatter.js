// Max Simons
// 12389285

var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

var requests = d3.json(consConf);

var dataset = 0
Promise.resolve(requests).then(function(response) {
  dataset = response
  var data = transformResponse(response);
  scatter(data);

}).catch(function(e){
    throw(e);
});

function scatter(data) {

    // // set margin
    var svg = d3.select("svg"),
        margin = {top: 100, right: 20, bottom: 0, left: 120},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // set variables
    var bufLeft = 100;
    var tip = 50;
    var topPadding = 80;

    // setting x minimum
    var x_min = d3.min(data, function (d) {
          return parseInt(d["time"])
        });

    // setting x maximum
    var x_max = d3.max(data, function (d) {
          return parseInt(d["time"])
        });

    // setting y minimum
    var y_min = d3.min(data, function (d) {
          return d["datapoint"]
        });

    // setting y maximum
    var y_max = d3.max(data, function (d) {
          return d["datapoint"]
        });

    // set scaling x
    var x_scale = d3.scaleLinear()
        .domain([x_min, x_max])
        .range([bufLeft,  width]);

    // set scaling y
    var y_scale = d3.scaleLinear()
        .domain([y_min, y_max])
        .range([height, topPadding]);

    // transform coordinates for x and y position
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // set x axis
    var xAxis = d3.axisBottom()
        .scale(x_scale)
        .tickFormat(d3.format('.0f'));

    // set y axis
    var yAxis = d3.axisLeft()
        .scale(y_scale);

    // create title
    svg.append("text")
      .attr("class", "title")
      .attr("x", width/1.8)
      .attr("y", topPadding/2)
      .attr("text-anchor", "middle")
      .text("TH_WRXRS values over the years 2007-2015")

    // create x axis
    svg.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)

    // create x axis label
    svg.append("text")
      .attr("class", "label")
      .attr("x", width/1.8)
      .attr("y", height - 40 + topPadding)
      .attr("text-anchor", "middle")
      .text("Year")

    // create y axis
    svg.append("g")
      .attr("class", "yaxis")
      .attr("transform", "translate(100," + 0 + ")")
      .call(yAxis)

    // create y axis label;
    svg.append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("x", -height/1.8)
      .attr("y", 50)
      .attr("fill", "#000")
      .attr("text-anchor", "middle")
      .text("TH_WRXRS values");

      var data_list = data;

      // default scatter with all countries
      draw_scatter(data_list, svg, x_scale, y_scale);

      // on click to update the data
			d3.selectAll(".dropdown-item")
				.on("click", function() {
					var index = this.getAttribute("value");

          // start index zero
          var index_start = 0

          // to see all countries
          if (index == 7) {
            data_list = data;
          }

          // to see countries seperately
          if (index != 7) {
            data_list = [];
            index_start = (index - 1) * 9;
            for (i = (index_start); i < index * 9; i++) {
              data_list.push(data[i]);
            }
          }

      // update scatter
      draw_scatter(data_list, svg, x_scale, y_scale);
      });
}

function draw_scatter(data_current, svg, x_scale, y_scale) {

      svg.selectAll("circle")
        .remove()

      // add tip to see the country
    	var tip = d3.select("svg")
        .append("text")
    		.attr("class", "tip")
    		.style("opacity", 0)
        .attr("x", 150)
        .attr("y", 120);

      // create scatter points
      svg.selectAll("circle")
        .data(data_current)
        .attr("class", "circle")
        .enter()
          .append("circle")
          .attr("fill", function (d) {
            if (d["Country"] == "France") {
              return "black" }
            if (d["Country"] == "Netherlands") {
              return "blue" }
            if (d["Country"] == "Portugal") {
              return "orange" }
            if (d["Country"] == "Germany") {
              return "purple" }
            if (d["Country"] == "United Kingdom") {
              return "red" }
            if (d["Country"] == "Korea") {
              return "green" }
          })
          .attr("cx", function(d) {
            return x_scale(parseInt(d["time"]));
          })
          .attr("cy", function(d) {
            return y_scale(d["datapoint"]);
          })
          .attr("r", 5)
          .on("mouseover", function(d) {
    			  tip.transition()
    				  .style("opacity", 1);
    			  tip.html(d["Country"] + " " + d["datapoint"]);
    		  })
    		  .on("mouseout", function(d) {
    			  tip.transition()
    				   .style("opacity", 0);
    		  });
}

function transformResponse(data) {

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataArray = [];

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":").slice(0, -1);
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                dataArray.push(tempObj);
            }
        });
    });

    // return the finished product!
    return dataArray;
}
