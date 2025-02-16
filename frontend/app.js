function showToast(message, type = "info") {
    let bgColor = type === "error" 
        ? "linear-gradient(to right, #ff416c, #ff4b2b)" // Red for errors
        : "linear-gradient(to right, #007BFF, #0056b3)"; // Blue for regular messages

    Toastify({
        text: message,
        duration: 30000, // Set to null to prevent auto-dismissals
        gravity: "bottom",
        position: "center",
        backgroundColor: bgColor,
        style: {
            background: bgColor, 
            color: "white", // Ensure text is readable
            borderRadius: "8px",
            padding: "25px 25px",
            fontSize: "26px",
        },
    }).showToast();
}

function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = function(event) {
        const spokenText = event.results[0][0].transcript;
        showToast("You said: " + spokenText);

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
                    question: `A senior is asking: ${spokenText}. Only show direct steps. Start each step with 'Step'.
                    Each step should not be more than 20 words. Don't add introductory or concluding sentences.` ,
                })
            })
            .then(response => response.json())
            .then(data => {
                showToast(data.response);
                showToast("If you need more help, say no.");
                const audio = new Audio("data:audio/wav;base64," + data.audio);
                audio.play();
            })
            .catch(err => {
                console.error(err);
                showToast("Error fetching answer. Please try again.");
            });
        }
        // You can trigger your chatbot function here using spokenText as the question
    };
    recognition.start();

    recognition.onerror = function(event) {
    console.error(event.error);
    showToast("Error capturing speech. Please try again.");
    }; 
}

document.getElementById('voiceBtn').addEventListener('click', startVoiceRecognition);
//voiceBtn.addEventListener('click', startVoiceRecognition);
//document.querySelector('.container').appendChild(voiceBtn);

// const chatbotBtn = document.createElement('button');
