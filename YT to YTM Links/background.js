/* background.js */

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "yt2music",
    title: "Open in YouTube Music",
    contexts: ["link", "page"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  let videoId = null;

  if (info.menuItemId === "yt2music") {
    // Case 1: Right-clicked on a link
    if (info.linkUrl) {
      try {
        const url = new URL(info.linkUrl);
        if (url.hostname.includes("youtube.com") && url.searchParams.has("v")) {
          videoId = url.searchParams.get("v");
        }
      } catch (e) {
        console.error("Invalid link URL:", e);
      }
    }

    // Case 2: Right-clicked on a YouTube video page
    else if (tab && tab.url.includes("youtube.com/watch")) {
      try {
        const url = new URL(tab.url);
        if (url.searchParams.has("v")) {
          videoId = url.searchParams.get("v");
        }
      } catch (e) {
        console.error("Invalid tab URL:", e);
      }
    }

    // If we got a video ID, open YouTube Music
    if (videoId) {
      const musicUrl = `https://music.youtube.com/watch?v=${videoId}`;
      chrome.tabs.create({ url: musicUrl });
    } else {
      console.warn("No video ID found to redirect to YouTube Music.");
    }
  }
});
