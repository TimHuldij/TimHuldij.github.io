function toggleTheme() {
  var element = document.body;
  element.classList.toggle("light-mode");
} 

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
    const time = new Date().getHours();
    let username = getCookie("username");

    if (username != "") {
        if (time < 12) {
            alert("Goedemorgen " + username);
        }
        else if (time < 18) {
            alert("Goedemiddag " + username);
        }
        else if (time > 18) {
            alert("Goedenavond " + username);
        }
        else {
            alert("Goedenacht " + username);
        }
    }
    else {
        username = prompt("Please enter your name:", "");
        if (username != "" && username != null) {
        setCookie("username", username, 365);
        checkCookie();
        }
    }
}

