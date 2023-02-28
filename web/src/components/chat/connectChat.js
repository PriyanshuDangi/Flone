import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Peer from 'peerjs';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MicOffIcon from '@mui/icons-material/MicOff';
import MicIcon from '@mui/icons-material/Mic';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import GroupIcon from '@mui/icons-material/Group';
import { selectUser } from '../../store/reducers/walletSlice';
import Chat from './chat';
import Audio from './audio';
import socket from '../../utils/socket/socket.js';
import styleClasses from './styles.module.css';

const Connect = (props) => {
    const user = useSelector(selectUser);
    const pkh = user.addr;

    const [userName, setUserName] = useState(props.userName);
    const [roomId, setRoomId] = useState(props.roomId);
    const [userId, setUserId] = useState(props.userId);
    const [joinedChat, setJoinedChat] = useState(false);
    const [joinedAudio, setJoinedAudio] = useState(false);
    const [minimized, setMinimized] = useState(false);
    // const [disconnectCall, setDisconnectCall] = useState(false);
    const [micOn, setMicOn] = useState(false);
    const [volumeOn, setVolumeOn] = useState(true);
    const [participants, setParticipants] = useState([]);
    const [showParticipants, setShowParticipants] = useState(false);
    const [peer, setPeer] = useState(null);
    const [audioStream, setAudioStream] = useState(null);

    useEffect(() => {
        socket.on('user_joined', (message) => {
            setParticipants(message.participants);
        });
        socket.on('user_left', (message) => {
            if (message.participants) {
                setParticipants(message.participants);
            }
        });
    }, []);

    useEffect(() => {
        let peer = new Peer(undefined, {
            host: 'api.stoneage.originx.games',
            // host: 'https://peerjs.com/peerserver',
            secure: true,
            port: 8001,
        });

        setPeer(peer);

        peer.on('open', (id) => {
            getUserStream();
            setUserId(id);
            socket.emit('join_room', { roomId, userId: id, user: userName });
            setJoinedChat(true);
        });

        peer.on('error', (err) => {
            console.log(err);
            socket.emit('join_room', { roomId, userId: userId, user: userName });
            setJoinedChat(true);
        })

        peer.on('close', () => {
            try {
                setAudioStream((state) => {
                    if (state) {
                        const tracks = state.getTracks();
                        tracks.forEach(function (track) {
                            track.stop();
                        });
                    }
                    return null;
                });
            } catch (err) {
                console.log(err);
            }
        });

        return () => {
            try {
                // setPeer((peer) => {
                if (peer) {
                    peer.destroy();
                }
                return null;
                // });
            } catch (err) {
                console.log('error in disconnecting peer', err);
            }
        };
    }, []);

    useEffect(() => {
        if (audioStream && !joinedAudio) {
            socket.emit('send_audio', { roomId, userId });
            setJoinedAudio(true);
        }
    }, [audioStream]);

    const getUserStream = async () => {
        // checking browser compatibility for getUserMedia and setting navigator.mediaDevices accordingly
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }

        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function (constraints) {
                var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                if (!getUserMedia) {
                    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                }

                return new Promise(function (resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            };
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
        });

        stream.getAudioTracks()[0].enabled = false;
        setAudioStream(stream);
    };

    const ShowParticipants = () => {
        return (
            <div className={styleClasses.participants}>
                <div className={styleClasses.participantsHeader}>
                    <h6>Participants</h6>
                </div>
                <ul className={styleClasses.participantsList}>
                    {Object.keys(participants).map((key) => {
                        const participant = participants[key];
                        return (
                            <li className={styleClasses.participant} key={participant.key}>
                                {participant.user}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    };

    return (
        <div className={`${styleClasses.chatBoxContainer} ${!props.show ? styleClasses.none : ''}`}>
            <div className={styleClasses.minimizedLogoContainer}>
                {joinedAudio && (
                    <Audio
                        peer={peer}
                        myAudioStream={audioStream}
                        micOn={micOn}
                        setMicOn={setMicOn}
                        volumeOn={volumeOn}
                    />
                )}
                <div className="d-flex align-items-center gap-3" style={{ flex: '1' }}>
                    <GroupIcon
                        className={styleClasses.cursorPointer}
                        onClick={() => setShowParticipants(!showParticipants)}
                    />
                    <div>
                        {micOn ? (
                            <MicIcon
                                className={`${!joinedAudio ? styleClasses.disabled : styleClasses.cursorPointer} `}
                                onClick={() => joinedAudio && setMicOn(false)}
                            />
                        ) : (
                            <MicOffIcon
                                className={`${!joinedAudio ? styleClasses.disabled : styleClasses.cursorPointer} ${
                                    styleClasses.red
                                }`}
                                onClick={() => joinedAudio && setMicOn(true)}
                            />
                        )}
                        {volumeOn ? (
                            <VolumeUpIcon
                                className={`${!joinedAudio ? styleClasses.disabled : styleClasses.cursorPointer} `}
                                onClick={() => {
                                    joinedAudio && setVolumeOn(false);
                                }}
                            />
                        ) : (
                            <VolumeOffIcon
                                className={`${!joinedAudio ? styleClasses.disabled : styleClasses.cursorPointer} ${
                                    styleClasses.red
                                }`}
                                onClick={() => {
                                    joinedAudio && setVolumeOn(true);
                                }}
                            />
                        )}
                    </div>
                </div>
                {showParticipants && <ShowParticipants />}
            </div>
            <div className={minimized ? styleClasses.dNone : styleClasses.chatContainer}>
                <Chat
                    show={joinedChat}
                    socket={socket}
                    userName={props.userName || userName || pkh}
                    room={roomId}
                />
            </div>
        </div>
    );
};

export default Connect;
