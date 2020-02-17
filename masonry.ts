/*!
 * Masonry v1.0.0
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

  init(): void {
    this.masonryContainer.style.position = 'relative';
    this.setItemPositions();
  }

  setItemPositions(): void {
    const $items = this.masonryContainer.querySelectorAll('div.item');

    this.resetAllPositions($items);

    const columns = this.getColumnsForViewportSize();
    const rows: any[][] = [[]];

    for (let i = 0; i < $items.length; i += columns) {
      rows.push([].slice.call($items, i, i + columns));
    }

    for (let a = 0; a < rows.length; a++) {
      const row = rows[a];

      for (let b = 0; b < row.length; b++) {
        const col = row[b];

        col.style.position = 'absolute';
        col.style.width = `calc(${100 / columns}% - ${this.gutter}${this.gutterUnit})`;

        if (a === 0) {
          col.style.top = 0;
        } else {
          const prevRowSibling = rows[a - 1][b];

          if (prevRowSibling) {
            const siblingTop = parseInt(getComputedStyle(prevRowSibling)['top'], 10);
            
            col.style.top = `calc(${siblingTop + prevRowSibling['offsetHeight']}px + ${this.gutter}${this.gutterUnit})`;
          }
        }

        if (b === 0) {
          col.style.left = 0;
        } else {          
          const prevCol = row[b - 1];

          col.style.left = `calc(${(parseInt(getComputedStyle(prevCol)['width'], 10) * b)}px + ${this.gutter * b}${this.gutterUnit}`;
        }
      }
    }
  }

  private resetAllPositions(items: any[]): void {
    let len = items.length;

    while (len--) {
      const item = items[len];

      item.style.position = '';
      item.style.top = '';
      item.style.left = '';
      item.style.width = '';
    }
  }

  private getColumnsForViewportSize(): number {
    if (!this.columnBreakpoints) return this.columns;

    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const keys = Object.keys(this.columnBreakpoints);

    for (let i = 0; i < keys.length; i++) {
      const breakpoint = parseInt(keys[i], 10);
      const columns = this.columnBreakpoints[breakpoint];

      if (viewportWidth <= breakpoint) return columns;
    }

    return this.columns;
  }

  private bindEvents(): void {
    window.addEventListener('resize', this.setItemPositions.bind(this));
  }

  dispose(): void {
    window.removeEventListener('resize', this.setItemPositions.bind(this));
  }
}