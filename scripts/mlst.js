mlst = (function() {
    var positiveOutsideStandDeviation = function(values, deviationMultip) {
        var deviMultplier = deviationMultip || 1.645;
        var validValues = [];
        values.map(function(el) {
            var parsed = parseInt(el);
            if (parsed && parsed > 0) {
                validValues.push(parsed);
            }
        });
        var standDev = standardDeviation(validValues);
        var standDevToUse = {
            min: standDev.min * (deviMultplier * -1),
            max: standDev.max * deviMultplier
        };
        var outsideSD = [];
        validValues.map(function(el) {
            if (el >= standDevToUse.max || el <= standDevToUse.min) {
                outsideSD.push(el);
            }
        })
        return outsideSD;
    }

    var standardDeviation = function(values) {
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

    var toArr = function(els){
        return [].slice.call(els);
    }
    var getFunkyDivs = function() {
        var theFunkyOnes = [];
        var allDivsNonAuto = toArr(document.getElementsByTagName('div')).filter(function(el) {
            var zIx = el.style['z-index'];
            if (zIx != 'auto' &&
                parseInt(zIx) > 0 &&
                el.style['display'] !== 'none') {
                return el;
            }
        });
        if (allDivsNonAuto.length < 10) {
            theFunkyOnes = allDivsNonAuto;
        } else {
            var zIxs = allDivsNonAuto.map(function(el) {
                return parseInt(el.style['z-index']);
            })
            var elegibleZIxs = positiveOutsideStandDeviation(zIxs);
            theFunkyOnes = allDivsNonAuto.filter(function(el) {
                if (elegibleZIxs.indexOf(parseInt(el.style['z-index'])) > 0) {
                    return el;
                }
            });
        }
        return theFunkyOnes;
    }

    var removeFunkyDivs = function(divs) {
        var toRemove = divs || getFunkyDivs();
        toRemove.map(function(el) {
            el.remove();
        });
    }
    return {
        getFunkyDivs: getFunkyDivs,
        removeFunkyDivs: removeFunkyDivs
    };
}(this));
