# blob-scroll

`blob-scroll` is a lightweight, dependency-free Javascript library for triggering smooth scrolling events. It supports horizontal and vertical scrolling within the page or an individual element, with customizable speeds and easing effects.

&nbsp;

## Table of Contents

 * [Installation](#installation)
 * [Usage](#usage)
 * [Settings](#settings)
 * [License](#license)

&nbsp;

## Installation

`blob-scroll` is compatible with all major modern web browsers and IE 11. There are no third-party requirements.

To install it, simply drop a link to the script in your code:

```html
<script src="dist/blob-scroll.min.js"></script>
```

&nbsp;

## Usage

### blobScroll.scroll()

This method will scroll smoothly to the desired target. If no arguments are passed, this will bring visitors back to the top of the page.

#### Arguments

| Type | Name | Description |
| ---- | ---- | ----------- |
| *DOMElement* or *int* | Scroll To | Either an element, a querySelector string, or a numeric pixel value. |
| *object* | Settings | See [below](#settings) for a complete list. |

#### Examples

```js
// Scroll to #foobar.
blobScroll.scroll(document.getElementById('foobar'), { yourSettings… });
blobScroll.scroll('#foobar', { … });

// Scroll to 500 pixels from the top.
blobScroll.scroll(500, { … });

// Just go to the top of the page.
blobScroll.scroll();

// Automatically have all internal links scroll smoothly.
const links = document.querySelectorAll('a[href^="#"]');
for (let i = 0; i < links.length; ++i) {
    links[i].addEventListener('click', function(e) {
        e.preventDefault();
        blobScroll.scroll(e.target.getAttribute('href'));
    });    
}
```

&nbsp;

## Settings

| Type | Name | Description | Default |
| ---- | ---- | ----------- | ------- |
| *DOMElement* | Parent | To animate a scroll within an element on the page, pass it. Otherwise scrolling will be applied to the window. | `document.documentElement` |
| *string* | Axis | Scroll direction, either `"y"` or `"x"`. | `"y"` |
| *int* | Offset | If supplied, this value is added to the scroll target. Negative values scroll past the target, positive ones come up short. | `0` |
| *int* | Duration | Scroll animation length in milliseconds. | `500` |
| *string* | Easing Effect | One of the easing effects listed below. | `"ease"` |
| *function* | Callback | A function to execute after scrolling has completed. | `NULL` |

**Easing Effects:**

| Name | Description |
| ---- | ----------- |
| linear | Nothing fancy. |
| ease | Alias of `"easeInOutCubic"`. |
| easeInQuad | Accelerating from zero velocity. |
| easeOutQuad | Decelerating to zero velocity. |
| easeInOutQuad | Acceleration until halfway, then deceleration. |
| easeInCubic | Accelerating from zero velocity. |
| easeOutCubic | Decelerating to zero velocity. |
| easeInOutCubic | Acceleration until halfway, then deceleration. |
| easeInQuart | Accelerating from zero velocity. |
| easeOutQuart | Decelerating to zero velocity. |
| easeInOutQuart | Acceleration until halfway, then deceleration. |
| easeInQuint | Accelerating from zero velocity. |
| easeOutQuint | Decelerating to zero velocity. |
| easeInOutQuint | Acceleration until halfway, then deceleration. |

&nbsp;

## License

Copyright © 2018 [Blobfolio, LLC](https://blobfolio.com) &lt;hello@blobfolio.com&gt;

This work is free. You can redistribute it and/or modify it under the terms of the Do What The Fuck You Want To Public License, Version 2.

    DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
    Version 2, December 2004
    
    Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>
    
    Everyone is permitted to copy and distribute verbatim or modified
    copies of this license document, and changing it is allowed as long
    as the name is changed.
    
    DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
    TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
    
    0. You just DO WHAT THE FUCK YOU WANT TO.

### Donations

<table>
  <tbody>
    <tr>
      <td width="200"><img src="https://blobfolio.com/wp-content/themes/b3/svg/btc-github.svg" width="200" height="200" alt="Bitcoin QR" /></td>
      <td width="450">If you have found this work useful and would like to contribute financially, Bitcoin tips are always welcome!<br /><br /><strong>1Af56Nxauv8M1ChyQxtBe1yvdp2jtaB1GF</strong></td>
    </tr>
  </tbody>
</table>
