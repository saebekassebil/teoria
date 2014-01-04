var SVGNS = 'http://www.w3.org/2000/svg';

function merge(obj1, obj2) {
  var obj3 = {}, attr;
  for (attr in obj1) { obj3[attr] = obj1[attr]; }
  for (attr in obj2) { obj3[attr] = obj2[attr]; }

  return obj3;
}

function sample(from, to, count, fn) {
  var step = (to - from) / count;
  var samples = [];
  for (var i = 0; i < count; i++) {
    samples.push([from + step * i, fn(from + step * i)]);
  }

  return samples;
}

function waveLambda(fq) {
  return function(x) {
    return Math.sin(fq * (2 * Math.PI * x));
  }
}

function plotFunction(fn, options) {
  var samples = options.samples;
  var from = options.from;
  var to = options.to;
  var xtrans = options.translate ? options.translate.x : 0;
  var ytrans = options.translate ? options.translate.y : 0;
  var xscale = options.scale ? options.scale.x : 0;
  var yscale = options.scale ? options.scale.y : 0;
  var color = options.color ? options.color : '#006ae0';
  var width = options.width ? options.width : 1.5;
  var opacity = options.opacity ? options.opacity : 1;
  var line = '';

  var path = document.createElementNS(SVGNS, 'path');
  path.setAttribute('style', 'opacity:' + opacity);
  path.setAttribute('stroke', color);
  path.setAttribute('stroke-width', width);
  path.setAttribute('fill', 'none');

  var samples = sample(from, to, samples, fn);

  line = 'M ' + (samples[0][0] * xscale + xtrans) + ' ' +
    (samples[0][1] * yscale + ytrans);

  samples.slice(1).forEach(function(sample) {
    line += ' L ' + (sample[0] * xscale + xtrans) + ' ' +
      (sample[1] * yscale + ytrans);
  });

  path.setAttribute('d', line);
  return path;
}

function plotChord(chord, options) {
  var fqs = [];
  var colors = options.colors || ['#006ae0', '#ff0000', '#ff8f00'];
  var chordColor = options.chordColor || colors[colors.length - 1];
  var plot = options.plot;
  var panel = options.panel;

  // plot the notes
  chord.notes().forEach(function(n, i) {
    // Push the wave lambda to the sum stack
    fqs.push(waveLambda(n.fq()));

    // Plot the function
    var path = plotFunction(fqs[fqs.length - 1], merge(options, {
      color: colors[i % colors.length]
    }));

    // Add the note to the panel
    var li = document.createElement('li');
    li.style.borderLeft = '3px solid ' + colors[i % colors.length];
    li.style.opacity = options.opacity || 1;
    li.textContent = n + ' ~ ' + Math.round(n.fq() * 100) / 100 + 'hz';
    panel.appendChild(li);

    (function(path, item) {
      function over() {
        path.style.opacity = item.style.opacity = 1;
      }

      function out() {
        path.style.opacity = item.style.opacity = options.opacity;
      }
      path.addEventListener('mouseover', over, false);
      item.addEventListener('mouseover', over, false);
      path.addEventListener('mouseout', out, false);
      item.addEventListener('mouseout', out, false);
    })(path, li);

    // Append the path
    plot.appendChild(path);
  });

  // plot the chord wave
  var chord = plotFunction(function(x) {
    return fqs.reduce(function(a, b) { return a + b(x); }, 0);
  }, merge(options, { color: chordColor, opacity: 1, width: 2 }));
  plot.appendChild(chord);
}

function purge(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

function inputChanged() {
  if (!this.value) return;

  try {
    var chord = teoria.chord(this.value);
    purge(g);
    purge(panel);
    plotChord(chord, options);
  } catch (e) {
    console.warn(e.toString());
  }
}

var input = document.getElementById('chordinput');
var plot = document.getElementById('plot');
var g = document.createElementNS(SVGNS, 'g');
plot.appendChild(g);
var panel = document.getElementById('panel');
var options = {
  from: -0.030,
  to: 0.030,
  samples: 1800,
  translate: {
    x: 0,
    y: 150
  },
  scale: {
    x: 100000,
    y: 50
  },
  opacity: 0.3,
  plot: g,
  panel: panel,
  chordColor: '#1693a5',
  colors: ['#006ae0', '#ff0000', '#ff8f00', '#009a0a', '#23d8d8',
           '#fed600', '#cdff00']
};

var mouseDown, origo = {x: 0, y: 0};
plot.addEventListener('mousedown', function(e) {
  mouseDown = {x: e.pageX, y: e.pageY};
}, false);

plot.addEventListener('mouseup', function(e) {
  origo.x = origo.x + (e.pageX - mouseDown.x);
  origo.y = origo.y + (e.pageY - mouseDown.y);
  mouseDown = null;
}, false);

plot.addEventListener('mousemove', function(e) {
  if (!mouseDown) return;

  var x = origo.x + e.pageX - mouseDown.x;
  var y = origo.y + e.pageY - mouseDown.y;
  g.setAttribute('transform', 'translate(' + x + ',' + y + ')');
}, false);

// Draw chord, when ready
input.addEventListener('change', inputChanged, false);
inputChanged.call(input);

