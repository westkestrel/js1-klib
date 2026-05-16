# Scripts to enhance web-1.0 pages

This project folder contains JavaScript code that is intended to be used with HTML content that is downloaded from a server, not built on the client-side using libraries like React.  Specifically, as soon as the page finishes loading the JavaScript looks for DOM elements with specific CSS class names and adds event handlers to them... so if other code on your page is going to be creating and removing DOM then the setup code in these scripts will not work properly.

You can view the [documentation and demos](https://westkestrel.github.io/js1-klib/) online. Note that these scripts are fine for personal projects but they are ⚠️**not production-ready**⚠️. In particular, they have not been tested on Android devices.

## Installation and use

To use the scripts and/or stylesheets, simply copy the ones you want to use from the *dist/* folder into your own project and include them in your HTML via a `<script>` tag.  If you want to use all of the scripts, include the *klib.js* script which is simply a concatenation of all the others. If you want to use all of the stylesheets, include the *klib.css* stylesheet.

### Version numbers

The first non-LICENSE comment in each script in the *dist/* folder contains a version number using the **semantic versioning** convention. These version numbers may vary from file to file; if the package was versioned but an individual file did not change then its version number will remain unchanged.

### Order of Inclusion

If you include *klib.js* then you will get everything you need, in the order that you need it.  If you are including specific scripts one by one, the order that you load them into your web page matters.

- *filterbox.js* must come before anything else, since it creates checkboxes and inserts them into the DOM.
- *longpress.js* must come before *radio-checkbox-group.js* and *collapsible.js*, since they both depend on the new longpress event.

## Script descriptions

### collapsible.js


Collapsible allows you to expand and collapse sections with the click of the mouse.

To use it, you have a give a container (typically a DIV, SECTION, or TABLE) the class
"collapsible-section".  The first child of the container (typically a H2 or TR) will
be turned into a trigger that, when clicked, causes the remaining children to appear
or disappear.

Note that the first element child does not *have* to include a button, but it is good
practice for it to do so as this helps with the accessibility of your web page.

e.g.,
```html
<section class="collapsible-section">
  <h2><button>Rutabagas</button></h2>
  <p>Rutabagas are a vegetable.</p>
  <p>Some people like them. Some people don't</p>
</section>
```

If you also include the *longpress.js* script then the user can long-press or
Option-click (Alt-click on Windows) a button to expand the section and collapse
all others.  You must include the *longpress.js* script before *collapsible.js*.

### filterbox.js


Filterbox allows you to use checkboxes to show and hide rows of data.

To use it, you ensure that your HTML has a controls block. Note that if you omit the
`id=""` and `for=""` tags on the input and label, they will be inferred from the
label contents.  In the code below

- the first checkbox toggles "cats" (despite the label being "Felines")
- the second toggles "dogs" (inferred from the label)
- the third toggles "bugs", and ignores the explanatory text after the colon
- the fourth toggles "bugs", and ignores the explanatory text in parenthesis
- the fifth toggles "eight-legs" (8 became eight since CSS class names cannot begin with digits)
- the sixth toggles "birds-and-bees" (spaces become hyphens)
- the seventh toggles both "birds" and "Bees" (commas separate items)

```html
<ul class="filterbox-controls filter-animals">
  <li><input type="checkbox" id="cats"><label for="cats">Felines</label></li>
  <li><input type="checkbox"><label>Dogs</label></li>
  <li><input type="checkbox"><label>Bugs: six-legged beasties</label></li>
  <li><input type="checkbox"><label>Bugs (six-legged beasties)</label></li>
  <li><input type="checkbox"><label>8-Legs (arachnids and octopi)</label></li>
  <li><input type="checkbox"><label>Birds and Bees</label></li>
  <li><input type="checkbox"><label>Birds, Bees</label></li>
</ul>
```

Your HTML also must have a data block:

```html
<table class="filterbox-data filter-animals">
  <tr class="cats">...</tr>
  <tr class="cats">...</tr>
  <tr class="dogs">...</tr>
  <tr class="bugs">...</tr>
  <tr class="eight-legs">...</tr>
  <tr class="birds">...</tr>
  <tr class="bees">...</tr>
  <tr class="birds-and-bees">...</tr>
</table>
```

When the user toggles the checkbox for a given id, all data elements with that
CSS class have their visibility toggled. In the case above if the user toggles
the last checkbox both the "birds" and "bees" rows will be hidden, but not the
"birds-and-bees" row.

***

Filterbox pairs very nicely with checkbox-radio-group, which allow the user to
Option-click (or long-press) to toggle the visibility of all items *except* the one
they just selected, and with stored-checkbox-state, which preserves checkbox state
across page-loads using local storage.

It also pairs nicely with stored-checkbox-state, which preserves checkbox state in
local-storage between page-loads.

If you do use either or both of these other files you must include them *after* this
one, so that this file's setup will have created the checkbox html elements (and
attached its event listeners) before those files attempt to work with them.

### longpress.js


Generate a new **longpress** event when the user holds the mouse button (or their
finger on a touch-sensitive device) on a link, button, checkbox, or radio button.
On a Mac the user can also Option-click the element to generate this event, and on
Windows they can use Alt-click.

If you write any code that uses the new longpress event, you must register your event
listeners in a window-load event handler, and you must register that handler *after*
loading *longpress.js*. E.g.,

```html
<head>
<script src="longpress.js"></script>
<script>
window.addEventListener('load', () => {
  document.getElementById('my-button').addEventListener('click', (event) => {
    if (event.target.justHadLongPress) return // already handled as a long-press
    // your standard event-handling code goes here
  })
  document.getElementById('my-button').addEventListener('longpress', (event) => {
    // your long-press event-handling code goes here
  })
})
</script>
</head>
<body>
  <p class="supports-longpress">
    <button id="my-button">Click or long-press me</button>
  </p>
</body>
```

If you register you handlers too early then the new **justHadLongPress** flag will not
have been added to the event target, and your code will end up performing both your
long-press and click operations if the user Option-clicks the element.

If you intend to support longpress events on an iOS device you will probably want to
prevent the system-standard Copy menu from coming up when the user long-presses. If
you add the css class `supports-longpress` to a container then the Copy menu will be
suppressed for all links, buttons, checkboxes, and input labels within the container.
You can also add the class directly to the link, button, checkbox, or label.

### navigation-without-bookmarks.js


If you add `class="navigation-without-bookmarks"` to an HTML container (e.g., a `div`
or `section`) then any anchor links within that container (e.g., `<a href="#anchor">`)
will jump to that portion of the web page without adding the anchor to the end of the
URL.

### radio-checkbox-group.js


Radio Checkbox Groups allow you to have checkboxes which behave like radio buttons
when Option-clicked or long-pressed. This is *not* a standalone script; if you include
it you must first include *longpress.js*.

To use it, add `class="radio-checkbox-group"` to a container.  Now any checkboxes
within the container will behave normally when toggled, unless the Option key (on
a Mac) or Alt key (on Windows) is held, or if the checkbox is long-pressed on a
phone or tablet or long-clicked on computer.  Any of these gestures will trigger the
radio-checkbox-group behavior.

The radio-checkbox-group behavior is very straightforward. If any checkbox other than
the target is checked then the target will be "soloed", which is to say that it will
be checked and all of the others will be unchecked. If all checkboxes other than the
target are unchecked then the soloing will be cancelled and all checkboxes will be
checked.

Note that soloing and de-soloing will trigger **change** events for many of the
checkboxes in the group. If your change-handling code needs to know which checkbox
was actually clicked, you can check `event.target.isSoloTarget`; this will be `true`
for the checkbox the user clicked on and `undefined` for all the rest.

### stored-checkbox-state.js


Stored Checkbox State preserves checkbox state between webpage reloads.

If you decorate a container with `class="stored-checkbox-state"` then any checkboxes
within it will have their state preserved in local storage between launches.

## Stylesheets

### collapsible.css


Styling rules for use with the *collapsible.js* script. You can use these styles, or
can disregard them and do your own styling; the script works correctly in either case.

To use these styles, add the following CSS class names to an ancestor element of
your collapsible sections (e.g., the `body` tag).
- **(no class required)**: buttons in collapse-control element (the first child of the element with the collapsible-section class) are styled like ordinary content.
- **dim-when-collapsed**: the collapse-control element is rendered semi-transparent when the content is collapsed.
- **line-through-when-collapsed**: the collapse-control element has a line drawn through it when the content is collapsed. This can be combined with dimming.
- **rotate-chevron-when-collapsed**: the collapse-control element is prefixed with a downward-pointing triangle, which is rotated to point to the right when the content is collapsed.
- **animate-when-collapsed**: the collapsing content shrinks to nothing rather than simply disappearing. Note that this does not behave correctly if the collapsing content consists of table rows, as table rows do not honour min-height.

### hide-checkboxes-and-dim-labels.css


Given a DOM structure like
```html
     <ul class="hide-checkboxes-and-dim-labels">
         <li><input type="checkbox" id="a"><label for="a">My Label</label></li>
     </ul>
```

These CSS rules will hide the checkbox and will instead dim the label text when
the checkbox is unchecked. Note that the hidden checkbox is still interactive since
it has a label that the user can click on.

### hide-checkboxes-and-line-through-labels.css


Given a DOM structure like
```html
     <ul class="hide-checkboxes-and-line-through-labels">
         <li><input type="checkbox" id="a"><label for="a">My Label</label></li>
     </ul>
```

These CSS rules will hide the checkbox and will instead dim the label text and draw
a line through it when the checkbox is unchecked.  Note that the hidden checkbox is
still interactive since it has a label that the user can click on.

### hide-checkboxes-and-use-disclosures.css


Given a DOM structure like
```html
     <ul class="hide-checkboxes-and-use-disclosures">
         <li><input type="checkbox" id="a"><label for="a">My Label</label></li>
     </ul>
```

These CSS rules will hide the checkbox and will instead draw a disclosure triangle.
When the checkbox is checked and unchecked the triangle will animate a rotation from
pointing right to pointing down.   Note that the hidden checkbox is still interactive
since it has a label that the user can click on.

