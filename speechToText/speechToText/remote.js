document.getElementById("joinBtn").addEventListener("click", function() {
    const video = document.getElementById("video");

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            video.srcObject = stream;
            video.style.display = "block";
        })
        .catch(function(error) {
            alert("Camera access denied or unavailable.");
            console.error(error);
        });
});

