import React, { useState, useRef, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { chatApi } from '@/lib/api';
import { toast } from 'sonner';
import { Send, Bot, User, Loader2, PawPrint, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestedQuestions = [
    'What vaccines does my puppy need?',
    'How often should I feed my cat?',
    'Signs of illness in dogs?',
    'Best diet for senior pets?',
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.message || response.data.response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      // Demo response
      const demoResponses = [
        "I'd be happy to help you with your pet care question! Based on what you've asked, here are some recommendations:",
        "That's a great question about pet health! Let me share some insights with you.",
        "As your pet care assistant, I recommend consulting with a veterinarian for specific medical advice. However, here's some general guidance:",
      ];

      const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `${randomResponse}\n\nFor "${userMessage.content}", I suggest:\n\n1. Regular check-ups with your veterinarian are essential\n2. Maintain a balanced diet appropriate for your pet's age and species\n3. Ensure proper exercise and mental stimulation\n4. Keep vaccinations up to date\n\nWould you like more specific information about any of these points?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 h-[calc(100vh-200px)] flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Pet Assistant</h1>
          <p className="text-muted-foreground">Ask me anything about pet care!</p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-card rounded-2xl shadow-card overflow-hidden flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 gradient-hero rounded-full flex items-center justify-center mb-6 animate-float">
                  <PawPrint className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Hello! I'm your Pet Care Assistant
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Ask me anything about pet health, nutrition, training, or general care. 
                  I'm here to help!
                </p>

                {/* Suggested Questions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(question)}
                      className="p-3 bg-muted rounded-xl text-sm text-foreground text-left hover:bg-muted/80 transition-colors group"
                    >
                      <Sparkles className="h-4 w-4 text-primary inline mr-2 group-hover:animate-wiggle" />
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3 animate-fade-in',
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    )}
                    style={{ animationDelay: `${0.05 * index}s` }}
                  >
                    {/* Avatar */}
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                        message.role === 'user'
                          ? 'bg-secondary'
                          : 'gradient-hero'
                      )}
                    >
                      {message.role === 'user' ? (
                        <User className="h-5 w-5 text-secondary-foreground" />
                      ) : (
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={cn(
                        'max-w-[70%] rounded-2xl px-4 py-3',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-muted text-foreground rounded-tl-sm'
                      )}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <p
                        className={cn(
                          'text-xs mt-2',
                          message.role === 'user'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        )}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex gap-3 animate-fade-in">
                    <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-background/50">
            <div className="flex gap-3 max-w-3xl mx-auto">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about pet care..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                variant="hero"
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              AI responses are for informational purposes only. Consult a vet for medical advice.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Chat;
