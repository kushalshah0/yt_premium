// adBlocker.js

const searchInterval = 50;
let failCounter = 0;
let blockCounter = 0;
let masterSwitch = true;

function removeAds() {
    const currentURL = window.location.href;

    if (!masterSwitch || !currentURL.includes("youtube.com")) {
        return;
    }

    if (/https:\/\/www\.youtube\.com\/watch\?.*/.test(currentURL)) {
        // Select elements that may contain ads
        const adShowing = document.querySelector('.ad-showing');
        const ad2Showing = document.querySelector('#video-ads');
        const bannerShowing = document.querySelector('.player-ads');
        const adMiniBanner = document.querySelector('.ytd-ad-slot-renderer');
        const skipButtonShowing = document.querySelector('#ytp-ad-skip-button-modern');
        const adContainerShowing = document.querySelector('.ytp-cultural-moment-player-content');
        const blockMessageShown = document.querySelector('ytd-enforcement-message-view-model');

        // Remove ads if they are found
        removeElement(bannerShowing);
        removeElement(ad2Showing);
        removeElement(adMiniBanner);
        removeElement(adContainerShowing);
        clickElement(skipButtonShowing);

        if (blockMessageShown) {
            navigateHistory();
            blockCounter++;
        }

        if (blockCounter > 10) {
            handleAdBlockerRetry();
        }
    }

    if (/https:\/\/www\.youtube\.com\/$/.test(currentURL)) {
        const headAdShowing = document.querySelector('#masthead-ad');
        const adCardShowing = document.querySelector('ytd-ad-slot-renderer');
        const ytAdBanner = document.querySelector('ytd-statement-banner-renderer');

        removeElement(headAdShowing);
        if (adCardShowing || ytAdBanner) {
            const adParent = (adCardShowing || ytAdBanner).parentNode.parentNode;
            removeElement(adParent);
        }
    }
}

function removeElement(element) {
    if (element) {
        element.remove();
    }
}

function clickElement(element) {
    if (element) {
        element.click();
    }
}

function navigateHistory() {
    window.history.back();
    window.history.forward();
}

function handleAdBlockerRetry() {
    const blocker = window.confirm("Make sure there are no other ad-blockers working on this page.\n\nPress 'OK' to retry.\nPress 'Cancel' to disable the YouTube ad-blocker script for this session.");
    if (blocker) {
        blockCounter = 0;
    } else {
        masterSwitch = false;
    }
}

// Execute the ad removal function at intervals
setInterval(removeAds, searchInterval);