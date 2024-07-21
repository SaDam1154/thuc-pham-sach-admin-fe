import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { sendMessage, getMessages, updateLastMessage, getConversation } from '../../../configs/firebase/firebaseUtils.js';
import { Timestamp } from 'firebase/firestore';

export default function ChatBox({ senderId, conversationId, lastMessage }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const inputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const [firstOpen, setFirstOpen] = useState(true);
    useEffect(() => {
        const unsubscribe = getMessages(conversationId, (fetchedMessages) => {
            setMessages(fetchedMessages);
        });

        return () => unsubscribe(); // Hủy đăng ký khi component unmount
    }, [conversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {}, [messages]);

    const scrollToBottom = () => {
        const messagesContainer = document.querySelector('.messages-container');
        if (firstOpen) {
            console.log(firstOpen, 'đây là FO', messagesContainer.scrollTop, '-', messagesContainer.scrollTop);
            if (messagesContainer.scrollHeight > 500) messagesContainer.scrollTop = messagesContainer.scrollHeight;
            console.log(firstOpen, 'đây là trước set', messagesContainer.scrollTop, '-', messagesContainer.scrollTop);
            if (messagesContainer.scrollTop > 400) {
                console.log('lớn hơn 400');
                if (messagesContainer.scrollTop >= messagesContainer.scrollHeight - 300) {
                    console.log('Thõa điều kiện 2');
                } else {
                    console.log('Không đủ đ kiện 2');
                }
            } else {
                console.log('Nhỏ hơn 400');
            }
            if (messagesContainer.scrollTop > 400 && messagesContainer.scrollTop >= messagesContainer.scrollHeight - 300) {
                console.log(firstOpen, 'đây là st', messagesContainer.scrollTop, '-', messagesContainer.scrollTop);
                console.log('set');
                setFirstOpen(false);
            }
        } else {
            console.log(firstOpen, 'đây là FO', messagesContainer.scrollTop, '-', messagesContainer.scrollTop);
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                conversations: conversationId,
                senderId: senderId,
                text: message,
                timestamp: Timestamp.now(),
            };
            setMessages([...messages, newMessage]);
            setMessage('');
            sendMessage(newMessage);
            updateLastMessage(conversationId, newMessage);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const formattedTimestamp = (timestamp) => {
        const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        return moment(date).format('HH:mm');
    };

    return (
        <div className='flex h-full w-full flex-col bg-white shadow-lg'>
            <div className='messages-container flex-1 overflow-y-auto p-2'>
                {messages
                    ?.sort((a, b) => a.timestamp.seconds - b.timestamp.seconds)
                    .map((msg, index) => (
                        <div key={index} className={`mb-2 ${msg.senderId === senderId ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block rounded-lg p-2 ${msg.senderId === senderId ? 'bg-blue-100' : 'bg-gray-300'}`}>
                                <span>{msg.text}</span>
                                <span className='block text-xs text-gray-500'>{formattedTimestamp(msg.timestamp)}</span>
                            </div>
                        </div>
                    ))}
                <div ref={messagesEndRef} />
            </div>
            <div className='flex border-t border-gray-300 p-2'>
                <input
                    ref={inputRef}
                    type='text'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className='flex-1 rounded-lg border border-gray-300 p-2'
                    placeholder='Type your message...'
                />
                <button onClick={handleSendMessage} className='ml-2 rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700'>
                    Send
                </button>
            </div>
        </div>
    );
}
