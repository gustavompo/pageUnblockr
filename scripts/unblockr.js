var unblockr = (function() {
    var getBlockerElements = function() {
        var blockers = [];
        var elementsNonAuto = $mlst('div').e.concat($mlst('span').e);
        var visibleElsWithZIndex = elementsNonAuto.filter(function(el) {
            var zIx = $mlst(el).css('zIndex');
            if (zIx != 'auto' &&
                parseInt(zIx) > 0 &&
                $mlst(el).css('display') !== 'none') {
                return el;
            }
        });
        if (visibleElsWithZIndex.length < 10) {
            blockers = visibleElsWithZIndex;
        } else {
            var zIxs = visibleElsWithZIndex.map(function(el) {
                return parseInt($mlst(el).css('zIndex'));
            })
            var elegibleZIxs = mlst.math.filterPositiveOutSD(zIxs);
            blockers = visibleElsWithZIndex.filter(function(el) {
                if (elegibleZIxs.indexOf(parseInt($mlst(el).css('zIndex'))) >= 0) {
                    return el;
                }
            });
        }
        return blockers;
    }

    var removeBlockerElements = function(elements) {
        var toRemove = elements || getBlockerElements();
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

    var areThereBlockers = function() {
        var blockers = getBlockerElements();
        return blockers.length > 0;
    }
    var removeBlockersNow = function() {
        removeBlockerElements(elements);
        restoreScrollbar();
    }

    var areThereBlkrs = function(){return true;}
    var removeBlockersNw = function(){return alert('removed');}
    return {
        areThereBlockers: areThereBlkrs,
        removeBlockersNow: removeBlockersNw
    };
}());




chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (sender.tab) {
            switch (request) {
                case 'areThereBlockers?':
                    return unblockr.areThereBlockers();
                    break;
                case 'removeBlockersNow!':
                    unblockr.removeBlockersNow();
                    break;
            }
        }
    });
