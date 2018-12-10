window.onload = function() {
var input = "data/heroin_retail_europe.json"
var requests = [d3.json(input)];

Promise.all(requests).then(function(response) {
    console.log(response)
}).catch(function(e){
    throw(e);
});

};
