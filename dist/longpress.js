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
