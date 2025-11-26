import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/providers/LanguageProvider";
import { Send, Loader2, Sparkles, Zap, Lightbulb, BookOpen, FileText, Microscope, PlusCircle } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  timestamp: Date;
  analysis?: string;
}

export default function CurioPremium() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [fileLoading, setFileLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { language: contextLanguage } = useLanguage();
  const [userId, setUserId] = useState<number | null>(null);
  const language = contextLanguage === "english" ? "en" : "bn";

  useEffect(() => {
    const storedSession = localStorage.getItem("supabase_session");
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        setUserId(1);
      } catch (e) {
        console.error("Error parsing session:", e);
        setUserId(1);
      }
    } else {
      setUserId(1);
    }
  }, []);


  const handleSendMessage = async () => {
    if (!input.trim() || !userId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          message: messageText,
          conversationHistory: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || data.aiResponse || "I couldn't generate a response.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: language === "bn" ? "ত্রুটি" : "Error",
        description: language === "bn" ? "বার্তা পাঠাতে ব্যর্থ" : "Failed to send message",
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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "image/jpeg",
      "image/png",
    ];

    if (!validTypes.includes(file.type)) {
      toast({
        title: language === "bn" ? "ত্রুটি" : "Error",
        description: language === "bn" ? "শুধুমাত্র PDF, DOCX, DOC, JPG, PNG সমর্থিত" : "Only PDF, DOCX, DOC, JPG, PNG supported",
        variant: "destructive",
      });
      return;
    }

    setFileLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/document/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();

      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        content: data.text || "",
        timestamp: new Date(),
        analysis: data.analysis,
      };

      setUploadedFiles((prev) => [newFile, ...prev]);

      toast({
        title: language === "bn" ? "সফল" : "Success",
        description: language === "bn" ? "ফাইল আপলোড হয়েছে" : "File uploaded successfully",
      });
    } catch (error) {
      toast({
        title: language === "bn" ? "ত্রুটি" : "Error",
        description: language === "bn" ? "ফাইল আপলোড ব্যর্থ" : "File upload failed",
        variant: "destructive",
      });
    } finally {
      setFileLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const suggestedActions = [
    { icon: Lightbulb, label: language === "bn" ? "ধারণা" : "Brainstorm", description: language === "bn" ? "গবেষণা ধারণা" : "Research Ideas" },
    { icon: BookOpen, label: language === "bn" ? "ব্যাখ্যা" : "Explain", description: language === "bn" ? "ধারণা বুঝুন" : "Understand Concepts" },
    { icon: Microscope, label: language === "bn" ? "বিশ্লেষণ" : "Analyze", description: language === "bn" ? "ডেটা বিশ্লেষণ" : "Data Analysis" },
    { icon: Zap, label: language === "bn" ? "সমাধান" : "Problem Solve", description: language === "bn" ? "সমস্যা সমাধান" : "Problem Solving" },
  ];

  // Show home screen if no messages
  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-slate-950 to-slate-900 overflow-y-auto">
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          {/* Greeting */}
          <div className="text-center mb-12 max-w-2xl">
            <h1 className="text-5xl font-light text-white mb-2">
              {language === "bn" ? "নমস্কার" : "Hello"}, {language === "bn" ? "শিক্ষার্থী" : "Student"}
            </h1>
            <p className="text-lg text-slate-400">
              {language === "bn" 
                ? "আপনার বিজ্ঞান শিক্ষার যাত্রা শুরু করুন কিউরিওর সাথে" 
                : "Start your science learning journey with Curio"}
            </p>
          </div>

          {/* Input Area */}
          <div className="w-full max-w-3xl mb-12">
            <div className="relative">
              <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:border-slate-600/50 transition-all">
                <Input
                  placeholder={
                    language === "bn"
                      ? "কিউরিওকে জিজ্ঞাসা করুন..."
                      : "Ask Curio..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="border-0 bg-transparent text-white placeholder:text-slate-500 focus:ring-0 text-lg"
                  data-testid="input-curio-message"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                  data-testid="input-file-upload"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={fileLoading}
                  className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                  data-testid="button-upload-file"
                >
                  <PlusCircle className="w-5 h-5" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded"
                  data-testid="button-send-message"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Suggested Actions */}
          <div className="w-full max-w-3xl">
            <div className="grid grid-cols-2 gap-4">
              {suggestedActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(action.description)}
                  className="group text-left p-4 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/60 transition-all hover:border-slate-600"
                  data-testid={`button-suggest-${idx}`}
                >
                  <div className="flex items-start gap-3">
                    <action.icon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium text-white group-hover:text-blue-300 transition-colors">{action.label}</p>
                      <p className="text-xs text-slate-400 mt-1">{action.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Input Helper Text */}
        <div className="text-center text-xs text-slate-500 pb-6">
          {language === "bn" 
            ? "তথ্য শেয়ার করুন এবং সঠিক উত্তর পান" 
            : "Share information to get accurate answers"}
        </div>
      </div>
    );
  }

  // Chat view
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`max-w-2xl ${message.role === "user" ? "flex-row-reverse" : ""} flex gap-4`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                message.role === "user"
                  ? "bg-slate-700"
                  : "bg-blue-600"
              }`}>
                {message.role === "user" ? "👤" : "🤖"}
              </div>

              {/* Message */}
              <div
                className={`rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-100"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center flex-shrink-0">
                🤖
              </div>
              <div className="bg-slate-800 rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 hover:border-slate-600/50 transition-all">
            <Input
              placeholder={
                language === "bn"
                  ? "আরও জিজ্ঞাসা করুন..."
                  : "Ask follow-up..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="border-0 bg-transparent text-white placeholder:text-slate-500 focus:ring-0"
              data-testid="input-curio-followup"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={fileLoading}
              className="text-slate-400 hover:text-white hover:bg-slate-700/50"
              data-testid="button-upload-file-chat"
            >
              <PlusCircle className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              size="icon"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded"
              data-testid="button-send-followup"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
