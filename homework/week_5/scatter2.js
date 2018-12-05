// Name: Kimberley Boersma
// Student number: 11003464
// JavaScript file to make scatter plot

window.onload = function() {
  var input1 = "https://raw.githubusercontent.com/kim66003/dataprocessing/master/homework/week_5/alcoholconsumption.json"
  var input2 = "https://raw.githubusercontent.com/kim66003/dataprocessing/master/homework/week_5/dailysmokers.json"
  var input3 = "https://raw.githubusercontent.com/kim66003/dataprocessing/master/homework/week_5/obesitas.json"
  var requests = [d3.json(input1), d3.json(input2), d3.json(input3)];

  Promise.all(requests).then(function(response) {
      alcObeTitle = "Association between alcohol consumption and obesity for population aged 15+ in 2014"
      tobObeTitle = "Association between daily smoking and obesity for population aged 15+ in 2014"
      xAxisTitle = "Alcoholconsumption in litres per capita"
      xAxisTitle2 = "Daily smokers in % of population"
      // functies hier aanroepen
      alc = response[0]
      tob = response[1]
      obe = response[2]
      function createDropdown() {
        // Create a dropdown
        var dropdown = d3.select("#correlations");
        var dropdowntitles = ["Correlation between alcohol consumption and obesity", "Correlation between daily smokers and obesity"]
        selectBox = dropdown
        .append("select")
        .attr("id", "selectBox")
        .on("change", changeFunc)

        selectBox.selectAll("option")
            .data(dropdowntitles)
            .enter()
            .append("option")
            .attr("value", function(d){
                return d;
            })
            .text(function(d){
                return d;
            })
            .attr("onclick", function(d){
              return d;
            });

      }

      changeFunc = function changeFunc() {
        var selectBox = document.getElementById("selectBox");
        var selectedValue = selectBox.options[selectBox.selectedIndex].value;
        if (selectedValue.includes("alcohol consumption and obesity")) {
          makeVisualisation(alc, obe, alcObeTitle, xAxisTitle)

        };
        if (selectedValue.includes("daily smokers and obesity")) {
          makeVisualisation(tob, obe, tobObeTitle, xAxisTitle2)
        };
      }
      createDropdown()
      makeVisualisation(alc, obe, alcObeTitle, xAxisTitle)
  }).catch(function(e){
      throw(e);
  })
};

function valuesArray(data, keys)  {
      var array = []
      keys.forEach(function(key){
        array.push((data[key]).Value)
      });
      return array
}

function makeCoordinates(dict1, dict2) {
      output = []
      for (i = 0; i < dict1.length; i++) {
          temp = [(dict1[i]).Value, (dict2[i]).Value]
          output.push(temp);
      };
      return output
}

function makeDict(data, keys) {
      output = []
      keys.forEach(function(key){
        output.push((data[key]))
      });
      return output
}

function makeCountries(dict) {
      output = []
      for (i = 0; i < dict.length; i++) {
          output.push(dict[i].LOCATION);
      };
      return output
}

function makeVisualisation(data1, data2, title, xAxisTitle) {

  d3.select("svg").remove();

  // functies hier schrijven
  alcCountries = Object.keys(data1)
  dictAlc = makeDict(data1, alcCountries)
  dictObe = makeDict(data2, alcCountries)
  countries = makeCountries(dictAlc)
  not_europe = ["CAN", "KOR", "TUR", "USA", "ISR"]
  alcValues = valuesArray(data1, alcCountries)
  maxAlc = Math.max.apply(null, alcValues)
  obeValues = valuesArray(data2, alcCountries)
  maxObe = Math.max.apply(null, obeValues)
  alcObe = makeCoordinates(dictAlc, dictObe)

  var margin = {top: 10, right: 20, bottom: 20, left: 10},
    padding = {top: 20, right: 60, bottom: 60, left: 30},
    outerWidth = 1100,
    outerHeight = 500,
    innerWidth = outerWidth - margin.left - margin.right,
    innerHeight = outerHeight - margin.top - margin.bottom,
    width = innerWidth - padding.left - padding.right,
    height = innerHeight - padding.top - padding.bottom;

  function createMarginScales(maxX, maxY, dataset) {
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

        var svg = d3.select("#correlations").append("svg")
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

  function createScatter(xScale, yScale, svg, g, dataset, labels, not_europe) {
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
             return (d[1] / 90)
           })
           .style("fill", function(d, i) {
             if (not_europe.includes(labels[i])) {
               return "#2de50d"
             } else {
               return "#5400ff"
             }
           })
           // change color and show info when you hover over bars with mouse
           .on("mouseover", function(){
               d3.select(this)
               .attr("opacity", 1)
                 tooltip.style("display", null);
           })
           .on("mouseout", function(){
               d3.select(this)
               .attr("opacity", function(d) {
                 return (d[1] / 90)
               })
               tooltip.style("display", "none");
           })
           .on("mousemove", function(d){
               var xPos = d3.mouse(this)[0] - 15;
               var yPos = d3.mouse(this)[1] - 35;
               tooltip.attr("transform", "translate(" + xPos + "," + yPos + ")");
               tooltip.select("text").text(d[0] + ", " + d[1]);
               tooltip.attr("fill", "#000a28")
               tooltip.style("font-family", "sans-serif")
           });
           var tooltip = svg.append("g")
                           .attr("class", tooltip)
                           .style("display", "none");
           tooltip.append("text")
                   .attr("x", 15)
                   .attr("dy", "1.2em")
                   .style("font-size", "0.9em")
                   .attr("font-weight", "light");


         gdots.append("text").text(function(d, i){
                      return labels[i];
                   })
                   .attr("x", function (d) {
                       return xScale(d[0]) - 1;
                   })
                   .attr("y", function (d) {
                       return yScale(d[1]) + 2;
                   })
                   .attr("font-family", "sans-serif")
                   .attr("font-size", "9px")
                   .style("font-weight", "bold")
                   .attr("fill", "#ff009d");

            //Create Title
           svg.append("text")
           .attr("class", "title")
           .attr("x", width / 2 )
           .attr("y", 10)
           .style("text-anchor", "middle")
           .attr("font-family", "sans-serif")
           .text(title)
           .style("font-size", "16px");

           svg.append("text")
              .attr("class", "axis labels")
              .attr("transform",
                    "translate(" + ((width / 1.8)) + " ," +
                                   (height + padding.bottom + 10) + ")")
              .text(xAxisTitle)
              .attr("font-family", "sans-serif")
              .style("text-anchor", "middle")
              .style("font-size", "16px");

            svg.append("text")
              .attr("class", "axis labels")
              .attr("transform", "rotate(-90)")
              .attr("x", 0 - (height / 1.7))
              .attr("y", 0 + margin.left)
              .attr("dy", "1em")
              .text("Self-reported obesitas in %")
              .attr("font-family", "sans-serif")
              .style("text-anchor", "middle")
              .style("font-size", "16px");
  }

  function makeLegend(svg) {
    legend = ["Europe", "Non-European"]

    // draw legend
     var legend = svg.selectAll(".legend")
         .data(legend)
         .enter().append("g")
         .attr("class", "legend")
         .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

         // draw legend colored circles
    legend.append("circle")
        .attr("cx", width - 10)
        .attr("cy", 10)
        .attr("r", 9)
        .style("fill", function(d, i) {
            if (i == 0) {
              return "#5400ff"
            } else {
              return "#2de50d"
            }
        })
        .attr("opacity", 0.8);

        // draw legend text
       legend.append("text")
           .attr("x", width - 24)
           .attr("y", 9)
           .attr("dy", ".4em")
           .attr("font-family", "sans-serif")
           .style("text-anchor", "end")
           .text(function(d) { return d;})
  }
  valuesScatter = createMarginScales(maxAlc, maxObe, alcObe)
  createScatter(valuesScatter[0], valuesScatter[1], valuesScatter[2], valuesScatter[3], alcObe, countries, not_europe)
  makeLegend(valuesScatter[2])
}
