# Scripts to enhance web-1.0 pages

This library contains JavaScript code that is intended to be used with HTML content that is downloaded from a server, not built on the client-side using libraries like React.  Specifically, as soon as the page finishes loading the JavaScript looks for DOM elements with specific CSS class names and adds event handlers to them... so if other code on your page is going to be creating and removing DOM then the setup code in these scripts will not work properly.

Note that these scripts are fine for personal projects but they are ⚠️**not production-ready**⚠️. In particular, they have not been tested on Android devices.

## Installation and use

To use the scripts and/or stylesheets, simply copy the ones you want to use from the *dist/* folder into your own project and include them in your HTML via a `<script>` tag.  If you want to use all of the scripts, include the *klib.js* script which is simply a concatenation of all the others. If you want to use all of the stylesheets, include the *klib.css* stylesheet.

### Version numbers

The first non-LICENSE comment in each script in the *dist/* folder contains a version number using the **semantic versioning** convention. These version numbers may vary from file to file; if the package was versioned but an individual file did not change then its version number will remain unchanged.

### Order of Inclusion

If you include *klib.js* then you will get everything you need, in the order that you need it.  If you are including specific scripts one by one, the order that you load them into your web page matters.

- *filterbox.js* must come before anything else, since it creates checkboxes and inserts them into the DOM.
- *longpress.js* must come before *radio-checkbox-group.js* and *collapsible.js*, since they both depend on the new longpress event.

## Script Documentation
- [collapsible.js](scripts/collapsible.js.html)
  - [Demo: Collapsible SECTION tags](demos/collapsible-sections.html)
  - [Demo: Collapsible TBODY tags](demos/collapsible-tables.html)
  - [Demo: Animating the collapse/expand effect](demos/collapsible-animation.html)
- [filterbox.js](scripts/filterbox.js.html)
  - [Demo: Filtering content tags](demos/filterbox-unstyled.html)
  - [Demo: Filtering content tags, with styling](demos/filterbox-styled.html)
- [longpress.js](scripts/longpress.js.html)
  - [Demo: Detecting long-press and Command-click gestures](demos/longpress.html)
- [navigation-without-bookmarks.js](scripts/navigation-without-bookmarks.js.html)
  - [Demo: Navigate within a page without pushing anchor tags to the location.](demos/navigation-without-bookmarks.html)
- [radio-checkbox-group.js](scripts/radio-checkbox-group.js.html)
  - [Demo: Treating checkboxes like radio buttons](demos/radio-checkbox-group.html)
- [stored-checkbox-state.js](scripts/stored-checkbox-state.js.html)
  - [Demo: Caching checkbox state in local-storage between page-loads.](demos/stored-checkbox-state.html)

## Stylesheet Documentation
- [collapsible.css](stylesheets/collapsible.css.html)
- [hide-checkboxes-and-dim-labels.css](stylesheets/hide-checkboxes-and-dim-labels.css.html)
- [hide-checkboxes-and-line-through-labels.css](stylesheets/hide-checkboxes-and-line-through-labels.css.html)
- [hide-checkboxes-and-use-disclosures.css](stylesheets/hide-checkboxes-and-use-disclosures.css.html)