// remote.js
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
  