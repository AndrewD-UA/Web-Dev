/* By: Andrew Dennison
 * Last updated: 09 NOV 23
 * This file contains the functions used by the "home" and "create listing" pages
 */

// This function requests for and displays listing search results
function searchForItems(){

    // Clear the existing results viewpane.
    let displayArea = document.getElementById("results");
    displayArea.innerHTML = "";

    // Collect and format the required information, then send the request
    let url = "/app/get/search/items/" + encodeURIComponent(document.getElementById("searchText").value);
    let getReq = fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });

    // Handle the responses to the server
    getReq.then((results) => {
        return results.json();
    }).then((jsonObject) => {
        // For each item in the search results, put it in the results viewpane.
        for (let i = 0; i < jsonObject.length; i++){
            displayArea.innerHTML += getHTMLFromJSON(jsonObject[i]);

            // Enables the functionality of the buy now button
            if (jsonObject[i].status != "SOLD"){
                document.getElementById(jsonObject[i]._id).setAttribute("onclick", "purchase('" + jsonObject[i]._id + "')")
            }
        }
    })
}


// Function to redirect to the "New Listings" page
function goToList(){
    window.location.href = '/app/list.html';
}


// Function to add a new listing from the "New Listing" page
function submitItem(){

    // Collect the required information
    let srcTitle = document.getElementById("title").value;
    let srcDesc = document.getElementById("desc").value;
    //let srcImgPath = document.getElementById("image").value;
    let srcPrice = parseInt(document.getElementById("price").value);
    let srcStatus = document.getElementById("status").value;
    
    // Format required information
    let info = {
        title:        srcTitle, 
        description:  srcDesc,
        imgPath:      "imgPath",
        price:        srcPrice,
        status:       srcStatus    };    

    // Create and send the POST request
    let url = "http://127.0.0.1:80/app/add/item/";
    let p = fetch(url, {
        method: 'POST',
        body: JSON.stringify(info),
        headers: {'Content-Type': 'application/json'}
    }).catch((error) => {
        console.log(error);
    });

    // Redirect back to the home page
    window.location.href = '/app/home.html';
}


// Retrieve either listings or purchases, based on parameter "type"
// "Type" should be either String("listings") or String("purchases")
function retrieve(type){

    // Clear the existing results viewpane.
    let displayArea = document.getElementById("results");
    displayArea.innerHTML = "";

    // Send off the specified request
    let p = fetch("/app/get/" + type);

    // Handle the request response
    p.then((results) => {
        return results.text();
    }).then((text) => {

        // If we received a response of item IDs
        if (text != ""){

            // Iterate through each item ID
            let items = text.split(',');
            for (let i = 0; i < items.length; i++){ 
                
                // Get the details of the specific listing
                let data = fetch("/app/get/items/" + items[i], {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                });
                
                // Convert the details of the listing to HTML and add it to the DOM
                data.then((results) => {
                    return results.json();
                }).then((jsonObject) => {
                    return getHTMLFromJSON(jsonObject, type);                      
                }).then((resultHTML) => {
                    displayArea.innerHTML += resultHTML;
                })
            }
        }
    });
}

// Function for executing a purchase
function purchase(id){

    // Send off notification of the purchase
    let p = fetch("http://127.0.0.1:80/app/purchase/" + encodeURIComponent(id) + "/");

    // Handle the server's response to the purchase request
    p.then((response) => {
        return response.text();
    }).then((text) => {
        // Manually update the displayed status of the listing
        // This will not need to be done in the future
        document.getElementById(id).outerHTML = "Item has been purchased";
    });
}

// Function for converting an item retrieved from MongoDB in JSON format to HTML code
// This is used exclusively by retrieve and search
// This does not link purchase to the onclick of the specified item
function getHTMLFromJSON(jsonObject, urlParameter){

    // If we somehow get passed an invalid argument
    if (jsonObject == null){
        return "<h2>Nothing here!</h2>";
    }

    // Build out the object
    let displayHTML =   "<div class='results'><h2>" + jsonObject.title + "</h2>" +
                                        "<div>" + jsonObject.description + "</div>" + 
                                        "<div>" + jsonObject.imgPath + "</div>" + 
                                        "<div>" + jsonObject.price + "</div>";
    
    // Determine what to display for status
    // If we're retrieving the user's listings, there should be no purchase button
    // Otherwise, if it's not sold, add a purchase button
    if (urlParameter === "listings"){
        displayHTML += "<div>" + jsonObject.status + "</div></div>"
    }
    else if (jsonObject.status === "SOLD"){
        displayHTML += "<div>Item has been purchased</div></div>";
    } else {
        displayHTML +=  "<input type='submit' class='buyButton'" + 
                        "id='" + jsonObject._id + "' value='Buy Now!'></div>"
    }

    return displayHTML;
}

// This function adds the welcome message to the home page DOM
function addName(){

    // Send our username request
    let p = fetch("http://127.0.0.1:80/app/get/username/");

    // Build and display the username
    p.then((response) => {
        return response.text();
    }).then((username) => {
        let content = document.getElementById("actions");
        content.innerHTML = "<h2 class='actions'>Welcome, " + username + "!  What would you like to do?</h2>" + content.innerHTML;
    });     
}