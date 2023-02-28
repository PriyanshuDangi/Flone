import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { nanoid } from 'nanoid';
import NavBar from '../../../components/navbar/Navbar';
import { avatars } from '../../../assets/avatar';
import styleClasses from './styles.module.css';
import World from '../World';

const defaultName = 'Anonymous';
const publicRoom = 'publicroom';

const WorldHome = () => {
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState('Adventurer');
    const [showWorld, setShowWorld] = useState(false);
    const [mode, setMode] = useState('move');
    const [roomId, setRoomId] = useState('');
    const [roomTab, setRoomTab] = useState(0);

    const { search } = useLocation();

    useEffect(() => {
        const roomId = new URLSearchParams(search).get('roomId');
        setRoomId(roomId || '');
    }, [search]);

    useEffect(() => {
        if (roomId && roomId !== '' && roomId !== publicRoom) {
            setRoomTab(1);
        }
    }, [roomId]);

    const AvatarCard = ({ attribute, data }) => {
        return (
            <div
                className={`${styleClasses.avatarCard} ${
                    selectedAvatar === attribute ? styleClasses.avatarActive : ''
                }`}
                onClick={() => setSelectedAvatar(attribute)}
            >
                <div className={styleClasses.avatarSelected}>
                    ✔
                </div>
                <img src={data.image} alt={data.name} />
                <span>{data.name}</span>
            </div>
        );
    };

    const handleJoinRoom = () => {
        if (roomId.length !== 10) {
            // sendMsg({ msg: 'Enter a valid room Id', variant: 'error' });
            alert('Enter a valid room Id');
        } else {
            setShowWorld(true);
        }
    };

    const handleCreateRoom = () => {
        const id = nanoid(10);
        setRoomId(id);
        setShowWorld(true);
    };


    return !showWorld ? (
        <div>
            <NavBar />
            <div className={styleClasses.container + ' container'}>
                <h1>Avatar</h1>
                <div className="d-flex justify-content-center gap-4" style={{ transition: 'all 1s', height: '100%' }}>
                    <div>
                        <div className={styleClasses.infoContainer}>
                            <ul className={styleClasses.roomTab}>
                                <li className={roomTab === 0 ? styleClasses.active : ''} onClick={() => setRoomTab(0)}>
                                    Public
                                </li>
                                <li className={roomTab === 1 ? styleClasses.active : ''} onClick={() => setRoomTab(1)}>
                                    Private
                                </li>
                            </ul>
                            {roomTab === 0 ? (
                                <div className={styleClasses.info}>
                                    <h5>Public Room</h5>
                                    <div className={styleClasses.inputContainer}>
                                        <input
                                            className={styleClasses.nameInput}
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter Name"
                                        />
                                        <span className={styleClasses.focusBorder}></span>
                                    </div>
                                    <button onClick={() => setShowWorld(true)}>Enter World</button>
                                </div>
                            ) : (
                                <div className={styleClasses.info}>
                                    <h5>Private Room</h5>
                                    <div className={styleClasses.inputContainer}>
                                        <input
                                            className={styleClasses.nameInput}
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter Name"
                                        />
                                        <span className={styleClasses.focusBorder}></span>
                                    </div>
                                    <div className={styleClasses.inputContainer}>
                                        <input
                                            className={styleClasses.nameInput}
                                            type="text"
                                            value={roomId}
                                            onChange={(e) => setRoomId(e.target.value)}
                                            placeholder="Enter Room ID"
                                        />
                                        <span className={styleClasses.focusBorder}></span>
                                    </div>
                                    <button onClick={() => handleJoinRoom()}>Join</button>
                                    <span>OR</span>
                                    <button onClick={() => handleCreateRoom()}>Create Room</button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={`${styleClasses.avatarContainer} `}>
                        {Object.keys(avatars).map((key, value) => (
                            <AvatarCard key={value} attribute={key} data={avatars[key]} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <World avatar={selectedAvatar} userName={name || defaultName} controls={mode} roomId={roomId || publicRoom} />
    );
};

export default WorldHome;
