const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_FIREBASE_PROJECT.firebaseapp.com",
    databaseURL: "https://YOUR_FIREBASE_PROJECT.firebaseio.com",
    projectId: "YOUR_FIREBASE_PROJECT",
    storageBucket: "YOUR_FIREBASE_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  firebase.initializeApp(firebaseConfig);
  
  const db = firebase.database();
  let peerConnection;
  const servers = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
  
  function startVoiceCall() {
    document.getElementById("callStatus").innerText = "Starting call...";
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const audioElement = document.getElementById("remoteAudio");
      audioElement.srcObject = stream;
  
      peerConnection = new RTCPeerConnection(servers);
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
  
      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          db.ref("calls/candidate").set(JSON.stringify(event.candidate));
        }
      };
  
      peerConnection.ontrack = event => {
        document.getElementById("remoteAudio").srcObject = event.streams[0];
      };
  
      peerConnection.createOffer().then(offer => {
        peerConnection.setLocalDescription(offer);
        db.ref("calls/offer").set(JSON.stringify(offer));
      });
  
      db.ref("calls/answer").on("value", snapshot => {
        if (snapshot.exists()) {
          peerConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(snapshot.val())));
        }
      });
    });
  }
  