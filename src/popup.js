

/*
popup.html and all javascript here is still running in a different context, which is why you still need to send code via the chrome.tabs.executeScript()
*/

const activeButton = document.getElementById("activateButton");

activeButton.onclick = function(element) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {code: `
          chrome.storage.sync.get("blockerMode", function (obj) {
            if (obj.hasOwnProperty("blockerMode")) {
              if (obj.blockerMode === "offline") {
                chrome.storage.sync.set({blockerMode: 'online'}, function() {
                    console.log("Blocker online");
                  });
              }
              else {
                chrome.storage.sync.set({blockerMode: 'offline'}, function() {
                    console.log("Blocker offline");
                  });
              }
            }
        });`});
  });

  if (activeButton.innerText === "Activate") {
    activeButton.innerText = "Deactivate";
  }
  else {
    activeButton.innerText = "Activate";
  }
};
