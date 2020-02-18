/*!
 * Masonry v1.0.3
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

  constructor(
    private masonryContainer: any,

    options?: {
      columns?: number;
      columnBreakpoints?: any,
      gutter?: number;
      gutterUnit?: string;
    }
  ) {
    if (!this.masonryContainer) throw new Error('Masonry container not found.');

    if (options) {
      if (options.hasOwnProperty('columns') && typeof options.columns === 'number')
        this.columns = options.columns;
      
      if (options.hasOwnProperty('columnBreakpoints'))
        this.columnBreakpoints = options.columnBreakpoints;
      
      if (options.hasOwnProperty('columnBreakpoints'))
        this.columnBreakpoints = options.columnBreakpoints;
      
      if (options.hasOwnProperty('gutter') && typeof options.gutter === 'number')
        this.gutter = options.gutter;
      
      if (options.hasOwnProperty('gutterUnit') && typeof options.gutterUnit === 'string')
        this.gutterUnit = options.gutterUnit;
    }

    this.init();
    this.bindEvents();
  }

  init(): void {
    this.resetAllPositions();
    this.setItemPositions();
  }

  private setItemPositions(): void {
    const columns = this.getColumnsForViewportSize();
    const columnWidth = `calc(${100 / columns}% - ${this.gutter}${this.gutterUnit})`;

    if (this.masonryContainer.style.position !== 'relative')
      this.masonryContainer.style.position = 'relative';

    // Divide all items into rows
    const $items = this.masonryContainer.children;

    const rows: any[][] = [[]];

    const itemsLength = $items.length;
    let itemsIterator = 0;

    while (itemsIterator < itemsLength)
      rows.push([].slice.call($items, itemsIterator, itemsIterator += columns));

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
        if (col.style.position !== 'absolute') col.style.position = 'absolute';

        col.style.width = columnWidth;

        // Set top value to 0 if this is the first row
        if (rowsIterator === 0) {
          col.style.top = 0;
        } else {
          // Set top value to the top + height of the column above this one
          const prevRowSibling = rows[rowsIterator - 1][colsIterator];

          if (prevRowSibling) {
            const siblingTop = parseInt(getComputedStyle(prevRowSibling)['top'], 10);
            
            col.style.top = `calc(${siblingTop + prevRowSibling['offsetHeight']}px + ${this.gutter}${this.gutterUnit})`;
          }
        }

        // Set left value to 0 if this is the first column in the row
        if (colsIterator === 0) {
          col.style.left = 0;
        } else {          
          // Set left value to width + gutters of previous column in this row
          const prevCol = row[colsIterator - 1];

          col.style.left = `calc(${(parseInt(getComputedStyle(prevCol)['width'], 10) * colsIterator)}px + ${this.gutter * colsIterator}${this.gutterUnit}`;
        }

        if (rowsIterator === rowLength - 1) {
          const columnHeight = col.getBoundingClientRect().top + document.body.scrollTop + col['offsetHeight'];

          if (containerHeight < columnHeight) containerHeight = columnHeight;
        }

        colsIterator++;
      }

      rowsIterator++;
    }

    // Setting the container height to the tallest column's height
    this.masonryContainer.style.height = `calc(${containerHeight}px + ${this.gutter}${this.gutterUnit})`;
  }

  private resetAllPositions(): void {
    const $children = this.masonryContainer.children;
    let len = $children.length;

    while (len--) {
      const item = $children[len];

      item.style.top = '';
      item.style.left = '';
      item.style.width = '';
    }

    this.masonryContainer.style.height = '';
  }

  private getColumnsForViewportSize(): number {
    if (!this.columnBreakpoints) return this.columns;

    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const keys = Object.keys(this.columnBreakpoints).sort((a: any, b: any) => (b - a));

    let keysIterator = keys.length;

    while (keysIterator--) {
      const breakpoint = parseInt(keys[keysIterator], 10);
      const columns = this.columnBreakpoints[breakpoint];

      if (viewportWidth <= breakpoint) return columns;
    }

    return this.columns;
  }

  private bindEvents(): void {
    window.addEventListener('resize', this.initDebounced.bind(this));
  }

  dispose(): void {
    window.removeEventListener('resize', this.initDebounced.bind(this));
  }

  private initDebounced = this.debounce(this.init.bind(this));

  private debounce<T extends Function>(cb: T, wait = 25) {
    let h: any = 0;

    let callable = (...args: any) => {
        clearTimeout(h);
        h = setTimeout(() => cb(...args), wait);
    };

    return <T>(<any>callable);
  }
}