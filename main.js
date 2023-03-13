// irene hu
// info-474
// this is the main js file for the precipitation viz.

function dataPreprocessor(row) {
    var months = {
        1: 'JAN', 2: 'FEB',
        3: 'MAR', 4: 'APR',
        5: 'MAY', 6: 'JUN',
        7: 'JUL', 8: 'AUG',
        9: 'SEP', 10: 'OCT',
        11: 'NOV', 12: 'DEC'
    }

    return {
        date: row.date,
        month: months[row.date.split("-")[1]],
        year: row.date.split("-")[0],
        // actual_mean_temp
        // actual_min_temp
        // actual_max_temp
        // average_min_temp
        // average_max_temp
        // record_min_temp
        // record_max_temp
        // record_min_temp_year
        // record_max_temp_year
        actual_precipitation: row.actual_precipitation,
        average_precipitation_x: row.average_precipitation_x,
        record_precipitation: row.record_precipitation,
        monthly_historical_avg: row.average_precipitation_y
    }
}

// 🌈 color palette
//          feb         mar         apr         may     jun         jul         aug     sep         oct         nov     dec         jan         
colors = ['#c81b8e', '#508484', '#F17300', '#707070', '#C39A32', '#D11149', '#96654d', '#af54cb', '#64a38f', '#a3d1c1', '#569dd8', '#054A91']

// 📝 global variable selected year
selectedYear = 2015;

// 📝 d3 element svg
var svg = d3.select('svg');

// 📝 gets svg element layout parameters from the HTML
// 🟥 add padding! reference lab 5
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var innerRadius = svgWidth / 6;
var outerRadius = Math.min(svgWidth, svgHeight) / 2.25;

// 📝 please remember to append any graph elements to chartG!
//      chartG appended to svg above.
var chartG = svg.append('g').attr('transform', 'translate(' + [svgWidth / 2, svgHeight / 2] + ')')



// 🌟 write javascript below
d3.csv('new_KSEA.csv', dataPreprocessor).then(function (dataset) {
    // all the precipitation data in the loaded dataset, with average for each month calculated.
    weatherPoints = dataset

    // finding a datapoint for each unique month!
    monthsText = new Set()
    weatherMonths = weatherPoints.filter(function (d) {
        if (!monthsText.has(d.month)) {
            monthsText.add(d.month);
            return d;
        };
    })


    // .filter(function(d) {
    //     // TO PRINT ALL YEAR DATA POINTS: console.log(d.date.split("-")[0]);
    //     return d.date.split("-")[0] == selectedYear;
    // });

    console.log(weatherPoints);

    // ✅ find the max precipitation
    var maxPrecip = d3.max(weatherPoints, function (d) {
        // TO PRINT ALL PRECIPITATION DATA POINTS: console.log(d.average_precipitation_x);
        return d.average_precipitation_x;
    })

    console.log("maxPrecip: " + maxPrecip);

    // ✅ xScale - for the graph bars
    xScale = d3.scaleBand()
        .domain(weatherPoints.map(function (d) {
            return d.date;
        }))
        .range([0, 2 * Math.PI]);

    // ✅ yScale - for the graph radius
    var yScale = d3.scaleRadial()
        .domain([0, maxPrecip])
        .range([innerRadius, outerRadius]);

    // ✅ labelScale - for the graph labels
    var labelScale = d3.scaleBand()
        .domain(weatherPoints.map(function (d) {
            return d.month;
        }))
        .range([0, 2 * Math.PI]);
    // ✅ colorPick - for dividing the graph by color
    var colorPick = d3.scaleOrdinal().domain(weatherPoints)
        .range(colors);


    // 🌟 LABELING THE GRAPH WITH MONTHS (using 'weatherMonths')
    (chartG.selectAll("g")
        .data(weatherMonths)
        .enter()
        .append("g")

        .attr("text-anchor", function (d) {
            return (labelScale(d.month) + labelScale.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start";
        })
        .attr("transform", function (d) {
            return "rotate(" + ((labelScale(d.month) + labelScale.bandwidth() / 2) * 180 / Math.PI - 90) + ")" +
                "translate(" + (Math.min(svgWidth, svgHeight) / 8) + ",0)";
        })
        .append("text")
        .text(function (d) {
            return d.month;
        })
        // transforming text using labelScale
        .attr("transform", function (d) {
            return (labelScale(d.month) + labelScale.bandwidth() / 2 + Math.PI) %
                (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)";
        })
        .style("font-size", "16px")
        .attr("alignment-baseline", "middle")
    )

        // 🌟🌟 CREATING THE GRAPH
        // CREATING THE MONTHLY AVERAGE GRAPH
        (chartG.selectAll("path")
            .data(weatherMonths)
            .enter()
            .append("path")
            .attr("fill", function (d) {
                return colorPick(d.month)
            })
            .attr('fill-opacity', '0.4')

            .attr("d", d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(function (d) {
                    return yScale(d.monthly_historical_avg);
                })
                .startAngle(function (d) {
                    return labelScale(d.month);
                })
                .endAngle(function (d) {
                    return labelScale(d.month) + labelScale.bandwidth();
                })
                .padAngle(0)
                .padRadius(innerRadius))
        )

    // 🌟🌟 CREATING THE DAILY AVERAGE GRAPH
    chartG.selectAll("path")
        .data(weatherPoints)
        .enter()
        .append("path")
        .attr("fill", function (d) {
            return colorPick(d.month)
        })
        .attr('fill-opacity', '0.9')
        .attr("d", d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(function (d) {
                return yScale(d.average_precipitation_x);
            })
            .startAngle(function (d) {
                return xScale(d.date);
            })
            .endAngle(function (d) {
                return xScale(d.date) + xScale.bandwidth();
            })
            .padAngle(0.0075)
            .padRadius(innerRadius))


});
    // 📝 TO-DO LIST
    // find a good size for the doughnut chart?
    // set 12 different even sections - label by month
    // find the maximum value in the dataset - darkest shade of blue.
    // minimum value set to 0                   - set to white