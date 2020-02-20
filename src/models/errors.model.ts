const prefix = '[@fristys/masonry]';

export const Errors = {
  containerDoesNotExist: `${prefix} Masonry container element not found or provided.`,
  resizeObserverNotSupported: `${prefix} Looks like ResizeObserver was not detected in this browser. If you want to support it, add a polyfill: https://github.com/juggle/resize-observer`
};
