# longpress.js


Generate a new **longpress** event when the user holds the mouse button (or their
finger on a touch-sensitive device) on a link, button, checkbox, or radio button.
On a Mac the user can also Command-click the element to generate this event, and on
Windows they can use Control-click.

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
long-press and click operations if the user Command-clicks the element.

If you intend to support longpress events on an iOS device you will probably want to
prevent the system-standard Copy menu from coming up when the user long-presses. If
you add the css class `supports-longpress` to a container then the Copy menu will be
suppressed for all links, buttons, checkboxes, and input labels within the container.
You can also add the class directly to the link, button, checkbox, or label.


[[Back](.)]