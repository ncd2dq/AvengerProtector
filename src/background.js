
// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*
The background.js runs in a different javascript context then the browser,
thats why you need to have chrome.tabs.executeScript run code.

chrome.storage.sync is accessible by both this context and browser tab context
*/

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'www.facebook.com', schemes: ['https']},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
  chrome.storage.sync.set({blockerMode: 'offline'}, function() {
      console.log("Blocker offline");
    });
});

let sweepInterval = 1000;
let checkSweepStatusInterval = 10;
let sweepFeed = null;
let activated = false;
const sweepScript = `
(function () {
  const illegals = [
    "avengers",
    "ironman",
    "iron man",
    "end game",
    "endgame",
    "spiderman",
    "spider man",
    "wonder woman",
    "wonderwoman",
    "thanos",
    "thans",
    "spoiler",
    "spoiled",
    "tickets",
    "movie",
    "captain",
    "captain america",
    "america",
    "infinity",
    "discuss",
    "villian",
    "marvel",
    "mu",
    "mcu",
    "stan lee",
    "lee"
  ]
  const divs =  document.querySelectorAll('.userContent');
  const comments = document.querySelectorAll('._3l3x');

  /*
  for (div of divs) {
    const html = div.innerHTML;

    for (illegal of illegals) {
      const matcher = new RegExp("<p>.*" + illegal + ".*</p>");
      if (html.match(matcher) !== null) {
        div.innerHTML.replace("<p>NONE OF THIS, NOPE!</p>")
      }
    }
  }
  */

  for (comment of comments) {
    const text = comment.innerText;

    for (illegal of illegals) {
      if (text.indexOf(illegal) !== -1) {
        comment.innerText = "NOT TODAY SATAN";
      }
    }
  }
})();
`

setInterval( () => {chrome.storage.sync.get("blockerMode", function (obj) {
  if (obj.hasOwnProperty("blockerMode")) {
    if (obj.blockerMode === "offline") {
      if (sweepFeed !== null) clearInterval(sweepFeed);
      activated = false;
    }
    else if (obj.blockerMode === "online") {
      if (activated == false) {
        sweepFeed = setInterval(() => {
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, {code: sweepScript});
          });
        }, sweepInterval);
      }
      activated = true;
    }
  }
});}, checkSweepStatusInterval);
