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
  const userNameAnswer = userProfile?.answers.find(a => a.questionId === 'user_name')?.answer;
  const userName = Array.isArray(userNameAnswer)
    ? userNameAnswer[0]
    : typeof userNameAnswer === 'string'
      ? userNameAnswer
      : '';

  return (
    <div className="flex flex-col fixed inset-0 bg-background">
      {/* Fixed Header */}
      <div className="border-b p-4 flex justify-between items-center bg-primary/5">
        <h1 className="font-bold text-primary">TalkTuahFutureYou</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className='hover:bg-primary/10'
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
      <div className="flex-1 overflow-hidden relative bg-gray-50">
        <div className="absolute inset-0 overflow-y-auto p-4" ref={scrollAreaRef}>
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user'
                  ? 'justify-end'
                  : 'justify-start'
                  }`}
              >
                <div className={`rounded-lg p-3 max-w-[95%] ${message.sender === 'user'
                  ? 'bg-gray-500 text-white'
                  : 'bg-muted text-foreground'
                  }`}>
                  <div className="flex items-start gap-2 max-w-[95%]">
                    {message.sender === 'future-self' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-900 text-white text-sm">
                          F{userName[0]}
                        </AvatarFallback>
                      </Avatar>
                      // </div>
                    )}
                    <div
                      className={`overflow-hidden rounded-lg p-4 ${message.sender === 'user'
                        ? 'bg-white text-black'
                        : 'bg-white shadow-sm border border-gray-200'
                        }`}
                    >
                      {message.sender === 'user' ? (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => (
                              <p className="whitespace-pre-wrap mb-3 last:mb-0">{children}</p>
                            ),
                            h3: ({ children }) => (
                              <h3 className="font-semibold text-base mb-2">{children}</h3>
                            ),
                            ul: ({ children }) => (
                              <ul className="list-disc pl-4 mb-3 space-y-1">{children}</ul>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 text-gray-600 bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Mesmerizing...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 py-2 border-t bg-gray-50">
          <div className="max-w-3xl mx-auto flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="text-sm bg-white hover:bg-gray-50"
              onClick={() => setInputMessage("What will my savings look like?")}
            >
              What will my savings look like?
            </Button>
            <Button
              variant="outline"
              className="text-sm bg-white hover:bg-gray-50"
              onClick={() => setInputMessage("Can you show me my financial timeline?")}
            >
              Can you show me my financial timeline?
            </Button>
            <Button
              variant="outline"
              className="text-sm bg-white hover:bg-gray-50"
              onClick={() => setInputMessage("What important financial decisions should I make now?")}
            >
              What important financial decisions should I make now?
            </Button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <form
          onSubmit={handleSendMessage}
          className="max-w-2xl mx-auto flex gap-2"
        >
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask future you 10 years from now..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gray-600 hover:bg-gray-800 text-white"
          >
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