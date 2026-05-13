# collapsible.js


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
Command-click (Control-click on Windows) a button to expand the section and collapse
all others.  You must include the *longpress.js* script before *collapsible.js*.


[[Back](.)]