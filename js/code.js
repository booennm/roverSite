var currentView = 0;

var curiosityCams = ["", "fhaz", "rhaz", "chemcam", "navcam"];
var perseveranceCams = ["", "navcam_left", "mcz_right", "mcz_left", "supercam_rmi", "skycam"];

/**
 * Prints an interface for viewing the most recent images from Mars rover photos API
 * @param {string} roverName name of the chosen rover in all lowercase letters
 */
function viewImages(roverName) {

    let backButton = document.createElement("span");
    backButton.innerHTML = "<i class='fas fa-long-arrow-alt-left'></i> go back to picking a rover";
    backButton.setAttribute("id", "back");
    backButton.setAttribute("onclick", "window.location.reload()");

    document.body.insertBefore(backButton, document.body.firstChild);

    document.querySelector(".header").classList.remove("selection");
    document.querySelector("h2").remove();

    let headerName = roverName.charAt(0).toUpperCase() + roverName.slice(1);
    document.querySelector("h1").textContent = headerName;

    if(roverName == "curiosity") {
        getImage(roverName, curiosityCams[currentView]);
    }else if(roverName == "perseverance") {
        getImage(roverName, perseveranceCams[currentView]);
    }

    document.querySelector(".buttons").remove();

}

/**
 * Prints the most recent image and its information
 * @param {string} rover name of the rover 
 * @param {string} cam name of the camera, if an empty string searches from all the cameras
 */
function getImage(rover, cam) {

    let previousImg = document.querySelector("img");

    if(previousImg) {
        previousImg.setAttribute("src", "#");
    }

    let loading = document.createElement("p");
    loading.textContent = "Loading resources..."
    loading.setAttribute("id", "loading");
    document.getElementById("content").appendChild(loading);

    let request = new XMLHttpRequest();
    let url = "https://api.nasa.gov/mars-photos/api/v1/rovers/" + rover + "/latest_photos?&api_key=AEPvIWsTwogkG1DQDfzWSu5voSsXRrSJQwt3gDcn"

    if(cam != "") {
        url += "&camera=" + cam;
    }

    request.open("GET", url, true);
    request.send();

    request.addEventListener("load", function(){

        if(request.status == 200 && request.readyState == 4) { //status 200 is a succesful request, state 4 means the operation is complete
            document.getElementById("loading").remove();

            var response = JSON.parse(request.responseText);

            console.log(response);
            
            let index = response.latest_photos.length - 1;
            let entry = response.latest_photos[index];

            let img = entry.img_src;
            let date = entry.earth_date;
            let name = entry.camera.full_name;

            //print cameras name
            let camNameElement = document.querySelector("h2");

            //create camera name element if needed
            if(!camNameElement) {
                let camNameElement = document.createElement("h2");

                if(currentView == 0) {
                    camNameElement.textContent = "Most recent image";
                }else {
                    camNameElement.textContent = name;
                }

                document.querySelector(".header").appendChild(camNameElement);
            }else {

                if(currentView == 0) {
                    camNameElement.textContent = "Most recent image";
                }else {
                    camNameElement.textContent = name;
                }
            }
            
            //check for image div and create one if needed
            let imgDiv = document.getElementById("img");

            if(!imgDiv) {
                let imgDiv = document.createElement("div");
                imgDiv.setAttribute("id", "img");

                //make left icon
                let leftArrow = document.createElement("i");
                leftArrow.classList.add("fas");
                leftArrow.classList.add("fa-chevron-left");
                leftArrow.classList.add("fa-2x");

                let leftSpan = document.createElement("span");
                leftSpan.setAttribute("id", "previous");

                if(rover == "curiosity") {
                    if(currentView == 0) {
                        leftSpan.textContent = curiosityCams[curiosityCams.length-1];
                    }else {
                        leftSpan.textContent = curiosityCams[currentView-1];
                    }
                }else if(rover == "perseverance") {
                    if(currentView == 0) {
                        leftSpan.textContent = perseveranceCams[perseveranceCams.length-1];
                    }else {
                        leftSpan.textContent = perseveranceCams[currentView-1];
                    }
                }

                leftArrow.appendChild(leftSpan);
                leftArrow.setAttribute("onClick", "previousCam('" + rover + "')");

                //make image
                let imgElement = document.createElement("img");
                imgElement.setAttribute("src", img);

                //make right icon
                let rightArrow = document.createElement("i");
                rightArrow.classList.add("fas");
                rightArrow.classList.add("fa-chevron-right");
                rightArrow.classList.add("fa-2x");

                let rightSpan = document.createElement("span");
                rightSpan.setAttribute("id", "next");

                if(rover == "curiosity") {
                    if(currentView == curiosityCams.length-1) {
                        rightSpan.textContent = curiosityCams[0];
                    }else {
                        rightSpan.textContent = curiosityCams[currentView+1];
                    }
                }else if(rover == "perseverance") {
                    if(currentView == perseveranceCams.length-1) {
                        rightSpan.textContent = perseveranceCams[0];
                    }else {
                        rightSpan.textContent = perseveranceCams[currentView+1];
                    }
                }

                rightArrow.setAttribute("onClick", "nextCam('" + rover + "')");
                rightArrow.appendChild(rightSpan);

                imgDiv.append(leftArrow, imgElement, rightArrow);
                document.getElementById("content").appendChild(imgDiv);

            }else {
                let imgElement = document.querySelector("img");
                imgElement.setAttribute("src", img);

                let leftSpan = document.getElementById("previous");
                let rightSpan = document.getElementById("next");

                if(rover == "curiosity") {
                    if(currentView == 0) {
                        leftSpan.textContent = curiosityCams[curiosityCams.length-1];
                    }else {
                        if(currentView-1 == 0) {
                            leftSpan.textContent = "recent";
                        }else {
                            leftSpan.textContent = curiosityCams[currentView-1];
                        }
                    }
                }else if(rover == "perseverance") {
                    if(currentView == 0) {
                        leftSpan.textContent = perseveranceCams[perseveranceCams.length-1];
                    }else {
                        if(currentView-1 == 0) {
                            leftSpan.textContent = "recent";
                        }else {
                            leftSpan.textContent = perseveranceCams[currentView-1];
                        }
                    }
                }

                if(rover == "curiosity") {
                    if(currentView == curiosityCams.length-1) {
                        rightSpan.textContent = "recent";
                    }else {
                        rightSpan.textContent = curiosityCams[currentView+1];
                    }
                }else if(rover == "perseverance") {
                    if(currentView == perseveranceCams.length-1) {
                        rightSpan.textContent = "recent";
                    }else {
                        rightSpan.textContent = perseveranceCams[currentView+1];
                    }
                }
            }
            
            //set date, create element if needed

            let dateElement = document.querySelector("#content > p");

            if(!dateElement) {
                let dateElement = document.createElement("p");
                dateElement.textContent = "Date taken: " + date;
                document.getElementById("content").appendChild(dateElement);
            }else {
                dateElement.textContent = "Date taken: " + date;
            }

        }else {
            loading.textContent = "Failed to load. Please refresh the page and try again.";
        }
    });
}

function previousCam(rover) {

    console.log("clicked");

    if(rover == "curiosity") {

        if(currentView == 0) {
            currentView = curiosityCams.length-1;
        }else {
            currentView--;
        }

        getImage(rover, curiosityCams[currentView]);

    }else if(rover == "perseverance") {

        if(currentView == 0) {
            currentView = perseveranceCams.length-1;
        }else {
            currentView--;
        }

        getImage(rover, perseveranceCams[currentView]);
    }
}

function nextCam(rover) {

    if(rover == "curiosity") {

        if(currentView == curiosityCams.length-1) {
            currentView = 0;
        }else {
            currentView++;
        }

        getImage(rover, curiosityCams[currentView]);

    }else if(rover == "perseverance") {

        if(currentView == perseveranceCams.length-1) {
            currentView = 0;
        }else {
            currentView++;
        }

        getImage(rover, perseveranceCams[currentView]);
    }
}