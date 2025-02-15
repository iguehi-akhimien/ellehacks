document.getElementById('chatbotBtn').addEventListener('click', () => {
    let question = prompt("Please type your tech question:");
    if(question) {
        fetch('http://127.0.0.1:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*", // Allow all origins
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization"
            },
            body: JSON.stringify({
                question: `A senior is asking: ${question}. Provide a simple, step-by-step explanation.`,
            })
        })
        .then(response => response.json())
        .then(data => {
            alert("Answer: " + data.response);
        })
        .catch(err => {
            console.error(err);
            alert("Error fetching answer. Please try again.");
        });
    }
});


// Example function to start voice recognition
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
                    question: `A senior is asking: ${spokenText}. Provide a simple, step-by-step explanation.`,
                })
            })
            .then(response => response.json())
            .then(data => {
                alert("Answer: " + data.response);
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
