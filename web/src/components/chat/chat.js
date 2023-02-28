import React, { useEffect, useRef, useState } from 'react';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import Picker from 'emoji-picker-react';
import styleClasses from './styles.module.css';

const Chat = ({ show, socket, userName, room, handleDisconnect }) => {
    const [sendMessage, setSendMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [showEmojiKeyboard, setShowEmojiKeyboard] = useState(false);

    const endMessagesRef = useRef(null);
    const chatBodyRef = useRef(null);

    const scrollToBottom = () => {
        endMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getTime = () => new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes();

    const updateMessage = ({ sender, user, message, time, type }) => {
        setMessages((msg) => [...msg, { sender, user, message, time, type }]);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (sendMessage == '') {
            return;
        }
        const message = {
            room,
            sender: userName,
            message: sendMessage,
            time: getTime(),
        };
        await socket.emit('send_message', message);
        updateMessage({ ...message, type: 'self' });
        setSendMessage('');
        setShowEmojiKeyboard(false);
    };

    useEffect(() => {
        socket.on('receive_message', (message) => {
            updateMessage({ ...message, type: 'other' });
        });
        socket.on('user_joined', (message) => {
            updateMessage({ ...message.data, type: 'join' });
        });
        socket.on('user_left', (message) => {
            updateMessage({ ...message.data, type: 'left' });
        });
    }, []);

    const onEmojiClick = (event, selected) => {
        setSendMessage(sendMessage + selected.emoji);
    };

    const EmojiKeyboard = () => (
        <Picker
            onEmojiClick={onEmojiClick}
            disableAutoFocus={true}
            // skinTone={SKIN_TONE_MEDIUM_DARK}
            groupNames={{ smileys_people: 'PEOPLE' }}
            native
        />
    );

    const Messages = () =>
        messages.map((msg, idx) => {
            let { type } = msg;
            let user;
            if (msg.user) {
                user = msg.user.split(' ')[0];
                if (user.length > 10) user = `${user.slice(0, 10)}... `;
            }
            return type === 'join' || type === 'left' ? (
                <div className={styleClasses.userJoin} key={idx}>
                    <p>
                        {user} {type === 'join' && <span>joined</span>}
                        {type === 'left' && <span>left</span>}
                    </p>
                </div>
            ) : (
                <div
                    className={`${styleClasses.messageContainer} ${
                        type === 'self' ? styleClasses.selfMessage : styleClasses.otherMessage
                    }`}
                    key={idx}
                >
                    <div className={styleClasses.message}>
                        {type !== 'self' && (
                            <div className={styleClasses.messageSender}>
                                {msg.sender.length > 15 ? `${msg.sender.slice(15)}...` : msg.sender}
                            </div>
                        )}
                        <p className={styleClasses.messageText}>{msg.message}</p>
                        <div className={styleClasses.messageTime}>{msg.time}</div>
                    </div>
                </div>
            );
        });

    return (
        <div className={!show ? styleClasses.none : ''}>
            <div className={styleClasses.chatBody} ref={chatBodyRef}>
                <Messages />
                <div ref={endMessagesRef} />
            </div>
            <div>
                <form className={styleClasses.chatFooter} onSubmit={(e) => handleSend(e)}>
                    <div className={`${styleClasses.emojiKeyboard}`}>{showEmojiKeyboard && <EmojiKeyboard />}</div>
                    <div className={styleClasses.footerItem} onClick={() => setShowEmojiKeyboard(!showEmojiKeyboard)}>
                        <SentimentSatisfiedAltIcon />
                    </div>
                    <textarea
                        type="text"
                        placeholder="Type Message..."
                        value={sendMessage}
                        onChange={(e) => {
                            setSendMessage(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            e.keyCode == 13 && !e.shiftKey && handleSend(e);
                        }}
                    />
                    <button type="submit">SEND</button>
                </form>
                {/* <button onClick={() => handleDisconnect(room)}>DISCONNECT</button> */}
            </div>
        </div>
    );
};

export default Chat;
