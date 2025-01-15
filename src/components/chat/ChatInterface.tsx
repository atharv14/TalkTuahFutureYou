// src/components/chat/ChatInterface.tsx
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';
import useAppStore from '@/lib/store/appStore';
import { generateChatResponse } from '@/lib/api/futurePersona';
import { ChatMessage } from '@/types/chat';
import { useNavigate } from 'react-router-dom';
import TimelineVisualizer from '../timeline/TimelineVisualizer';
import { ChatCompletionMessage } from '@/types/chat';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTimelineVisible, setIsTimelineVisible] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { userProfile, reset } = useAppStore();
  const navigate = useNavigate();

  const handleReset = () => {
    reset();
    navigate('/');
  };

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0 && userProfile?.futurePersona) {
      const userName = userProfile.answers.find(a => a.questionId === 'user_name')?.answer || '';
      setMessages([
        {
          id: '1',
          content: `### Hey ${userName}! 👋\n\nI'm your future self from 2034. We've achieved ${userProfile.futurePersona.achievedGoals[0] || 'our financial goals'}. What would you like to know about your financial journey?`,
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
    if (!inputMessage.trim() || isLoading || !userProfile?.futurePersona) return;

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
      // Convert previous messages to OpenAI format
      const previousMessages: ChatCompletionMessage[] = messages
        .slice(-5)
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content,
        }));

      const response = await generateChatResponse(inputMessage, {
        answers: userProfile.answers,
        futurePersona: userProfile.futurePersona,
        activeScenario: userProfile.timeline?.scenarios.find(
          s => s.id === userProfile.timeline?.activeScenarioId
        ),
        timeRange: userProfile.timeline?.timeRange,
        previousMessages,
      });

      // Check if message is about financial visualization
      if (
        inputMessage.toLowerCase().includes('show') &&
        (inputMessage.toLowerCase().includes('projection') ||
          inputMessage.toLowerCase().includes('timeline') ||
          inputMessage.toLowerCase().includes('graph'))
      ) {
        setIsTimelineVisible(true);
      }

      const futureMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'future-self',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, futureMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: "I'm having trouble connecting right now. Please try again.",
          sender: 'future-self',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col fixed inset-0">
      {/* Fixed Header */}
      <div className="border-b p-4 flex justify-between items-center bg-background">
        <h1 className="font-bold">TalkTuahFutureYou</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsTimelineVisible(!isTimelineVisible)}
          >
            {isTimelineVisible ? 'Hide Timeline' : 'Show Timeline'}
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Start Over
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map(message => (
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
                        : 'bg-muted prose prose-sm max-w-none dark:prose-invert'
                    }`}
                  >
                    {message.sender === 'user' ? (
                      message.content
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-2">{children}</p>,
                          h3: ({ children }) => (
                            <h3 className="font-bold mb-2">{children}</h3>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc ml-4 mb-2">{children}</ul>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-lg p-3 bg-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mesmerizing...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {messages.length <= 1 && (
      <div className="px-4 py-2 border-t bg-background">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="text-sm"
            onClick={() => setInputMessage("What will my savings look like?")}
          >
            What will my savings look like?
          </Button>
          <Button 
            variant="outline"
            className="text-sm"
            onClick={() => setInputMessage("How do I achieve my financial goals faster?")}
          >
            How do I achieve my financial goals faster?
          </Button>
          <Button 
            variant="outline"
            className="text-sm"
            onClick={() => setInputMessage("What important financial decisions should I make now?")}
          >
            What important financial decisions should I make now?
          </Button>
        </div>
      </div>
    )}

      {/* Input Area */}
      <div className="border-t p-4 bg-background">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="How can you 10 years from now help you ..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            Send
          </Button>
        </form>
      </div>

      {/* Timeline Visualizer */}
      <TimelineVisualizer
        isVisible={isTimelineVisible}
        onClose={() => setIsTimelineVisible(false)}
      />
    </div>
  );
};

export default ChatInterface;