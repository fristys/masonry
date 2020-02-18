![masonry](https://i.imgur.com/AVeTw1M.png)

# masonry
A simple masonry library written in TypeScript.

The masonry library we need, but don't deserve. Uses pure JavaScript and should be compatible with most browsers.

## Installation

npm
```bash
npm i @fristys/masonry
```

yarn
```bash
yarn add @fristys/masonry
```

## Usage

```typescript
import { Masonry } from '@fristys/masonry';

const options = { gutter: 1.5, gutterUnit: 'rem', columnBreakpoints: { 960: 2, 740: 1 } };
const masonry = new Masonry(document.getElementById('masonry'), options);

```

## Options

`columns: number` *(default: `4`)* the number of columns to render. Column widths are calculated via percentage - `gutter` (`calc((100 / columns)% - gutter)`).

`gutter: number` *(default: `10`)* the size of the gutter between columns and rows.

`gutterUnit: string` *(default `px`)* the unit of measurement to use when applying the gutter to the masonry grid (could be any valid unit of measurement `px`, `%`, `rem`, `em`, etc.)

`columnBreakpoints: any` *(default `undefined`)* Most Masonry scenarios require some form of responsiveness. Setting this property allows you to set the number of columns to be used for different viewport width(s) in the format of `{ [width: number]: [columns: number] }`. Example:

```typescript
// viewports with the width of <= 920 will get 2 columns
// viewports with the width of <= 740 will get 1 column
// Any other viewport width will get whatever value you've set for `columns`
const columnBreakpoints = { 960: 2, 740: 1 };
```

## API

`constructor(private masonryContainer: any, options?: MasonryOptions)`
The constructor. `masonryContainer` can be any valid DOM node / Element. When called it automatically initializes the masonry using `masonryContainer` as the container element and binds `init()` (debounced) on window resize (see `dispose()` on how to clear said binding, if needed).

`init(): void`
Recalculates and initializes all the masonry columns. Called on object construction and window resize. If you need to re initialize your grid for some reason, you can call this method to do so.

`dispose(): void`
Unbinds the window resize event listener. If you're using this library inside of a framework, you should probably call this method during your destroy lifecycle hook (`onDestroy()`, `destroyed()`, `componentWillUnmount()`, etc.).
