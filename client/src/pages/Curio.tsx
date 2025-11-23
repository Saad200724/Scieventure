import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/providers/LanguageProvider";
import { Send, MessageCircle } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function Curio() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm Curio, your science learning companion. I'm here to help you explore and understand science concepts. What would you like to learn about today? I can help with Biology, Chemistry, Physics, Mathematics, Environmental Science, and Astronomy!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { language: contextLanguage } = useLanguage();
  const [userId, setUserId] = useState<number | null>(null);
  const language = contextLanguage === "english" ? "en" : "bn";

  useEffect(() => {
    const storedSession = localStorage.getItem("supabase_session");
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        // For now, use a default user ID - in production, this would come from auth
        setUserId(1);
      } catch (e) {
        console.error("Error parsing session:", e);
        setUserId(1);
      }
    } else {
      setUserId(1);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !userId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          message: input,
          conversationHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Curio");
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || data.aiResponse || "Sorry, I couldn't generate a response.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: language === "bn" ? "ত্রুটি" : "Error",
        description:
          language === "bn"
            ? "বার্তা পাঠাতে ব্যর্থ হয়েছে"
            : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white dark:bg-slate-950 px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {language === "bn" ? "কিউরিও" : "Curio"}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === "bn"
                ? "আপনার বিজ্ঞান শিক্ষা সহচর"
                : "Your Science Learning Companion"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <Card
              className={`max-w-xs lg:max-w-md px-4 py-2 ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  message.role === "user"
                    ? "text-blue-100"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </Card>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <Card className="px-4 py-3 bg-gray-200 dark:bg-gray-800">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200"></div>
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-white dark:bg-slate-950 p-4">
        <div className="flex gap-2">
          <Input
            placeholder={
              language === "bn"
                ? "আপনার প্রশ্ন জিজ্ঞাসা করুন..."
                : "Ask your science question..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="flex-1"
            data-testid="input-curio-message"
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            size="icon"
            data-testid="button-send-message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {language === "bn"
            ? "Enter চাপুন বা পাঠান বাটন ক্লিক করুন (Shift+Enter নতুন লাইনের জন্য)"
            : "Press Enter or click Send (Shift+Enter for new line)"}
        </p>
      </div>
    </div>
  );
}
