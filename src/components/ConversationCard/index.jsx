import { useState, useEffect } from 'react';
import { getUser } from '../../configs/firebase/firebaseUtils.js';
export default function ConversationCard({ conversation, onConversationClick }) {
    const [user, setUser] = useState([]);

    useEffect(() => {
        fetchUser();
        console.log(user);
    }, []);

    const fetchUser = async () => {
        const userPromise = await getUser(conversation.participants[0].userId);
        console.log(conversation.participants[1], 'đây là id');
        setUser(userPromise);
    };
    return (
        <div
            key={conversation.id}
            className='flex cursor-pointer items-center rounded-md border border-gray-200 p-2 hover:border-blue-600'
            onClick={onConversationClick}
        >
            <img
                className='mr-3 h-12 w-12 rounded-full object-cover'
                src={conversation.avt || '/placeholder-avatar.png'}
                alt={`${conversation.name}'s avatar`}
            />
            <div className='flex flex-col'>
                <p className='font-semibold text-blue-600'>{user.displayName}</p>
                <p className='text-sm italic'>{conversation.lastMessage.text}</p>
                {/* <p className='text-xs text-gray-500'>{conversation.lastMessageTime}</p> */}
            </div>
        </div>
    );
}
