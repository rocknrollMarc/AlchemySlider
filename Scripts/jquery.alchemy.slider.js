/**
 * jQuery Alchemy Slider
 *
 * Written 8/28/2013 by Edmund Bates AKA FrankieAvocado
 *
 * Licensed under MIT: http://www.opensource.org/licenses/mit-license.php
 */

(function($) {
    $.fn.alchemySlide = function (options) {

            moveFirstToLast = function (parent) {
                var firstItem = parent.find('li').first();
                var copiedItem = firstItem.clone();
                var firstItemWidth = firstItem.width();
                parent.find('ul').first().append(copiedItem);

                firstItem.animate({
                    marginLeft: -firstItemWidth
                }, 1000, function () {
                    firstItem.remove();
                });

            }

            // if nothing is selected, return nothing
            if (!this.length) {
                options && options.debug && window.console && console.warn("nothing selected, returning nothing");
                return;
            }

            var $this = $(this);
            moveFirstToLast($this);
    };
}(jQuery));