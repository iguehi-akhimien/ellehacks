document.getElementById('chatbotBtn').addEventListener('click', () => {
    let question = prompt("Please type your tech question:");
    if(question) {
        // Call OpenAI API
        fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
            },
            body: JSON.stringify({
                model: 'text-davinci-003',
                prompt: `A senior is asking: ${question}. Provide a simple, step-by-step explanation.`,
                max_tokens: 100
            })
        })
        .then(response => response.json())
        .then(data => {
            alert("Answer: " + data.choices[0].text.trim());
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
        // You can trigger your chatbot function here using spokenText as the question
    };
    recognition.start();
}

// Optionally, add a button for voice command
const voiceBtn = document.createElement('button');
voiceBtn.innerText = "🎙️ Speak Your Question";
voiceBtn.addEventListener('click', startVoiceRecognition);
document.querySelector('.container').appendChild(voiceBtn);
