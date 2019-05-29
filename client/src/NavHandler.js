const DEFAULT_LOADER_DELAY_MS = 2000
let activeLink = null
let showLoader
let hideLoader
let timer

/*
 *
 * This class works in conjunction with AsyncLink and SyncLink and handles the current state of the navigation.
 * This class tracks:
 *  1. The last link that a user clicked.
 *  2. Whether or not a loader should be shown.
 * 
 * After data has been fetched by AsyncLink, it will check this class to see if the route should transition or not.
 * If the user has clicked on another link in the meantime, the previously clicked link will not be transitioned to.
 *
 */
export default function NavHandler(showLoaderCallback, hideLoaderCallback) {
    const navHandler = Object.create(NavHandler.prototype)
    showLoader = showLoaderCallback
    hideLoader = hideLoaderCallback

    return navHandler
}

NavHandler.prototype.asyncNavClicked = function(path, showLoaderAfterMs = DEFAULT_LOADER_DELAY_MS) {
    activeLink = path
    clearTimeout(timer)
    timer = setTimeout(() => {
        if (activeLink === path) {
            showLoader()
        }
    }, showLoaderAfterMs)
}

NavHandler.prototype.syncNavClicked = function(path) {
    activeLink = path
    hideLoader()
}

NavHandler.prototype.IsLoading = function() {
    return activeLink != null
}

NavHandler.prototype.setLoadingComplete = function(path) {
    if (activeLink === path) {
        activeLink = null
        hideLoader()
    }
}

NavHandler.prototype.shouldRouteTo = function(path) {
    return activeLink === path
}