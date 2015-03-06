(function(global) {
    'use strict';

    var mlst = function(input) {

        // Shorthand to convert items to array
        var toArray = function(items) {
            return [].slice.call(items);
        }

        // returns whether the argument is an array or not
        var isArray = function(item){
            return Object.prototype.toString.call(item) === '[object Array]';
        }

        // returns whether the argument is an object or not
        var isObject = function(item){
            return typeof(item) === 'object';
        }

        // Executes a function for the all elements, bypassing arguments
        // Accept both a single element and an array of elements
        var apply = function(func, element, arg0, arg1, arg2, arg3, arg4) {

            if (isArray(element)) {
                return element.map(function(e) {
                    return func(e, arg0, arg1, arg2, arg3, arg4);
                });
            }

            return func(element, arg0, arg1, arg2, arg3, arg4);
        }


        // Set a property value if provided and return it's value
        var css = function(element, property, value) {
            if (value) {

                //if its important, setProperty will not work
                if(value.indexOf('!important') >= 0){

                    element.style.removeProperty(property);
                    element.style.cssText += property + ':' + value;

                }else{

                    element.style.setProperty(property, value);
                }
            }
            return element.ownerDocument.defaultView.getComputedStyle(element, null)[property];
        }

        
        // handles main object input and query (if necessary) to DOM element(s)
        // if the argument is an array or object, then it's returned, 
        // or a query is performed against document to retrieve elements given a selector
        var dom = function(element) {
            if(!element){
                return;
            }

            if ( isArray(element) || isObject(element) ) {

                return element;

            } else {

                return toArray(document.querySelectorAll(element));

            }
        }

        // interface for css method
        var iCss = function(property, value) {
            return apply(css, iUnderlyingDOM, property, value);
        }


        // Returns the width of the element
        var iWidth = function(){

            if( iUnderlyingDOM === window ){

                return iUnderlyingDOM.innerWidth;
            }

            return iUnderlyingDOM.offsetWidth;
        }

        // Returns the height of the element
        var iHeight = function(){

            if( iUnderlyingDOM === window ){

                return iUnderlyingDOM.innerHeight;
            }

            return iUnderlyingDOM.offsetHeight;
        }

        // underlying DOM (which will be exposed)
        var iUnderlyingDOM = dom(input);


        return {

            //either the argument dom element 
            //or the dom's retrieved from given css selector
            dom: iUnderlyingDOM,

            // css interface for getting and setting style
            css: iCss,
            
            // width interface for getting element's width
            width: iWidth,
            
            // height interface for getting element's height
            height: iHeight

        };
    }

    global.$mlst = mlst;

}(this));
