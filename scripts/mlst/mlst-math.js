(function(global){
	'use strict';
	var filterPositiveOutSD = function(values, deviationMultip) {
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

    global.mlst = global.mlst || {};
    global.mlst.math = {
    	standDeviat : standDeviat,
    	filterPositiveOutSD : filterPositiveOutSD
    };
}(this))