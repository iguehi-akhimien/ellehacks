//remote.js
document.addEventListener("DOMContentLoaded", function () {
    const joinCallBtn = document.getElementById("joinCallBtn");
    joinCallBtn.addEventListener("click", function () {
      const code = document.getElementById("joinCode").value;
      if (!code) {
        alert("Please enter a code.");
        return;
      }
      document.getElementById("remoteHelperStatus").innerHTML =
        "Attempting to join call with code: " + code;
      // Here you would set up your WebRTC connection using the code as a room identifier.
      // This is a placeholder for demonstration.
    });
  });

document.addEventListener("DOMContentLoaded", function () {
  const startCallBtn = document.getElementById("startCallBtn");

  let peerConnection;
  const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  startCallBtn.addEventListener("click", function () {
      sendEmailInvite(); // Send an email invite to the helper

      // Initialize WebRTC voice connection
      peerConnection = new RTCPeerConnection(config);
      peerConnection.onicecandidate = event => {
          if (event.candidate) {
              console.log("New ICE Candidate", event.candidate);
          }
      };

      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
          stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
      });

      peerConnection.createOffer().then(offer => {
          peerConnection.setLocalDescription(offer);
          console.log("Offer created", offer);
      });

      document.getElementById("remoteStatus").innerHTML = "Waiting for a helper to join...";
  });
});

// Function to send email invite
function sendEmailInvite() {
  fetch("https://api.emailservice.com/send", { // Replace with actual email API
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          to: "nomaam158@gmail.com",
          subject: "Join Live Voice Chat",
          text: `Click here to join the call: https://elderease.com/join`
      })
  })
  .then(response => response.json())
  .then(data => console.log("Email sent", data))
  .catch(error => console.error("Email error", error));
}


