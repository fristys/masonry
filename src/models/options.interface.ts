export interface MasonryOptions {
  /** The number of columns for the masonry */
  columns?: number;

  /**
   * The number of columns for the masonry depending on width
   *
   * `{ [width]: [noOfColumns] }`
   * */
  columnBreakpoints?: any;

  /** Column gutter size  */
  gutter?: number;

  /** Column gutter unit (`px`, `em`, `rem`, `%`, etc.) */
  gutterUnit?: string;

  /**
   * Should this Masonry instance wait for all the images in the container to load first before
   * initializing?
   * */
  initOnImageLoad?: boolean;

  /** Class to add to the Masonry container during image loading */
  loadingClass?: string;

  /** Class to add to the Masonry after it's finished loading  */
  loadedClass?: string;

  /** Callback for when the Masonry is finished calculating and setting itself up */
  onInit?: () => void;

  /** Should the Masonry bind to window.resize and recalculate itself automatically? */
  bindOnScroll?: boolean;

  /** Should the Masonry use the container's width when calculating as opposed to viewport width */
  useContainerWidth?: boolean;

  /** Should the Masonry track the changes in size for all items inside of it and re-initialize on change */
  trackItemSizeChanges?: boolean;
}
