// Select all elements with `data-testid="cellInnerDiv`
const tweetContainers = document.querySelectorAll('[aria-label="Timeline: Your Home Timeline"] [data-testid="cellInnerDiv"]');

tweetContainers.forEach((container, index) => {
    const spans = container.querySelectorAll('[dir="auto"] span');
    const allText = Array.from(spans).map(span => span.textContent).join(' ');
    console.log(allText.trim());
});

// Flags to track observer activity
let isRootObserverActive = false;
let isTimelineObserverActive = false;

// Global variables for observers and timeline
let timeline;
let rootObserver;
let timelineObserver;

// Config for MutationObserver
const targetNode = document.getElementById("react-root");
const config = { attributes: false, childList: true, subtree: true };

// URL Change Listener
window.navigation.addEventListener("navigate", (event) => {
    console.log('URL: ', window.location.href);

    // Disconnect existing observers
    if (isRootObserverActive && rootObserver) {
        console.log("closed root observer");
        rootObserver.disconnect();
        isRootObserverActive = false;
    }
    if (isTimelineObserverActive && timelineObserver) {
        console.log("closed timeline observer");
        timelineObserver.disconnect();
        isTimelineObserverActive = false;
    }

    // Start the root observer
    findTimeline(targetNode, config)
        .then((timeline) => {
            console.log("Timeline found:", timeline);
            // Start observing the timeline for new tweets
            timelineObserver = new MutationObserver((mutationsList) => {
                isTimelineObserverActive = true;
                mutationsList.forEach(record => {
                    if (record.addedNodes.length > 0 && record.target === timeline && !record.addedNodes[0].hasAttribute("seen")) {
                        let post = record.addedNodes[0];
                        sendPostText(post);
                    }
                });
            });
            timelineObserver.observe(timeline, config);
        })
        .catch((error) => {
            console.error("Error observing mutations:", error);
        });
});

// Root div observer promise wrapper
function findTimeline(targetNode, config) {
    return new Promise((resolve, reject) => {
        rootObserver = new MutationObserver((mutationsList) => {
            isRootObserverActive = true;
            console.log("root changes");

            // Find the correct timeline based on the current URL
            const url = window.location.href;
            let timelineParent;

            if (url === "https://x.com/home") {
                timelineParent = document.querySelector('div[aria-label="Timeline: Your Home Timeline"]');
            } else if (/^\d*$/.test(url.slice(-6))) {
                timelineParent = document.querySelector('div[aria-label="Timeline: Conversation"]');
            } else if (document.querySelector('nav[aria-label="Profile timelines"]')) {
                if (document.querySelector('div[aria-label$="posts"]')) {
                    timelineParent = document.querySelector('div[aria-label$="posts"]');
                } else if (document.querySelector('div[aria-label$="Highlights"]')) {
                    timelineParent = document.querySelector('div[aria-label$="Highlights"]');
                }
            } else if (url.startsWith("https://x.com/search") || url.startsWith("https://x.com/hashtag")) {
                timelineParent = document.querySelector('div[aria-label="Timeline: Search timeline"]');
            }

            // If the timeline is ready, resolve the promise
            if (
                timelineParent &&
                timelineParent.firstChild.querySelector('div[role="progressbar"]') ===
                timelineParent.firstChild.querySelector('div > div[role="progressbar"][style="visibility: hidden;"]')
            ) {
                console.log("found timeline");
                isRootObserverActive = false;
                rootObserver.disconnect();
                timeline = timelineParent.firstChild;

                // Add click listeners to handle blur buttons
                timeline.addEventListener('click', (event) => {
                    const isButton = event.target.className === 'blurButton';
                    if (isButton) {
                        if (event.target.getAttribute("active") === "false") {
                            event.target.setAttribute("active", "true");
                            event.target.parentElement.previousSibling.style = "";
                            event.target.innerHTML = "Blur the post again";
                        } else {
                            event.target.setAttribute("active", "false");
                            event.target.parentElement.previousSibling.style.filter = "blur(10px)";
                            event.target.innerHTML = "View post anyway";
                        }
                    }
                });

                // Process pre-rendered posts
                Array.from(timeline.childNodes).forEach((post) => sendPostText(post));
                resolve(timeline);
            }
        });

        rootObserver.observe(targetNode, config);
    });
}

// Function to process each tweet
async function sendPostText(post) {
    post.setAttribute("seen", "false");
    const texts = post.querySelectorAll('div[data-testid="tweetText"] > span');
    let message = Array.from(texts).map(span => span.innerText).join(' ');

    if (message.length > 0) {
        const response = await fetch("http://localhost:5000/", {
            method: 'POST',
            headers: { "Content-Type": "text/plain" },
            body: message,
        });

        const isHate = await response.text();
        if (isHate == 1) {
            post.firstChild.style.filter = 'blur(10px)';
            const warningText = document.createElement("p");
            warningText.innerText = "This post may contain hate speech";
            const button = document.createElement("button");
            button.className = "blurButton";
            button.setAttribute("active", "false");
            button.innerText = "View post anyway";
            warningText.appendChild(button);
            post.appendChild(warningText);
        } else {
            const safeText = document.createElement("p");
            safeText.innerText = "This post does not contain hate speech";
            post.appendChild(safeText);
        }
    }
}
