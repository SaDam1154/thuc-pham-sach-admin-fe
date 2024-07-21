import { collection, addDoc, setDoc, query, where, orderBy, onSnapshot, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // import đối tượng db từ file cấu hình firebase

// Hàm gửi tin nhắn
const sendMessage = async (newMessage) => {
    try {
        await addDoc(collection(db, 'messages'), {
            conversations: newMessage.conversations,
            text: newMessage.text,
            senderId: newMessage.senderId,
            timestamp: newMessage.timestamp,
        });
        console.log('Message sent successfully!');
    } catch (error) {
        console.error('Error sending message: ', error);
    }
};

const updateLastMessage = async (conversationId, lastMessage) => {
    try {
        const conversationRef = doc(db, 'conversations', conversationId);
        await updateDoc(conversationRef, { lastMessage: lastMessage });
        return true;
    } catch (error) {
        console.error('Error updating last message:', error);
        return false;
    }
};

// Hàm lấy danh sách tin nhắn
const getMessages = (conversationId, callback) => {
    try {
        const messagesRef = collection(db, 'messages');
        const q = query(messagesRef, where('conversations', '==', conversationId));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(messages);
        });

        return unsubscribe;
    } catch (error) {
        console.error('Error getting messages:', error);
        return () => {}; // Trả về một hàm rỗng để tránh lỗi nếu không có unsubscribe
    }
};

const getConversation = (conversationId, callback) => {
    try {
        const conversationsRef = collection(db, 'conversations');
        const q = query(conversationsRef, where('id', '==', conversationId), limit(1));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.forEach((doc) => {
                const conversation = {
                    id: doc.id,
                    ...doc.data(),
                };
                callback(conversation);
            });
        });

        return unsubscribe;
    } catch (error) {
        console.error('Error getting conversation:', error);
        return () => {}; // Trả về một hàm rỗng để tránh lỗi nếu không có unsubscribe
    }
};

const getUser = async (customerId) => {
    const userRef = doc(db, 'users', customerId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log('No such document!', customerId);
        return [];
    }
};
const checkConversation = async (customer) => {
    try {
        const q = query(collection(db, 'conversations'), where('participants', 'array-contains', customer._id));

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            console.log(`Conversation found for customer ID:`);
            const conversationId = querySnapshot.docs[0].id;
            return conversationId;
        } else {
            console.log(`No conversation found for customer ID: ${customer._id}`);
            try {
                const newConversationRef = await addDoc(collection(db, 'conversations'), {
                    lastMessage: '',
                    participants: [customer._id, '658957a7e30c9ef2e3045c99'], // id admin
                });
                console.log('Add conversation successfully!');
                return newConversationRef.id;
            } catch (error) {
                console.error('Error sending message: ', error);
            }
            return null;
        }
    } catch (error) {
        console.error('Error checking conversation:', error);
        return false;
    }
};

// Hàm lấy danh sách tất cả các cuộc hội thoại
const getConversationList = (callback) => {
    try {
        const q = query(collection(db, 'conversations'));

        return onSnapshot(q, (snapshot) => {
            const conversations = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(conversations);
        });
    } catch (error) {
        console.error('Error getting conversation list:', error);
        return [];
    }
};

export { sendMessage, getMessages, getUser, checkConversation, getConversationList, updateLastMessage, getConversation };
