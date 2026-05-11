/**
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
