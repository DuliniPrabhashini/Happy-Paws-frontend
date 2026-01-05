import React, { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatApi } from "@/lib/api";
import { Send, Bot, User, Loader2, PawPrint, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestedQuestions = [
    "What vaccines does my puppy need?",
    "How often should I feed my cat?",
    "Signs of illness in dogs?",
    "Best diet for senior pets?",
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage(userMessage.content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.data.data || response.data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm here to help with pet-related questions. Please consult a veterinarian for accurate diagnosis and treatment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6 h-[calc(100vh-160px)] flex flex-col">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">Pet Assistant</h1>
          <p className="text-muted-foreground">
            Ask me anything about pet care 🐾
          </p>
        </div>

        <div className="flex-1 bg-card rounded-2xl shadow-card flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 gradient-hero rounded-full flex items-center justify-center mb-6">
                  <PawPrint className="h-10 w-10 text-primary-foreground" />
                </div>

                <h3 className="text-xl font-semibold mb-2">
                  Hello! I'm your Pet Care Assistant
                </h3>
                <p className="text-muted-foreground max-w-md mb-8">
                  Ask about pet health, nutrition, training, or general care.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 w-full max-w-lg">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(q)}
                      className="p-3 bg-muted rounded-xl text-sm text-left hover:bg-muted/80"
                    >
                      <Sparkles className="inline h-4 w-4 text-primary mr-2" />
                      {q}
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
                      "flex gap-3",
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center",
                        message.role === "user"
                          ? "bg-secondary"
                          : "gradient-hero"
                      )}
                    >
                      {message.role === "user" ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      )}
                    </div>

                    <div
                      className={cn(
                        "max-w-[80%] px-4 py-3 rounded-2xl break-words",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted text-foreground rounded-tl-sm"
                      )}
                    >
                      <p className="text-sm leading-loose whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p className="text-xs mt-3 opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <div className="w-9 h-9 gradient-hero rounded-full flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">
                          Thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <div className="p-4 border-t bg-background">
            <div className="flex gap-3 max-w-3xl mx-auto">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about pet care..."
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
              AI responses are informational only. Always consult a veterinarian.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Chat;
