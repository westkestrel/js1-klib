# collapsible.css


Styling rules for use with the *collapsible.js* script. You can use these styles, or
can disregard them and do your own styling; the script works correctly in either case.

To use these styles, add the following CSS class names to an ancestor element of
your collapsible sections (e.g., the `body` tag).
- (no class required): buttons in collapse-control element (the first child of the element with the collapsible-section class) are styled like ordinary content.
- dim-when-collapsed: the collapse-control element is rendered semi-transparent when the content is collapsed.
- line-through-when-collapsed: the collapse-control element has a line drawn through it when the content is collapsed. This can be combined with dimming.
- rotate-chevron-when-collapsed: the collapse-control element is prefixed with a downward-pointing triangle, which is rotated to point to the right when the content is collapsed.
- animate-when-collapsed: the collapsing content shrinks to nothing rather than simply disappearing. Note that this does not behave correctly if the collapsing content consists of table rows, as table rows do not honour min-height.


[[Back](.)]