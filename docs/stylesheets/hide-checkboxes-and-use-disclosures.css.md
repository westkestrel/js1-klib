# hide-checkboxes-and-use-disclosures.css


Given a DOM structure like
     <ul class="hide-checkboxes-and-use-disclosures">
         <li><input type="checkbox" id="a"><label for="a">My Label</label></li>
     </ul>

These CSS rules will hide the checkbox and will instead draw a disclosure triangle.
When the checkbox is checked and unchecked the triangle will animate a rotation from
pointing right to pointing down.   Note that the hidden checkbox is still interactive
since it has a label that the user can click on.


[[Back](.)]