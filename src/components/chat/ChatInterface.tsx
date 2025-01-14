// src/components/chat/ChatInterface.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import useAppStore from '@/lib/store/appStore';
import { generateChatResponse } from '@/lib/api/futurePersona';
import { ChatMessage } from '@/types/chat';
import { useNavigate } from 'react-router-dom';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { userProfile, reset } = useAppStore();
  const navigate = useNavigate();

  const handleReset = () => {
    reset(); // Reset the store
    navigate('/'); // Navigate back to the landing page
  };

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0 && userProfile?.futurePersona) {
      setMessages([
        {
          id: '1',
          content: `Hey! I'm your future self from 2034. I've achieved ${userProfile.futurePersona.achievedGoals[0] || 'our financial goals'
            }. What would you like to know about your financial journey?`,
          sender: 'future-self',
          timestamp: new Date(),
        },
      ]);
    }
  }, [messages.length, userProfile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !userProfile || !userProfile.futurePersona) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await generateChatResponse(inputMessage, {
        answers: userProfile.answers,
        futurePersona: userProfile.futurePersona
        });

    const futureMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: response,
      sender: 'future-self',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, futureMessage]);
  } catch (error) {
    console.error('Error generating response:', error);
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      content: "I'm having trouble connecting right now. Please try again.",
      sender: 'future-self',
      timestamp: new Date(),
    }]);
  } finally {
    setIsLoading(false);
  }
};

return (
  <div className="flex flex-col fixed inset-0">
    {/* Fixed Header */}
    <div className="border-b p-4 flex justify-between items-center bg-background">
      <h1 className="font-bold">Chat with Future Self</h1>
      <Button variant="outline" onClick={handleReset}>
        Start Over
      </Button>
    </div>

    {/* Chat Area - fills remaining space with scroll */}
    <div className="flex-1 overflow-hidden relative">
      <div 
        className="absolute inset-0 overflow-y-auto p-4"
        ref={scrollAreaRef}
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className="flex items-start gap-2 max-w-[80%]">
                {message.sender === 'future-self' && (
                  <Avatar>
                    <AvatarFallback>FS</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-lg p-3 bg-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Fixed Input Area */}
    <div className="border-t p-4 bg-background">
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask your future self something..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          Send
        </Button>
      </form>
    </div>
  </div>
);
};

export default ChatInterface;