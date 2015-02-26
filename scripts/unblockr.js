var unblockr = (function() {
    'use strict';

    var blockrsTypes = 'div,span';

    // returns all elements probably blocking page
    // It will consider it a blocker if it enter in any of the following conditions
    // be visible and has a positive zIndex
    // If the ammount of total elements with the same is less tha 10
    // Or if it's zIndex is outside the standard deviation of all zIndexes
    var getBlockerElements = function() {
        var blockers = [],
            documentWidth = $mlst(window).width(),
            documentHeight = $mlst(window).height();

        // filter whether an alement can be blocking page
        var blockrFilter = function(el) {
            var $el = $mlst(el);
            var zIx = $el.css('zIndex');
            if (zIx != 'auto' &&
                parseInt(zIx) > 0 &&
                $el.css('display') !== 'none') {
                return el;
            }
        }

        var zIndexedElements = $mlst(blockrsTypes).dom.filter(blockrFilter);

        // return if A param is largem than B based in informed percentage
        var isLargerIn = function(percentage, a, b) {
            return ((a / b) * 100) > percentage;
        }

        // the base element that blocks UI
        // this and all elements with higher zIndex will be removed
        var baseBlockrs = zIndexedElements.filter(function(el) {
            var elWidth = $mlst(el).width();
            var elHeight = $mlst(el).height();
            var percentageLimit = 80;
            if (isLargerIn(percentageLimit, elWidth, documentWidth) && isLargerIn(percentageLimit, elHeight, documentHeight)) {
                return el;
            }
        });

        if (baseBlockrs.length === 0) {
            return [];
        }

        var min = function(valueGetter, array){
            var minNumber = Number.MAX_VALUE;
            var minElement = undefined;
            for (var i = array.length - 1; i >= 0; i--) {
                var currentNumber = valueGetter(array[i]);
                if(currentNumber < minNumber ){
                    minNumber = currentNumber;
                    minElement = array[i];
                }
            };
            return minElement;
        }

        var blockerWithTheLowestIndex = min(function(el){ return parseInt($mlst(el).css('zIndex')); }, baseBlockrs);
        
        var lowestZIndex = parseInt($mlst(blockerWithTheLowestIndex).css('zIndex'));

        blockers = zIndexedElements.filter(function(el) {
            if (parseInt($mlst(el).css('zIndex')) >= lowestZIndex) {
                return el;
            }
        });

        return blockers;
    }

    //remove the provided elements or query blockr elements and remove
    var removeBlockerElements = function(elements) {
        var toRemove = elements || getBlockerElements();
        toRemove.map(function(el) {
            el.remove();
        });
    }

    //restore scroll and scrollbar to page
    var restoreScrollFrom = function(el) {
        var overflow = $mlst(el).css('overflow');
        if (overflow === 'hidden') {
            $mlst(el).css('overflow', 'visible !important');
        }
    }

    //layer above restoreScrollbar, since multiple elements must be restored
    var restoreScrollbar = function() {
        [
            document.children[0],
            document.body
        ].map(function(e) {
            restoreScrollFrom(e);
        });
    }

    //returns whether are blockers in page
    var iAreThereBlockers = function() {
        var blockers = getBlockerElements();
        return blockers.length > 0;
    }

    // handle blockrs removal.
    // - select blockrs if not provided
    // - remove them
    // - restore scrollbar
    var iRemoveBlockersNow = function(elements) {
        removeBlockerElements(elements);
        restoreScrollbar();
    }

    return {
        areThereBlockers: iAreThereBlockers,
        removeBlockersNow: iRemoveBlockersNow
    };

}());

setTimeout(function() {
    chrome.runtime.sendMessage({
        init: true,
        blockrs: unblockr.areThereBlockers()
    });
}, 500);


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch (request) {
            case 'areThereBlockers?':
                sendResponse(unblockr.areThereBlockers());
                break;
            case 'removeBlockersNow!':
                unblockr.removeBlockersNow();
                break;
        }

    });
