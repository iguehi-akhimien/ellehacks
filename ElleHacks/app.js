// document.getElementById('chatbotBtn').addEventListener('click', () => {
//     let question = prompt("Please type your tech question:");
//     if(question) {
//         // Call OpenAI API
//         fetch('https://api.openai.com/v1/completions', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
//             },
//             body: JSON.stringify({
//                 model: 'text-davinci-003',
//                 prompt: `A senior is asking: ${question}. Provide a simple, step-by-step explanation.`,
//                 max_tokens: 100
//             })
//         })
//         .then(response => response.json())
//         .then(data => {
//             alert("Answer: " + data.choices[0].text.trim());
//         })
//         .catch(err => {
//             console.error(err);
//             alert("Error fetching answer. Please try again.");
//         });
//     }
// });


// // Example function to start voice recognition
// function startVoiceRecognition() {
//     const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
//     recognition.onresult = function(event) {
//         const spokenText = event.results[0][0].transcript;
//         alert("You said: " + spokenText);
//         // You can trigger your chatbot function here using spokenText as the question
//     };
//     recognition.start();
// }

// // Optionally, add a button for voice command
// const voiceBtn = document.createElement('button');
// voiceBtn.innerText = "🎙️ Speak Your Question";
// voiceBtn.addEventListener('click', startVoiceRecognition);
// document.querySelector('.container').appendChild(voiceBtn);

// const tutorialsBtn = document.getElementById('tutorialsBtn');
// const videoTutorialsSection = document.getElementById('videoTutorialsSection');

// // Event listener for the "Video Tutorials" button
// tutorialsBtn.addEventListener('click', () => {
//     // Toggle visibility of the video tutorials section
//     videoTutorialsSection.classList.toggle('hidden');
// });

// Chatbot functionality for asking questions
document.getElementById('chatbotBtn').addEventListener('click', () => {
    let question = prompt("Please type your tech question:");
    if (question) {
        // Call OpenAI API
        fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_OPENAI_API_KEY'  // Replace with your API key
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

// Voice recognition functionality
function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = function(event) {
        const spokenText = event.results[0][0].transcript;
        alert("You said: " + spokenText);
        // Trigger chatbot function here using spokenText as the question
        askChatbot(spokenText);
    };
    recognition.start();
}

// Function to trigger the chatbot with spoken text
function askChatbot(question) {
    if (question) {
        fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_OPENAI_API_KEY'  // Replace with your API key
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
}

// Create and add a button for voice command
const voiceBtn = document.createElement('button');
voiceBtn.innerText = "🎙️ Speak Your Question";
voiceBtn.addEventListener('click', startVoiceRecognition);
document.querySelector('.container').appendChild(voiceBtn);

// Handle the "Video Tutorials" button click event to toggle visibility of video tutorials
const tutorialsBtn = document.getElementById('tutorialsBtn');
const videoTutorialsSection = document.getElementById('videoTutorialsSection');

// Event listener for the "Video Tutorials" button
tutorialsBtn.addEventListener('click', () => {
    // Toggle visibility of the video tutorials section
    videoTutorialsSection.classList.toggle('hidden');
});

// Handle video upload functionality
document.getElementById('uploadForm').addEventListener('submit', uploadVideo);
document.getElementById('searchBtn').addEventListener('click', searchVideos);

function uploadVideo(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const keywords = document.getElementById('keywords').value;
    const videoFile = document.getElementById('videoFile').files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('keywords', keywords);
    formData.append('videoFile', videoFile);

    fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Video uploaded successfully!');
        } else {
            alert('Error uploading video');
        }
    });
}

function searchVideos() {
    const keyword = document.getElementById('searchInput').value;

    fetch(`http://localhost:5000/search?keyword=${keyword}`)
        .then(response => response.json())
        .then(data => {
            const videoResultsDiv = document.getElementById('videoResults');
            videoResultsDiv.innerHTML = '';  // Clear previous results

            if (data.length === 0) {
                videoResultsDiv.innerHTML = "<p>No videos found.</p>";
            }

            data.forEach(video => {
                const videoElement = document.createElement('div');
                videoElement.innerHTML = `
                    <h4>${video.title}</h4>
                    <p>${video.description}</p>
                    <video controls>
                        <source src="http://localhost:5000/video/${video.fileId}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                `;
                videoResultsDiv.appendChild(videoElement);
            });
        });
        // Upload video route
app.post('/upload', upload.single('videoFile'), (req, res) => {
    const { title, description, keywords } = req.body;
    const videoFile = req.file;

    console.log("Video file received:", videoFile);  // Log the received file

    if (!videoFile) {
        return res.status(400).json({ success: false, message: 'No video file uploaded' });
    }

    // Store the video in GridFS
    const writeStream = gfs.createWriteStream({
        filename: videoFile.originalname,
        content_type: videoFile.mimetype
    });

    writeStream.write(videoFile.buffer);
    writeStream.end();

    // Log that the video is being stored
    writeStream.on('close', (file) => {
        console.log("Video file stored in GridFS:", file);

        // Save video metadata to MongoDB
        const newVideo = new Video({
            title,
            description,
            keywords: keywords.split(','),
            fileId: file._id // use the file ID from GridFS
        });

        newVideo.save()
            .then(video => res.json({ success: true, video }))
            .catch(err => {
                console.log("Error saving metadata to DB:", err);
                res.status(500).json({ success: false, error: err });
            });
    });

    writeStream.on('error', (err) => {
        console.log("Error during video upload:", err);
        res.status(500).json({ success: false, error: err });
    });
});

}
