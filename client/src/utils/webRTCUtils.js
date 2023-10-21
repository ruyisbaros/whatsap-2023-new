import { store } from "./../redux/store";
let peerConfiguration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
  ],
};
export const createPeerConnection = (offerObj) => {
  const socket = store.getState().sockets.socket;
  return new Promise(async (resolve, reject) => {
    const peerConnection = new RTCPeerConnection(peerConfiguration);
    //Create media stream for remote
    const remoteStream = new MediaStream();
    /* remoteVideoEl.srcObject = remoteStream;

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    }); */

    //Catch errors
    peerConnection.addEventListener("signalingstatechange", (e) => {
      //console.log(e);
      //console.log(peerConnection.signalingState);
    });

    //3. Find local ICE Candidate
    peerConnection.addEventListener("icecandidate", (e) => {
      //console.log("candidate offer...");
      //console.log(e);
      if (e.candidate) {
        socket.emit("sendIceCandidateToSignalingServer", {
          iceCandidate: e.candidate,
          iceUsername: "username",
        });
      }
    });
    peerConnection.addEventListener("track", (e) => {
      //console.log("Got a track from other client");
      //console.log(e);
      e.streams[0].getTracks().forEach((tr) => {
        remoteStream.addTrack(tr, remoteStream);
      });
    });
    if (offerObj) {
      //console.log("Before", peerConnection.signalingState);
      await peerConnection.setRemoteDescription(offerObj.offer);
      //console.log("After", peerConnection.signalingState);
    }
    resolve();
  });
};
