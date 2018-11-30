// Name: Kimberley Boersma
// Student number: 11003464
// JavaScript file to make scatter plot

window.onload = function() {
  var input1 = "alcoholconsumption.json"
  var input2 = "dailysmokers.json"
  var input3 = "obesitas.json"
  var requests = [d3.json(input1), d3.json(input2), d3.json(input3)];
  Promise.all(requests).then(function(response) {
      // functies hier aanroepen
      alc = response[0]
      tob = response[1]
      obe = response[2]
      alcCountries = Object.keys(alc)
      tobCountries = Object.keys(tob)
      obeCountries = Object.keys(obe)
      alcValues = valuesArray(alc, alcCountries)
      tobValues = valuesArray(tob, tobCountries)
      obeValues = valuesArray(obe, obeCountries)
      alcTob = makeCoordinates(tobValues, alcValues)
      alcObe = makeCoordinates(alcValues, obeValues)
      tobObe = makeCoordinates(tobValues, obeValues)
      createMargin()
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
      console.log(output)
      return output
}

function createMargin() {
      var margin = {top: 20, right: 20, bottom: 20, left: 20},
        padding = {top: 60, right: 60, bottom: 60, left: 60},
        outerWidth = 1200,
        outerHeight = 500,
        innerWidth = outerWidth - margin.left - margin.right,
        innerHeight = outerHeight - margin.top - margin.bottom,
        width = innerWidth - padding.left - padding.right,
        height = innerHeight - padding.top - padding.bottom;

    //     var x = d3.scale.identity()
    // .domain([0, width]);
    //
    //     var y = d3.scale.identity()
    //         .domain([0, height]);
    //
    //     var xAxis = d3.svg.axis()
    //         .scale(x)
    //         .orient("bottom");
    //
    //     var yAxis = d3.svg.axis()
    //         .scale(y)
    //         .orient("right");

        var svg = d3.select("body").append("svg")
            .attr("width", outerWidth)
            .attr("height", outerHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}
