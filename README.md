# Scripts to enhance web-1.0 pages

This project folder contains JavaScript code that is intended to be used with HTML content that is downloaded from a server, not built on the client-side using libraries like React.  Specifically, as soon as the page finishes loading the JavaScript looks for DOM elements with specific CSS class names and adds event handlers to them... so if other code on your page is going to be creating and removing DOM then the setup code in these scripts will not work properly.

## Installation

To use the scripts, simply copy the ones you want to use from the *dist/* folder into your own project and include them in your HTML via a `<script>` tag.  If you want to use all of the scripts, use the *klib.js* script which is simply a concatenation of all the others.

## Script descriptions

### Collapsible


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

### Filterbox


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

