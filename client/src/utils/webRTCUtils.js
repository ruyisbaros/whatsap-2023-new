import {
  reduxAddLocalStream,
  reduxAddPeerConnection,
  reduxAddRemoteStream,
} from "../redux/callStreamSlicer";
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
    store.dispatch(reduxAddRemoteStream(remoteStream));
    store.dispatch(reduxAddPeerConnection(peerConnection));
    //3. Find local ICE Candidate
    peerConnection.addEventListener("icecandidate", (e) => {
      //console.log(e);
      if (e.candidate) {
        socket.emit("iceToServer", {
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

export const fetchUserMedia = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        video: true,
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(options);
      store.dispatch(reduxAddLocalStream(stream));
      resolve();
    } catch (error) {
      console.log("Offer Error: ", error);
      reject();
    }
  });
};
