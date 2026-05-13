# radio-checkbox-group.js


Radio Checkbox Groups allow you to have checkboxes which behave like radio buttons
when Command-clicked or long-pressed. This is *not* a standalone script; if you include
it you must first include *longpress.js*.

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


[[Back](.)]