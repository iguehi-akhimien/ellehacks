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
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = `
      <div id="chatbotContainer">
        <h2>Ask a Tech Question</h2>
        <textarea id="questionInput" rows="3" placeholder="Type your question here..." style="width:100%; font-size:1.1em;"></textarea>
        <br>
        <button id="sendBtn">Send</button>
        <button id="voiceBtn">🎙️ Speak</button>
        <div id="chatbotResponse" style="margin-top:20px; background: #e9ecef; padding: 10px; border-radius:5px;"></div>
      </div>
    `;
    document.getElementById("sendBtn").addEventListener("click", sendQuestion);
    document.getElementById("voiceBtn").addEventListener("click", startVoiceRecognition);
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
  
  function loadRemoteHelp() {
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = `
      <div id="remoteContainer">
        <h2>Remote Assistance</h2>
        <p>Share this code with your trusted contact to connect for remote help:</p>
        <textarea id="offerCode" rows="3" style="width:100%;" readonly></textarea>
        <br>
        <button id="startCallBtn">Start Call (Generate Code)</button>
        <div id="remoteStatus" style="margin-top:20px;"></div>
      </div>
    `;
    document.getElementById("startCallBtn").addEventListener("click", startRemoteCall);
  }
  
  function startRemoteCall() {
    // For demonstration, we generate a random code.
    // A full WebRTC implementation would require a signaling server.
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById("offerCode").value = code;
    document.getElementById("remoteStatus").innerHTML =
      "Waiting for a helper to join using the code...";
    // Here, you would set up a WebRTC connection (e.g., using Simple-Peer) using this code as the room ID.
  }
  