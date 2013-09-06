/**
 * jQuery Alchemy Slider
 *
 * Written 8/28/2013 by Edmund Bates AKA FrankieAvocado
 *
 * Licensed under MIT: http://www.opensource.org/licenses/mit-license.php
 */

(function($) {
    $.fn.alchemySlide = function (options) {

        // Our internal default settings
        var internalDefaults = {
            slideDelay: 5000,
            slideSpeed: 500,
            verticalShowSpeed: 250,
            horizontalShowSpeed: 0,
            heightSetting: "auto",
            widthSetting: "auto",
            onSlide: function (e) { }
        }

        // apply user requested settings as necessary
        $.extend(internalDefaults, options);
            
        // our initialization function that setups a timer and repeats transitions
        beginSliding = function (parent, chosenOptions) {
            var thisTimer = parent.attr("IntervalId");
            var firstLi = parent.find('li').first();

            // if they manually specified a height then use it, otherwise base the height off of the first li
            // in the future, we should make this find the tallest li
            var showItHeight = 0;
            if (chosenOptions.heightSetting == "auto") {
                showItHeight = firstLi.height();
            }
            else {
                showItHeight = chosenOptions.heightSetting;
            }
            
            // if they manually specified a width then use it, otherwise base the width off of the first li
            // in the future, we should make this find the skinniest li
            var showItWidth = 0;
            if (chosenOptions.widthSetting == "auto") {
                showItWidth = firstLi.width();
            }
            else {
                showItWidth = chosenOptions.heightSetting;
            }

            // show the slider container at the appropriate size
            // slide in width first (usually instant)
            parent.animate({
                width: showItWidth + "px"
                }, chosenOptions.horizontalShowSpeed, function () {
                    parent.animate({
                        height: showItHeight + "px"
                    }, chosenOptions.verticalShowSpeed, function () {
                    });
            });

            // setup our "pause on hover" event
            parent.unbind();
            parent.bind('mouseenter', function () {
                pauseSlider($(this), chosenOptions);
            });
           
            // setup our "resume on leave" event
            // in the future perhaps we should make this a callback of mouseenter?  It just didn't seem to matter 
            // since they should be mutually exclusive (can't mouseleave before mouseentering)
            parent.bind('mouseleave', function () {
                resumeSlider($(this));
            });

            // if we already have a timer then KILL IT WITH FIRE (or, you know...just clear it)
            if (thisTimer) {
                window.clearTimeout(parseInt(thisTimer))
            }

            // setup our interval to repeatedly move the first item to the last slot.
            thisTimer = window.setInterval(function () {
                moveFirstToLast(parent, chosenOptions);
            }, chosenOptions.slideDelay);

            // now that we have an interval, save that info to the element for future use
            parent.attr("IntervalId", thisTimer);
            
        }

        // the actual code to move an element from the first item (currently showing) to the last item
        moveFirstToLast = function (parent, chosenOptions) {

            // grab our first item and copy it
            var firstItem = parent.find('li').first();
            var copiedItem = firstItem.clone();
            var firstItemWidth = firstItem.width();

            // then put the replica on the end of the queue so it can watch C-beams glitter in the dark near the Tannhauser gate
            parent.find('ul').first().append(copiedItem);

            // move the first item off the screen.  once it is offscreen, remove it.
            firstItem.animate({
                marginLeft: -firstItemWidth
            }, chosenOptions.slideSpeed, function () {
                firstItem.remove();
            });

        }

        // code to pause the slider (called on mouseenter)
        pauseSlider = function (parent, chosenOptions, callback) {
            var thisTimer = parent.attr("IntervalId");
            if (thisTimer) {
                window.clearTimeout(thisTimer);
                dehydrateSettings(parent, chosenOptions);
                callback;
            }
        }

        // code to resume the slider (called on mouseout)
        resumeSlider = function (parent, callback) {
            var previousSettings = rehydrateSettings(parent);
            beginSliding(parent, previousSettings);
            callback;
        }

        // code to save the settings of a slider onto the element it is affecting.
        // this is used when pausing under the assumption that you will resume in the future.
        dehydrateSettings = function (parent, chosenOptions) {
            var dOptions = JSON.stringify(chosenOptions);
            parent.attr("SliderSettings", dOptions);
        }

        // code to load previously saved settings from an element that was a slider.
        // this is used when resuming
        rehydrateSettings = function (parent) {
            var dOptions = parent.attr("SliderSettings") || {};
            var rOptions = jQuery.parseJSON(dOptions);
            return rOptions;
        }

        // if nothing is selected, return nothing
        if (!this.length) {
            options && options.debug && window.console && console.warn("nothing selected, returning nothing");
            return;
        }

        // start the slide!
        var $this = $(this);
        beginSliding($this, internalDefaults);
    };
}(jQuery));