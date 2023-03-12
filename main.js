// irene hu
// info-474
// this is the main js file for the precipitation viz.

function onDefault() {
    console.log('filler code');
}

// 📝 global variable selected year
selectedYear = 2015;

// 📝 d3 element svg
var svg = d3.select('svg');


// 📝 please remember to append any graph elements to chartG!
//      chartG appended to svg above.
var chartG = svg.append('g')


// 📝 gets svg element layout parameters from the HTML
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');


// 🌟 write javascript below
d3.csv('Weather Data/KSEA.csv').then(function(dataset){
    
    // ✅ filtering the dataset - if selectedYear == the date in the dataset
    weatherPoints = dataset.filter(function(d) {
        // TO PRINT ALL YEAR DATA POINTS: console.log(d.date.substring(0,4));
        return d.date.substring(0,4) == selectedYear;
    });

    // ✅ find the max precipitation
    var maxPrecip = d3.max(weatherPoints, function(d){
        // TO PRINT ALL PRECIPITATION DATA POINTS: console.log(d.actual_precipitation);
        return d.actual_precipitation;
    })

    console.log("maxPrecip: " + maxPrecip);

    
    
    // 📝 TO-DO LIST
    // find a good size for the doughnut chart?
    // set 12 different even sections - label by month
    // find the maximum value in the dataset - darkest shade of blue.
    // minimum value set to 0                   - set to white
})


