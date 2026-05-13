# filterbox.js


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



[[Back](.)]