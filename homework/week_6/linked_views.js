// Name: Kimberley Boersma
// Student number: 11003464
// JavaScript file that loads webpage with correct content

// executes script when webpage loaded all content
window.onload = function() {

  // adds format to numbers > 1000
  var format = d3.format(",");

  // set tooltips for worldmap
  var tip = d3.tip()
              .attr('class', 'd3-tip')
              .offset([0, 60])
              .html(function(d) {
                return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Cocaine wholesale price: </strong><span class='details'>" + format(d.wholesaleprices) +"US$/kg</span>";
              })
  // set margins, width and height
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
              width = 620 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom,
              min = 25000,
              max = 60000;
  // use colorscale for worldmap
  var color = d3.scaleSequential(d3.interpolateOrRd)
                .domain([min, max]);

  var path = d3.geoPath();

  var svg = d3.select("body")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .append('g')
              .attr('class', 'map');
  // scale, width and height has been adjusted to only show USA and Europe
  var projection = d3.geoMercator()
                     .scale(170)
                    .translate( [width / 1.25, height / 1]);

  var path = d3.geoPath().projection(projection);

  svg.call(tip);

// data from json and tsv files
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
// request data
var requests = [d3.json(input1), d3.json(input2), d3.json(input3), d3.json(input4),
d3.json(input5), d3.json(input6), d3.json(input7), d3.json(input8), d3.json(input9), d3.tsv(input10), svg];

// wait till all requests are loaded
Promise.all(requests).then(function(response) {
    // set variables to store data
    coca_ret_eu = response[0]
    hero_ret_eu = response[1]
    coca_ret_us = response[2]
    hero_ret_us = response[3]
    coca_whole_eu = response[4]
    hero_whole_eu = response[5]
    coca_whole_us = response[6]
    hero_whole_us = response[7]
    var data = response[8]
    var wholesale = response[9]
    var svg = response[10]

    // arrays of years and countries
    var years = getYears(coca_ret_eu)
    var countriesEU = Object.keys(coca_ret_eu);
    countryUS = "Average inflation adjusted in 2016 US$"
    // arrays of x and y values of cocaine and heroin data
    var creuArray = xyArrays(coca_ret_eu, countriesEU)
    var cweu = xyArrays(coca_whole_eu, countriesEU)
    var hreu = xyArrays(hero_ret_eu, countriesEU)
    var hweu = xyArrays(hero_whole_eu, countriesEU)
    var crus = xyArrays(coca_ret_us, countryUS)
    var cwus = xyArrays(coca_whole_us, countryUS)
    var hrus = xyArrays(hero_ret_us, countryUS)
    var hwus = xyArrays(hero_whole_us, countryUS)
    // dicts of retail and wholesaleprices of cocaine and heroin for Europe and USA
    var dictRetailEU = makeDictionary(creuArray, hreu, countriesEU)
    var dictRetailUS = makeDictionary(crus, hrus, "USA")
    var dictWholeEU = makeDictionary(cweu, hweu, countriesEU)
    var dictWholeUS = makeDictionary(cwus, hwus, "USA")

    // draw initial graphs that show retail and wholesaleprices for Austria
    update(dictRetailEU, countriesEU, years, "Austria")
    update(dictWholeEU, countriesEU, years, "Austria")

function worldMap() {
// draws worldmap and adds tooltip (hover and onclick) function
  var wholesaleById = {};

    wholesale.forEach(function(d) { wholesaleById[d.id] = +d.wholesaleprices; });
    data.features.forEach(function(d) { d.wholesaleprices = wholesaleById[d.id] });

    svg.append("g")
        .attr("class", "countries")
      .selectAll("path")
        .data(data.features)
      .enter().append("path")
        .attr("d", path)
        .style("fill", function(d) { return color(wholesaleById[d.id]); }) // color countries
        .style('stroke', 'white')
        .style('stroke-width', 1.5)
        .style("opacity",0.8)
        // tooltips
          .style("stroke","white")
          .style('stroke-width', 0.3)
          // add hover function
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
          })
          // add onclick function to update graphs for selected country
          .on("mousedown", function(d) {
            if (d.properties.name == "USA") {
              // remove retail graph and add new graph for USA
              d3.select("#retail").remove();
              update(dictRetailUS, countriesEU, years, d.properties.name)
              // remove wholesale graph and add new graph for USA
              d3.select("#wholesale").remove();
              update(dictWholeUS, countriesEU, years, d.properties.name)
            } else if (countriesEU.includes(d.properties.name)) {
              // remove retail graph and add new graph for Europe
              d3.select("#retail").remove();
              update(dictRetailEU, countriesEU, years, d.properties.name)
              // remove wholesale graph and add new graph for Europe
              d3.select("#wholesale").remove();
              update(dictWholeEU, countriesEU, years, d.properties.name)
            } else {
              d3.select("#retail").remove();
              d3.select("#wholesale").remove();
            }
          });

    svg.append("path")
        .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
        .attr("class", "names")
        .attr("d", path);

}
worldMap()

function worldmapLegend() {
// make legend for worldmap colors and matching values
  var defs = svg.append("defs");

  var linearGradient = defs.append("linearGradient")
                            .attr("id", "linear-gradient");
  // set gradient direction
  linearGradient
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");
  // calculate the gradient
  linearGradient.selectAll("stop")
      .data([
        {offset: "0%", color: color(min)},
        {offset: "25%", color: color((max - min) / 4 + min)},
        {offset: "50%", color: color(((max - min) / 4) * 2 + min)},
        {offset: "75%", color: color(((max - min) / 4) * 3 + min)},
        {offset: "100%", color: color(max)}
      ])
      .enter().append("stop")
      .attr("offset", function(d) {
        return d.offset;
      })
      .attr("stop-color", function(d) {
        return d.color;
      });
  // make legend rectangle
  var legend = svg.append("rect")
          .attr("width", 20)
          .attr("height", height - 15)
          .style("fill", "url(#linear-gradient)")
          .attr("transform", "translate(40,10)")
          .attr("opacity", 0.8);
  // yscale for axis
  var yScale = d3.scaleLinear()
          .range([0, height - 15])
          .domain([max, min]);
  // yaxis scaled
  var yAxis = d3.axisLeft()
          .scale(yScale)
          .ticks(5);

  // add axis
  svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", "translate(40,10)")
    .call(yAxis)

}
worldmapLegend()

}).catch(function(e){
    throw(e);
});

function update(data, countries, years, id){
// update function to draw graph with correct data

  // calculate the min and max of y for correct data
  if (countries.includes(id) && returnRetail(data, id)) {
    // return min and max for retailprices europe
    minMax = calcMinMax(coca_ret_eu, hero_ret_eu, id)
    minY = minMax[0]
    maxY = minMax[1]
  } else if (countries.includes(id) && returnWholesale(data, id)) {
    // return min and max for wholesaleprices europe
    minMax = calcMinMax(coca_whole_eu, hero_whole_eu, id)
    minY = minMax[0]
    maxY = minMax[1]
  } else {
    if (returnRetail(data, id)) {
      // return min and max for retailprices USA
      minMaxUS = calcMinMax(coca_ret_us, hero_ret_us, countryUS)
      minY = minMaxUS[0]
      maxY = minMaxUS[1]
    } else {
      // return min and max for wholesaleprices USA
      minMaxUS = calcMinMax(coca_whole_us, hero_whole_us, countryUS)
      minY = minMaxUS[0]
      maxY = minMaxUS[1]
    }
  }
    // return the correct titles and lineIDs for given data
    if (returnRetail(data, id)) {
      var title = 'Cocaine and heroin retailprices (streetprices) in ' + id
      var lineID = ["Cocaine retailprices ", "Heroin retailprices "]
    } else {
      var title = 'Cocaine and heroin wholesaleprices in ' + id
      var lineID = ["Cocaine wholesaleprices ", "Heroin wholesaleprices "]
    }

    // create margins and padding
    var margin = {top: 0, right: 20, bottom: 0, left: 0},
      padding = {top: 20, right: 0, bottom: 50, left: 40},
      outerWidth = 600,
      outerHeight = 500,
      innerWidth = outerWidth - margin.left - margin.right,
      innerHeight = outerHeight - margin.top - margin.bottom,
      width = innerWidth - padding.left - padding.right,
      height = innerHeight - padding.top - padding.bottom;

      // create svg
      var svg = d3.select("body").append("svg")
          .attr("id", function() {
            if (returnRetail(data, id)) { return "retail"}
            else { return "wholesale" }})
          .attr("width", outerWidth)
          .attr("height", outerHeight)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // create group tag
      var g = svg.append("g")
          .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

    // create x and y scale
    var xScale = d3.scaleLinear()
      .range([(margin.left + padding.left), width])
      .domain([Math.min.apply(null, years), Math.max.apply(null, years)])
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
    if (returnRetail(data, id)) { var yAxisLabel = 'US$ per gram'; }
      else { var yAxisLabel = 'US$ per kg'; }


    // make x and y axis
    g.append("g")
        .attr("class", "x axis")
        .transition()
        .duration(200)
        .attr("transform", "translate(0," + height  + ")")
        .call(xAxis);

    g.append("g")
        .attr("class", "y axis")
        .transition()
        .duration(200)
        .attr("transform", "translate(" + (margin.left + padding.left) + ",0)")
        .call(yAxis);
    // add axis labels
    g.append('text')
    .attr('class', 'axis-label')
    .attr('y', outerHeight - 30)
    .attr('x', innerWidth / 2 - 20)
    .attr('fill', 'black')
    .text(xAxisLabel);

    g.append('text')
    .attr('class', 'axis-label')
    .attr('y', function() { if (returnRetail(data, id)) { return margin.left }
                            else { return margin.left - 20}})
    .attr('x', - innerHeight / 2)
    .attr('fill', 'black')
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text(yAxisLabel)

    // add title
    g.append('text')
    .attr('class', 'title')
    .attr('x', innerWidth / 2 - 10)
    .attr('y', margin.top)
    .text(title)

    // define the line
    var valueline = d3.line()
      .x(function(d) { return xScale(d[0]) })
      .y(function(d) { return yScale(d[1]) })
      .curve(d3.curveMonotoneX); // apply smoothing to the line

    // append the path, bind the data, and call the line generator
        g.selectAll(".line")
        .data(data[id])
        .enter()
        .append("path")
        .attr("class", "line") // assign a class for styling
        .attr("d", function(d) { return valueline(d); } ) // calls the line generator
        .attr("id", function(d, i) { return lineID[i]; }) // add id to every line
        .style("stroke", function(d, i) {   // add color according to line
          if (i == 0) { return "#6c069b"}
          else { return "#ba6816" };
        })
        // tooltip hover function
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
        // show correct text according to line id
        .on("mousemove", function(d){
            var xPos = d3.mouse(this)[0] - 15;
            var yPos = d3.mouse(this)[1] - 35;
            tooltip.attr("transform", "translate(" + xPos + "," + yPos + ")");
            tooltip.select("text")
            .attr("class", "tooltip-text")
            .text(this.id);});
        var tooltip = svg.append("g")
                        .attr("class", "tooltip")
                        .style("display", "none");
        tooltip.append("text")
                .attr("x", 15)
                .attr("dy", "1em");

      // make legend for graph
      makeLegend(svg, data, id, lineID, width)
}};

function returnRetail(data, id) {
  // returns true if input is retail data
  return (data[id][0][0][1] < 1000);
}

function returnWholesale(data, id) {
  // returns true if input is wholesale data
  return (data[id][0][0][1] > 1000);
}

function makeLegend(svg, data, id, lineID, width) {
  // draw legend for line graph
   var legend = svg.selectAll(".legend")
       .data(lineID)
       .enter().append("g")
       .attr("class", "legend")
       .attr("transform", function(d, i) { return "translate(20," + i * 20 + ")"; });
       // draw legend rects with 2 colors
       legend.append("rect")
         .attr("x", width + 10)
         .attr("y", 40)
         .attr("width", 18)
         .attr("height", 18)
         .style("fill", function(d, i) {
           if (i == 0) { return "#6c069b"}
           else { return "#ba6816" };
           })

         // add text to legend
         legend.append("text")
           .attr("x", function() { if (returnRetail(data, id)) { return width - 115 }
                                else { return width - 145 }})
           .attr("y", 55)
           .text(function(d){
             return d; })
          .attr("font-family", "sans-serif")
          .attr("font-size", "14px")
}

function getYears(data) {
  // returns array of all years of data
  for (key in data) {
    years = []
    countries = data[key]
    for (key2 in countries){
      years.push(Number(key2))
    }
  }
  return years
  }

function calcMinMax(data, data2, country) {
  // returns minimum and maximum of y values
  allValues = []
    dataList = [data[country], data2[country]]
      dataList.forEach(function(d){
        for (value in d) {
          allValues.push(d[value]) }
        });
  minValues = Math.min.apply(null, allValues)
  maxValues = Math.max.apply(null, allValues)
  return [minValues, maxValues];
}

function xyArrays(data, countries) {
  // returns dict with array x and y values for every country like dict["Austria"] = [[x, y], [x, y]...]
    dict = {}
    try {
      countries.forEach(function(key){
          temp = []
          for (year in data[key]) {
            tempxy = [Number(year), data[key][year]]
            temp.push(tempxy)
          }
          dict[key] = temp
      });
    } catch(err) {
      temp = []
      for (year in data[countries]) {
          tempxy = [Number(year), data[countries][year]]
          temp.push(tempxy)
      }
      dict["USA"] = temp
    };
    return dict;
}

function makeDictionary(data, data2, countries) {
  // create dict that matches country with cocaine and heroin data like dict["Austria"] = [cocaineArray], [heroinArray]
    dict = {}
    try {
      countries.forEach(function(key){
        dict[key] = [data[key], data2[key]]
      });
    } catch(err) {
      dict["USA"] = [data[countries], data2[countries]]
    };
    return dict;
}
