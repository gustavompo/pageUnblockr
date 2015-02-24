var unblockr = (function() {
    'use strict';

    var blockrsTypes = 'div,span';

    // returns all elements probably blocking page
    // It will consider it a blocker if it enter in any of the following conditions
    // be visible and has a positive zIndex
    // If the ammount of total elements with the same is less tha 10
    // Or if it's zIndex is outside the standard deviation of all zIndexes
    var getBlockerElements = function() {
        var ninetyPercentSDMultiplier = 1.645;
        var blockers = [];

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

        var possibleBlockrs = $mlst(blockrsTypes).dom.filter(blockrFilter);

        //if possible blockers amount is less than 10, return all of them
        if (possibleBlockrs.length < 10) {

            blockers = possibleBlockrs;

        }
        //else return only those with zIndex above the 90% standard deviation
        else {

            var zIxs = possibleBlockrs.map(function(el) {
                return parseInt($mlst(el).css('zIndex'));
            })

            var maxZIndexToAllow = mlst.math.standDeviat(zIxs).max * ninetyPercentSDMultiplier;

            blockers = possibleBlockrs.filter(function(el) {
                if (parseInt($mlst(el).css('zIndex')) >= maxZIndexToAllow) {
                    return el;
                }
            });
        }
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
