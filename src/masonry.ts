import { debounce } from './utils/debounce';
import { imagesLoaded } from './utils/images-loaded';

import { MasonryOptions } from './models/options.interface';
import { Errors } from './models/errors.model';

/*!
 * Masonry v1.1.6
 * The masonry library we need, but don't deserve
 * https://fristys.me
 * MIT License
 * by Momchil Georgiev
 */
export class Masonry {
  private columns: number = 4;

  private columnBreakpoints: any;

  private gutter: number = 10;

  private gutterUnit: string = 'px';

  private loadingClass: string = 'masonry-loading';

  private initOnImageLoad: boolean = false;

  private loadedClass: string = 'masonry-loaded';

  private onInit!: () => void;

  private bindOnScroll: boolean = true;

  private useContainerWidth: boolean = false;

  private trackItemSizeChanges: boolean = false;

  private sizeObservers!: { observer: ResizeObserver, target: Element }[];

  constructor(private masonryContainer: any, options?: MasonryOptions) {
    if (!this.masonryContainer) throw new Error(Errors.containerDoesNotExist);

    this.setOptions(options);

    if (this.initOnImageLoad) {
      this.initOnAllImagesLoaded();
    } else {
      this.init();
    }

    // DOM Event bindings
    this.bindEvents();
  }

  /**
   * (Re)Calculates and sets the Masonry
   */
  init(): void {
    this.resetAllPositions();
    this.setItemPositions();
    this.masonryContainer.classList.remove(this.loadingClass);
    this.masonryContainer.classList.add(this.loadedClass);
  }

  /**
   * Unbinds all DOM events bound by this Masonry instance
   */
  dispose(): void {
    if (this.bindOnScroll) window.removeEventListener('resize', this.initDebounced.bind(this));
    if (this.trackItemSizeChanges) this.unbindItemSizeTracking();
  }

  /**
   * Sets all overrides for this instance depending on `options`
   */
  private setOptions(options: MasonryOptions | undefined): void {
    this.setOptionIfExists(options, 'columns');
    this.setOptionIfExists(options, 'columnBreakpoints');
    this.setOptionIfExists(options, 'gutter');
    this.setOptionIfExists(options, 'gutterUnit');
    this.setOptionIfExists(options, 'loadingClass');
    this.setOptionIfExists(options, 'initOnImageLoad');
    this.setOptionIfExists(options, 'loadedClass');
    this.setOptionIfExists(options, 'onInit');
    this.setOptionIfExists(options, 'bindOnScroll');
    this.setOptionIfExists(options, 'useContainerWidth');
    this.setOptionIfExists(options, 'trackItemSizeChanges');
  }

  /**
   * Overrides an option for this instance if it exists in the `options` object
   */
  private setOptionIfExists(options: MasonryOptions | undefined, prop: string): void {
    if (options && options.hasOwnProperty(prop)) {
      (this as any)[prop] = (options as any)[prop];
    }
  }

  /**
   * Calls this.init() with a debounce
   */
  private initDebounced = debounce(this.init.bind(this));

  /**
   * DOM Event bindings
   */
  private bindEvents(): void {
    if (this.bindOnScroll) window.addEventListener('resize', this.initDebounced.bind(this));
    if (this.trackItemSizeChanges) this.bindItemSizeTracking();
  }

  /**
   * Waits for all images inside the masonry container to be loaded
   * and then calls `this.init()`
   */
  private initOnAllImagesLoaded(): void {
    this.masonryContainer.classList.remove(this.loadedClass);
    this.masonryContainer.classList.add(this.loadingClass);

    imagesLoaded(this.masonryContainer, () => {
      this.init();
      this.masonryContainer.classList.remove(this.loadingClass);
      this.masonryContainer.classList.add(this.loadedClass);
    });
  }

  /**
   * Calculates and sets all the positional styling values
   */
  private setItemPositions(): void {
    const columns = this.getColumnsForViewportSize();

    const columnWidth = `calc(${100 / columns}% - ${this.gutter}${this.gutterUnit})`;

    this.masonryContainer.style.position = 'relative';

    // Divide all items into rows
    const $items = this.masonryContainer.children;

    const rows: any[][] = [];

    const itemsLength = $items.length;
    let itemsIterator = 0;

    while (itemsIterator < itemsLength) {
      const nextIndex = itemsIterator + columns;

      rows.push([].slice.call($items, itemsIterator, nextIndex));

      itemsIterator = nextIndex;
    }

    // Iterate over items row by row
    const rowsLength = rows.length;
    let rowsIterator = 0;
    let containerHeight = 0;

    while (rowsIterator < rowsLength) {
      const row = rows[rowsIterator];

      // Iterate over the columns in this row
      const rowLength = row.length;
      let colsIterator = 0;

      while (colsIterator < rowLength) {
        const col = row[colsIterator];

        // Set position and width
        col.style.position = 'absolute';
        col.style.width = columnWidth;

        // Set top value to 0 if this is the first row
        if (rowsIterator === 0) {
          col.style.top = 0;
        } else {
          // Set top value to the top + height of the column above this one
          const prevRowSibling = rows[rowsIterator - 1][colsIterator];

          if (prevRowSibling) {
            const siblingTop = parseInt(getComputedStyle(prevRowSibling).top, 10);

            col.style.top = `calc(${siblingTop + prevRowSibling.offsetHeight}px + ${this.gutter}${this.gutterUnit})`;
          }
        }

        // Set left value to 0 if this is the first column in the row
        if (colsIterator === 0) {
          col.style.left = 0;
        } else {
          // Set left value to width + gutters of previous column in this row
          const prevCol = row[colsIterator - 1];

          col.style.left = `calc(${parseInt(getComputedStyle(prevCol).width, 10) * colsIterator}px + ${this.gutter * colsIterator}${this.gutterUnit}`;
        }

        const columnHeight = col.getBoundingClientRect().top + col.offsetHeight;

        if (containerHeight < columnHeight) containerHeight = columnHeight;

        colsIterator++;
      }

      rowsIterator++;
    }

    // Setting the container height to the tallest column's height
    if (this.masonryContainer.getBoundingClientRect().top >= 0) {
      this.masonryContainer.style.height = `calc(${containerHeight - this.masonryContainer.getBoundingClientRect().top}px + ${this.gutter}${this.gutterUnit})`;
    }

    // On init callback
    if (this.onInit) this.onInit();
  }

  /**
   * Resets all positonal styling values inside this Masonry instance
   */
  private resetAllPositions(): void {
    this.masonryContainer.style.position = '';
    this.masonryContainer.style.height = '';

    const $children = this.masonryContainer.children;
    let len = $children.length;

    while (len--) {
      const item = $children[len];

      item.style.top = '';
      item.style.left = '';
      item.style.width = '';
      item.style.position = '';
    }
  }

  /**
   * Gets the number of columns for the current viewport size / container size
   * depending on settings
   */
  private getColumnsForViewportSize(): number {
    if (!this.columnBreakpoints) return this.columns;

    const viewportWidth = this.useContainerWidth ? this.masonryContainer.offsetWidth : (
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    );

    const keys = Object.keys(this.columnBreakpoints).sort((a: any, b: any) => a - b);

    const keysLength = keys.length;

    let keysIterator = 0;

    while (keysIterator < keysLength) {
      const breakpoint = parseInt(keys[keysIterator], 10);
      const columns = this.columnBreakpoints[keys[keysIterator]];

      if (viewportWidth < breakpoint) return columns;

      keysIterator++;
    }

    return this.columns;
  }

  private bindItemSizeTracking(): void {
    if (!('ResizeObserver' in window)) {
      /* eslint-disable no-console */
      console.warn(Errors.resizeObserverNotSupported);

      return;
    }

    if (!this.sizeObservers) this.sizeObservers = [];

    const $items = this.masonryContainer.children;
    let iterator = $items.length;

    while (iterator--) {
      const target = $items[iterator];
      const observer = new ResizeObserver(this.initDebounced.bind(this));

      observer.observe($items[iterator]);

      this.sizeObservers.push({ observer, target });
    }
  }

  private unbindItemSizeTracking(): void {
    if (!('ResizeObserver' in window)) {
      /* eslint-disable no-console */
      console.warn(Errors.resizeObserverNotSupported);

      return;
    }

    let iterator = this.sizeObservers.length;

    while (iterator--) {
      const { observer, target } = this.sizeObservers[iterator];

      observer.unobserve(target);
    }
  }
}
