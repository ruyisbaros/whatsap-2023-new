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
  const loggedUser = store.getState().currentUser.loggedUser;
  const chattedUser = store.getState().messages.chattedUser;
  return new Promise(async (resolve, reject) => {
    const peerConnection = new RTCPeerConnection(peerConfiguration);
    //Create media stream for remote
    const remoteStream = new MediaStream();
    store.dispatch(reduxAddPeerConnection(peerConnection));
    //3. Find local ICE Candidate
    peerConnection.addEventListener("icecandidate", (e) => {
      //console.log(e);
      if (e.candidate) {
        socket.emit("iceToServer", {
          iceCandidate: e.candidate,
          target: chattedUser?._id,
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
      await peerConnection.setRemoteDescription(offerObj?.offer);
    }
    resolve({ remoteStream });
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
