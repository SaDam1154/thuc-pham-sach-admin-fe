import { useEffect, useState } from 'react';
import ConversationCard from '../../../components/ConversationCard';
import { getConversationList } from '../../../configs/firebase/firebaseUtils';
import { Scrollbars } from 'react-custom-scrollbars';
import removeVietnameseTones from '../../../utils/removeVietnameseTones';
import ChatBox from '../ChatBox';
import { useDispatch, useSelector } from 'react-redux';

import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { accountActions } from '../../../redux/slices/accountSlide';
import { accountSelector } from '../../../redux/selectors';
function ConversationList() {
    const account = useSelector(accountSelector);
    const [search, setSearch] = useState('');
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState([]);
    const [renderConversations, setRenderConversations] = useState([]);

    useEffect(() => {
        const unsubscribe = getConversationList((conversationList) => {
            setConversations(conversationList);
            setRenderConversations(conversationList);
        });

        return () => unsubscribe(); // Hủy đăng ký khi component unmount
    }, []);

    useEffect(() => {
        setRenderConversations(
            conversations.filter((conversation) => {
                if (!search || search === '') {
                    return conversation;
                } else {
                    return removeVietnameseTones(conversation.participants[0].displayName.toLowerCase()).includes(
                        removeVietnameseTones(search.toLowerCase())
                    );
                }
            })
        );
    }, [search, conversations]);

    return (
        <>
            <div className='container h-full w-full overflow-y-hidden py-2'>
                <div className='flex h-full'>
                    {/* LEFT VIEW */}
                    <div className='flex flex-1 flex-col rounded-l-md border py-3 px-2'>
                        {/* HEADER ACTION GROUP */}
                        <div className='flex space-x-2 pb-2'>
                            {/* Search */}
                            <input
                                type='text'
                                className='text-input flex-1 py-1'
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                                placeholder='Tìm kiếm sản phẩm'
                            />
                        </div>

                        {/* LIST PRODUCT */}
                        <div className='flex-1'>
                            <Scrollbars autoHide autoHideTimeout={4000} autoHideDuration={200}>
                                <div className='grid grid-cols-1 gap-2'>
                                    {renderConversations
                                        ?.sort((a, b) => b.lastMessage.timestamp.seconds - a.lastMessage.timestamp.seconds)
                                        .map((conversation) => (
                                            <ConversationCard
                                                key={conversation.id}
                                                conversation={conversation}
                                                onConversationClick={() => {
                                                    setSelectedConversation(conversation);
                                                    console.log(selectedConversation);
                                                }}
                                            />
                                        ))}
                                </div>
                            </Scrollbars>
                        </div>
                    </div>

                    {/* RIGHT VIEW */}
                    <div className='j flex h-full min-w-[700px] flex-1 flex-col rounded-r-md border py-5 px-2'>
                        {selectedConversation ? (
                            <ChatBox
                                onClose={() => setSelectedConversation(null)}
                                senderId={account._id} // Thay thế bằng ID thực tế của sender
                                open={true}
                                lastMessage={selectedConversation.lastMessage}
                                conversationId={selectedConversation.id}
                                customerId={conversations.participants?.[0].userId} // Thay thế bằng ID thực tế của customer
                            />
                        ) : (
                            <p className='text-center text-lg font-semibold'>Chọn một cuộc hội thoại để xem tin nhắn</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ConversationList;
