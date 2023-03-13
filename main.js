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

        // .CSV has but doesn't take into account: 
        // actual_mean_temp | actual_min_temp | actual_max_temp
        // average_min_temp | average_max_temp
        // record_min_temp | record_max_temp
        // record_min_temp_year | record_max_temp_year
        actual_precipitation: row.actual_precipitation,
        average_precipitation_x: row.average_precipitation_x,
        record_precipitation: row.record_precipitation,
        monthly_historical_avg: row.average_precipitation_y
    }
}

function onChanged() {
    var select = d3.select('#citySelect').node();
    // Get current value of select element
    var category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of letters
    updateChart(category);
}




// 🌈 color palette
//          feb         mar         apr         may     jun         jul         aug     sep         oct         nov     dec         jan         
colors = ['#ff56d0', '#2b5e5e', '#F17300', '#730000', '#C39A32', '#2a0140', '#82b504', '#b00404', '#64a38f', '#a3d1c1', '#569dd8', '#1f3b59']

// 📝 global variable selected year
selectedYear = 2015;

// 📝 d3 element svg
var svg = d3.select('svg');

// 📝 gets svg element layout parameters from the HTML
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
    var initWeatherPoints = dataset

    // finding a datapoint for each unique month!
    var initMonthsText = new Set()
    var initWeatherMonths = initWeatherPoints.filter(function (d) {
        if (!initMonthsText.has(d.month)) {
            initMonthsText.add(d.month);
            return d;
        };
    })


    // .filter(function(d) {
    //     // TO PRINT ALL YEAR DATA POINTS: console.log(d.date.split("-")[0]);
    //     return d.date.split("-")[0] == selectedYear;
    // });


    // ✅ find the max precipitation
    var maxPrecip = d3.max(initWeatherPoints, function (d) {
        // TO PRINT ALL PRECIPITATION DATA POINTS: console.log(d.average_precipitation_x);
        return d.average_precipitation_x;
    })

    console.log("maxPrecip: " + maxPrecip);

    // ✅ xScale - for the graph bars
    xScale = d3.scaleBand()
        .domain(initWeatherPoints.map(function (d) {
            return d.date;
        }))
        .range([0, 2 * Math.PI]);

    // ✅ axisScale - for the graph radius
    axisScale = d3.scaleRadial()
        .domain([0, maxPrecip])
        .range([innerRadius, outerRadius]);

    // ✅ labelScale - for the graph month labels
    labelScale = d3.scaleBand()
        .domain(initWeatherPoints.map(function (d) {
            return d.month;
        }))
        .range([0, 2 * Math.PI]);
    // ✅ colorPick - for dividing the graph by color
    colorPick = d3.scaleOrdinal().domain(initWeatherPoints)
        .range(colors);


    // 🌟 LABELING THE GRAPH WITH MONTHS (using 'initWeatherMonths')
    chartG.selectAll("g")
        .data(initWeatherMonths)
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

    // 🌟 CREATING RADIAL AXIS
    radialAxis = g => g
        .attr('transform', 'translate(' + [svgWidth / 2, svgHeight / 2] + ')')
        .attr("text-anchor", "middle")
        .call(g => g.append("text")
            .attr("y", d => -axisScale(axisScale.ticks(12).pop()))
            .attr("dy", "-1em")
            .text("Daily and Monthly Precipitation in Seattle: The Historical Average"))
        .call(g => g.selectAll("g")
            .data(function (d) {
                return axisScale.ticks(8).filter(function (d) {
                    return !(d > 0.1 && (d * 100) % 3 != 0)
                })

            })
            .join("g")
            .attr("fill", "none")
            .call(g => g.append("circle")
                .attr("stroke", "gray")
                .attr("stroke-opacity", 0.5)
                .attr("r", axisScale))
            .call(g => g.append("text")
                .attr("y", d => -axisScale(d))
                .attr("dy", "0.35em")
                .attr("stroke", "#F2F5F5")
                .attr("stroke-width", 2)
                .text(axisScale.tickFormat())
                .style("font-size", "12px")
                .clone(true)
                .attr("fill", "#000")
                .attr("stroke", "none")))

    svg.append("g")
        .call(radialAxis);

    updateChart('new_KSEA.csv');

});

// FUNCTION TO UPDATE CHART
function updateChart(csvString) {
    console.log('updateChart: ' + csvString);
    d3.csv(csvString, dataPreprocessor).then(function(dataset) {
        weatherPoints = dataset;


        // ✅ FIND A DATAPOINT FOR EACH MONTH
        monthsText = new Set();
        weatherMonths = weatherPoints.filter(function (d) {
            if (!monthsText.has(d.month)) {
                monthsText.add(d.month);
                return d;
            };
        })
        console.log(weatherMonths);
        console.log(weatherPoints);

        //  CREATING THE GRAPH
        //  🥚 CREATING THE MONTHLY AVERAGE GRAPH

        //  🌟 CREATING BARS       
        bars1 = chartG.selectAll("path")
            .data(weatherMonths)

        //  🌟 ENTER SELECTION AND APPEND NEW GROUPS
        bars1.enter()
            .append("path")
            .attr('class', 'bar')
            .attr("fill", function (d) {
                console.log('bars filled')
                return colorPick(d.month)
            })
            .attr('fill-opacity', '0.4')

            .attr("d", d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(function (d) {
                    return axisScale(d.monthly_historical_avg);
                })
                .startAngle(function (d) {
                    return labelScale(d.month);
                })
                .endAngle(function (d) {
                    return labelScale(d.month) + labelScale.bandwidth();
                })
                .padAngle(0)
                .padRadius(innerRadius))

            bars1.exit().remove()

        //  🥚 CREATING THE DAILY AVERAGE GRAPH
        bars2 = chartG.selectAll("path")
            .data(weatherPoints)


        bars2.enter()
            .append("path")
            .attr("fill", function (d) {
                console.log('bars filled: 2')
                return colorPick(d.month)
            })
            .attr('fill-opacity', '0.7')
            .attr("d", d3.arc()
                .innerRadius(innerRadius)
                .outerRadius(function (d) {
                    return axisScale(d.average_precipitation_x);
                })
                .startAngle(function (d) {
                    return xScale(d.date);
                })
                .endAngle(function (d) {
                    return xScale(d.date) + xScale.bandwidth();
                })
                .padAngle(0.0075)
                .padRadius(innerRadius))
            
            bars2.exit().remove()

    })

}
    // 📝 TO-DO LIST
    // find a good size for the doughnut chart?
    // set 12 different even sections - label by month
    // find the maximum value in the dataset - darkest shade of blue.
    // minimum value set to 0                   - set to white