/**
* Copyright (c) 2026-present, Mike West
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
* 
*/



/** (version 0.3.0)
 * Collapsible allows you to expand and collapse sections with the click of the mouse.
 *
 * To use it, you have a give a container (typically a DIV, SECTION, or TABLE) the class
 * "collapsible-section".  The first child of the container (typically a H2 or TR) will
 * be turned into a trigger that, when clicked, causes the remaining children to appear
 * or disappear.
 *
 * Note that the first element child does not *have* to include a button, but it is good
 * practice for it to do so as this helps with the accessibility of your web page.
 *
 * e.g.,
 * ```html
 * <section class="collapsible-section">
 * <h2><button>Rutabagas</button></h2>
 * <p>Rutabagas are a vegetable.</p>
 * <p>Some people like them. Some people don't</p>
 * </section>
 * ```
 */
 
const collapsibleBootstrap = () => {

const getLocalStorageKey = (element) => {
    if (!element) return 'collapse-NULL'
    return'collapse-' + element.innerHTML.replace(/<.*?>/g, '').replace(/\W+/g, '-')
}

const toggle = (event) => {
    var container = event.target
    var className = null
    while (container) {
        className = container.getAttribute('class') || ''
        if (className.indexOf('collapsible-section') != -1) break;
        container = container.parentNode
    }
    if (!container) {
        console.error('no collapsible-section found!')
        return
    }
    const shouldCollapse = className.split(' ').indexOf('collapsed') === -1
    const containers = event.metaKey ? document.getElementsByClassName('collapsible-section') : [container]
    for (container of containers) {
        window.localStorage.setItem(getLocalStorageKey(container.firstElementChild), shouldCollapse)
        const classNames = container.getAttribute('class').split(' ').filter(s => s != 'collapsed')
        if (shouldCollapse) {
            classNames.push('collapsed')
        }
        container.setAttribute('class', classNames.join(' '))
    }
}

const wireUpCollapsibles = () => {
    const collapsibles = document.getElementsByClassName('collapsible-section')
    for (section of collapsibles) {
        const key = getLocalStorageKey(section.firstElementChild)
        const first = section.firstElementChild
        const target = first.getElementsByTagName('button')[0] || first
        target.addEventListener('mouseup', toggle)
        if (window.localStorage.getItem(key) == 'true') {
            section.setAttribute('class', section.getAttribute('class') + ' collapsed')
        }
    }
    cssRules = `
        .collapsible-section.collapsed > :not(:first-child) {
            display: none;
        }
    `.replace(/\n {4,8}/g, '\n')
    const head = document.getElementsByTagName('head')[0]
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.innerHTML = cssRules
    head.appendChild(style)
}

window.addEventListener('load', wireUpCollapsibles)

}

collapsibleBootstrap()


/** (version 0.3.0)
 * Filterbox allows you to use checkboxes to show and hide rows of data.
 *
 * To use it, you ensure that your HTML has a controls block. Note that if you omit the
 * `id=""` and `for=""` tags on the input and label, they will be inferred from the
 * label contents.  In the code below
 *
 * - the first checkbox toggles "cats" (despite the label being "Felines")
 * - the second toggles "dogs" (inferred from the label)
 * - the third toggles "bugs", and ignores the explanatory text after the colon
 * - the fourth toggles "bugs", and ignores the explanatory text in parenthesis
 * - the fifth toggles "eight-legs" (8 became eight since CSS class names cannot begin with digits)
 * - the sixth toggles "birds-and-bees" (spaces become hyphens)
 * - the seventh toggles both "birds" and "Bees" (commas separate items)
 *
 * ```html
 * <ul class="filterbox-controls filter-animals">
 * <li><input type="checkbox" id="cats"><label for="cats">Felines</label></li>
 * <li><input type="checkbox"><label>Dogs</label></li>
 * <li><input type="checkbox"><label>Bugs: six-legged beasties</label></li>
 * <li><input type="checkbox"><label>Bugs (six-legged beasties)</label></li>
 * <li><input type="checkbox"><label>8-Legs (arachnids and octopi)</label></li>
 * <li><input type="checkbox"><label>Birds and Bees</label></li>
 * <li><input type="checkbox"><label>Birds, Bees</label></li>
 * </ul>
 * ```
 *
 * Your HTML also must have a data block:
 *
 * ```html
 * <table class="filterbox-data filter-animals">
 * <th>...</th>
 * <tr class="cats">...</tr>
 * <tr class="cats">...</tr>
 * <tr class="dogs">...</tr>
 * <tr class="bugs">...</tr>
 * <tr class="eight-legs">...</tr>
 * <tr class="birds">...</tr>
 * <tr class="bees">...</tr>
 * <tr class="birds-and-bees">...</tr>
 * </table>
 * ```
 *
 * When the user toggles the checkbox for a given id, all data elements with that
 * CSS class have their visibility toggled. In the case above if the user toggles
 * the last checkbox both the "birds" and "bees" rows will be hidden, but not the
 * "birds-and-bees" row.
 *
 * ***
 *
 * Filterbox pairs very nicely with checkbox-radio-group, which allow the user to
 * command-click (or long-press) to toggle the visibility of all items *except* the one
 * they just selected, and with stored-checkbox-state, which preserves checkbox state
 * across page-loads using local storage.
 *
 * It also pairs nicely with stored-checkbox-state, which preserves checkbox state in
 * local-storage between page-loads.
 *
 * If you do use either or both of these other files you must include them *after* this
 * one, so that this file's setup will have created the checkbox html elements (and
 * attached its event listeners) before those files attempt to work with them.
 *
 */
 
const filterboxBootstrap = () => {

/**
 * By default the script looks for combo values, but you can disable this if you
 * do not use combos and have a sufficiently-large data set that the search is
 * causing performance problems.
 *
 * A combo is a data class that contains more than one of the filtered values, e.g.,
 *      <div class="filterbox-controls filter-traits">
 *        <div><input type="checkbox"><label>Eggs</label></div>
 *        <div><input type="checkbox"><label>Lactation</label></div>
 *        <div><input type="checkbox"><label>Scales</label></div>
 *      </div>
 *      <ul class="filterbox-data">
 *        <li class="lactation">Cat<li>
 *        <li class="eggs">Robin<li>
 *        <li class="eggs lactation">Platypus<li>
 *        <li class="scales">Snake<li>
 *      </ul>
 *
 * Without looking for combos, checking "Eggs" and not "Lactation" will result
 * in both "Cat" and "Platypus" being hidden due to the simple CSS rules
 *      .filterbox-data.filter-traits.hide-eggs .eggs { display: none }
 *      .filterbox-data.filter-traits.hide-lactation .lactation { display: none }
 *      .filterbox-data.filter-traits.hide-scales .scales { display: none }
 *
 * With combos enabled, checking "Eggs" and not "Lactation" will reveal both
 * "Robin" and "Platypus" because of a more sophisticated set of rules
 *      .filterbox-data.filter-traits.hide-eggs.hide-lactations .eggs.lactation { display: none }
 *      .filterbox-data.filter-traits.hide-eggs .eggs:not(.eggs.lactation) { display: none }
 *      .filterbox-data.filter-traits.hide-lactation .lactation:not(.eggs.lactation) { display: none }
 *      .filterbox-data.filter-traits.hide-scales .scales { display: none }
 *
 * Note that checking "eggs" and unchecking "scales" hides the snake because the "Snake"
 * line item does not have the "eggs" css class (though it probably should). If it did,
 * then rules would have been constructed to handle that scenario as well.
 */
const shouldLookForCombos = true

/**
 * Turn '3d' into 'three-d' and '32flavors' into 'three-two-flavors' since CSS class names
 * cannot begin with a digit.
 */
const digitsToWords = (text) => {
    return text
        .replace('0', 'zero-')
        .replace('1', 'one-')
        .replace('2', 'two-')
        .replace('3', 'three-')
        .replace('4', 'four-')
        .replace('5', 'five-')
        .replace('6', 'six-')
        .replace('7', 'seven-')
        .replace('8', 'eight-')
        .replace('9', 'nine-')
        .replace(/\W+/g, '-')
}

/**
 * Given '3 Musketeers' return 'three-musketeers'
 */
const textToCssClass = text => {
    return digitsToWords(text).replace(/\W+/, '-').toLocaleLowerCase()
}

/**
 * Adds a class to all filterbox-data containers to hide (or not hide) elements with
 * the given filtered values for a given filter-value type. e.g. given 'animal', 'cat',
 * and 'false', it will turn
 *    <div class="filterbox-data animal">
 * into
 *    <div class="filterbox-data animale hide-cat">
 * so that the CSS rules will hide all <div class="cat"> child elements.
 */
const setVisibility = (filterType, filterClassName, flag) => {
    const targetClassName = `filterbox-data ${filterType}`
    const filterContainers = document.getElementsByClassName(targetClassName)
    if (!filterContainers.length) {
        console.error(`no element with class="${targetClassName}"`)
        return
    }
    for (container of filterContainers) {
        for (filterValue of filterClassName.split(' ')) {
            filterValue = digitsToWords(filterValue)
            const className = container.getAttribute('class') || ''
            const hiddenPart = `hide-${filterValue}`
            const parts = className.split(' ').filter(x => x != hiddenPart)
            if (!flag) {
                parts.push(hiddenPart)
            }
            container.setAttribute('class', parts.join(' '))
        }
    }
}

/**
 * Given an HTML container element, decorate any <input type="checkbox"> elements with
 * change-event listeners that will toggle the visibility of corresponding data elements
 * in any filterbox-data containers.
 *
 * The passed cssRules array will be populated with CSS rules that should be injected
 * into the document's <head> to actually accomplish the visibility changes.
 */
const wireUpFilterControlContainer = (container, cssRules) => {
    const filterType = container.getAttribute('class').split(' ').filter(x => x.startsWith('filter-'))[0]
    if (!filterType) {
        console.error('filterbox-controls lacks a filter-TYPE class:', container)
        return
    }
    var filterableValues = []
    const toggles = container.getElementsByTagName('input')
    for (toggle of toggles) {
        const toggleId = toggle.getAttribute('id')
        const label = toggle.nextElementSibling
        const filterValues = toggleId
            ? [toggleId]
            : label.innerHTML
                .replace(/<span class="text">(.*?)<\/span>\s*/m, '$1')
                .replace(/<span class="icon">(.*?)<\/span>\s*/m, '')
                .toLocaleLowerCase()
                .replace(/ *[(].*[)]/, '')
                .replace(/:.*/, '')
                .split(/, */)
                .map(x => x.replace(/\W+/g, ' ').trim().replace(/ /g, '-'))
        filterableValues.push(...filterValues)
        const filterId = `${filterType}-${filterValues.join('-')}`
        const filterClassName = filterValues.join(' ')
        if (!toggleId) { toggle.setAttribute('id', filterId) }
        if (!toggle.getAttribute('class')) { toggle.setAttribute('class', filterClassName) }
        const stateChange = event => {
            setVisibility(filterType, filterClassName, event.target.checked)
        }
        label.setAttribute('for', toggleId || filterId)
        toggle.addEventListener('change', stateChange)
        toggle.checked = true
    }
    if (!shouldLookForCombos) {
        // without combos the hiding rules are very simple
        for (filterValue of filterableValues) {
            filterValue = textToCssClass(filterValue)
            cssRules.push(`.filterbox-data.${filterType}.hide-${filterValue} .${filterValue} { display: none }`)
        }
    } else {
        // first, go through all data containers looking for combos
        const combos = new Set() // e.g., {'audio & video', 'photo & video'}
        const classes = new Set(filterableValues.map(textToCssClass))
        for (dataContainer of document.getElementsByClassName('filterbox-data')) {
            for (dataElement of dataContainer.children) {
                const cssClass = dataElement.getAttribute('class') || ''
                const classNames = cssClass.split(/ +/).filter(s => classes.has(s))
                if (classNames.length > 1) {
                    const sortedClassNames = classNames.sort()
                    combos.add(sortedClassNames.join(' & '))
                }
            }
        }
        const comboArrays = Array.from(combos).sort().map(c => c.split(' & ')) // e.g., [['audio', 'video'], ['photo', 'video']]
        const comboValues = new Set(comboArrays.flat()) // e.g., {'audio', 'photo', 'video'}
        
        // second, emit the simple rules for values which are never part of a combo
        for (filterValue of filterableValues.filter(v => !comboValues.has(v))) {
            filterValue = textToCssClass(filterValue)
            cssRules.push(`.filterbox-data.${filterType}.hide-${filterValue} .${filterValue} { display: none }`)
        }
        
        // third, emit rules for hiding a combo if all of its elements are hidden
        for (combo of comboArrays) {
            const comboClass = combo.join('.')
            const hideClasses = combo.map(v => `.hide-${v}`).join('')
            cssRules.push(`.filterbox-data.${filterType}${hideClasses} .${comboClass} { display: none }`)
        }
        
        // finally, emit rules for hiding a row if it has some 
        const comboClassArray = comboArrays.map(a => '.' + a.join('.')) // e.g., ['.audio.video', '.photo.video']
        const notAnyCombo = comboClassArray.map(c => `:not(${c})`).join('')
        for (filterValue of Array.from(comboValues).sort()) {
            cssRules.push(`.filterbox-data.${filterType}.hide-${filterValue} .${filterValue}${notAnyCombo} { display: none }`)
        }
    }
}

/**
 * Locates all HTML container elements with class 'filterbox-controls' and wires up the
 * checkboxes within them as visibility controls.
 */
const wireUpAllFilterControlContainers = () => {
    const cssRules = []
    const filterControlContainers = document.getElementsByClassName('filterbox-controls')
    for (container of filterControlContainers) {
        wireUpFilterControlContainer(container, cssRules)
    }
    const head = document.getElementsByTagName('head')[0]
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.innerHTML = cssRules.join('\n')
    head.appendChild(style)
}

window.addEventListener('load', wireUpAllFilterControlContainers)
 
}
filterboxBootstrap()


/** (version 0.3.0)
 */
 
const longpressBootstrap = () => {

    var metaKey = false
    var justPerformedLongPress = false
    var timeout = null

    /**
     * Returns the id of the button, checkbox, link, etc. associated with the given
     * element node.  This will be
     * - the value of the 'id' attribute, if the element is a checkbox, button, or link
     * - the value of the 'for' attribute, if the element is a label
     * - the 'id' or 'for' of the parent element, if neither of the above apply
     */
    const getControlId = element => {
        if (!element) return null
        const type = element.tagName
        const id = type == 'LABEL'
            ? element.getAttribute('for')
            : type == 'A' || type == 'BUTTON' || type == 'INPUT' ? element.getAttribute('id') : null
        if (id) return id
        return getControlId(element.parentNode)
    }
    
    /**
     * Event handler for mousedown or touchstart events on either checkboxes or their labels.
     *
     * Clears any outstanding long-press timers and starts a new one.
     */
    const hit = (event) => {
        justPerformedLongPress = false
        event.target.justHadLongPress = justPerformedLongPress
        metaKey = event.metaKey
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(longPress, 1000, event)
        return false
    }
    
    /**
     * Event handler for mouseup or touchend events on either checkboxes or their labels.
     *
     * Clears any outstanding long-press timers to prevent the long-press action from occurring.
     */
    const release = (event) => {
        event.target.justHadLongPress = justPerformedLongPress
        if (justPerformedLongPress) {
            event.preventDefault()
            return true
        }
        
        metaKey = event.metaKey
        if (timeout) {
            clearTimeout(timeout)
            timeout = null
        }
        
        // command-clicking is the same as a long-press
        if (event.metaKey && !justPerformedLongPress) {
            longPress(event)
            event.preventDefault
        }
        
        return true
    }
    
    const click = (event) => {
        event.target.justHadLongPress = justPerformedLongPress
        if (justPerformedLongPress) {
            event.preventDefault()
            return true
        }
        return false
    }
    
    const change = (event) => {
        event.target.justHadLongPress = justPerformedLongPress
        if (justPerformedLongPress) {
            event.preventDefault()
            return true
        }
        return false
    }
    
    /**
     * Pseudo-event handler for long-presses on buttons, checkboxes, etc. or their labels.
     *
     * Looks to see if any other checkboxes are checked and if so, solos the target checkbox.
     * If not, de-solos the target checkbox.
     */
    const longPress = (event) => {
        timeout = null
        metaKey = true
        const htmlFor = getControlId(event.target)
        const element = htmlFor ? document.getElementById(htmlFor) : event.target
        if (!element) {
            console.error('no button, checkbox, or link is associated with the event', event)
            return false
        }
        if (element.getAttribute('type') == 'checkbox') {
            // we get the event before the user has released the mouse, so we
            // must toggle the state ourselves
            element.checked = !element.checked
        }
        const newEvent = new Event('longpress')
        for (key in Object.keys(event)) {
            newEvent[key] = event[key]
        }
        newEvent.type = 'longpress'
        element.dispatchEvent(newEvent)
        justPerformedLongPress = true
        
        return false
    }
    
    const wireUpMouseHandlers = (elements) => {
        for (element of elements) {
            element.addEventListener('mousedown', hit)
            element.addEventListener('mouseup', release)
            element.addEventListener('click', click)
            element.addEventListener('touchstart', hit)
            element.addEventListener('touchend', release)
        }
    }
    
    const wireUpChangeHandlers = (elements) => {
        for (element of elements) {
            element.addEventListener('mousedown', hit)
            element.addEventListener('mouseup', release)
            element.addEventListener('click', click)
            element.addEventListener('touchstart', hit)
            element.addEventListener('touchend', release)
            element.addEventListener('change', change)
        }
    }
    
    const wireUpInteractiveElements = () => {
        wireUpMouseHandlers(document.getElementsByTagName('button'))
        wireUpMouseHandlers(document.getElementsByTagName('a'))
        const allInputs = Array.from(document.getElementsByTagName('input'))
        const allLabels = Array.from(document.getElementsByTagName('label'))
        wireUpChangeHandlers(allInputs.filter(e => e.getAttribute('type') == 'checkbox'))
        wireUpChangeHandlers(allInputs.filter(e => e.getAttribute('type') == 'radio'))
        wireUpMouseHandlers(allLabels)
    }
    
    window.addEventListener('load', wireUpInteractiveElements)

}

longpressBootstrap()


/** (version 0.3.0)
 * Navigation Without Bookmarks allows the user to click anchor links (e.g., <a href="#foo">)
 * to jump to that portion of the web page without adding the anchor to the end of the
 * URL.
 */ 
const navigationWithoutBookmarksBootstrap = () => {

const navigate = event => {
    const href = event.target.getAttribute('href')
    if (href.startsWith('#')) {
        event.preventDefault()
        const destination = document.getElementById(href.substring(1))
        
        // we push state so the browser back button will return to the previous
        // scroll position
        history.pushState('', null)
        
        // and then we navigate without pushing the anchor onto the url, so the user
        // can reload the page without then autoscrolling to to this item
        destination.scrollIntoView()
        return true
    }
}

const wireUpNavigationLinks = () => {
    const containers = document.getElementsByClassName('navigation-without-bookmarks')
    for (container of containers) {
        const links = Array.from(container.getElementsByTagName('a'))
        for (link of links.filter(l => (l.getAttribute('href') || '').startsWith('#'))) {
            link.addEventListener('click', navigate)
        }
    }
}

window.addEventListener('load', wireUpNavigationLinks)

}

navigationWithoutBookmarksBootstrap()


/** (version 0.3.0)
 * Radio Checkbox Groups allow you to have checkboxes which behave like radio buttons
 * when Command-clicked or long-pressed.
 *
 * To use it, add the class 'radio-checkbox-group' to a container.  Now any checkboxes
 * within the container will behave normally when toggled, unless the Command key (on
 * a mac) or Control key (on Windows) is held, or if the checkbox is long-pressed on a
 * phone or tablet or long-clicked on computer.  Any of these gestures will trigger the
 * radio-checkbox-group behavior.
 *
 * The radio-checkbox-group behavior is very straightforward. If any checkbox other than
 * the target is checked then the target will be "soloed", which is to say that it will
 * be checked and all of the others will be unchecked. If all checkboxes other than the
 * target are unchecked then the soloing will be cancelled and all checkboxes will be
 * checked.
 *
 * Note that soloing and de-soloing will trigger **change** events for many of the
 * checkboxes in the group. If your change-handling code needs to know which checkbox
 * was actually clicked, you can check `event.target.isSoloTarget`; this will be `true`
 * for the checkbox the user clicked on and `undefined` for all the rest.
 */
 
const radioCheckboxGroupsBootstrap = () => {

const wireUpCheckboxes = (checkboxes, labels) => {
    var metaKey = false
    var justPerformedLongPress = false
    var timeout = null
    
    /**
     * Returns the id of the checkbox associated with the given element node.  This will be
     * - the value of the 'id' attribute, if the element is a checkbox
     * - the value of the 'for' attribute, if the element is a label
     * - the 'id' or 'for' of the parent element, if neither of the above apply
     */
    const getCheckboxId = element => {
        if (!element) return null
        const type = element.tagName
        const id = type == 'LABEL'
            ? element.getAttribute('for')
            : type == 'INPUT' ? element.getAttribute('id') : null
        if (id) return id
        return getCheckboxId(element.parentNode)
    }
    
    /**
     * Returns the checkbox associated with the given element, which may be
     * - a checkbox
     * - a label with a 'for' attribute
     * - a child of such a label
     *
     * Returns null if no such checkbox can be found.
     */
    const getAssociatedCheckbox = element => {
        if (!element) return null;
        if (element.tagName === 'INPUT' && element.getAttribute('type') === 'checkbox') return element;
        const id = getCheckboxId(element)
        return id && document.getElementById(id)
    }
    
    /**
     * Returns true iff any checkbox other than the given target is currently checked.
     */
    const isAnyOtherCheckboxChecked = target => {
        for (checkbox of checkboxes) {
            if (checkbox === target) continue
            if (checkbox.checked) return true
        }
        return false
    }
    
    /**
     * Sets the state of the checkbox and dispatches a change event.
     */
    const setChecked = (checkbox, flag) => {
        if (checkbox.checked == flag) return
        checkbox.checked = flag
        const event = new Event('change')
        event.target = checkbox
        checkbox.dispatchEvent(event)
    }
    
    /**
     * Checks the target checkbox and unchecks all the others.
     */
    const solo = target => {
        for (checkbox of checkboxes) {
            setChecked(checkbox, target === checkbox)
        }
    }
    
    /**
     * Checks all checkboxes.
     */
    const desolo = target => {
        for (checkbox of checkboxes) {
            setChecked(checkbox, true)
        }
    }
    
    /**
     * Event handler for mousedown or touchstart events on either checkboxes or their labels.
     *
     * Clears any outstanding long-press timers and starts a new one.
     */
    const hit = event => {
        metaKey = event.metaKey
        justPerformedLongPress = false
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(longPress, 1000, event)
        return false
    }
    
    /**
     * Event handler for mouseup or touchend events on either checkboxes or their labels.
     *
     * Clears any outstanding long-press timers to prevent the long-press action from occurring.
     */
    const release = event => {
        metaKey = event.metaKey
        if (timeout) {
            clearTimeout(timeout)
            timeout = null
        }
        
        // command-clicking is the same as a long-press
        if (event.metaKey && !justPerformedLongPress) {
            longPress(event)
        }
        
        // This gets a bit tricky... If the user long-pressed on a checkbox then we will
        // have soloed (or de-soloed) the checkboxes when the long-press timer went off.
        // But then the user releases the mouse button or lifts their finger and the
        // built-in checkbox toggling occurs and deselects the target.
        // We want to prevent this so the target remains selected, but it appears that
        // event.preventDefault() on the mouseup event does not prevent the change event
        // from occurring... so we need to take a different approach.
        if (justPerformedLongPress) {
            const checkbox = getAssociatedCheckbox(event.target)
            const wasChecked = checkbox.checked
            
            // On macOS we can simply toggle the checkbox manually (to un-checked) and then
            // when the built-in checkbox-toggling code executes it will be set to checked
            // and the event handlers will fire. That second firing is unnecessary, but
            // harmless since the checkbox state is correct.
            if (checkbox) {
                checkbox.checked = !wasChecked
            } else {
                console.error('Could not find a checkbox associated with event', event)
            }
            
            // Unfortunately, the above pre-toggling does NOT work on iOS, so instead
            // we need to wait until the change event has propagated and then change it
            // back. This is unfortunate because any logic associated with toggling the
            // checkbox will fire twice (once with checked==false and then again with
            // checked=true), but it seems to happen before the screen redraws so there
            // is no visible flicker.
            setTimeout(() => {
                if (checkbox.checked != wasChecked) {
                    checkbox.checked = wasChecked;
                    const event = new Event('change')
                    event.target = checkbox
                    checkbox.dispatchEvent(event)
                }
            }, 0)
        }
        return false
    }
    
    /**
     * Pseudo-event handler for long-presses on checkboxes or their labels.
     *
     * Looks to see if any other checkboxes are checked and if so, solos the target checkbox.
     * If not, de-solos the target checkbox.
     */
    const longPress = event => {
        timeout = null
        metaKey = true
        const htmlFor = getCheckboxId(event.target)
        const checkbox = htmlFor ? document.getElementById(htmlFor) : event.target
        if (!checkbox) {
            console.error('no checkbox is associated with the event', event)
            return false
        }
        checkbox.isSoloTarget = true
        if (isAnyOtherCheckboxChecked(checkbox)) {
            solo(checkbox)
        } else {
            desolo(checkbox)
        }
        justPerformedLongPress = true
        setTimeout(() => delete checkbox.isSoloTarget, 100)
        
        return false
    }
    
    for (checkbox of checkboxes) {
        checkbox.addEventListener('mousedown', hit)
        checkbox.addEventListener('mouseup', release)
        checkbox.addEventListener('touchstart', hit)
        checkbox.addEventListener('touchend', release)
    }
    for (label of labels) {
        label.addEventListener('mousedown', hit)
        label.addEventListener('mouseup', release)
        label.addEventListener('touchstart', hit)
        label.addEventListener('touchend', release)
    }
}

const injectCSS = () => {
    cssRules = `
        .radio-checkbox-group input,
        .radio-checkbox-group label {
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
        }
    `.replace(/\n {4,8}/g, '\n')
    const head = document.getElementsByTagName('head')[0]
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.innerHTML = cssRules
    head.appendChild(style)
}

const wireUpRadioGroups = () => {
    const containers = document.getElementsByClassName('radio-checkbox-group')
    for (container of containers) {
        const checkboxes = Array.from(container.getElementsByTagName('input'))
            .filter(e => e.getAttribute('type') == 'checkbox')
        const checkboxIds = new Set(checkboxes.map(e => e.getAttribute('id')).filter(id => !!id))
        const labels = Array.from(container.getElementsByTagName('label'))
            .filter(e => checkboxIds.has(e.getAttribute('for')))
        wireUpCheckboxes(checkboxes, labels)
    }
    injectCSS()
}

window.addEventListener('load', wireUpRadioGroups)

}

radioCheckboxGroupsBootstrap()


/** (version 0.3.0)
 * Stored Checkbox State preserves checkbox state between webpage reloads.
 *
 * If you decorate a container with `class="stored-checkbox-state"` then any checkboxes
 * within it will have their state preserved in local storage between launches.
 */
 
const storedCheckboxStateBootstrap = () => {

const onChange = event => {
    const id = event.target.id
    if (!id) return
    window.localStorage.setItem('cached-' + id, event.target.checked)
}

const wireUpElements = () => {
    const containers = document.getElementsByClassName('stored-checkbox-state')
    for (container of containers) {
        const inputs = Array.from(container.getElementsByTagName('input'))
        const checkboxes = inputs.filter(e => e.getAttribute('type') == 'checkbox' && !!e.getAttribute('id'))
        for (input of checkboxes) {
            input.addEventListener('change', onChange)
            const id = input.getAttribute('id')
            const state = window.localStorage.getItem('cached-' + id)
            const checked = state == 'true'
            if (state && checked != input.checked) {
                input.checked = checked
                const event = new Event('change')
                event.target = input
                input.dispatchEvent(event)
            }
        }
    }
}

window.addEventListener('load', wireUpElements)

}

storedCheckboxStateBootstrap()
