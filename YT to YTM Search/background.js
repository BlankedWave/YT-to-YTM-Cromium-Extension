chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "yt2music",
    title: "Open in YouTube Music (Search)",
    contexts: ["link", "page"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "yt2music") return;

  let searchQuery = "";

  // Case 1: Right-clicked on a link
  if (info.linkUrl) {
    try {
      const url = new URL(info.linkUrl);
      if (url.hostname.includes("youtube.com") && url.searchParams.has("v")) {
        // Use the URL's title or fallback to full URL
        searchQuery = decodeURIComponent(url.searchParams.get("v"));
      }
    } catch (e) {
      console.error("Invalid link URL:", e);
    }
  }

  // Case 2: Right-clicked on a page (YouTube video page)
  if (!searchQuery && tab && tab.url.includes("youtube.com/watch")) {
    searchQuery = tab.title;
  }

  // Fallback: just use whatever we can
  if (!searchQuery && info.linkUrl) {
    searchQuery = info.linkUrl;
  }

  // Construct search URL
  if (searchQuery) {
    const musicSearchUrl = `https://music.youtube.com/search?q=${encodeURIComponent(searchQuery)}`;
    chrome.tabs.create({ url: musicSearchUrl });
  } else {
    console.warn("No valid query found to search on YouTube Music.");
  }
});
