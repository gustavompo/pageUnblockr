(function(global) {

    var mlst = function(input) {
        var _apply = function() {
            var args = _toArr(arguments);
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

        var _toArr = function(els) {
            return [].slice.call(els);
        }
        var _css = function(el, valueArray) {
            var value = valueArray[0];
            var valueToSet = valueArray.length > 1 ? valueArray[1] : undefined;
            if (valueToSet) {
                el.style.cssText += value + ':' + valueToSet + ' !important';
            }
            return el.ownerDocument.defaultView.getComputedStyle(el, null)[value];
        }

        var css = function(value, toSet) {
            return _apply(_css, _underlyingElement, value, toSet);
        }
        var _docEl = function(param) {
            if (Object.prototype.toString.call(param) === '[object Array]' || typeof(param) === 'object') {
                return param;
            } else if (param.charAt(0) === '.') {
                return _toArr(document.getElementsByClassName(param.substring(1)));
            } else if (param.charAt(0) === '#') {
                return [document.getElementById(param.substring(1))];
            } else {
                return _toArr(document.getElementsByTagName(param));
            }
        }
        var _underlyingElement = _docEl(input);
        var result = {
            e: _underlyingElement,
            css: css
        };
        return result;
    }
    global.$mlst = mlst;
}(this));