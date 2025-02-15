// app.js

document.addEventListener("DOMContentLoaded", function () {
    const chatbotBtn = document.getElementById("chatbotBtn");
    const tutorialsBtn = document.getElementById("tutorialsBtn");
    const remoteHelpBtn = document.getElementById("remoteHelpBtn");
  
    // Auto-detect offline status
    window.addEventListener("offline", function () {
      alert("Your internet connection appears to be offline. Please check your Wi-Fi.");
    });
  
    chatbotBtn.addEventListener("click", loadChatbot);
    tutorialsBtn.addEventListener("click", loadTutorials);
    remoteHelpBtn.addEventListener("click", loadRemoteHelp);
  });
  
  function loadChatbot() {
    window.location.href = "chatbot.html"; // Redirect to a new HTML file
    // document.getElementById("sendBtn").addEventListener("click", sendQuestion);
    // document.getElementById("voiceBtn").addEventListener("click", startVoiceRecognition);
  }
  
  function sendQuestion() {
    const question = document.getElementById("questionInput").value;
    if (!question) {
      alert("Please enter a question.");
      return;
    }
    const responseDiv = document.getElementById("chatbotResponse");
    responseDiv.innerHTML = "Thinking...";
  
    // Call OpenAI API using fetch
    fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_OPENAI_API_KEY"
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: `A senior is asking: ${question}. Provide a simple, step-by-step explanation in plain language.`,
        max_tokens: 150,
        temperature: 0.5
      })
    })
      .then((response) => response.json())
      .then((data) => {
        const answer = data.choices[0].text.trim();
        responseDiv.innerHTML = `<strong>Answer:</strong> ${answer}`;
      })
      .catch((err) => {
        console.error(err);
        responseDiv.innerHTML = "Error fetching answer. Please try again.";
      });
  }
  
  function startVoiceRecognition() {
    // Check if the browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    recognition.onresult = function (event) {
      const spokenText = event.results[0][0].transcript;
      document.getElementById("questionInput").value = spokenText;
      // Optionally, you can auto-send the question:
      // sendQuestion();
    };
  
    recognition.onerror = function (event) {
      console.error("Speech recognition error", event);
      alert("Error in speech recognition: " + event.error);
    };
  
    recognition.start();
  }
  
  function loadTutorials() {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = `
      <div id="tutorialsContainer">
        <h2>Video Tutorials</h2>
        <p>Coming Soon! Check back later for video tutorials on common tech issues.</p>
      </div>
    `;
  }




  const socket = io("http://localhost:5000"); // Update with your deployed server URL

  // ============ NEW LIVE CHAT WITH SPEECH-TO-TEXT ============
function loadRemoteHelp() {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = `
    <div id="remoteContainer">
      <h2>Live Chat Assistance</h2>
      <p>Click below to start a live chat with a helper.</p>
      <button id="startChatBtn">Join Live Chat</button>
      <div id="chatArea" style="display:none; margin-top:20px;">
          <div id="chatMessages" style="height: 200px; overflow-y: auto; background: #e9ecef; padding: 10px; border-radius:5px;"></div>
          <textarea id="chatInput" placeholder="Type your message..." rows="2" style="width:100%; font-size:1.1em;"></textarea>
          <br>
          <button id="sendChatBtn">Send</button>
          <button id="voiceChatBtn">🎙️ Speak</button>
      </div>
    </div>
  `;

  document.getElementById("startChatBtn").addEventListener("click", startLiveChat);
}

function startLiveChat() {
  document.getElementById("startChatBtn").style.display = "none";
  document.getElementById("chatArea").style.display = "block";

  socket.emit("join-chat");

  document.getElementById("sendChatBtn").addEventListener("click", sendChatMessage);
  document.getElementById("voiceChatBtn").addEventListener("click", startVoiceToText);
}

function sendChatMessage() {
  const message = document.getElementById("chatInput").value;
  if (!message.trim()) return;

  socket.emit("chat-message", message);
  displayChatMessage("You", message);

  document.getElementById("chatInput").value = "";
}

function displayChatMessage(sender, message) {
  const chatMessages = document.getElementById("chatMessages");
  chatMessages.innerHTML += `<p><strong>${sender}:</strong> ${message}</p>`;
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function startVoiceToText() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = function (event) {
      const spokenText = event.results[0][0].transcript;
      document.getElementById("chatInput").value = spokenText;
  };

  recognition.onerror = function (event) {
      console.error("Speech recognition error", event);
      alert("Error in speech recognition: " + event.error);
  };

  recognition.start();
}

// Handle incoming messages
socket.on("chat-message", (message) => {
  displayChatMessage("Helper", message);
});

// function loadRemoteHelp() {
//     const contentDiv = document.getElementById("content");
//     contentDiv.innerHTML = `
//       <div id="remoteContainer">
//         <h2>Remote Assistance</h2>
//         <p>Click below to start a live text chat.</p>
//         <button id="startChatBtn">Join Live Chat</button>
//         <div id="chatArea" style="display:none; margin-top:20px;">
//           <p><strong>User:</strong> <span id="transcribedText">(Waiting for speech...)</span></p>
//           <button id="recordBtn">Record Question</button>
//           <p><strong>Helper:</strong></p>
//           <div id="helperResponse"></div>
//         </div>
//       </div>
//     `;
//     document.getElementById("startChatBtn").addEventListener("click", startLiveChat);
// }

// function startLiveChat() {
//     document.getElementById("chatArea").style.display = "block";
//     document.getElementById("startChatBtn").style.display = "none";
//     document.getElementById("recordBtn").addEventListener("click", recordSpeech);
// }

// function recordSpeech() {
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     recognition.lang = "en-US";
//     recognition.start();

//     recognition.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         document.getElementById("transcribedText").innerText = transcript;
//         socket.emit("userMessage", transcript); // Send to helper
//     };

//     recognition.onerror = (event) => {
//         console.error("Speech recognition error:", event.error);
//     };
// }

// socket.on("helperResponse", (response) => {
//     document.getElementById("helperResponse").innerHTML = `<p>${response}</p>`;
// });


//   function loadRemoteHelp() {
//     const contentDiv = document.getElementById("content");
//     contentDiv.innerHTML = `
//       <div id="remoteContainer">
//         <h2>Remote Assistance</h2>
//         <p>Click below to start a live voice chat with a helper.</p>
//         <button id="startCallBtn">Join Live Voice Chat</button>
//         <div id="remoteStatus" style="margin-top:20px;"></div>
//       </div>
//     `;
//     document.getElementById("startCallBtn").addEventListener("click", startRemoteCall);
// }

// function startRemoteCall() {
//     document.getElementById("remoteStatus").innerHTML = "Requesting a helper to join...";

//     // Send an email invite to the helper
//     sendEmailInvite();

//     // Initialize WebRTC voice connection (requires a signaling server)
//     initializeWebRTC();
// }

// // Function to send an email invite to you (the helper)
// function sendEmailInvite() {
//     fetch("https://api.emailservice.com/send", { // Replace with a real email API
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             to: "samantha.2sfl@gmail.com",
//             subject: "User Needs Live Tech Assistance",
//             text: `A user has requested live voice assistance. Click here to join: https://elderease.com/join`
//         })
//     })
//     .then(response => response.json())
//     .then(data => console.log("Email sent", data))
//     .catch(error => console.error("Email error", error));
// }

// // Function to initialize WebRTC (voice-only)
// function initializeWebRTC() {
//     let peerConnection;
//     const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

//     peerConnection = new RTCPeerConnection(config);
//     peerConnection.onicecandidate = event => {
//         if (event.candidate) {
//             console.log("New ICE Candidate", event.candidate);
//         }
//     };

//     navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
//         stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
//         document.getElementById("remoteStatus").innerHTML = "Live voice chat started!";
//     });

//     peerConnection.createOffer().then(offer => {
//         peerConnection.setLocalDescription(offer);
//         console.log("Offer created", offer);
//     });
// }
