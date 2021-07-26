/* main Martin P. Goettl, 2021 */

 //execute script when window is loaded
 
window.onload = function(){

    //SVG dimension variables
    var w = 900, h = 500;


	
    //Example 1.5 line 1...container block
    var container = d3.select("body") //get the <body> element from the DOM
        .append("svg") //put a new svg in the body
        .attr("width", w) //assign the width
        .attr("height", h) //assign the height
        .attr("class", "container") //assign a class name
        .style("background-color", "rgba(0,0,0,0.2)"); //svg background color

     //Example 1.8 line 1...innerRect block
    var innerRect = container.append("rect")
        .datum(400) //a single value is a DATUM
        .attr("width", function(d){ //rectangle width
            return d * 2; //400 * 2 = 800
        })
        .attr("height", function(d){ //rectangle height
            return d; //400
        })
        .attr("class", "innerRect") //class name
        .attr("x", 50) //position from left on the x (horizontal) axis
        .attr("y", 50) //position from top on the y (vertical) axis
        .style("fill", "#FFFFFF"); //fill color

	var cityPop = [
        { 
            city: 'Madison',
            population: 233209
        },
        {
            city: 'Milwaukee',
            population: 594833
        },
        {
            city: 'Green Bay',
            population: 104057
        },
        {
            city: 'Superior',
            population: 27244
        },
    ];
	
	//define the min value of cityPop data
	//this will be used in the linear scaling
	var minPop = d3.min(cityPop, function(d){
		return d.population;
	});
	
	//define the max value of cityPop data
	//this will be used in the linear scaling
	var maxPop = d3.max(cityPop, function(d){
		return d.population;
	});
	
	//a generator, custom function that will scale data along y axis
	var y = d3.scale.linear()
		//set range and domain as constraints to data
		.range([495, 95])
		.domain([0, 900000]);

	//a generator, a custom function that will place data along particular range
	var x = d3.scale.linear()
		.range([120,810])
		.domain([0, 3]);
	
	//a generator, a custom function that will color data circles based on their linear relationship
	var color = d3.scale.linear()
		//colors reflect attribute values, think unclassed choropleth/proportional symbols
		//set beginning and end hues, color values with mix between the two
		.range(["#FFF", "#542d44"])
		//set domain to minimum value and maximum population value
		.domain([minPop, maxPop]);
		
	//create new svg element for the scale
	var yAxis = d3.svg.axis()
		.scale(y)
		//position to bottom left corner
		.orient("left")
		
	//add new svg element to the container element
	var axis = container.append("g")
		//assign class name that's the same as variable name
		.attr("class", "axis")
		//use transform to adjust/displace the axis svg element
		.attr("transform", "translate(50,0)")
		.call(yAxis);
		
	//add text element to the container
	var title = container.append("text")
		//assign class name that's the same as variable name
		.attr("class", "title")
		//anchor text and center title
		.attr("text-anchor", "middle")
		//assign placement
		.attr("x", 450)
		.attr("y", 30)
		//assign string in text element
		.text("West Coast City Populations");
	
	//use selectAll to work on more than one element, in this case 4 labels
	var labels = container.selectAll(".labels")
		//access/call cityPop data (the array defined above)
		.data(cityPop)
		//magical enter, essentially is a loop through array?
		.enter()
		//add text
		.append("text")
		//assign class name that's the same as variable name
		.attr("class", "labels")
		//anchor and align text
		.attr("text-anchor", "left")
		//adjust placement of text element to the right of circle symbol
		.attr("x", function(d,i){
			return x(i) + Math.sqrt(d.population * 0.01 / Math.PI) + 5;
		})
		.attr("y", function(d){
			return y(d.population) + 5;
		})

	//create two lines of text instead of adjusting the leading between lines
	//this is a shortcut to Botsick's more complicated method
	//create the first line of text and add to label elements
	var nameLine = labels.append("tspan")
		//assign class name that's the same as variable
		.attr("class", "nameLine")
		//adjust placement
		.attr("x", function(d, i){
			//position labels to the right of the circles
			return x(i) + Math.sqrt(d.population * 0.01 / Math.PI) + 5;
		})
		//add text string that calls city name
		.text(function(d){
			return d.city;
		});
		
	//format method that will add a comma to long numbers
	var format = d3.format(",");
	
	//create the second line of text and add to label elements
	var popLine = labels.append("tspan")
		//assign class name that's the same as variable
		.attr("class", "popLine")
		//adjust placement
		.attr("x", function(d, i){
			//position labels to the right of the circles
			return x(i) + Math.sqrt(d.population * 0.01 / Math.PI) + 5;
		})
		//adjust vertical offset
		.attr("dy", "15")
		//add text string that calls city population infomration
		.text(function(d){
			return "Pop. " + format(d.population);
		});

    //Example 2.6 line 3
    var circles = container.selectAll(".circles") //create an empty selection
        .data(cityPop) //here we feed in an array
        .enter() //one of the great mysteries of the universe
        .append("circle") //inspect the HTML--holy crap, there's some circles there
        .attr("class", "circles")
        .attr("id", function(d){
            return d.city;
        })
        .attr("r", function(d){
            //calculate the radius based on population value as circle area
            var area = d.population * 0.01;
            return Math.sqrt(area/Math.PI);
        })
        .attr("cx", function(d, i){
            //use the index to place each circle horizontally
            return 90 + (i * 180);
        })
        .attr("cy", function(d){
            //subtract value from 450 to "grow" circles up from the bottom instead of down from the top of the SVG
            return 450 - (d.population * 0.0005);
        });
}


