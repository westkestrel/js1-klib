# Change Log

### 0.3.1 (12-May-2026)

Fix a typo in the **longpress.js** doc comments.

Add a note to the **README** saying that the scripts have not been tested on Android devices.

## 0.3.0 (11-May-2026)

Add

- **longpress.js**: create a new "longpress" event that links, buttons, checkboxes, and radio buttons will deliver if the user long-presses (or Command-clicks on Mac, or Control-clicks on Windows) the element.
- **hide-checkboxes-and-dim-labels.css**: hides a checkbox and instead toggles the checkbox label between 50% and 100% opacity.
- **hide-checkboxes-and-line-through-labels.css**: hides a checkbox and instead toggles the checkbox label between line-through and normal font style.
- **hide-checkboxes-and-use-disclosures.css**: hides a checkbox and prefixes the label with a triangle that toggles between pointing down (checked) and to the right (unchecked).

Update **radio-checkbox-group.js** and **collapsible.js** to use the functionality provided by **longpress.js**.

Update **collapsible.js** to have the option of smoothly animating the expansion and collapse of the section.

Update **filterbox.js** so that a data element can have more than one class from a given filter set, and the element is shown if any of the relevant attributes are checked. e.g., if the filter set contains "lays eggs" and "lactates" then the Platypus would be shown if either of these were checked.

## 0.2.0 (10-May-2026)

Add

- **radio-checkbox-group.js**: long-press or Command-click (Control-Click on Windows) a checkbox to select it and deselect all others in the group. I.e., checkboxes that sometimes behave like radio buttons.
- **stored-checkbox-state.js**: remember checkbox state in localStorage and restore it when the page reloads.
- **navigation-without-bookmarks.js**: when using anchor links to jump around within a page, refrain from altering the URL in the navigation bar..

## 0.1.0 (10-May-2026)

Create initial library with

- **collapsible.js** (and **.css**): click the heading at the top of a section to collapse/expand the section.
- **filterbox.js**: toggle checkboxes in the filter-controls section to show/hide content in the filter-data section.

