document.getElementById('chatbotBtn').addEventListener('click', () => {
    window.location.href = "chatbot.html"; 

});


document.getElementById('tutorialsBtn').addEventListener('click', () => {
    window.location.href = "video.html"; });

document.getElementById('remoteHelpBtn').addEventListener('click', () => {
        window.location.href = "remote.html"; 
    
});



//Example function to start voice recognition
function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = function(event) {
        const spokenText = event.results[0][0].transcript;
        alert("You said: " + spokenText);
        if(spokenText) {
            fetch('http://127.0.0.1:5000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*", // Allow all origins
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization"
                },
                body: JSON.stringify({
                    question: `A senior is asking: ${spokenText} . Only show direct steps in the response. Start each step with \'Step\' and Each step should not be more than 20 words. Do not add introductory or concluding sentences.`,
                })
            })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem("chatResponse", data.response);
                window.location.href = "response.html";
                // alert("Answerlol: " + data.response);
                
            })
            .catch(err => {
                console.error(err);
                alert("Error fetching answer. Please try again.");
            });
        }
        // You can trigger your chatbot function here using spokenText as the question
    };
    recognition.start();

    recognition.onerror = function(event) {
    console.error(event.error);
    alert("Error capturing speech. Please try again.");
    }; 
}


// Optionally, add a button for voice command
const voiceBtn = document.createElement('button');
voiceBtn.innerText = "🎙️ Speak Your Question";
voiceBtn.addEventListener('click', startVoiceRecognition);
document.querySelector('.container').appendChild(voiceBtn);

const chatbotBtn = document.createElement('button');

document.addEventListener("DOMContentLoaded", function () {
   
    remoteHelpBtn.addEventListener("click", loadRemoteHelp);
  });

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
  
    //document.getElementById("startChatBtn").addEventListener("click", startLiveChat);
  }
