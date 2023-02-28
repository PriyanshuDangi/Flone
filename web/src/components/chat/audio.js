import React, { useState, useRef, useEffect } from 'react';
import socket from '../../utils/socket/socket';
import styleClasses from './styles.module.css';

// const publicRoom = 1; // hardcoded roomId for public chat

const Audio = (props) => {
    const { peer, myAudioStream, setMicOn } = props;

    const [allAudioStreams, setAllAudioStreams] = useState([]);

    const videoGridRef = useRef(null);

    let myVideo = document.createElement('video');
    myVideo.muted = true;
    let peers = {};

    useEffect(() => {
        const func = async () => {
            try {
                peer.on('call', async (call) => {
                    call.answer(myAudioStream);
                    const video = document.createElement('video');

                    call.on('stream', (userVideoStream) => {
                        addVideoStream(video, userVideoStream);
                    });
                });

                socket.on('recv_audio', async (data) => {
                    connectToNewUser(data.key, data.userId, myAudioStream);
                });

                socket.on('user_left', ({ data }) => {
                    const { key } = data;
                    if (peers[key]) {
                        peers[key].close();
                    }
                });
            } catch (err) {
                console.log(err);
            }
        };

        func();
    }, []);

    useEffect(() => {
        const volumeOnOff = (volumeOn) => {
            allAudioStreams.forEach((stream) => {
                if (stream.id !== myAudioStream.id) stream.getAudioTracks()[0].enabled = volumeOn;
            });
        };
        allAudioStreams.length > 0 && volumeOnOff(props.volumeOn);
    }, [props.volumeOn]);

    useEffect(() => {
        const muteUnmute = async (micOn) => {
            if (micOn) {
                navigator.permissions
                    .query({ name: 'microphone' })
                    .then((permissionObj) => {
                        if (permissionObj.state != 'granted') {
                            alert('Microphone permissions denied, please enable it from settings!');
                            setMicOn(false);
                        }
                    })
                    .catch((error) => {
                        console.log('Got error :', error);
                    });
            }
            if (myAudioStream) myAudioStream.getAudioTracks()[0].enabled = micOn;
        };
        muteUnmute(props.micOn);
    }, [props.micOn]);

    function connectToNewUser(key, userId, stream) {
        try {
            const call = peer.call(userId, stream);
            const video = document.createElement('video');

            call.on('stream', (userVideoStream) => {
                addVideoStream(video, userVideoStream);
            });
            call.on('close', () => {
                video.remove();
            });
            peers[key] = call;
        } catch (err) {
            console.log('error in connecting new user', err);
        }
    }

    function addVideoStream(video, stream) {
        try {
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => {
                video.play();
            });
            setAllAudioStreams((prev) => [...prev, stream]);
            videoGridRef.current.append(video);
        } catch (err) {
            console.log('error in appending stream', err);
        }
    }

    return <div ref={videoGridRef} style={{ display: 'none' }} />;
};

export default Audio;
