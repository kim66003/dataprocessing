window.onload = function() {

  var format = d3.format(",");

// Set tooltips
var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([0, 0])
            .html(function(d) {
              return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Cocaine retail price: </strong><span class='details'>" + d.retailprices +"US$ per gram</span>";
            })

var margin = {top: -130, right: 0, bottom: 0, left: 0},
            width = 1000 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom,
            min = 50,
            max = 120;

var color = d3.scaleSequential(d3.interpolateOrRd)
              .domain([min, max]);

var path = d3.geoPath();

var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append('g')
            .attr('class', 'map');

var projection = d3.geoMercator()
                   .scale(210)
                  .translate( [width / 1.2, height / 0.95]);

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
    data = response[8]
    retail = response[9]
    svg = response[10]

    all = arrayValues(coca_ret_eu)
    cweuArray = arrayValues(coca_whole_eu)
    creu = all[0]
    creu_all = all[1]
    maxCreu = Math.max.apply(null, creu_all)
    years = all[2]
    minYear = Math.min.apply(null, years)
    maxYear = Math.max.apply(null, years)
    creu_dict = all[3]
    countriesEU = Object.keys(coca_ret_eu);
    console.log(countriesEU)
    countryUS = "Average inflation adjusted in 2016 US$"

    creuArray = xyArrays(coca_ret_eu, countriesEU)
    cweu = xyArrays(coca_whole_eu, countriesEU)
    hreu = xyArrays(hero_ret_eu, countriesEU)
    hweu = xyArrays(hero_whole_eu, countriesEU)
    crus = xyArrays(coca_ret_us, countryUS)
    cwus = xyArrays(coca_whole_us, countryUS)
    hrus = xyArrays(hero_ret_us, countryUS)
    hwus = xyArrays(hero_whole_us, countryUS)

    dictRetailEU = makeDictionary(creuArray, hreu, countriesEU)
    dictRetailUS = makeDictionary(crus, hrus, "USA")
    dictWholeEU = makeDictionary(cweu, hweu, countriesEU)
    dictWholeUS = makeDictionary(cwus, hwus, "USA")

    update(dictRetailEU, countriesEU, years, minYear, maxYear, "Austria")

    var retailById = {};

      retail.forEach(function(d) { retailById[d.id] = +d.retailprices; });
      data.features.forEach(function(d) { d.retailprices = retailById[d.id] });

      svg.append("g")
          .attr("class", "countries")
        .selectAll("path")
          .data(data.features)
        .enter().append("path")
          .attr("d", path)
          .style("fill", function(d) { return color(retailById[d.id]); })
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
            })
            .on("mousedown", function(d) {
              if (d.properties.name == "USA") {
                update(dictRetailUS, countriesEU, years, minYear, maxYear, d.properties.name)
              } else if (countriesEU.includes(d.properties.name)) {
                update(dictRetailEU, countriesEU, years, minYear, maxYear, d.properties.name)
              } else {
                d3.select("#graph").remove();
              }
            });

      svg.append("path")
          .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
          .attr("class", "names")
          .attr("d", path);


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

function calcMinMax(data, data2, country) {
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

  function update(data, countries, years, minX, maxX, id){
    // remove whole svg
    d3.select("#graph").remove();

    if (countries.includes(id)) {
      minMax = calcMinMax(coca_ret_eu, hero_ret_eu, id)
      minY = minMax[0]
      maxY = minMax[1]
    } else {
        minMaxUS = calcMinMax(coca_ret_us, hero_ret_us, countryUS)
        minY = minMaxUS[0]
        maxY = minMaxUS[1]
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

      var title = 'Cocaine and heroin retailprices (streetprices) in ' + id

      lineID = ["Cocaine retailprices", "Heroin retailprices"]

      // create x and y scale
      var xScale = d3.scaleLinear()
        .range([(margin.left + padding.left), width])
        .domain([minX, maxX])
        .nice();

      var yScale = d3.scaleLinear()
        .range([height, (margin.top + padding.top)]).clamp(true)
        .domain([0, maxY])
        .nice();

        console.log(maxY)

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
          .attr("id", "graph")
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
              .entries(data);

      // define the line
      var valueline = d3.line()
          .x(function(d) { return xScale(d[0]) })
          .y(function(d) { return yScale(d[1]) })
          .curve(d3.curveMonotoneX); // apply smoothing to the line

      console.log(data[id])

      // Append the path, bind the data, and call the line generator
      data[id].forEach(function(d, i){
        g.append("path")
            .attr("class", "line") // Assign a class for styling
            .attr("d", valueline(d)) // Calls the line generator
            .attr("id", lineID[i])
            .style("stroke", function(d) {
              if (i == 0) { return "#6c069b"}
              else { return "#964d04" };
              })
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
                    .style("font-size", "1.1em")
                    .attr("font-weight", "bold")
                    .attr("fill", "#0043ff");
      });
  }
