import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import useAppStore from '@/lib/store/appStore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Chat: React.FC = () => {
  const { userProfile, setOnboarded } = useAppStore();
  const navigate = useNavigate();

  const handleReset = () => {
    setOnboarded(false);
    navigate('/');
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b p-4 flex justify-between items-center">
        <h1 className="font-bold">Chat with Future Self</h1>
        <Button variant="outline" onClick={handleReset}>
          Start Over
        </Button>
      </header>
      <main className="flex-1">
        <ChatInterface />
      </main>
    </div>
  );
};

export default Chat;