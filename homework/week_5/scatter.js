// Name: Kimberley Boersma
// Student number: 11003464
// JavaScript file to make scatter plot

window.onload = function() {
  var input1 = "https://raw.githubusercontent.com/kim66003/dataprocessing/master/homework/week_5/alcoholconsumption.json"
  var input2 = "https://raw.githubusercontent.com/kim66003/dataprocessing/master/homework/week_5/dailysmokers.json"
  var input3 = "https://raw.githubusercontent.com/kim66003/dataprocessing/master/homework/week_5/obesitas.json"
  var requests = [d3.json(input1), d3.json(input2), d3.json(input3)];
  Promise.all(requests).then(function(response) {
      // functies hier aanroepen
      alc = response[0]
      tob = response[1]
      obe = response[2]
      alcCountries = Object.keys(alc)
      console.log(alcCountries)
      tobCountries = Object.keys(tob)
      obeCountries = Object.keys(obe)
      alcValues = valuesArray(alc, alcCountries)
      minAlc = Math.min.apply(null, alcValues)
      maxAlc = Math.max.apply(null, alcValues)
      tobValues = valuesArray(tob, tobCountries)
      obeValues = valuesArray(obe, obeCountries)
      minObe = Math.min.apply(null, obeValues)
      maxObe = Math.max.apply(null, obeValues)
      alcTob = makeCoordinates(tobValues, alcValues)
      alcObe = makeCoordinates(alcValues, obeValues)
      tobObe = makeCoordinates(tobValues, obeValues)
      valuesScatter = createMarginScales(minAlc, maxAlc, minObe, maxObe, alcObe)
      createScatter(valuesScatter[0], valuesScatter[1], valuesScatter[2], valuesScatter[3], alcObe, alcCountries)
  }).catch(function(e){
      throw(e);
  })
};

// functies hier schrijven

function valuesArray(data, keys)  {
      var array = []
      keys.forEach(function(key){
        array.push((data[key]).Value)
      });
      return array
}

function makeCoordinates(array1, array2) {
      output = []
      for (i = 0; i < array1.length; i++) {
          temp = [array1[i], array2[i]]
          output.push(temp);
      };
      return output
}

var margin = {top: 10, right: 20, bottom: 20, left: 10},
  padding = {top: 10, right: 60, bottom: 60, left: 30},
  outerWidth = 900,
  outerHeight = 480,
  innerWidth = outerWidth - margin.left - margin.right,
  innerHeight = outerHeight - margin.top - margin.bottom,
  width = innerWidth - padding.left - padding.right,
  height = innerHeight - padding.top - padding.bottom;

function createMarginScales(minX, maxX, minY, maxY, dataset) {
      var xScale = d3.scaleLinear()
        .range([(margin.left + padding.left), width])
        .domain([0, maxX])
        .nice();

      var yScale = d3.scaleLinear()
        .range([height, (margin.top + padding.top)]).clamp(true)
        .domain([0, maxY])
        .nice();

      var xAxis = d3.axisBottom(xScale);
      var yAxis = d3.axisLeft(yScale);

      var svg = d3.select("body").append("svg")
          .attr("width", outerWidth)
          .attr("height", outerHeight)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var g = svg.append("g")
          .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

      g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      g.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + (margin.left + padding.left) + ",0)")
          .call(yAxis);

       return [xScale, yScale, svg, g]
    }

function createScatter(xScale, yScale, svg, g, dataset, labels) {
      var gdots =  svg.selectAll("g.dot")
            .data(dataset)
            .enter().append('g');

      svg.selectAll("circle")
         .data(dataset)
         .enter()
         .append("circle")
         .attr("cx", function(d) {
            return xScale(d[0]);
         })
         .attr("cy", function(d) {
            return yScale(d[1]) + margin.top;
         })
         .attr("r", function(d) {
            return (d[1] / 8);
         })
         .attr("opacity", function(d) {
           return (d[1] / 100)
         })
         .style("fill", "#5400ff");

     gdots.append("text").text(function(d, i){
                  return labels[i];
               })
               .attr("x", function (d) {
                   return xScale(d[0]);
               })
               .attr("y", function (d) {
                   return yScale(d[1]);
               })
               .attr("font-family", "sans-serif")
               .attr("font-size", "10px")
               .style("font-weight", "bold")
               .attr("fill", "#ff009d");

         svg.append("text")
            .attr("class", "axis labels")
            .attr("transform",
                  "translate(" + ((width / 1.8)) + " ," +
                                 (height + padding.bottom - 10) + ")")
            .text("Alcoholconsumption")
            .style("text-anchor", "middle")
            .style("font-size", "16px");

          svg.append("text")
            .attr("class", "axis labels")
            .attr("transform", "rotate(-90)")
            .attr("x", 0 - (height / 1.7))
            .attr("y", 0 + margin.left)
            .attr("dy", "1em")
            .text("Self-reported obesitas")
            .style("text-anchor", "middle")
            .style("font-size", "16px");
}
