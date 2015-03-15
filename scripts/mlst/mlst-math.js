(function(global){
    'use strict';
    var filterAboveOutsideDeviation = function(values, deviationMultip) {
        var deviMultplier = deviationMultip || 1.645;
        var validValues = [];
        values.map(function(el) {
            var parsed = parseInt(el);
            if (parsed && parsed > 0) {
                validValues.push(parsed);
            }
        });
        var standDev = standDeviat(validValues);
        var standDevToUse = {
            min: standDev.min * (deviMultplier * -1),
            max: standDev.max * deviMultplier
        };
        var outsideSD = [];
        validValues.map(function(el) {
            if (el >= standDevToUse.max) {
                outsideSD.push(el);
            }
        })
        return outsideSD;
    }

    var standDeviat = function(values) {
        var avg = function(vals) {
            return vals.reduce(function(a, b) {
                return a + b;
            }) / vals.length;
        }
        var mean = avg(values);
        var squaredDiff = values.map(function(el) {
            return Math.pow(el - mean, 2);
        });
        var avgOfSquaredDiff = avg(squaredDiff);
        var standDev = Math.sqrt(avgOfSquaredDiff);
        return {
            min: mean - standDev,
            max: mean + standDev
        };
    }

    function makeCircle(center, radius, detailLevelInDegree) {
        var circle = [],
            detailLevelInDegree = detailLevelInDegree || 1,
            d = radius / 6378.8;

        var yRad = (Math.PI / 180) * center.y;
        var xRad = (Math.PI / 180) * center.x;

        for (var a = 1; a <= 360; a += detailLevelInDegree) {
            var tc = (Math.PI / 180) * (a + 180);
            var y = Math.asin(Math.sin(yRad) * Math.cos(d) + Math.cos(yRad) * Math.sin(d) * Math.cos(tc));
            var dlng = Math.atan2(Math.sin(tc) * Math.sin(d) * Math.cos(yRad), Math.cos(d) - Math.sin(yRad) * Math.sin(y));
            var x = ((xRad - dlng + Math.PI) % (2 * Math.PI)) - Math.PI;
            var resultY = parseFloat(y * (180 / Math.PI));
            var resultX = parseFloat(x * (180 / Math.PI));
            circle.push({
                y: resultY,
                x: resultX
            });
        }
        
        return {
            circle: circle,
            radius: radius
        };
    }

    global.mlst = global.mlst || {};
    global.mlst.math = {
        standardDeviation: standDeviat,
        makeCircle: makeCircle,
        filterAboveOutsideDeviation: filterAboveOutsideDeviation
    }
}(this))