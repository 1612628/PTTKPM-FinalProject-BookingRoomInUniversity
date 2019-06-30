
function setUser(json){
    var result = {'user':json};
    sessionStorage.setItem("User",JSON.stringify(result));
}

function getUser(){
    return JSON.parse(sessionStorage.getItem("User"));
}

function setMyItem(name,value){
    sessionStorage.setItem(name,value);
}
function getMyItem(name){
    return sessionStorage.getItem(name);
}