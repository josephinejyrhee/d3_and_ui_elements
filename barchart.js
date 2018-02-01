// feel free to remove this, it's just to help you make sure you're loading the correct file
console.log('hello world from barchart.js!');

var width = 960,
	height = 500,
	margin = { top: 20, right: 20, bottom: 30, left: 40 };

var svg = d3.select('body').append('svg')
	.attr('width', width)
	.attr('height', height);

// reduce our width and height by our margins
width = width - margin.left - margin.right;
height = height - margin.top - margin.bottom;

var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1),
	yScale = d3.scaleLinear().rangeRound([height, 0]);

//////// NEW CODE ////////
var xAxis = d3.axisBottom(xScale),
	yAxis = d3.axisLeft(yScale).ticks(10, '%');

// create a formatter function for our labels at the top of the bars
var formatter = d3.format('.1%');

// create an svg group element and translate its position from the default origin
var g = svg.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

d3.json('./data/letter_frequency.json', renderChart);

// our function that will set up and draw our chart
// takes an argument "dataset" which is an array of objects
function renderChart(error, dataset) {
	if (error) throw error;

	console.log(dataset);

	xScale.domain(dataset.map(function(d) {
		return d.letter;
	}));

	yScale.domain([0, d3.max(dataset, function(d) { return d.frequency; })]);

	// create the x axis
	g.append('g')
	.attr('class', 'axis axis--x')
	.attr('transform', 'translate(0, ' + height + ')')
	.call(xAxis);

	// create the y axis
	g.append('g')
		.attr('class', 'axis axis--y') // give our x axis group a class of axis axis--y
		.call(yAxis)
		.append('text')
		.attr('transform', 'rotate(-90)')
		.attr('y', 6)
		.attr('dy', '0.71em')
		.attr('text-anchor', 'end')
		.text('Frequency');

	// create svg rectangle elements for each letter / data point
	g.selectAll('.bar')
		.data(dataset)
		.enter().append('rect')
		.attr('class', 'bar')
		.attr('x', function(d) {
			return xScale(d.letter);
		})
		.attr('y', function(d) {
			return yScale(d.frequency);
		})
		.attr('width', xScale.bandwidth())
		.attr('height', function(d) {
			return height - yScale(d.frequency);
		});

	// create labels for the top of each bar
	g.selectAll('.bar-label')
		.data(dataset)
		.enter().append('text')
		.text(function(d) {
		// format labels!!!
			return formatter(d.frequency);
		})
		.attr('class', 'bar-label')
		.attr('x', function(d) {
			return xScale(d.letter);
		})
		.attr('y', function(d) {
			return yScale(d.frequency) - 2;
		});



	var sortOrder = false;
	
	var button = d3.select('body')
		.append('button')
		.text('Sort Bars');

	button.on('click', function() {
		console.log('thanks for clicking');


		var comparator = sortOrder ?
			function(a, b) { return d3.ascending(a.letter, b.letter); }:
			function(a, b) { return b.frequency - a.frequency; };
		var xScaleCopy = xScale.domain(
			dataset.sort(comparator)
			.map(function(d) { return d.letter; })
		)
		.copy(); // add to any scale of d3 where you want to create a new scale that inherits from your existing scale


		var t = d3.transition().duration(750),
		// delay function
			delay = function(d, i) { return i * 50; };

		// selecting all rectangles
		d3.selectAll('.bar')
			.sort(function(a, b){
				return xScaleCopy(a.letter) - xScaleCopy(b.letter);
		});

		t.selectAll('.bar')
			.delay(delay)
			.attr('x', function(d) { return xScaleCopy(d.letter); });

		d3.selectAll('.bar-label')
			.sort(function(a, b) {
				return xScaleCopy(a.letter) - xScaleCopy(b.letter);
			});

		t.selectAll('.bar-label')
			.delay(delay)
			.attr('x', function(d) { return xScaleCopy(d.letter); });

		// using two classes together to select something
		// the more classes you use, the more specific you get
		t.select('.axis.axis--x')
			.call(xAxis)
			.selectAll('g')
			.delay(delay);

		// flip sortOrder boolean
		sortOrder = !sortOrder;


	});

} // end renderChart













