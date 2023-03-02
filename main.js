const output = document.querySelector('.output');
let request, data;
const xhr = new XMLHttpRequest();
let path = "https://" + getSettings("ip") + ":3000/";
xhr.withCredentials = true;

//Load buttons on startup
document.addEventListener('DOMContentLoaded', htmlSettings(), false); 

async function getButtons(){
  xhr.open('GET', path + 'list', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      data = JSON.parse(xhr.responseText);
      console.log(data);
      htmlButtons()
    }
  };
  xhr.send();
}

function api(state){
    switch(state){
        case stop:
        xhr.open("GET", path + "stop", true)
        xhr.send();
        break;
        default:
            xhr.open("GET", path + "play?id=" + state);
            xhr.send();
    }

}

function saveSettings(){
  const ip = document.getElementById("ip").value;
  document.cookie = "ip=" + ip + "; expires=Fri, 31 Dec 9999 23:59:59 UTC; path=/";
getButtons();
}

function getSettings(cname){
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

//Generating HTML for buttons
async function htmlButtons(){
    let html = '<span class="header"><button id="stop" data-i18n="general.stop-panic" class="btn btn-stop" onClick="api(stop)">STOP PANIK EMERGENCY</button><button data-i18n="settings.name"class="btn btn-primary" onClick="htmlSettings();">Settings</button></span>';
    data.forEach(function(buttons){
        html += `<h2 style="text-align: center;">${buttons.category}</h2><p>`;
        buttons.files.forEach(function(file, index){
          html += `<span><button id="${file}" class="btn btn-primary" style="background-color: ${buttons.color[index]}" onClick="api('${file}')">${buttons.fancy[index]}</button></span> `;
        });
    }); 
    output.innerHTML = html;
}

async function htmlSettings() {
  let html = '<h1 data-i18n="settings.name">SETTINGS</h1>';
    html += 'Enter IP address: ';
    html += '<input type="text" id="ip"/>'

 
    html += '<br><button id="save" data-i18n="general.save" class="btn btn-save" onClick="saveSettings()">Save</button> <button id="cancel" data-i18n="general.cancel" class="btn btn-cancel" onClick="getButtons()">Cancel</button>'
  //Show HTML
  output.innerHTML = html;
  document.getElementById("ip").value = getSettings("ip");
  console.log(getSettings("ip"));
}