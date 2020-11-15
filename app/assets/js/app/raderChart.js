var ctx = document.getElementById('pfc').getContext('2d');

var DATA_COUNT = 3;

var utils = Samples.utils;

utils.srand(110);

function getLineColor(ctx) {
    return utils.color(ctx.datasetIndex);
}

function alternatePointStyles(ctx) {
    var index = ctx.dataIndex;
    return index % 2 === 0 ? 'circle' : 'rect';
}

function makeHalfAsOpaque(ctx) {
    return utils.transparentize(getLineColor(ctx));
}

function make20PercentOpaque(ctx) {
    return utils.transparentize(getLineColor(ctx), 0.8);
}

function adjustRadiusBasedOnData(ctx) {
    var v = ctx.dataset.data[ctx.dataIndex];
    return v < 10 ? 5
        : v < 25 ? 7
        : v < 50 ? 9
        : v < 75 ? 11
        : 15;
}

function generateData() {
    return utils.numbers({
        count: DATA_COUNT,
        min: 0,
        max: 100
    });
}

var data = {
    labels: [['Protain', 'たんぱく質'], ['Fat', '脂質'], ['Carbohydrate', '炭水化物']],
    datasets: [{
        data: generateData()
    }]
};

var options = {
    legend: false,
    tooltips: true,
    elements: {
        line: {
            backgroundColor: make20PercentOpaque,
            borderColor: getLineColor,
        },
        point: {
            backgroundColor: getLineColor,
            hoverBackgroundColor: makeHalfAsOpaque,
            radius: adjustRadiusBasedOnData,
            pointStyle: alternatePointStyles,
            hoverRadius: 15,
        }
    }
};


var chart = new Chart('pfc', {
    type: 'radar',
    data: data,
    options: options
});


// eslint-disable-next-line no-unused-vars
function addDataset() {
    chart.data.datasets.push({
        data: generateData()
    });
    chart.update();
}

// eslint-disable-next-line no-unused-vars
function randomize() {
    chart.data.datasets.forEach(function(dataset) {
        dataset.data = generateData();
    });
    chart.update();
}

// eslint-disable-next-line no-unused-vars
function removeDataset() {
    chart.data.datasets.shift();
    chart.update();
}


window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};

(function(global) {
	var MONTHS = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	var COLORS = [
		'#4dc9f6',
		'#f67019',
		'#f53794',
		'#537bc4',
		'#acc236',
		'#166a8f',
		'#00a950',
		'#58595b',
		'#8549ba'
	];

	var Samples = global.Samples || (global.Samples = {});
	var Color = global.Color;

	Samples.utils = {
		// Adapted from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
		srand: function(seed) {
			this._seed = seed;
		},

		rand: function(min, max) {
			var seed = this._seed;
			min = min === undefined ? 0 : min;
			max = max === undefined ? 1 : max;
			this._seed = (seed * 9301 + 49297) % 233280;
			return min + (this._seed / 233280) * (max - min);
		},

		numbers: function(config) {
			var cfg = config || {};
			var min = cfg.min || 0;
			var max = cfg.max || 1;
			var from = cfg.from || [];
			var count = cfg.count || 8;
			var decimals = cfg.decimals || 8;
			var continuity = cfg.continuity || 1;
			var dfactor = Math.pow(10, decimals) || 0;
			var data = [];
			var i, value;

			for (i = 0; i < count; ++i) {
				value = (from[i] || 0) + this.rand(min, max);
				if (this.rand() <= continuity) {
					data.push(Math.round(dfactor * value) / dfactor);
				} else {
					data.push(null);
				}
			}

			return data;
		},

		labels: function(config) {
			var cfg = config || {};
			var min = cfg.min || 0;
			var max = cfg.max || 100;
			var count = cfg.count || 8;
			var step = (max - min) / count;
			var decimals = cfg.decimals || 8;
			var dfactor = Math.pow(10, decimals) || 0;
			var prefix = cfg.prefix || '';
			var values = [];
			var i;

			for (i = min; i < max; i += step) {
				values.push(prefix + Math.round(dfactor * i) / dfactor);
			}

			return values;
		},

		months: function(config) {
			var cfg = config || {};
			var count = cfg.count || 12;
			var section = cfg.section;
			var values = [];
			var i, value;

			for (i = 0; i < count; ++i) {
				value = MONTHS[Math.ceil(i) % 12];
				values.push(value.substring(0, section));
			}

			return values;
		},

		color: function(index) {
			return COLORS[index % COLORS.length];
		},

		transparentize: function(color, opacity) {
			var alpha = opacity === undefined ? 0.5 : 1 - opacity;
			return Color(color).alpha(alpha).rgbString();
		}
	};

	// DEPRECATED
	window.randomScalingFactor = function() {
		return Math.round(Samples.utils.rand(-100, 100));
	};

	// INITIALIZATION

	Samples.utils.srand(Date.now());

	// Google Analytics
	/* eslint-disable */
	if (document.location.hostname.match(/^(www\.)?chartjs\.org$/)) {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		ga('create', 'UA-28909194-3', 'auto');
		ga('send', 'pageview');
	}
	/* eslint-enable */

}(this));
