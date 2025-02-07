// components/chat/ChatRoom.jsx
import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import api from '../../api/axios';
import "../../styles/Chat.css";

const ChatRoom = ({ roomId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [messageIds, setMessageIds] = useState(new Set());
    const messagesEndRef = useRef(null);

    useEffect(() => {
        loadMessages();
        loadUnreadCount();
        
        const token = localStorage.getItem('token');
        const sock = new SockJS('http://localhost:8080/ws');
        const stomp = Stomp.over(sock);

        const headers = {
            'Authorization': `Bearer ${token}`
        };
        
        stomp.connect(headers, () => {
            setStompClient(stomp);
            console.log('WebSocket Connected');
            
            stomp.subscribe(`/topic/chat/${roomId}`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                if (!messageIds.has(receivedMessage.id)) {
                    setMessageIds(prev => new Set([...prev, receivedMessage.id]));
                    setMessages(prev => [...prev, receivedMessage]);
                    if (receivedMessage.senderId !== parseInt(localStorage.getItem('userId'))) {
                        loadUnreadCount();
                    }
                }
            });
        });

        return () => {
            if (stompClient) {
                stompClient.disconnect();
            }
        };
    }, [roomId]);
    

    const loadUnreadCount = async () => {
        try {
            const response = await api.get(`/chat/${roomId}/unread-count`);
            setUnreadCount(response.data);
        } catch (error) {
            console.error('읽지 않은 메시지 수 로드 실패:', error);
        }
    };

    const loadMessages = async () => {
        try {
            const response = await api.get(`/chat/${roomId}/messages?page=0&size=50`);
            const messageList = response.data;
            setMessages(messageList);
            setMessageIds(new Set(messageList.map(msg => msg.id)));
        } catch (error) {
            console.error('메시지 로드 실패:', error);
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !stompClient) return;
    
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token not found');
            return;
        }
    
        stompClient.send(`/app/${roomId}/send`, 
            { 'Authorization': `Bearer ${token}` },  // 헤더에 토큰 추가
            JSON.stringify({
                chatRoomId: roomId,
                content: newMessage
            })
        );
    
        setNewMessage('');
    };
    

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    return (
        <div className="chat-room">
            <div className="chat-header">
                <h3>채팅방</h3>
                {unreadCount > 0 && (
                    <span className="unread-badge">{unreadCount}</span>
                )}
            </div>

            <div className="messages-container">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.senderId === localStorage.getItem('userId') ? 'sent' : 'received'}`}>
                        <span className="sender">{msg.senderName}</span>
                        <p className="content">{msg.content}</p>
                        <span className="timestamp">{new Date(msg.timeStamp).toLocaleTimeString()}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="message-form">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                />
                <button type="submit">전송</button>
            </form>
        </div>
    );
};

export default ChatRoom;
