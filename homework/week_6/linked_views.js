window.onload = function() {

  var format = d3.format(",");

    footer = d3.select("footer")

    footer.append("p")
          .append("text")
          .text("Heroine and cocaine retail- and wholeprices in Europe and US")
          .attr("class", "head")
          .append("p")
          .append("text")
          .text("Name: Kimberley Boersma, student number: 11003464")
          .attr("class", "h2")
          .append("p")
          .text("Data source:")
          .append("a")
          .attr("xlink:href", "https://dataunodc.un.org/drugs/heroin_and_cocaine_prices_in_eu_and_usa"+"Data Source");


// Set tooltips
var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Population: </strong><span class='details'>" + format(d.population) +"</span>";
            })

var margin = {top: -100, right: 0, bottom: 0, left: 0},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

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

var path = d3.geoPath().projection(projection);

svg.call(tip);


var input1 = "data/cocaine_retail_europe.json"
var input2 = "data/heroin_retail_europe.json"
var input3 = "data/cocaine_retail_us.json"
var input4 = "data/heroin_retail_us.json"
var input5 = "data/cocaine_wholesale_europe.json"
var input6 = "data/heroin_wholesale_europe.json"
var input7 = "data/cocaine_wholesale_us.json"
var input8 = "data/heroin_wholesale_us.json"
var input9 = "data/world_countries.json"
var input10 = "data/world_population.tsv"

var requests = [d3.json(input1), d3.json(input2), d3.json(input3), d3.json(input4),
d3.json(input5), d3.json(input6), d3.json(input7), d3.json(input8), d3.json(input9), d3.tsv(input10), svg];

Promise.all(requests).then(function(response) {
    coca_ret_eu = response[0]
    hero_ret_eu = response[1]
    coca_ret_us = response[2]
    hero_ret_us = response[3]
    coca_whole_eu = response[4]
    hero_whole_eu = response[5]
    coca_whole_us = response[6]
    hero_whole_us = response[7]
    console.log(coca_ret_eu)
    data = response[8]
    population = response[9]
    svg = response[10]

    var populationById = {};

      population.forEach(function(d) { populationById[d.id] = +d.population; });
      data.features.forEach(function(d) { d.population = populationById[d.id] });

      svg.append("g")
          .attr("class", "countries")
        .selectAll("path")
          .data(data.features)
        .enter().append("path")
          .attr("d", path)
          .style("fill", function(d) { return color(populationById[d.id]); })
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
                .style("stroke","white")
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
          .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
           // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
          .attr("class", "names")
          .attr("d", path);

    all = arrayValues(coca_ret_eu)
    creu = all[0]
    creu_all = all[1]
    minY = Math.min.apply(null, creu_all)
    maxY = Math.max.apply(null, creu_all)
    years = all[2]
    minX = Math.min.apply(null, years)
    maxX = Math.max.apply(null, years)
    creu_dict = all[3]
    countries = Object.keys(coca_ret_eu);

    // create margins and padding
    var margin = {top: 10, right: 20, bottom: 20, left: 10},
      padding = {top: 20, right: 60, bottom: 60, left: 30},
      outerWidth = 1000,
      outerHeight = 500,
      innerWidth = outerWidth - margin.left - margin.right,
      innerHeight = outerHeight - margin.top - margin.bottom,
      width = innerWidth - padding.left - padding.right,
      height = innerHeight - padding.top - padding.bottom;

      const colorScale = d3.schemeCategory10 // d3.scaleOrdinal(d3[categorical[0].name]);

      const title = 'Cocaine retailprices (streetprices) in Western Europe';

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

      g.append('text')
      .attr('class', 'title')
      .attr('x', innerWidth / 2)
      .attr('y', margin.top)
      .text(title);


      var dataNest = d3.nest()
              .key(function(d, i) {return d[0].country;})
              .entries(creu_dict);

      // define the line
      var valueline = d3.line()
          .x(function(d) { return xScale(d.year) })
          .y(function(d) { return yScale(d.value) })
          .curve(d3.curveMonotoneX); // apply smoothing to the line

      var returnValue = (function(d) { return d.value});

      // Append the path, bind the data, and call the line generator
      for (i = 0; i < creu_dict.length; i++){
        g.append("path")
            .attr("class", "line") // Assign a class for styling
            .attr("d", valueline(creu_dict[i])) // Calls the line generator
            .attr("id", countries[i])
            .style("stroke", function(d, t ) { return colorScale[i % 10]; })
            .on("mouseover", function(){
                d3.select(this)
                .attr("opacity", 0.4)
                  tooltip.style("display", null);
            })
            .on("mouseout", function(){
                d3.select(this)
                .attr("opacity", 1)
                tooltip.style("display", "none");
            })
            .on("mousemove", function(d){
                var xPos = d3.mouse(this)[0] - 15;
                var yPos = d3.mouse(this)[1] - 35;
                tooltip.attr("transform", "translate(" + xPos + "," + yPos + ")");
                tooltip.select("text").text(this.id);
                tooltip.attr("fill", "#000a28")
                tooltip.style("font-family", "comic sans ms")
            });
            var tooltip = svg.append("g")
                            .attr("class", tooltip)
                            .style("display", "none");
            tooltip.append("text")
                    .attr("x", 15)
                    .attr("dy", "1.2em")
                    .style("font-size", "0.9em")
                    .attr("font-weight", "light");
      }


}).catch(function(e){
    throw(e);
});

};

function arrayValues(data) {
  values = []
  values_all = []
  dicto = []
  for (key in data) {
    temp = []
    years = []
    temp_values = []
    countries = data[key]
    for (key2 in countries){
        temp.push({
          country: key,
          year: Number(key2),
          value: countries[key2]
        })
      years.push(Number(key2))
      temp_values.push(countries[key2])
      values_all.push(countries[key2])
    }
    dicto.push(temp)
    values.push(temp_values)
  }
  return [values, values_all, years, dicto]

  }
