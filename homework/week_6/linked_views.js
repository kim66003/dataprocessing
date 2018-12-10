window.onload = function() {
var input1 = "data/cocaine_retail_europe.json"
var input2 = "data/heroin_retail_europe.json"
var input3 = "data/cocaine_retail_us.json"
var input4 = "data/heroin_retail_us.json"
var input5 = "data/cocaine_wholesale_europe.json"
var input6 = "data/heroin_wholesale_europe.json"
var input7 = "data/cocaine_wholesale_us.json"
var input8 = "data/heroin_wholesale_us.json"
var requests = [d3.json(input1), d3.json(input2), d3.json(input3), d3.json(input4),
d3.json(input5), d3.json(input6), d3.json(input7), d3.json(input8)];

Promise.all(requests).then(function(response) {
    console.log(response)
    coca_ret_eu = response[0]
    hero_ret_eu = response[1]
    coca_ret_us = response[2]
    hero_ret_us = response[3]
    coca_whole_eu = response[4]
    hero_whole_eu = response[5]
    coca_whole_us = response[6]
    hero_whole_us = response[7]

    console.log(coca_ret_eu)

    for (i = 0, len = coca_ret_eu.length, array = []; i < len; i++) {
      console.log(coca_ret_eu[i])
    }

    // create margins and padding
    var margin = {top: 10, right: 20, bottom: 20, left: 10},
      padding = {top: 20, right: 60, bottom: 60, left: 30},
      outerWidth = 1000,
      outerHeight = 500,
      innerWidth = outerWidth - margin.left - margin.right,
      innerHeight = outerHeight - margin.top - margin.bottom,
      width = innerWidth - padding.left - padding.right,
      height = innerHeight - padding.top - padding.bottom;

      // create x and y scale
      // var xScale = d3.scaleLinear()
      //   .range([(margin.left + padding.left), width])
      //   .domain([0, maxX])
      //   .nice();
      //
      // var yScale = d3.scaleLinear()
      //   .range([height, (margin.top + padding.top)]).clamp(true)
      //   .domain([0, maxY])
      //   .nice();
      //
      // // x and y axis to scale
      // var xAxis = d3.axisBottom(xScale);
      // var yAxis = d3.axisLeft(yScale);

      // create svg
      var svg = d3.select("body").append("svg")
          .attr("width", outerWidth)
          .attr("height", outerHeight)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

}).catch(function(e){
    throw(e);
});

};
