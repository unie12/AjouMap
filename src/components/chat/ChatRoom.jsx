import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import api from '../../api/axios';
import "../../styles/Chat.css";

const ChatRoom = ({ roomId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const stompClientRef = useRef(null); // WebSocket Client 관리
    const messageIdsRef = useRef(new Set()); // 중복 메시지 확인
    const messagesEndRef = useRef(null);

    // WebSocket 연결 및 초기 데이터 로드
    useEffect(() => {
        loadMessages();
        connectWebSocket();

        return () => disconnectWebSocket();
    }, [roomId]);

    // 메시지 로드
    const loadMessages = async () => {
        try {
            setLoading(true);
            // 더 큰 size 값 사용
            const response = await api.get(`/chat/${roomId}/messages?page=0&size=1000`);
            const messageList = response.data;
            // 시간순으로 정렬
            const sortedMessages = messageList.sort((a, b) => 
                new Date(a.timestamp) - new Date(b.timestamp)
            );
            setMessages(sortedMessages);
            messageIdsRef.current = new Set(sortedMessages.map(msg => msg.id));
        } catch (error) {
            console.error('메시지 로드 실패:', error);
        } finally {
            setLoading(false);
        }
    };
    

    // WebSocket 연결
    const connectWebSocket = () => {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const sock = new SockJS('http://localhost:8080/ws');
        const stompClient = Stomp.over(sock);

        stompClient.connect(headers, () => {
            stompClientRef.current = stompClient;

            // 채팅방 입장
            stompClient.send(`/app/enter/${roomId}`, headers, {});

            // 메시지 구독
            stompClient.subscribe(`/topic/chat/${roomId}`, handleNewMessage);

            // 알림 구독
            stompClient.subscribe(`/user/queue/notifications`, handleNotification);

            console.log('WebSocket connected');
        }, (error) => {
            console.error('WebSocket connection failed:', error);
        });
    };

    // WebSocket 연결 해제
    const disconnectWebSocket = () => {
        if (stompClientRef.current) {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            stompClientRef.current.send(`/app/leave/${roomId}`, headers, {});
            stompClientRef.current.disconnect();
            console.log('WebSocket disconnected');
        }
    };

    // 새로운 메시지 처리
    const handleNewMessage = (message) => {
        const receivedMessage = JSON.parse(message.body);
        
        const formattedMessage = {
            id: receivedMessage.id,
            senderId: receivedMessage.senderId,
            senderName: receivedMessage.senderName,
            content: receivedMessage.content,
            timestamp: receivedMessage.timestamp,
            isMyMessage: receivedMessage.senderId === parseInt(localStorage.getItem('userId'))
        };
    
        if (!messageIdsRef.current.has(formattedMessage.id)) {
            messageIdsRef.current.add(formattedMessage.id);
            setMessages(prev => [...prev, formattedMessage]);
            scrollToBottom();
        }
    };

    const formatMessageTime = (timestamp) => {
        const messageDate = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // 날짜가 같은 경우 시간만 표시
        if (messageDate.toDateString() === today.toDateString()) {
            return messageDate.toLocaleTimeString('ko-KR', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
        }
        // 그 외의 경우 날짜와 시간 모두 표시
        else {
            return messageDate.toLocaleDateString('ko-KR', {
                month: '2-digit',
                day: '2-digit'
            }) + ' ' + messageDate.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        }
    };

    // 알림 처리
    const handleNotification = (notification) => {
        const data = JSON.parse(notification.body);

        if (Notification.permission === 'granted') {
            new Notification('새 메시지', {
                body: data.content,
                icon: '/path/to/icon.png',
                onClick: () => window.focus() // 알림 클릭 시 창 활성화
            });
        }
    };

    // 메시지 전송
    const sendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !stompClientRef.current) return;
    
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
    
        stompClientRef.current.send(
            `/app/${roomId}/send`,
            headers,
            newMessage
        );
        
        setNewMessage('');
    };
    

    // 스크롤 하단으로 이동
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
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.isMyMessage ? 'sent' : 'received'}`}>
                        {!msg.isMyMessage && <span className="sender">{msg.senderName}</span>}
                        <p className="content">{msg.content}</p>
                        <span className="timestamp">
                            {formatMessageTime(msg.timestamp)}
                        </span>
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
                    disabled={!stompClientRef.current}
                />
                <button type="submit" disabled={!newMessage.trim() || !stompClientRef.current}>전송</button>
            </form>
        </div>
    );
};

export default ChatRoom;
