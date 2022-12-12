// this code is mad unclean
(function () {
  if (
    location.href.startsWith(
      "chrome-extension://haldlgldplgnggkjaafhelgiaglafanh"
    )
  ) {
    var chrome = window.chrome;
    document.title = "[swamp] Launcher";
    add("style").innerHTML = `
* {
  box-sizing: border-box;
}
body {
  padding: 10px;
  font-size: 110%;
  color: white;
  background-color: #2e2e31;
}
h1 {
  text-align: center;
  font-size: 70px;
}
h2 {
  text-align: left;
  font-size: 175%;
}
p,
label,
select,
button {
  font-family: "Roboto", sans-serif;
}
hr {
  border: none;
  border-bottom: 3px solid white;
}
textarea,
input,
kbd,
pre {
  font-family: monospace;
  border: none;
}
textarea,
input,
select {
  background-color: white;
  border-radius: 10px;
  padding: 10px 17px;
  font-size: 15px;
  border: none;
}
input {
  width: 350px;
  padding: 10px 20px;
  margin: 0px 5px 5px 0px;
  background-color: white;
  border-radius: 10px;
}
textarea {
  display: inline-block;
  height: 400px;
  white-space: pre;
  float: left;
  width: 60%;
  border-radius: 10px 0px 0px 10px;
  resize: none;
  background-color: #99edc3;
  margin-bottom: 15px;
}
pre {
  display: inline-block;
  height: 400px;
  border-radius: 0px 10px 10px 0px;
  font-size: 15px;
  padding: 8px;
  float: right;
  margin: 0px 0px 25px 0px;
  width: 40%;
  overflow-y: scroll;
  word-break: break-all;
  white-space: pre-line;
  background-color: #1c8e40;
  color: black;
}
button {
  background-color: white;
  color: black;
  border: none;
  font-size: 15px;
  padding: 10px 20px;
  border-radius: 10px;
  margin: 0px 5px 5px 0px;
  cursor: pointer;
  transition: filter 250ms;
}
button:hover {
  filter: brightness(0.8);
}
a {
  color: #99edc3;
  transition: color 250ms;
}
a:hover {
  color: #1c8e40;
}`;
    //
    add("h1").innerHTML = "[swamp] Launcher for ChromeOS";
    add("h3").innerHTML =
      "Launcher made by Bypassi, inspired by Eli from TN, user interface made by Mr. PB, DNS hosted by The Greatest Giant";
    add("p").innerHTML =
      '<a href="http://ssl.google-analytics.com/ga.js">Source code</a>';
    add("hr");
    //
    var run_code = add("div");
    add("h2", run_code).textContent = "Run your own code";
    add("p", run_code).textContent =
      'Put your script here to run it while pretending to be the GoGuardian extension. You will be able to access most "chrome" scripts and have other privileges such as access to all websites. Note that your code is saved automatically.';
    var run_code_input = add("textarea", run_code);
    run_code_input.placeholder = "Input goes here...";
    run_code_input.onkeyup = function () {
      localStorage.swamp_code = this.value;
    };
    run_code_input.onkeydown = function (event) {
      if (event.key === "Tab") {
        event.preventDefault();
        document.execCommand("insertText", false, "  ");
      }
    };
    var run_code_output = add("pre", run_code);
    run_code_output.textContent = "Output shows here:\n";
    console.log = function (e) {
      run_code_output.textContent += "\n" + e;
    };
    var run_button = add("button", run_code);
    run_button.textContent = "Run on this page";
    run_button.onclick = function () {
      localStorage.swamp_code = run_code_input.value;
      console.log("");
      try {
        eval(run_code_input.value);
        console.log("Code ran successfully");
      } catch (err) {
        console.log(err);
      }
    };
    var run_background_button = add("button", run_code);
    run_background_button.textContent = "Run as background";
    run_background_button.onclick = function () {
      localStorage.swamp_code = run_code_input.value;
      localStorage.swamp_background = true;
      localStorage.swamp_reloaded = true;
      chrome.runtime.reload();
    };
    add("p", run_code).innerHTML =
      "Concerning the two buttons above: Running on this page is pretty self explanatory. The script only takes effect when this page is open, which makes it a pain to use [swamp] at places such as school where you can't set it up. But running as background lets the script run even with the tab closed. Basically, it means that the script is being run at the highest level of a Chrome extension, in the background, so it persists until Chrome is fully restarted (with chrome://restart for example). <b>Note that you can only run as background when your [swamp] DNS/VPN is active. If you don't get a weird full-screen alert box within ~15 seconds, then your script was not run.</b>";
    add("hr");
    //
    var script_database = [
      { name: "Select an option...", code: `` },
      {
        name: "Display GoGuardian policy",
        code: `chrome.storage.local.get("policy", function (json) {
  console.log(JSON.stringify(json));
});`,
      },
      {
        name: "Emulate DNS and block all goguardian.com requests",
        code: `chrome.webRequest.onBeforeRequest.addListener(
  function () {
    return { redirectUrl: "javascript:" };
  },
  {
    urls: ["*://*.goguardian.com/*"],
  },
  ["blocking"]
);`,
      },
      {
        name: "Bookmarklet emulator when a Google tab is loaded",
        code: `chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  if (changeInfo.status == "complete") {
    chrome.tabs.executeScript(
      tabId, { code: \`
        if (location.hostname.endsWith("google.com")) {
          // Use your own code below:
          alert("Testing!")
        }
      \` }
    );
  }
});`,
      },
      {
        name: "Open a cool-looking window",
        code: `chrome.windows.create({ url: "https://google.com", type: "popup" });`,
      },
      {
        name: "Toggle all other admin-forced extensions when the GoGuardian icon is clicked",
        code: `chrome.browserAction.onClicked.addListener(function () {
  chrome.management.getAll(function () {
    arguments[0].forEach(function (extension) {
      if ("admin" === extension.installType && chrome.runtime.id !== extension.id)
        chrome.management.setEnabled(extension.id, !extension.enabled);
    });
  });
});`,
      },
      {
        name: "Display a goofy notification",
        code: `chrome.notifications.create(null, {
  type: "basic",
  iconUrl: "https://upload.wikimedia.org/wikipedia/en/9/9a/Trollface_non-free.png",
  title: "Important GoGuardian Message",
  message: "We've been trying to reach you concerning your vehicle's extended warranty. You should've received a notice in the mail about your car's extended warranty eligibility. Since we've not gotten a response, we're giving you a final courtesy call before we close out your file. Press 2 to be removed and placed on our do-not-call list. To speak to someone about possibly extending or reinstating your vehicle's warranty, press 1 to speak with a warranty specialist.",
});
// Credit to ilexite#8290`,
      },
      {
        name: "Run custom code when the GoGuardian icon is clicked",
        code: `chrome.browserAction.onClicked.addListener(function () {
  eval(prompt("Code, please?"));
});
// Something like this could be useful for running in the background...`,
      },
      {
        name: "Toggle emulated DNS unblocker when the GoGuardian icon is clicked",
        code: `function block() {
  return { redirectUrl: "javascript:" };
}
var blocking = false;
function toggle() {
  if (blocking) {
    chrome.webRequest.onBeforeRequest.removeListener(block);
  } else {
    chrome.webRequest.onBeforeRequest.addListener(
      block,
      {
        urls: ["*://*.goguardian.com/*"],
      },
      ["blocking"]
    );
  }
  blocking = !blocking;
  alert("Emulated DNS unblocker is " + (blocking ? "on!" : "off!"));
}
toggle();
chrome.browserAction.onClicked.addListener(toggle);
// This is also only useful if you run it in the background`,
      },
    ];
    var interesting_scripts = add("div");
    add("h2", interesting_scripts).textContent = "Interesting scripts";
    add("p", interesting_scripts).innerHTML =
      "Some useful scripts for the textbox above. <b>DM Bypassi#7037 on Discord to suggest new ones (or general improvements to this launcher).</b>";
    var interesting_scripts_select = add("select", interesting_scripts);
    script_database.forEach(function (script) {
      var interesting_scripts_label = add("option", interesting_scripts_select);
      interesting_scripts_label.textContent = script.name;
      interesting_scripts_label.value = script.code;
    });
    interesting_scripts_select.onchange = function () {
      run_code_input.value = interesting_scripts_select.value;
      run_code.scrollIntoView();
    };
    add("p", interesting_scripts).textContent =
      "By the way, if you find a URL like *google.com* in your GoGuardian whitelist policy, any url like https://blocked.com/?google.com will be unblocked for anyone in your district. Note that your policy may be inaccurate if you are using the hard-disable option or are signed into another Google account.";
    add("p", interesting_scripts).textContent =
      "Also, if you turned on the DNS emulator and previously blocked sites that you've visited before aren't loading, try adding a question mark to the end of the URL, which may clear cache. DNS unblocking may not work for blocking requests from other admin-installed extensions."; //
    add("p", interesting_scripts).textContent =
      "And please read the thing about background running earlier in the page, because that could be useful for making some of these scripts run at school.";
    add("hr");
    //
    var hard_disable = add("div");
    add("h2", hard_disable).textContent = "Hard-Disable GoGuardian";
    add("p", hard_disable).innerHTML =
      'This will disable GoGuardian and persist until you powerwash your device or undo it with the second button below. This will also prevent your teachers from seeing your screen, so be careful not to get in trouble. If you want something less permanent, use the bottom button on [swamp] or run the DNS emulator from the "interesting scripts" section (preferably as background). Hard-disable works by messing with cookies that GoGuardian needs to run. <b>DM Bypassi#7037 on Discord if you find a cooler way to do this</b>.';
    var hard_disable_button = add("button", hard_disable);
    hard_disable_button.textContent = "Hard-Disable GoGuardian";
    hard_disable_button.onclick = function () {
      for (var i = 0; i < localStorage.length; i++)
        if (!localStorage.key(i).startsWith("swamp"))
          localStorage[localStorage.key(i)] += 1;
      localStorage.swamp_reloaded = true;
      chrome.runtime.reload();
    };
    add("br", hard_disable);
    var re_enable_button = add("button", hard_disable);
    re_enable_button.textContent = "Undo Hard-Disable";
    re_enable_button.onclick = function () {
      for (var i = 0; i < localStorage.length; i++)
        if (!localStorage.key(i).startsWith("swamp"))
          localStorage[localStorage.key(i)] = "";
      localStorage.swamp_reloaded = true;
      chrome.runtime.reload();
    };
    add("br");
    add("hr");
    //
    var remove_extensions = add("div");
    add("h2", remove_extensions).innerHTML =
      'Disable Chrome Extensions similarly to <a href="https://compactcow.com/ltbeef">LTBEEF</a>';
    add("p", remove_extensions).textContent =
      "LTBEEF was fixed by Chrome in v106, so this is a great alternative that works in the latest version.";
    add("p", remove_extensions).innerHTML =
      'This allows you to emulate the switch in chrome://extensions and fully disable any extension by typing its ID in the textbox below (you can seperate multiple by commas). The ID can be found by going to chrome://extensions, clicking "Details" for the extension, and copying the text after the = in the URL. <b>"Removing" GoGuardian is not a good idea since it will stop this page from working. However, it is the only truly full GoGuardian bypass on this page. It can be reversed by visiting chrome://restart.</b>';
    var remove_extensions_input = add("input", remove_extensions);
    remove_extensions_input.placeholder = "Extension IDs here...";
    remove_extensions_input.type = "text";
    var remove_extensions_button = add("button", remove_extensions);
    remove_extensions_button.textContent = "Disable this extension";
    remove_extensions_button.onclick = function () {
      remove_extensions_input.value.split(",").forEach(function (id) {
        if (id === chrome.runtime.id) {
          alert(
            "You tried to remove GoGuardian, which would stop this launcher from working. As such, the extension was not removed. Please use the button at the bottom of the page if you would like to do this."
          );
        } else {
          chrome.management.setEnabled(id.trim(), false);
        }
      });
      remove_extensions_input.value = "";
      remove_extensions_input.placeholder = "Disabled!";
    };
    var revive_extensions_button = add("button", remove_extensions);
    revive_extensions_button.textContent = "Revive this extension";
    revive_extensions_button.onclick = function () {
      remove_extensions_input.value.split(",").forEach(function (id) {
        chrome.management.setEnabled(id.trim(), true);
      });
      remove_extensions_input.value = "";
      remove_extensions_input.placeholder = "Revived!";
    };
    add("br", remove_extensions);
    add("p", remove_extensions).textContent =
      "Or you can try the more automatic broad options:";
    var remove_all_button = add("button", remove_extensions);
    remove_all_button.textContent = "Disable all except GoGuardian";
    remove_all_button.onclick = function () {
      chrome.management.getAll(function () {
        arguments[0].forEach(function (extension) {
          if (chrome.runtime.id !== extension.id)
            chrome.management.setEnabled(extension.id, false);
        });
      });
    };
    var remove_all_admin_button = add("button", remove_extensions);
    remove_all_admin_button.textContent =
      "Disable all admin-forced except GoGuardian";
    remove_all_admin_button.onclick = function () {
      chrome.management.getAll(function () {
        arguments[0].forEach(function (extension) {
          if (
            "admin" === extension.installType &&
            chrome.runtime.id !== extension.id
          )
            chrome.management.setEnabled(extension.id, false);
        });
      });
    };
    var revive_all_button = add("button", remove_extensions);
    revive_all_button.textContent = "Revive all";
    revive_all_button.onclick = function () {
      chrome.management.getAll(function () {
        arguments[0].forEach(function (extension) {
          chrome.management.setEnabled(extension.id, true);
        });
      });
    };
    add("br", remove_extensions);
    add("p", remove_extensions).textContent = "And the final option:";
    var remove_goguardian_button = add("button", remove_extensions);
    remove_goguardian_button.textContent = "Disable GoGuardian";
    remove_goguardian_button.onclick = function () {
      if (
        confirm(
          "Are you sure you want to disable GoGuardian? This will close the [swamp] launcher until chrome://restart is visited."
        )
      )
        chrome.management.setEnabled(chrome.runtime.id, false);
    };
    //
    if (location.href.endsWith("?reset")) {
      delete localStorage.swamp_background;
      history.replaceState("", "", "/background.html");
    }
    if (localStorage.swamp_reloaded) {
      delete localStorage.swamp_reloaded;
      chrome.tabs.create({ url: chrome.runtime.getURL("background.html") });
    }
    if (localStorage.swamp_code) {
      run_code_input.value = localStorage.swamp_code;
      if (localStorage.swamp_background) {
        delete localStorage.swamp_background;
        alert("Running your [swamp] script as background...");
        run_button.click();
      }
    }
  }
  // you are about to see the greatest line of code ever written
  function add(type, parent) {
    return (parent || document.body).appendChild(document.createElement(type));
  }
})();
