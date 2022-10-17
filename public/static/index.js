const body = document.body;

function loadBack (backSrc) {
  let newImg = new Image();

  newImg.onload = function () {
    body.style.backgroundImage = "url('" + newImg.src + "')";
  }
  newImg.src = backSrc;
}

function waitForElement(querySelector, timeout){
  return new Promise((resolve, reject)=>{
    var timer = false;
    if(document.querySelectorAll(querySelector).length) return resolve();
    const observer = new MutationObserver(()=>{
      if(document.querySelectorAll(querySelector).length){
        observer.disconnect();
        if(timer !== false) clearTimeout(timer);
        return resolve();
      }
    });
    observer.observe(document.body, {
      childList: true, 
      subtree: true
    });
    if(timeout) timer = setTimeout(()=>{
      observer.disconnect();
      reject();
    }, timeout);
  });
}

waitForElement("body", 3000).then(function () {
  loadBack("/static/commune.jpg");
}).catch(() => {
  console.log("Error: did not load!");
});

function makeid (length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
  }
  return result;
}

const check = document.getElementById("check");
const newl = document.getElementById("new");

const code = document.getElementById("code");
const rcode = document.getElementById("rcode");

const create = document.getElementById("create");
const rcreate = document.getElementById("rnew");

const save_code = document.getElementById("save-code");
const save_code_ping = document.getElementById("save-code-ping");

const submit_url = document.getElementById("submit-url");
const web_url = document.getElementById("web-url");
const submit_ping = document.getElementById("submit-ping");
const code_ping = document.getElementById("code-ping");

check.onclick = function () {
  code.style.display = "block";
  newl.style.display = "none";
  check.style.display = "none";

  loadBack("/static/suburbia2.jpg");
}

rcode.onclick = function () {
  code.style.display = "none";
  newl.style.display = "block";
  check.style.display = "block";

  loadBack("/static/commune.jpg");
}

newl.onclick = function () {
  newl.style.display = "none";
  check.style.display = "none";
  create.style.display = "block";

  loadBack("/static/suburbia.jpg");
}

rcreate.onclick = function () {
  newl.style.display = "block";
  check.style.display = "block";
  create.style.display = "none";

  loadBack("/static/commune.jpg");
}

submit_url.onclick = function () {
  let urlCode = makeid(10);

  if (web_url.value === "" || web_url === null || web_url === undefined) {
    save_code.innerText = "Not a valid URL.";
  }

  else {
    save_code.innerText = "Web Code: " + urlCode;

    fetch ("/make", {
      method: "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        url : web_url.value,
        code : save_code.innerText
      })
    })
    .then(response => response.text())
    .then(data => {
      console.log(data);

      if (data === "limit") {
        save_code.innerText = "What the hell?";
      }

      else {
        web_url.value = "";
        save_code.innerHTML += "<p>Ping Created!</p>";
      }
    })
    .catch(error => {
      throw error;
    })
  }
}

submit_ping.onclick = function () {
  if (code_ping.value === "" || code_ping.value === null || code_ping.value === undefined) {
    save_code_ping.innerText = "Not a valid URL.";
  }

  else {
    fetch ("/get", {
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        url : code_ping.value
      })
    })
    .then(response => response.text())
    .then(data => {
      save_code_ping.innerText = data;
    })
    .catch(error => {
      throw error;
    });
  }
}