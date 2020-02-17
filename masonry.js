"use strict";
/*!
 * Masonry v1.0.0
 * The masonry library we need, but don't deserve
 * https://fristys.me
 * MIT License
 * by Momchil Georgiev
 */
var Masonry = /** @class */ (function () {
    function Masonry(masonryContainer, options) {
        this.masonryContainer = masonryContainer;
        this.columns = 4;
        this.gutter = 10;
        this.gutterUnit = 'px';
        if (!this.masonryContainer)
            throw new Error('Masonry container not found.');
        if (options) {
            if (options.hasOwnProperty('columns'))
                this.columns = options.columns;
            if (options.hasOwnProperty('columnBreakpoints'))
                this.columnBreakpoints = options.columnBreakpoints;
            if (options.hasOwnProperty('columnBreakpoints'))
                this.columnBreakpoints = options.columnBreakpoints;
            if (options.hasOwnProperty('gutter'))
                this.gutter = options.gutter;
            if (options.hasOwnProperty('gutterUnit'))
                this.gutterUnit = options.gutterUnit;
        }
        this.init();
        this.bindEvents();
    }
    Masonry.prototype.init = function () {
        this.masonryContainer.style.position = 'relative';
        this.setItemPositions();
    };
    Masonry.prototype.setItemPositions = function () {
        var $items = this.masonryContainer.querySelectorAll('div.item');
        this.resetAllPositions($items);
        var columns = this.getColumnsForViewportSize();
        var rows = [[]];
        for (var i = 0; i < $items.length; i += columns) {
            rows.push([].slice.call($items, i, i + columns));
        }
        for (var a = 0; a < rows.length; a++) {
            var row = rows[a];
            for (var b = 0; b < row.length; b++) {
                var col = row[b];
                col.style.position = 'absolute';
                col.style.width = "calc(" + 100 / columns + "% - " + this.gutter + this.gutterUnit + ")";
                if (a === 0) {
                    col.style.top = 0;
                }
                else {
                    var prevRowSibling = rows[a - 1][b];
                    if (prevRowSibling) {
                        var siblingTop = parseInt(getComputedStyle(prevRowSibling)['top'], 10);
                        col.style.top = "calc(" + (siblingTop + prevRowSibling['offsetHeight']) + "px + " + this.gutter + this.gutterUnit + ")";
                    }
                }
                if (b === 0) {
                    col.style.left = 0;
                }
                else {
                    var prevCol = row[b - 1];
                    col.style.left = "calc(" + (parseInt(getComputedStyle(prevCol)['width'], 10) * b) + "px + " + this.gutter * b + this.gutterUnit;
                }
            }
        }
    };
    Masonry.prototype.resetAllPositions = function (items) {
        var len = items.length;
        while (len--) {
            var item = items[len];
            item.style.position = '';
            item.style.top = '';
            item.style.left = '';
            item.style.width = '';
        }
    };
    Masonry.prototype.getColumnsForViewportSize = function () {
        if (!this.columnBreakpoints)
            return this.columns;
        var viewportWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var keys = Object.keys(this.columnBreakpoints);
        for (var i = 0; i < keys.length; i++) {
            var breakpoint = parseInt(keys[i], 10);
            var columns = this.columnBreakpoints[breakpoint];
            if (viewportWidth <= breakpoint)
                return columns;
        }
        return this.columns;
    };
    Masonry.prototype.bindEvents = function () {
        window.addEventListener('resize', this.setItemPositions.bind(this));
    };
    Masonry.prototype.dispose = function () {
        window.removeEventListener('resize', this.setItemPositions.bind(this));
    };
    return Masonry;
}());
