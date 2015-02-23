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



    var $mlst = function(el) {

        var appl = function() {
            var args = toArr(arguments);
            var func = args[0];
            var baseEl = args[1];
            args = args.slice(2);
            if (Object.prototype.toString.call(baseEl) === '[object Array]') {
                return baseEl.map(function(e) {
                    return func(e, args);
                });
            } else {
                return func(baseEl, args);
            }
        }

        var toArr = function(els) {
            return [].slice.call(els);
        }
        var _css = function(el, valueArray) {
            var value = valueArray[0];
            var valueToSet = valueArray.length > 1 ? valueArray[1] : undefined;
            if (valueToSet) {
                //el.style.setProperty(value,valueToSet);
                el.style.cssText += value + ':' + valueToSet + ' !important';
            }
            return el.ownerDocument.defaultView.getComputedStyle(el, null)[value];
        }

        var css = function(value, toSet) {
            return appl(_css, _underlyingElement, value, toSet);
        }
        var docEl = function(param) {
            if (Object.prototype.toString.call(param) === '[object Array]' || typeof(param) === 'object') {
                return param;
            } else if (param.charAt(0) === '.') {
                return toArr(document.getElementsByClassName(param.substring(1)));
            } else if (param.charAt(0) === '#') {
                return toArr(document.getElementById(param.substring(1)));
            } else {
                return toArr(document.getElementsByTagName(param));
            }
        }
        var _underlyingElement = docEl(el);
        var result = {
            e: _underlyingElement,
            css: css
        };
        return result;
    }



    var getFunkyElements = function() {
        var theFunkyOnes = [];
        var elementsNonAuto = $mlst('div').e.concat($mlst('span').e);
        var allDivsNonAuto = elementsNonAuto.filter(function(el) {
            var zIx = $mlst(el).css('zIndex');
            if (zIx != 'auto' &&
                parseInt(zIx) > 0 &&
                $mlst(el).css('display') !== 'none') {
                return el;
            }
        });
        if (allDivsNonAuto.length < 10) {
            theFunkyOnes = allDivsNonAuto;
        } else {
            var zIxs = allDivsNonAuto.map(function(el) {
                return parseInt($mlst(el).css('zIndex'));
            })
            var elegibleZIxs = positiveOutsideStandDeviation(zIxs);
            theFunkyOnes = allDivsNonAuto.filter(function(el) {
                if (elegibleZIxs.indexOf(parseInt($mlst(el).css('zIndex'))) >= 0) {
                    return el;
                }
            });
        }
        return theFunkyOnes;
    }

    var removeFunkyElements = function(elements) {
        var toRemove = elements || getFunkyElements();
        toRemove.map(function(el) {
            el.remove();
        });
    }

    var restoreScrollFrom = function(el) {
        var overflow = $mlst(el).css('overflow');
        if (overflow === 'hidden') {
            $mlst(el).css('overflow', 'visible');
        }
    }
    var restoreScrollbar = function() {
        [
            document.children[0], 
            document.body
        ].map(function(e) {
            restoreScrollFrom(e);
        });
    }

    var cleanScreen = function(elements) {
        removeFunkyElements(elements);
        restoreScrollbar();
    }
    return {
        getFunkyElements: getFunkyElements,
        removeFunkyElements: removeFunkyElements,
        cleanScreen: cleanScreen
    };
}(this));
