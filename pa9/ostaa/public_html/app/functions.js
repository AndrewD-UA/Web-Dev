function searchForItems(){
    let displayArea = document.getElementById("results");
    displayArea.innerHTML = "";

    let url = "/app/get/search/items/" + encodeURIComponent(document.getElementById("searchText").value);
    let getReq = fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    });

    getReq.then((results) => {
        return results.json();
    }).then((jsonObject) => {
        for (let i = 0; i < jsonObject.length; i++){
            displayArea.innerHTML += getHTMLFromJSON(jsonObject[i]);
            if (jsonObject[i].status != "SOLD"){
                document.getElementById(jsonObject[i]._id).setAttribute("onclick", "purchase('" + jsonObject[i]._id + "')")
            }
        }
    })
}

function goToList(){
    window.location.href = '/app/list.html';
}

function submitItem(){
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
    let url = "http://127.0.0.1:80/app/add/item/";
    
    // Create the POST request
    let p = fetch(url, {
        method: 'POST',
        body: JSON.stringify(info),
        headers: {'Content-Type': 'application/json'}
    }).catch((error) => {
        console.log(error);
    });

    window.location.href = '/app/home.html';
}

function retrieve(type){
    let displayArea = document.getElementById("results");
    displayArea.innerHTML = "";

    let p = fetch("/app/get/" + type);

    p.then((results) => {
        return results.text();
    }).then((text) => {
        if (text != ""){
            let items = text.split(',');
            for (let i = 0; i < items.length; i++){                
                let data = fetch("/app/get/items/" + items[i], {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                });

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

function purchase(id){
    let p = fetch("http://127.0.0.1:80/app/purchase/" + encodeURIComponent(id) + "/");

    p.then((response) => {
        return response.text();
    }).then((text) => {
        document.getElementById(id).outerHTML = "Item has been purchased";
        console.log(text);
    });
}

function getHTMLFromJSON(jsonObject, urlParameter){
    if (jsonObject == null){
        return "<h2>Nothing here!</h2>";
    }

    let displayHTML =   "<div class='results'><h2>" + jsonObject.title + "</h2>" +
                                        "<div>" + jsonObject.description + "</div>" + 
                                        "<div>" + jsonObject.imgPath + "</div>" + 
                                        "<div>" + jsonObject.price + "</div>";
    
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

function addName(){
    let p = fetch("http://127.0.0.1:80/app/get/username/");

    p.then((response) => {
        return response.text();
    }).then((username) => {
        let content = document.getElementById("actions");
        content.innerHTML = "<h2 class='actions'>Welcome, " + username + "!  What would you like to do?</h2>" + content.innerHTML;
    })
     
}