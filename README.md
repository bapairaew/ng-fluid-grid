Angular Fluid Grid
=============

Fluid Grid is [AngularJS](https://angularjs.org/) directive that create responsive grid layout for you.

#### Demo

http://bapairaew.github.io/ng-fluid-grid

#### Example
```
<fluid-grid block-min-width="400" block-min-height="100" block-vertical-margin="1" block-horizontal-margin="1">
  <fluid-grid-block>
    Grid #1
  </fluid-grid-block>
  <fluid-grid-block>
    Grid #2
  </fluid-grid-block>
  <fluid-grid-block>
    Grid #3
  </fluid-grid-block>
</fluid-grid>
``` 

This will result grid with 3 blocks (cells) which fit your entire screen.

#### Settings
`block-min-width`: Minimum width in pixel of each block.
`block-min-height`: Minimum height in pixel of each block.
`block-vertical-margin`: Reduce the width by given number in pixel.
`block-horizontal-margin`: Reduce the width by given number in pixel.

### Tips
- In case of the blocks reaches minimum height, they will overflow at the bottom of the container. 
- If you have to put border in your block, the `block-vertical-margin` and `block-horizontal-margin` will come in handy. They will reduce the block's size so that the border will not ruin the grid's layout.