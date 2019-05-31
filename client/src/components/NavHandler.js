'use strict'

/*
 * Singleton.
 * This class works in conjunction with AsyncLink and SyncLink and handles the current state of the navigation.
 * This class tracks:
 *  1. The last link that a user clicked.
 *  2. Whether or not a loader should be shown.
 * 
 * After data has been fetched by AsyncLink, it will check this class to see if the route should transition or not.
 * If the user has clicked on another link in the meantime, the previously clicked link will not be transitioned to.
 *
 */
export default function NavHandler(showLoader, hideLoader) {
    if (NavHandler.instance) {
        return NavHandler.instance
    }

    if (!showLoader || !hideLoader) {
        return undefined
    }

    const DEFAULT_LOADER_DELAY_MS = 2000
    let activeLink
    let timer
    
    NavHandler.instance = {}
    NavHandler.instance.asyncNavClicked = function(path, showLoaderAfterMs = DEFAULT_LOADER_DELAY_MS) {
        clearTimeout(timer)
        activeLink = path
        timer = setTimeout(() => {
            if (activeLink === path) {
                showLoader()
            }
        }, showLoaderAfterMs)
    }

    NavHandler.instance.syncNavClicked = function(path) {
        activeLink = path
        hideLoader()
    }

    NavHandler.instance.IsLoading = function() {
        return activeLink != null
    }

    NavHandler.instance.setLoadingComplete = function(path) {
        if (activeLink === path) {
            activeLink = null
            hideLoader()
        }
    }

    NavHandler.instance.shouldRouteTo = function(path) {
        return activeLink === path
    }
    
    Object.freeze(NavHandler.instance)
    return Object.freeze(NavHandler.instance)
}