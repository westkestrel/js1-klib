# Scripts to enhance web-1.0 pages

This project folder contains JavaScript code that is intended to be used with HTML content that is downloaded from a server, not built on the client-side using libraries like React.  Specifically, as soon as the page finishes loading the JavaScript looks for DOM elements with specific CSS class names and adds event handlers to them... so if other code on your page is going to be creating and removing DOM then the setup code in these scripts will not work properly.

## Installation

To use the scripts, simply copy the ones you want to use from the *dist/* folder into your own project and include them in your HTML via a `<script>` tag.  If you want to use all of the scripts, use the *klib.js* script which is simply a concatenation of all the others.

### Version numbers

The first comment in each script in the *dist/* folder contains a version number. These version numbers may differ; if the package was versioned but an individual file did not change then its version number will remain unchanged.

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
<th>...</th>
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
command-click (or long-press) to toggle the visibility of all items *except* the one
they just selected, and with stored-checkbox-state, which preserves checkbox state
across page-loads using local storage.

It also pairs nicely with stored-checkbox-state, which preserves checkbox state in
local-storage between page-loads.

If you do use either or both of these other files you must include them *after* this
one, so that this file's setup will have created the checkbox html elements (and
attached its event listeners) before those files attempt to work with them.


### navigation-without-bookmarks.js


Navigation Without Bookmarks allows the user to click anchor links (e.g., <a href="#foo">)
to jump to that portion of the web page without adding the anchor to the end of the
URL.

### radio-checkbox-group.js


Radio Checkbox Groups allow you to have checkboxes which behave like radio buttons
when Command-clicked or long-pressed.

To use it, add the class 'radio-checkbox-group' to a container.  Now any checkboxes
within the container will behave normally when toggled, unless the Command key (on
a mac) or Control key (on Windows) is held, or if the checkbox is long-pressed on a
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

