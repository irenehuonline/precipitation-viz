// irene hu
// info-474
// this is the main js file for the precipitation viz.

// ⭐⭐⭐ IMPORTING RADIAL SCALE

function onDefault() {
    console.log('filler code');
}

// 📝 global variable selected year
selectedYear = 2015;

// 📝 d3 element svg
var svg = d3.select('svg');

// 📝 gets svg element layout parameters from the HTML
// 🟥 add padding! reference lab 5
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var innerRadius = 80;
var outerRadius = Math.min(svgWidth, svgHeight) / 2;

// 📝 please remember to append any graph elements to chartG!
//      chartG appended to svg above.
var chartG = svg.append('g') .attr('transform', 'translate(' + [svgWidth/ 2, svgHeight / 2] + ')')



// 🌟 write javascript below
d3.csv('Weather Data/KSEA.csv').then(function(dataset){
    
    // ✅ filtering the dataset - if selectedYear == the date in the dataset
    weatherPoints = dataset.filter(function(d) {
        // TO PRINT ALL YEAR DATA POINTS: console.log(d.date.split("-")[0]);
        return d.date.split("-")[0] == selectedYear;
    });

    console.log(weatherPoints);

    // ✅ find the max precipitation
    var maxPrecip = d3.max(weatherPoints, function(d){
        // TO PRINT ALL PRECIPITATION DATA POINTS: console.log(d.actual_precipitation);
        return d.actual_precipitation;
    })

    console.log("maxPrecip: " + maxPrecip);
    console.log("")
    // xScale
    xScale = d3.scaleBand()
                .domain(weatherPoints.map(function(d){
                    console.log(d.date.split("-")[1]);
                    return d.date;
                }))
                .range([0, 2 * Math.PI]);
    // yScale
    var yScale = scaleRadial()
                .domain([0, maxPrecip])
                .range([innerRadius, outerRadius]);


    chartG.selectAll("path")
    .data(weatherPoints)
    .enter()
    .append("path")
      .attr("fill", "black")
      .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(function(d) { return yScale(d.actual_precipitation); })
          .startAngle(function(d) { return xScale(d.date); })
          .endAngle(function(d) { return xScale(d.date) + xScale.bandwidth(); })
          .padAngle(0.01)
          .padRadius(innerRadius))


    chartG.selectAll("g")
          .data(weatherPoints)
          .enter()
          .append("g")
            .attr("text-anchor", function(d) { return (xScale(d.date) + xScale.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
            .attr("transform", function(d) { return "rotate(" + ((xScale(d.date) + xScale.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (yScale(d.actual_precipitation)+ 0.05) + ",0)"; })
            .append("text")
            .text(function(d){return(d.date.split("-")[1])})
            .attr("transform", function(d) { return (xScale(d.date) + xScale.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
            .style("font-size", "11px")
            .attr("alignment-baseline", "middle")
    
    });



    // 📝 TO-DO LIST
    // find a good size for the doughnut chart?
    // set 12 different even sections - label by month
    // find the maximum value in the dataset - darkest shade of blue.
    // minimum value set to 0                   - set to white