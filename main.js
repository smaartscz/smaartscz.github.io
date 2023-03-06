const output = document.querySelector('.output');
let request, data;
const options = {
  hostname: getSettings('ip'),
  port: 3000,
  path: '/list',
  method: 'GET',
};

//Load buttons on startup
document.addEventListener('DOMContentLoaded', htmlSettings(), false); 

async function getButtons(){
  const url = `https://${options.hostname}:${options.port}${options.path}`;
  try {
    const response = await fetch(url, { method: options.method, redirect: 'follow', mode: 'cors', credentials: 'include', cache: 'no-cache', referrerPolicy: 'no-referrer', headers: { 'Content-Type': 'application/json' }, agent: options.agent, rejectUnauthorized: false });
    const data = await response.json();
    console.log(data);
    htmlButtons();
  } catch (error) {
    console.error(error);
  }
}

function api(state){
    switch(state){
        case stop:
          fetch(`https://${getSettings('ip')}:3000/stop`, { method: 'GET', rejectUnauthorized: false })
            .then(response => console.log(response.status))
            .catch(error => console.error(error));
        break;
        default:
          fetch(`https://${getSettings('ip')}:3000/play?id=${state}`, { method: 'GET', rejectUnauthorized: false })
            .then(response => console.log(response.status))
            .catch(error => console.error(error));
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
