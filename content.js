var rootObOn = false
var timelineObOn = false

let timeline;
let observer;


// 

async function sendPostText(post) {
    post.setAttribute("seen", "false")
    let texts = post.querySelectorAll('div[data-testid="tweetText"] > span')
    let message = ""
    let isHate 
    for (j = 0 ; j < texts.length ; j++) {
        let childno = texts[j]
        message += childno.innerText
    }
    if (message.length > 0) {
        await fetch("http://localhost:5000/", {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain",
        },  
        body: message
            }).then(response => {
                response.text().then((data) => {
                    isHate = data

                    if (isHate == 1 ) {
                            post.firstChild.style.filter = 'blur(10px)'
                            let warningText = document.createElement("p")
                            warningText.innerText = "this post may contain hate speech"
                            let buttonB = document.createElement("button")
                            buttonB.className = "blurButton"
                            buttonB.setAttribute("active" , "false") 
                            buttonB.innerText = "View post anyway"   
                            warningText.appendChild(buttonB)
                            post.appendChild(warningText)
                        
                        
                    } else {
                            let warningText = document.createElement("p")
                            warningText.innerText = "this post does not contain hate speech"
                            post.appendChild(warningText)
                    }
                })
        
            })

    }
}

//Root div observer promise wrapper 
function findTimeline(targetNode, config) {
    return new Promise((resolve, reject) => {
    // Observe root div for changes
    observer = new MutationObserver((mutationsList, observer) => {
        rootObOn = true
        console.log("root changes")


        // Find out what section to look for
        let url = window.location.href
        let timelineParent 
        if (url == "https://twitter.com/home") {
            //home timeline
            timelineParent = document.querySelector('div[aria-label="Timeline: Your Home Timeline"]')
        } else if ( /^\d*$/.test( url.slice(-6)) == true ){
            //post timeline
           // console.log("here")
            timelineParent = document.querySelector('div[aria-label="Timeline: Conversation"]')
        
        //check if we are in the profile timeline
        } else if ( document.querySelector('nav[aria-label="Profile timelines"]') != undefined){

            //check if we are on the profile section or highlights
            if (document.querySelector('div[aria-label$="posts"]') != undefined) {
                timelineParent = document.querySelector('div[aria-label$="posts"]')
            } else if (document.querySelector('div[aria-label$="Highlights"]') != undefined) {
                timelineParent = document.querySelector('div[aria-label$="Highlights"]')
            }
        //check if we are in the search timeline
        } else if (url.startsWith("https://twitter.com/search") || url.startsWith("https://twitter.com/hashtag")) {
            timelineParent = document.querySelector('div[aria-label="Timeline: Search timeline"]')
        }

        console.log()

        // find the timeline
        if (timelineParent != undefined && (timelineParent.firstChild.querySelector('div[role="progressbar"]') == timelineParent.firstChild.querySelector('div > div[role="progressbar"][style="visibility: hidden;"]') )  )  {
            console.log("found timeline")
            rootObOn = false
            observer.disconnect();
            timeline = timelineParent.firstChild
            
            //add click event listener for blur button
            timeline.addEventListener('click', (event) => {
                const isButton = event.target.className === 'blurButton'
                if (isButton) {
                    if (event.target.getAttribute("active") == "false") {

                        event.target.setAttribute("active" , "true")
                        event.target.parentElement.previousSibling.style = ""
                        event.target.innerHTML = "Blur the post again"
                        event.target.previousSibling.innerHTML = ""

                    } else if (event.target.getAttribute("active") == "true") {

                        event.target.setAttribute("active" , "false")
                        event.target.parentElement.previousSibling.style.filter = "blur(10px)"
                        event.target.innerHTML = "View post anyway"
                        event.target.previousSibling.innerHTML = "This post may contain hatespeech"
                    }
                }
              
              })
              
            //loop through prerendered posts
            for (i = 0 ; i < timeline.childNodes.length ; i++) {
                let post = timeline.childNodes[i]
                sendPostText(post)
            }
            resolve(timeline)
        }



    });

        observer.observe(targetNode, config)
    });

}   


// Timeline Observer
const TimelineObserver = new MutationObserver((mutationsList, TimelineObserver) => {
    timelineObOn = true
    mutationsList.forEach(record => {
        if(record.addedNodes.length > 0  && record.target == timeline && !record.addedNodes[0].hasAttribute("seen")){
            
            let post = record.addedNodes[0]
            sendPostText(post)
            
        }
    });
    
});


// Configs
var targetNode = document.getElementById("react-root")
var config = { attributes: false, childList: true, subtree: true }


// URL change listener
window.navigation.addEventListener("navigate", (event) => {
    //disconnect previous observer
    console.log('URL: ', window.location.href);
    if (rootObOn == true) {
        console.log("closed root observer")
        observer.disconnect()
    }

    if (timelineObOn == true) {
        timelineObOn = false
        console.log("closed timeline observer")
        TimelineObserver.disconnect()
    }


    // Start root observer
    findTimeline(targetNode, config)
    .then(timeline => {
        
        console.log(timeline)
        // start timeline observer when found
        TimelineObserver.observe(timeline , config)
    })
    .catch(error => {
        console.error('Error observing mutations:', error)
    })
})




