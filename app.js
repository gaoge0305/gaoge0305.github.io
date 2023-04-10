function final_project(){
    var filePath="data.csv";
    plot1(filePath);
    plot2(filePath);
    plot3(filePath);
    plot4(filePath);
    plot5(filePath);
}

var plot1=function(filePath){
    d3.csv(filePath).then(function(data){
        let svgwidth = 700;
        let svgheight = 600;
        let padding = 60;   
        const xScale = d3.scaleLinear()
                 .domain([0, d3.max(data, d => Number(d['Visibility(mi)']))])
                 .range([padding, svgwidth - padding]);

        const yScale = d3.scaleLinear()
                        .domain([0, d3.max(data, d => d.Severity)])
                        .range([svgheight - padding, padding]);

        

        const svg = d3.select("#q1_plot").append("svg")
            .attr("width", svgwidth)
            .attr("height", svgheight);

        // Append the circles to the SVG element
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(Number(d['Visibility(mi)'])))
            .attr("cy", d => yScale(d.Severity))
            .attr("r", 4)
            .style("fill", "lightskyblue")
            .style("stroke", "black")
            .style("stroke-width", 1);
            
        const xAxis = svg.append("g")
            .attr("class", "myXaxis")
            .attr("transform", "translate(0," + (svgheight - padding) + ")")
            .call(d3.axisBottom(xScale));
        

        svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .call(d3.axisLeft(yScale));
        
        // Add x axis title
        svg.append("text")
        .attr("class", "axis-title")
        .attr("transform", `translate(${svgwidth/2}, ${svgheight - padding/5})`)
        .style("text-anchor", "middle")
        .text("Visibility(mi)");

        // Add y axis title
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -svgheight/2)
            .attr("y", padding/1.1)
            .attr("dy", "-2em")
            .style("text-anchor", "middle")
            .text("Severity");

        // Add plot title
        svg.append("text")
        .attr("class", "plot-title")
        .attr("transform", `translate(${svgwidth/2}, ${padding/3})`)
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Visibility VS Severity");

        // A function that update the plot for a given xlim value
        function updatePlot() {

            // Get the value of the button
            xlim = this.value

            // Update X axis
            xScale.domain([0,xlim])
            xAxis.transition().duration(1000).call(d3.axisBottom(xScale))

            // Update chart
            svg.selectAll("circle")
            .data(data)
            .transition()
            .duration(1000)
            .attr("cx", d => xScale(Number(d['Visibility(mi)'])))
            .attr("cy", d => yScale(d.Severity))
        }

        // Add an event listener to the button created in the html part
        d3.select("#buttonXlim").on("input", updatePlot )
        
    });
 }
// //
var plot2=function(filePath){
    d3.csv(filePath).then(function(data){
        data.forEach(function(d) {
            var startYear = new Date(d.Start_Time).getFullYear(); 
            d.Start_Time = startYear.toString();
          });
        var eachyear = d3.rollup(data, v => v.length, d => d.Start_Time)
        var filArray = [];
            eachyear.forEach((value, key) => {
                var obj = {
                        year: key,
                        number: value
                    };
                    filArray.push(obj);
                
            });

        filArray.sort((a, b) => d3.ascending(a.year, b.year));
        var margin = {top: 40, right: 20, bottom: 40, left: 80};
        var svgheight = 600;
        var svgwidth = 600;
        var width = svgwidth - margin.left - margin.right;
        var height = svgheight - margin.top - margin.bottom;

        var xScale = d3.scaleBand()
        .domain(filArray.map(function(d) { return d.year; }))
        .range([0, width])
        .padding(0.1);

        var yScale = d3.scaleLinear()
        .domain([0, d3.max(filArray, d => Number(d.number))])
        .range([height, 0]);

        var xAxis = d3.axisBottom(xScale)           
        var yAxis = d3.axisLeft(yScale);

        var svg = d3.select("#q2_plot").append("svg")
        .attr("width", svgwidth)
        .attr("height", svgheight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll('text')

        svg.append("g")
        .call(yAxis);
        
        const colorScale = d3.scaleSequential()
        .interpolator(d3.interpolateGreens)
        .domain([0, d3.max(filArray, d => d.number)]);

        svg.selectAll(".bar")
        .data(filArray)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(d.number))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.number))
        .style("fill", d => colorScale(d.number));


        const changecolors = function(){
            const colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateReds)
            .domain([0, d3.max(filArray, d => d.number)]);

            svg.selectAll('.bar')
            .transition()
            .duration(2000)
            .style("fill", d => colorScale(d.number))
        }


		
		d3.select('#color_button')
        .on('click', function(){
            changecolors();
        }); 

        const changecolors2 = function(){
            const colorScale = d3.scaleSequential()
            .interpolator(d3.interpolatePurples)
            .domain([0, d3.max(filArray, d => d.number)]);

            svg.selectAll('.bar')
            .transition()
            .duration(2000)
            .style("fill", d => colorScale(d.number))
        }


		d3.select('#color_button2')
        .on('click', function(){
            changecolors2();
        });

        // Add x axis label
        svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", height + margin.bottom - 5)
        .text("Year");

        // Add y axis label
        svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", -height/2)
        .attr("y", -margin.left + 15)
        .attr("transform", "rotate(-90)")
        .text("Number of accidents");

        // Add plot title
        svg.append("text")
        .attr("class", "plot-title")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", -margin.top + 15)
        .text("Number of Accidents for Each Year from 2016-2020")
        .attr("text-anchor", "middle")
        .attr("font-size", "20px")
    });
}

var plot3=function(filePath){
    d3.csv(filePath).then(function(data){
        var serGroup = d3.rollup(data, v => v.length, d => d.Severity, d => d['Sunrise_Sunset'])

        var serArray = [];
        serGroup.forEach(function(value, key) {
            var serObject = { Severity: key };
            value.forEach(function(value, key) {
                serObject[key] = value;
            });
            serArray.push(serObject);
        });
        serArray.sort((a, b) => d3.ascending(a.Severity, b.Severity));

        var series =  d3.stack().keys(["Day", "Night"])
        var stacked = series(serArray)
        var svgheight = 500;
        var svgwidth = 700;
        var padding = 80;
        var colors = ["orange", "midnightblue"]

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(serArray, function(d){ 
            return Number(d.Day) + Number(d.Night);
            })])
            .range([svgheight-padding, padding]);


        var xScale = d3.scaleBand()
            .domain(serArray.map(function(d) { return d.Severity; }))
            .range([padding, svgwidth-padding])
            .padding(0.05);

        var svg = d3.select("#q3_plot").append("svg")
            .attr("height", svgheight)
            .attr("width", svgwidth);

        var yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + padding + ", 0)")
            .call(yAxis);

        var xAxis = d3.axisBottom(xScale);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (svgheight - padding) + ")")
            .call(xAxis)
            .selectAll("text")

        var groups = svg.selectAll(".gbars")
            .data(stacked).enter().append("g")
            .attr("class","gbars")
            .style("fill", function(d, i) { return colors[i]; });
                
        var rects = groups.selectAll("rect")
            .data(function(d){
                return d;
            }).enter().append("rect")
            .attr("x", function(d,i){
                return xScale(serArray[i].Severity)
            }) 
            .attr("y", function(d) {
                return yScale(d[1])
            })
            .attr("height", function(d) {
                return yScale(d[0]) - yScale(d[1])
            })
            .attr("width", xScale.bandwidth());
        
        svg.append("text")
            .attr("x", svgwidth/2)
            .attr("y", padding/2)
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .text("Numer of accidents of Each Severity Level During Day and Night");
        svg.append("text")
            .attr("transform", "translate(" + (svgwidth/2) + " ," + (svgheight - padding/2) + ")")
            .style("text-anchor", "middle")
            .text("Severity");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -svgheight/2)
            .attr("y", padding/1.5)
            .attr("dy", "-2em")
            .style("text-anchor", "middle")
            .text("Number of accidents");

        var legend = svg.selectAll(".legend")
            .data(series.keys())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
        
        legend.append("rect")
            .attr("x", svgwidth - padding)
            .attr("y", 70)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d, i) { return colors[i]; });
        
        legend.append("text")
            .attr("x", svgwidth - padding - 5)
            .attr("y", 80)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

     });
    
 }

var plot4=function(filePath){
    d3.csv(filePath).then(function(data){
        var salebystate = d3.rollup(data, v => v.length, d => d.State)

        var salesValues = Array.from(salebystate.values());
        var logScale = d3.scaleLog().domain([d3.min(salesValues), d3.max(salesValues)]).range([0, 1]);
        var salebystateraw = new Map();
        for (let [key, value] of salebystate) {
            salebystateraw.set(key, value);
        }
        console.log(salebystateraw)
        var salebystateNormalized = new Map();
        for (let [key, value] of salebystate) {
            salebystateNormalized.set(key, logScale(value));
        }

        var width = 1000;
        var height = 800;
        var margin=50;
        var svg1 = d3.select("#q4_plot")
            .append("svg").attr("width", width)
            .attr("height", height);

        var Tooltip = d3
            .select("#q1_plot")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip");
        const projection1  = d3.geoAlbersUsa().scale(1000).translate([width / 2, height / 2]); 
        const pathgeo1 = d3.geoPath().projection(projection1)
        const statesmap = d3.json('us-states.json')
            statesmap.then(function (map) {
                var colorScale = d3.scaleSequential(["lightblue","darkblue"]).domain([0, 1]); // 
                // Draw the map and color the states based on their sales data
                svg1.selectAll('path')
                    .data(map.features)
                    .enter().append('path')
                    .attr('d', pathgeo1)
                    .style('fill', function(d) {
                        // Get the normalized value for this state from salebystateNormalized
                        var normalizedValue = salebystateNormalized.get(d.properties.name);
                        // Use the color scale to convert the normalized value to a color
                        var color = colorScale(normalizedValue);
                        // Return the color for this state
                        return color;
                    })
                    .style('stroke', 'black')
                    .style('stroke-width', 0.5)
                    .on("mouseover", function (e, d) {
                        Tooltip.transition().duration(50).style("opacity", 0.9);
                        //create method chain for tooltip
                        d3.select(this)
                          .style("stroke", "black")
                          .style("stroke-width", 3)
                          .style("opacity", 1);
                          
                        Tooltip.html(d.properties.name + ": " + salebystateraw.get(d.properties.name))
                            .style("left", e.pageX+ 20+ "px")
                            .style("top", e.pageY+ 20 + "px")
                      })
                      .on("mousemove", function (e, d) {
                        pos = d3.pointer(e)
                        Tooltip
                            .style("left", e.pageX + 20 + "px")
                            .style("top", e.pageY + 20 + "px")
                      })
                      .on("mouseout", function (e, d) {
                        //create method chain for tooltip
                        Tooltip.style("opacity", 0);
                        d3.select(this).style("stroke", "black").style("stroke-width", 0);
                      });
                    
                // Define the legend
                var legend = svg1.append("g")
                .attr("transform", "translate(" + (width - margin-20) + "," + margin + ")");

                // Add a title to the chart
                svg1.append("text")
                .attr("x", width / 2)
                .attr("y", margin)
                .attr("text-anchor", "middle")
                .style("font-size", "24px")
                .text("Number of Accidents in U.S. by States From 2016-2020");


                legend.append("text")
                .attr("x", -10)
                .attr("y", -20)
                .text("Accidents");

                legend.append("text")
                    .attr("x", 25)
                    .attr("y", 200)
                    .text(d3.min(salesValues));

                legend.append("text")
                    .attr("x", 25)
                    .attr("y", 5)
                    .text(d3.max(salesValues));

                var legendGradient = legend.append("defs")
                .append("linearGradient")
                .attr("id", "gradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%");

                legendGradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "darkblue");

                legendGradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "lightblue");

                legend.append("rect")
                .attr("width", 20)
                .attr("height", 200)
                .style("fill", "url(#gradient)");

                    })
    });
}

var plot5=function(filePath){
    d3.csv(filePath).then(function(data){
        // set the dimensions and margins of the graph
        var margin = {top: 50, right: 30, bottom: 50, left: 40},
        width = 800 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#q5_plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
        
        let data_sorted = Array.from(data.map(d => Number(d["Wind_Speed(mph)"])))
        data_sorted.sort(d3.ascending);
        
        // Compute summary statistics used for the box:
        var q1 = d3.quantile(data_sorted, .25)
        var median = d3.quantile(data_sorted, .5)
        var q3 = d3.quantile(data_sorted, .75)
        var interQuantileRange = q3 - q1
        var min = q1 - 1.5 * interQuantileRange
        var max = q1 + 1.5 * interQuantileRange
        
        // Identify outliers
        function isOutlier(d) {
            return d < min || d > max;
        }
        var outliers = data_sorted.filter(isOutlier);
        
        // Show the Y scale
        var y = d3.scaleLinear()
            .domain([min, d3.max(data_sorted)])
            .range([height, 0]);
        
        var y_axis = d3.axisLeft(y);
        svg.append("g")
            .attr('transform', `translate(${margin.left},0)`)
            .attr("class","y_axis")
            .call(y_axis)
            .append("text")
            .attr("dx", "-.1em")
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
        svg.append("text")
            .attr("class", "axis-title")
            .attr("transform", `rotate(-90) translate(${-height/2}, ${-margin.left/2})`)
            .style("text-anchor", "middle")
            .text("Wind Speed(MPH)");

        svg.append("text")
            .attr("class", "plot-title")
            .attr("transform", `translate(${width/2}, ${margin.top-80})`)
            .style("text-anchor", "middle")
            .style("font-size", "20px")
            .text("Range of Wind Speed");
        

        // a few features for the box
        var center = 200
        var width = 100
        
        // Show the main vertical line
        svg.append("line")
            .attr("class", "line")
            .attr("x1", center)
            .attr("x2", center)
            .attr("y1", y(min))
            .attr("y2", y(max))
            .attr("stroke", "black")
        
        // Show the box
        svg.append("rect")
            .attr("x", center - width / 2)
            .attr("y", y(q3))
            .attr("height", y(q1) - y(q3))
            .attr("width", width)
            .attr("stroke", "black")
            .style("fill", "#69b3a2")
        
        // Show median, min and max horizontal lines
        svg.selectAll("toto")
            .data([min, median, max])
            .enter()
            .append("line")
            .attr("x1", center - width / 2)
            .attr("x2", center + width / 2)
            .attr("y1", function (d) { return (y(d)) })
            .attr("y2", function (d) { return (y(d)) })
            .attr("stroke", "black")
        
        // Show outliers
        svg.selectAll("circle")
            .data(outliers)
            .enter()
            .append("circle")
            .attr("cx", center)
            .attr("cy", function (d) { return y(d); })
            .attr("r", 3)
            .attr("stroke", "black")
            .style("fill", "#e8c1a0");

        d3.select("#hide-outliers-btn").on("click", function() {
            var outlierCircles = svg.selectAll("circle");
            var isHidden = outlierCircles.style("display") === "none";
            outlierCircles.style("display", isHidden ? "block" : "none");
            });
    });
}