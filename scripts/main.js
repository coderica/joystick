var inner = $('#inner');
var outer = $('#outer');
var circles = $('#circle');
var dot = $('#dot');
var nudgerContainer = $('.nudgers');
var nudger = $('.nudger');
var outerRadius = outer.width()/2;
var innerRadius = inner.width()/2;
var wBound = $(document).width() - dot.width();
var hBound = $(document).height() - dot.height();
var center, drag;

$(window).on('load', function(){
	$(document).on('press', showJoystick);
	$(document).on('mousemove', dragJoystick);
	$(document).on('mouseup touchend', hideJoystick);
	nudger.on('click', nudge);
})

function showJoystick(e) {
	showCircles(e.x, e.y);
	showNudgers(true);
	center = [outer.position().left + outerRadius, outer.position().top + outerRadius];
	drag = true;
}

function showCircles(x, y) {
	outer.css('left', x - outerRadius);
	outer.css('top', y - outerRadius);
	inner.css('left', x - innerRadius);
	inner.css('top', y - innerRadius);

	inner.fadeIn(100);
	outer.fadeIn(100);
}

function dragJoystick(e) {
	if (drag == true) {
		var bounds = limit(e.clientX, e.clientY);
		inner.css('left', bounds.x - innerRadius);
		inner.css('top', bounds.y - innerRadius);
	}
}

function limit(x, y) {
    var dist = distance([x, y], center)+10;
    if (dist < outerRadius) {
    	joystickColor('#cc6f7f','#ab0f2a')
		showNudgers(true);
        return {x: x, y: y};
    } else {
        x = x - center[0];
        y = y - center[1];
        var radians = Math.atan2(y, x)
        dotPos(x, y);
		joystickColor('#66b2ff','#0080ff');
		showNudgers(false);
       return {
           x: Math.cos(radians) * (outerRadius-10) + center[0],
           y: Math.sin(radians) * (outerRadius-10) + center[1]
       }
    } 
}

function distance(point1, point2) {
    var x1 = point1[0],
        y1 = point1[1],
        x2 = point2[0],
        y2 = point2[1];
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function joystickColor(color1, color2) {
	var color = outer.css('background-color');
	if (rgb2hex(color) != color1) {
		outer.css('background-color', color1);
		inner.css('background-color', color2);
	}
}

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function hideJoystick(e) {
	drag = false;
	inner.fadeOut(200);
	outer.fadeOut(200);
	showNudgers(false);
}

function dotPos(left, top) {
	var l = dot.position().left + left/10;
	var t = dot.position().top + top/10;
	if (( 0 < l && l < wBound ) && ( 0 < t && t < hBound )) {
		dot.css('left', l);
		dot.css('top', t);
	}
}

function showNudgers(bool) {
	if (bool) {
		var left = outer.position().left + outerRadius;
		var top = outer.position().top + outerRadius;
		var width = nudgerContainer.width()/2;
		nudgerContainer.css('left', left - width);
		nudgerContainer.css('top', top - 5);
		nudgerContainer.fadeIn(100);
	} else {
		nudgerContainer.fadeOut(100);
	}
}

function nudge(e) {
	if (e.target.id == 'left') {
		dot.width(dot.width()-1).height(dot.height()-1);
	} else {
		dot.width(dot.width()+1).height(dot.height()+1);
	}
}