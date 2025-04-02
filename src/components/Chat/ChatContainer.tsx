import React, { useState, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatThread from './ChatThread';
import ChatInput from './ChatInput';
import EmptyChat from './EmptyChat';
import ProviderInfo from './ProviderInfo';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface ChatContainerProps {
  selectedChat?: {
    id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
    messages: any[];
    provider: {
      id: string;
      name: string;
      avatar?: string;
      rating: number;
      reviewCount: number;
      company?: string;
      email?: string;
      phone?: string;
    };
    booking?: {
      id: string;
      status: string;
      date: string;
      service: string;
    };
  };
  onSendMessage: (chatId: string, message: string, attachments?: File[]) => void;
  onTyping: (chatId: string) => void;
  onStopTyping: (chatId: string) => void;
  isTyping?: boolean;
  typingUser?: string;
  onBackClick?: () => void;
  loading?: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  selectedChat,
  onSendMessage,
  onTyping,
  onStopTyping,
  isTyping = false,
  typingUser = '',
  onBackClick,
  loading = false
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  useEffect(() => {
    // Reset info panel when chat changes
    if (isMobile) {
      setShowInfo(false);
    }
  }, [selectedChat?.id, isMobile]);
  
  if (!selectedChat) {
    return <EmptyChat />;
  }
  
  const handleSendMessage = (message: string, attachments?: File[]) => {
    onSendMessage(selectedChat.id, message, attachments);
  };
  
  const handleTyping = () => {
    onTyping(selectedChat.id);
  };
  
  const handleStopTyping = () => {
    onStopTyping(selectedChat.id);
  };

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      <div className="flex flex-col flex-grow">
        <ChatHeader 
          title={selectedChat.name}
          subtitle={selectedChat.booking ? `Booking #${selectedChat.booking.id}` : ''}
          avatar={selectedChat.avatar}
          isOnline={selectedChat.isOnline}
          onBackClick={isMobile ? onBackClick : undefined}
          onInfoClick={() => setShowInfo(!showInfo)}
          isMobile={isMobile}
        />
        
        <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-850">
          <ChatThread 
            messages={selectedChat.messages}
            isTyping={isTyping}
            typingUser={typingUser}
            loading={loading}
          />
        </div>
        
        <ChatInput 
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
        />
      </div>
      
      {showInfo && (
        <div className={`${isMobile ? 'absolute inset-0 z-10' : ''}`}>
          <ProviderInfo 
            provider={selectedChat.provider}
            booking={selectedChat.booking}
            onClose={() => setShowInfo(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;