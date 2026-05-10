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



/** (version 0.1.0)
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
 * <section>
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
    while (container && (container.getAttribute('class') || '').indexOf('collapsible-section') == -1) {
        container = container.parentElement
    }
    if (!container) {
        console.error('no collapsible-section found!')
        return
    }
    const shouldCollapse = container.getAttribute('class').split(' ').indexOf('collapsed') === -1
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
        .collapsible-section.collapsed > :first-child {
            color: gray;
        }
        .collapsible-section:not(.collapsed) > :first-child:hover,
        .collapsible-section.collapsed > :first-child:not(:hover) {
            text-decoration: line-through;
        }
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


/** (version 0.1.0)
 * Filterbox allows you to use checkboxes to show and hide rows of data.
 *
 * To use it, you ensure that your HTML has a controls block. Note that if you omit the
 * `id=""`` and `for=""`` tags on the input and label, they will be inferred from the
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
 * ````
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
 * ````
 *
 * When the user toggles the checkbox for a given id, all data elements with that
 * CSS class have their visibility toggled. In the case above if the user toggles
 * the last checkbox both the "birds" and "bees" rows will be hidden, but not the
 * "birds-and-bees" row.
 */
 
const filterboxBootstrap = () => {

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
}

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

const wireUpCheckboxes = () => {
    const cssRules = []
    const filters = document.getElementsByClassName('filterbox-controls')
    var metaKey = false
    const captureMetaKey = event => { metaKey = event.metaKey }
    for (filter of filters) {
        const filterType = filter.getAttribute('class').split(' ').filter(x => x.startsWith('filter-'))[0]
        if (!filterType) {
            console.error('filterbox-controls lacks a filter-TYPE class:', filter)
            continue
        }
        const toggles = filter.getElementsByTagName('input')
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
            const filterId = `${filterType}-${filterValues.join('-')}`
            const filterClassName = filterValues.join(' ')
            if (!toggleId) { toggle.setAttribute('id', filterId) }
            if (!toggle.getAttribute('class')) { toggle.setAttribute('class', filterClassName) }
            label.setAttribute('for', toggleId || filterId)
            toggle.addEventListener('mousedown', captureMetaKey)
            toggle.addEventListener('mouseup', captureMetaKey)
            label.addEventListener('mousedown', captureMetaKey)
            label.addEventListener('mouseup', captureMetaKey)
            toggle.addEventListener('change', event => {
                if (metaKey) {
                    const wasChecked = event.target.checked
                    var allOthersWereChecked = true
                    for (t of toggles) {
                        if (t.getAttribute('id') != event.target.getAttribute('id')) {
                            allOthersWereChecked = allOthersWereChecked && t.checked
                        }
                    }
                    for (t of toggles) {
                        if (t.getAttribute('id') != event.target.getAttribute('id')) {
                            t.checked = !allOthersWereChecked
                            setVisibility(filterType, t.getAttribute('class'), !allOthersWereChecked)
                        } else {
                            t.checked = !wasChecked
                            setVisibility(filterType, filterClassName, t.checked)
                        }
                    }
                } else {
                    setVisibility(filterType, filterClassName, event.target.checked)
                }
            })
            toggle.checked = true
            for (filterValue of filterValues) {
                filterValue = digitsToWords(filterValue)
                cssRules.push(`.filterbox-data.${filterType}.hide-${filterValue} .${filterValue} { display: none }`)
            }
        }
    }
    const head = document.getElementsByTagName('head')[0]
    const style = document.createElement('style')
    style.setAttribute('type', 'text/css')
    style.innerHTML = cssRules.join('\n')
    head.appendChild(style)
}

window.addEventListener('load', wireUpCheckboxes)
 
}
filterboxBootstrap()
