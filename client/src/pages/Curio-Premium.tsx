import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/providers/LanguageProvider";
import { Send, Brain, Upload as UploadIcon, BookOpen, FileText, Loader2, Sparkles, Zap, ThermometerSun, Lightbulb, Copy, Check } from "lucide-react";

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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hey there! 👋 I'm Curio, your AI science companion powered by cutting-edge Gemini technology. Ready to explore the wonders of science together? Ask me anything!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [fileLoading, setFileLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [researchNotes, setResearchNotes] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("chat");

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

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

  const copyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-teal-500 to-cyan-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Premium Header with Glassmorphism */}
      <div className="relative z-10 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-teal-600/20 backdrop-blur-xl border-b border-cyan-400/20 px-6 py-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl blur-lg opacity-60"></div>
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-xl">
                <Brain className="w-8 h-8 text-white animate-bounce" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-300 via-blue-300 to-teal-300 bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-cyan-300 animate-pulse" />
                {language === "bn" ? "কিউরিও" : "Curio"}
              </h1>
              <p className="text-cyan-200/80 font-semibold text-sm">
                {language === "bn" ? "আপনার এআই বিজ্ঞান সহযোগী" : "Your AI Science Companion"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-green-300 text-sm font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden relative z-10">
        <TabsList className="rounded-none border-b border-cyan-400/20 bg-slate-900/40 backdrop-blur px-6 py-0 w-full justify-start gap-8 h-auto">
          <TabsTrigger 
            value="chat" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent relative px-0 py-4 text-slate-300 data-[state=active]:text-cyan-300 font-semibold transition-all group hover:text-cyan-300"
          >
            <Brain className="w-4 h-4 mr-2 group-data-[state=active]:animate-bounce" />
            {language === "bn" ? "চ্যাট" : "Chat"}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-data-[state=active]:opacity-100 transition-opacity"></div>
          </TabsTrigger>
          <TabsTrigger 
            value="upload"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent relative px-0 py-4 text-slate-300 data-[state=active]:text-cyan-300 font-semibold transition-all group hover:text-cyan-300"
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            {language === "bn" ? "ফাইল" : "Upload"}
          </TabsTrigger>
          <TabsTrigger 
            value="research"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent relative px-0 py-4 text-slate-300 data-[state=active]:text-cyan-300 font-semibold transition-all group hover:text-cyan-300"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {language === "bn" ? "গবেষণা" : "Research"}
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab - Premium Messages */}
        <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden m-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-5 scroll-smooth">
            {messages.map((message, idx) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-3 duration-300`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className={`flex gap-3 max-w-2xl ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 font-xl shadow-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                      : "bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500 shadow-cyan-500/50"
                  }`}>
                    {message.role === "user" ? "👤" : "🤖"}
                  </div>

                  {/* Message Content */}
                  <div className="group">
                    <Card
                      className={`px-5 py-4 shadow-xl backdrop-blur border transition-all duration-300 hover:shadow-2xl ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-blue-500/50 rounded-3xl rounded-tr-lg"
                          : "bg-gradient-to-br from-slate-800 to-slate-700/80 text-slate-50 border-cyan-500/30 rounded-3xl rounded-tl-lg"
                      }`}
                    >
                      <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Message Footer */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                        <span className="text-xs opacity-70">{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        {message.role === "assistant" && (
                          <button
                            onClick={() => copyMessage(message.id, message.content)}
                            className="opacity-50 hover:opacity-100 transition-opacity group-hover:opacity-100"
                            title="Copy"
                            data-testid={`button-copy-${message.id}`}
                          >
                            {copiedId === message.id ? (
                              <Check className="w-4 h-4 text-green-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/50">
                    🤖
                  </div>
                  <Card className="px-5 py-4 bg-gradient-to-br from-slate-800 to-slate-700/80 border-cyan-500/30 shadow-xl rounded-3xl rounded-tl-lg">
                    <div className="flex gap-2 items-center">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Premium Input Area */}
          <div className="border-t border-cyan-400/20 bg-gradient-to-t from-slate-900/80 to-slate-900/40 backdrop-blur p-6 shadow-2xl">
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Input
                  placeholder={
                    language === "bn"
                      ? "বিজ্ঞান সম্পর্কে প্রশ্ন জিজ্ঞাসা করুন..."
                      : "Ask about science..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="relative rounded-xl border-cyan-500/30 bg-slate-800/60 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur transition-all duration-300 h-12 px-4"
                  data-testid="input-curio-message"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                size="icon"
                className="rounded-xl h-12 w-12 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-lg shadow-cyan-500/50 transition-all duration-300 hover:scale-110 active:scale-95"
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
        </TabsContent>

        {/* Upload Tab - Premium */}
        <TabsContent value="upload" className="flex-1 flex flex-col overflow-hidden m-0">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Premium Upload Card */}
            <Card className="border-2 border-dashed border-cyan-400/50 rounded-2xl p-12 text-center mb-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur hover:border-cyan-400/80 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
                data-testid="input-file-upload"
              />
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl blur-lg opacity-40"></div>
                <div className="relative p-4 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-2xl">
                  <UploadIcon className="w-12 h-12 mx-auto text-cyan-400" />
                </div>
              </div>
              <h3 className="font-bold text-white mb-1 text-lg">
                {language === "bn" ? "ফাইল আপলোড করুন" : "Upload Document"}
              </h3>
              <p className="text-sm text-slate-300 mb-6">
                {language === "bn"
                  ? "PDF, DOCX, DOC, JPG, PNG সমর্থিত"
                  : "Supported: PDF, DOCX, DOC, JPG, PNG"}
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={fileLoading}
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 rounded-xl shadow-lg shadow-cyan-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {fileLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === "bn" ? "আপলোড হচ্ছে..." : "Uploading..."}
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-4 h-4 mr-2" />
                    {language === "bn" ? "নির্বাচন করুন" : "Select File"}
                  </>
                )}
              </Button>
            </Card>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-white text-lg">
                  {language === "bn" ? "আপলোড করা ফাইল" : "Uploaded Files"}
                </h4>
                {uploadedFiles.map((file) => (
                  <Card key={file.id} className="p-4 bg-gradient-to-r from-slate-800/60 to-slate-700/60 border-cyan-500/30 backdrop-blur hover:border-cyan-500/50 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{file.name}</p>
                        <p className="text-xs text-slate-400">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                        {file.analysis && (
                          <p className="text-sm text-slate-300 mt-2 line-clamp-2">{file.analysis}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Research Tab - Premium */}
        <TabsContent value="research" className="flex-1 flex flex-col overflow-hidden m-0">
          <div className="flex-1 overflow-y-auto p-6">
            <Card className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-cyan-500/30 backdrop-blur h-full flex flex-col">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-cyan-400" />
                {language === "bn" ? "গবেষণা নোটস" : "Research Notes"}
              </h3>
              <textarea
                value={researchNotes}
                onChange={(e) => setResearchNotes(e.target.value)}
                placeholder={
                  language === "bn"
                    ? "আপনার গবেষণা নোটস লিখুন..."
                    : "Write your research notes..."
                }
                className="flex-1 p-4 border border-cyan-500/30 rounded-xl focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-slate-900/50 text-white placeholder:text-slate-400 resize-none backdrop-blur transition-all duration-300 hover:border-cyan-500/50"
                data-testid="textarea-research-notes"
              />
              <Button className="mt-6 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 rounded-xl shadow-lg shadow-cyan-500/50 transition-all duration-300 hover:scale-105 active:scale-95">
                <Zap className="w-4 h-4 mr-2" />
                {language === "bn" ? "সংরক্ষণ করুন" : "Save Notes"}
              </Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
