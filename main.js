// irene hu
// this is the main js file for the precipitation viz.

function onDefault() {
    console.log('filler code');
}

// 📝 svg
var svg = d3.select('svg');

// 📝 please remember to append any graph elements to chartG!
//      chartG appended to svg above.
var chartG = svg.append('g')


d3.csv('Weather Data/KSEA.csv').then(function (dataset){
    // ⭐ javascript code here!
    


    // 📝 TO-DO LIST
    // find a good size for the doughnut chart?
    // set 12 different even sections - label by month
    // find the maximum value in the dataset - darkest shade of blue.
    // minimum value set to 0                   - set to white
})


