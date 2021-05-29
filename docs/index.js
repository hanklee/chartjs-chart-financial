var barCount = 60;
var initialDateStr = '01 Apr 2017 00:00 Z';

var ctx = document.getElementById('chart').getContext('2d');
ctx.canvas.width = 1000;
ctx.canvas.height = 250;
const tmp = getRandomData(initialDateStr, barCount);
var chart = new Chart(ctx, {
	type: 'candlestick',
	data: {
		datasets: [{
			label: 'CHRT - Chart.js Corporation',
			data: tmp.data,
			order: 1,
			// borderColor: '#cc65fe',ffce56
		},
		{
			label: 'EMA',
			data: tmp.data2,
			type: 'line',
			// this dataset is drawn on top
			order: 2,
			borderColor: '#36a2eb',
			borderWidth: 1,
		},
		{
			label: 'EMA2',
			data: tmp.data3,
			type: 'line',
			// borderColor: '#ff6384',
			borderColor: '#ffce56',
			borderWidth: 1,
			// this dataset is drawn on top
			order: 3
		}
	]
	}
});

console.log(chart.data);

var getRandomInt = function(max) {
	return Math.floor(Math.random() * Math.floor(max));
};

function randomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

function randomBar(date, lastClose) {
	var open = +randomNumber(lastClose * 0.95, lastClose * 1.05).toFixed(2);
	var close = +randomNumber(open * 0.95, open * 1.05).toFixed(2);
	var high = +randomNumber(Math.max(open, close), Math.max(open, close) * 1.1).toFixed(2);
	var low = +randomNumber(Math.min(open, close) * 0.9, Math.min(open, close)).toFixed(2);
	return {
		x: date.valueOf(),
		open,
		high,
		low,
		close,
		volume: 1000,
	};

}

function getRandomData(dateStr, count) {
	var date = luxon.DateTime.fromRFC2822(dateStr);
	var data = [randomBar(date, 30)];
	var data2 = [{x:data[data.length - 1].x, y:data[data.length - 1].high}];
	var data3 = [{x:data[data.length - 1].x, y:data[data.length - 1].low}];
	while (data.length < count) {
		date = date.plus({days: 1});
		if (date.weekday <= 5) {
			data.push(randomBar(date, data[data.length - 1].close));
			data2.push({x:data[data.length - 1].x, y:data[data.length - 1].high});
			data3.push({x:data[data.length - 1].x, y:data[data.length - 1].low});
		}
	}
	return {data,data2,data3};
}

var update = function() {
	var dataset = chart.config.data.datasets[0];

	// candlestick vs ohlc
	var type = document.getElementById('type').value;
	dataset.type = type;

	// linear vs log
	var scaleType = document.getElementById('scale-type').value;
	chart.config.options.scales.y.type = scaleType;

	// color
	var colorScheme = document.getElementById('color-scheme').value;
	if (colorScheme === 'neon') {
		dataset.color = {
			up: '#01ff01',
			down: '#fe0000',
			unchanged: '#999',
		};
	} else {
		delete dataset.color;
	}

	// border
	var border = document.getElementById('border').value;
	var defaultOpts = Chart.defaults.elements[type];
	if (border === 'true') {
		dataset.borderColor = defaultOpts.borderColor;
	} else {
		dataset.borderColor = {
			up: defaultOpts.color.up,
			down: defaultOpts.color.down,
			unchanged: defaultOpts.color.up
		};
	}

	chart.update();
};

document.getElementById('update').addEventListener('click', update);

document.getElementById('randomizeData').addEventListener('click', function() {
	const tmp2 = getRandomData(initialDateStr, barCount);
	chart.data.datasets.forEach(function(dataset) {	
		if (dataset.order === 2) {
			dataset.data = tmp2.data2;
		} else if (dataset.order === 3) {
			dataset.data = tmp2.data3;
		} else {
			dataset.data = tmp2.data;
		}	
		
	});
	update();
});
