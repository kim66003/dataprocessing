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

    creu = arrayValues(coca_ret_eu)[0]
    console.log(creu)
    creu_all = arrayValues(coca_ret_eu)[1]
    minY = Math.min.apply(null, creu_all)
    maxY = Math.max.apply(null, creu_all)
    years = arrayValues(coca_ret_eu)[2]
    minX = Math.min.apply(null, years)
    maxX = Math.max.apply(null, years)

    // create margins and padding
    var margin = {top: 10, right: 20, bottom: 20, left: 10},
      padding = {top: 20, right: 60, bottom: 60, left: 30},
      outerWidth = 1000,
      outerHeight = 500,
      innerWidth = outerWidth - margin.left - margin.right,
      innerHeight = outerHeight - margin.top - margin.bottom,
      width = innerWidth - padding.left - padding.right,
      height = innerHeight - padding.top - padding.bottom;

      var categorical = [
      { "name" : "schemeAccent", "n": 8},
      { "name" : "schemeDark2", "n": 8},
      { "name" : "schemePastel2", "n": 8},
      { "name" : "schemeSet2", "n": 8},
      { "name" : "schemeSet1", "n": 9},
      { "name" : "schemePastel1", "n": 9},
      { "name" : "schemeCategory10", "n" : 10},
      { "name" : "schemeSet3", "n" : 12 },
      { "name" : "schemePaired", "n": 12},
      { "name" : "schemeCategory20", "n" : 20 },
      { "name" : "schemeCategory20b", "n" : 20},
      { "name" : "schemeCategory20c", "n" : 20 }
    ]

      const colorScale = d3.scaleOrdinal(d3[categorical[0].name]);

      const title = 'Heroin and cocaine retailprices (streetprices) in Western Europe';

      // create x and y scale
      var xScale = d3.scaleLinear()
        .range([(margin.left + padding.left), width])
        .domain([minX, maxX])
        .nice();

      var yScale = d3.scaleLinear()
        .range([height, (margin.top + padding.top)]).clamp(true)
        .domain([0, maxY])
        .nice();

      // x and y axis to scale
      var xAxis = d3.axisBottom(xScale)
                  .tickFormat(function(d){ return d })
                  .tickPadding(15);
      const xAxisLabel = 'Year';
      var yAxis = d3.axisLeft(yScale)
                  .tickPadding(10);
      const yAxisLabel = 'US$ per gram';

      // create svg
      var svg = d3.select("body").append("svg")
          .attr("width", outerWidth)
          .attr("height", outerHeight)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // create group tag
      var g = svg.append("g")
          .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

      // make x and y axis
      g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      g.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + (margin.left + padding.left) + ",0)")
          .call(yAxis);

      g.append('text')
      .attr('class', 'axis-label')
      .attr('y', outerHeight - padding.bottom)
      .attr('x', innerWidth / 2 - 20)
      .attr('fill', 'black')
      .text(xAxisLabel);

      g.append('text')
      .attr('class', 'axis-label')
      .attr('y', margin.left - 15)
      .attr('x', -innerHeight / 2 + 15)
      .attr('fill', 'black')
      .attr('transform', `rotate(-90)`)
      .attr('text-anchor', 'middle')
      .text(yAxisLabel);

      // d3's line generator
      var line = d3.line()
          .x(function(d) { return xScale(d); }) // set the x values for the line generator
          .y(function(d) { return yScale(d); }) // set the y values for the line generator
          .curve(d3.curveMonotoneX) // apply smoothing to the line

      // Append the path, bind the data, and call the line generator
      svg.append("path")
          .datum(creu[0]) // Binds data to the line
          .attr("class", "line") // Assign a class for styling
          .attr("d", line); // Calls the line generator

}).catch(function(e){
    throw(e);
});

};

function arrayValues(data) {
  values = []
  values_all = []
  for (key in data) {
    years = []
    temp_values = []
    country = data[key]
    for (key in country){
        years.push(Number(key))
        temp_values.push(country[key])
        values_all.push(country[key])
    }
    values.push(temp_values)
  }
  return [values, values_all, years]
}
