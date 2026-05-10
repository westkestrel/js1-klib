/**
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
