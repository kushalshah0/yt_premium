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
        const adShowing = document.querySelector('.ad-showing');
        const ad2Showing = document.querySelector('#video-ads');
        const bannerShowing = document.querySelector('.player-ads');
        const adMiniBanner = document.querySelector('.ytd-ad-slot-renderer');
        const skipButtonShowing = document.querySelector('#ytp-ad-skip-button-modern');
        const adContainerShowing = document.querySelector('.ytp-cultural-moment-player-content');
        const blockMessageShown = document.querySelector('ytd-enforcement-message-view-model');
        const premiumDialogShowing = document.querySelector('.mealbar-promo-renderer');
        const button = document.querySelector('efyt-not-interested');

        removeElement(bannerShowing);
        removeElement(ad2Showing);
        removeElement(adMiniBanner);
        removeElement(adContainerShowing);
        removeElement(premiumDialogShowing?.parentNode);
        clickElement(skipButtonShowing);

        if (blockMessageShown) {
            navigateHistory();
            blockCounter++;
        }

        if (blockCounter > 10) {
            handleAdBlockerRetry();
        }

        if (button) {
            button.click();
            failCounter = 0;
        } else {
            handleButtonNotFound();
        }

        if (failCounter > 10) {
            handleFailedToFindButton();
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

function handleButtonNotFound() {
    console.error(`Failed to find button. Retrying in ${searchInterval} ms`);
    failCounter++;
}

function handleFailedToFindButton() {
    const buttonNotFound = window.confirm("Failed to find the 'Remove Ads' button. Please make sure that Enhancer for YouTube is installed.\n\nPress 'OK' to redirect to the installation page.\nPress 'Cancel' to disable the YouTube ad-blocker script for this session.");
    if (buttonNotFound) {
        window.open("https://chrome.google.com/webstore/detail/enhancer-for-youtube/ponfpcnoihfmfllpaingbgckeeldkhle");
        failCounter = 0;
    } else {
        masterSwitch = false;
    }
}

// Execute the ad removal function at intervals
setInterval(removeAds, searchInterval);