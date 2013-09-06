/**
 * jQuery Alchemy Slider
 *
 * Written 8/28/2013 by Edmund Bates AKA FrankieAvocado
 *
 * Licensed under MIT: http://www.opensource.org/licenses/mit-license.php
 */

(function($) {
    $.fn.alchemySlide = function (options) {

        var internalDefaults = {
            slideDelay: 5000,
            slideSpeed: 500,
            verticalShowSpeed: 250,
            horizontalShowSpeed: 0,
            heightSetting: "auto",
            widthSetting: "auto",
            onSlide: function (e) { }
        }

        $.extend(internalDefaults, options);
            
        beginSliding = function (parent, chosenOptions) {
            var thisTimer = parent.attr("IntervalId");
            var firstLi = parent.find('li').first();

            var showItHeight = 0;
            if (chosenOptions.heightSetting == "auto") {
                showItHeight = firstLi.height();
            }
            else {
                showItHeight = chosenOptions.heightSetting;
            }

            var showItWidth = 0;
            if (chosenOptions.widthSetting == "auto") {
                showItWidth = firstLi.width();
            }
            else {
                showItWidth = chosenOptions.heightSetting;
            }


            parent.animate({
                width: showItWidth + "px"
                }, chosenOptions.horizontalShowSpeed, function () {
                    parent.animate({
                        height: showItHeight + "px"
                    }, chosenOptions.verticalShowSpeed, function () {
                    });
            });

           

            if (thisTimer) {

            }

            thisTimer = window.setInterval(function () {
                moveFirstToLast(parent, chosenOptions);
            }, chosenOptions.slideDelay);
            parent.attr("IntervalId", thisTimer);
            
        }

        moveFirstToLast = function (parent, chosenOptions) {
            var firstItem = parent.find('li').first();
            var copiedItem = firstItem.clone();
            var firstItemWidth = firstItem.width();
            parent.find('ul').first().append(copiedItem);

            firstItem.animate({
                marginLeft: -firstItemWidth
            }, chosenOptions.slideSpeed, function () {
                firstItem.remove();
            });

        }

        // if nothing is selected, return nothing
        if (!this.length) {
            options && options.debug && window.console && console.warn("nothing selected, returning nothing");
            return;
        }

        var $this = $(this);
        beginSliding($this, internalDefaults);
    };
}(jQuery));