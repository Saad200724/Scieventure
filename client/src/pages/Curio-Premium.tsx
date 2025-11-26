import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/providers/LanguageProvider";
import { Send, Brain, Upload as UploadIcon, BookOpen, FileText, Loader2, Sparkles, Download, Share2, Copy } from "lucide-react";

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
    if (messages.length === 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 px-6 py-8 shadow-2xl border-b border-blue-400/30">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg border border-white/30">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6" />
              {language === "bn" ? "কিউরিও এআই" : "Curio AI"}
            </h1>
            <p className="text-white/80 font-medium text-sm">
              {language === "bn"
                ? "আপনার স্মার্ট বিজ্ঞান সহযোগী"
                : "Your Premium Science Companion"}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="rounded-none border-b border-slate-700 bg-slate-800/50 px-6 py-0 w-full justify-start gap-8 h-auto backdrop-blur">
          <TabsTrigger 
            value="chat" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent px-0 py-4 text-white data-[state=active]:text-cyan-300"
          >
            <Brain className="w-4 h-4 mr-2" />
            {language === "bn" ? "চ্যাট" : "Chat"}
          </TabsTrigger>
          <TabsTrigger 
            value="upload"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent px-0 py-4 text-white data-[state=active]:text-cyan-300"
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            {language === "bn" ? "ফাইল" : "Upload"}
          </TabsTrigger>
          <TabsTrigger 
            value="research"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent px-0 py-4 text-white data-[state=active]:text-cyan-300"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {language === "bn" ? "গবেষণা" : "Research"}
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden m-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className={`flex gap-3 max-w-2xl ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-500 to-cyan-500"
                      : "bg-gradient-to-br from-cyan-500 to-teal-500"
                  }`}>
                    {message.role === "user" ? "👤" : "🤖"}
                  </div>
                  <div>
                    <Card
                      className={`px-5 py-3 shadow-xl backdrop-blur border ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-400/50"
                          : "bg-slate-700/80 text-white border-slate-600/50"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                        <span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        {message.role === "assistant" && (
                          <button
                            onClick={() => copyMessage(message.id, message.content)}
                            className="hover:opacity-100 opacity-50 transition-opacity"
                            title="Copy"
                          >
                            {copiedId === message.id ? "✓" : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    🤖
                  </div>
                  <Card className="px-5 py-4 bg-slate-700/80 border-slate-600/50 shadow-xl">
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

          {/* Input Area */}
          <div className="border-t border-slate-700 bg-slate-800/80 backdrop-blur p-6 shadow-2xl">
            <div className="flex gap-3">
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
                className="flex-1 rounded-lg border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400"
                data-testid="input-curio-message"
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                size="icon"
                className="rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 shadow-lg"
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload" className="flex-1 flex flex-col overflow-hidden m-0">
          <div className="flex-1 overflow-y-auto p-6">
            <Card className="border-2 border-dashed border-cyan-400/50 rounded-xl p-8 text-center mb-6 bg-gradient-to-br from-slate-700/50 to-slate-800/50 backdrop-blur">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
                data-testid="input-file-upload"
              />
              <UploadIcon className="w-12 h-12 mx-auto text-cyan-400 mb-3" />
              <h3 className="font-semibold text-white mb-1">
                {language === "bn" ? "ফাইল আপলোড করুন" : "Upload Document"}
              </h3>
              <p className="text-sm text-slate-300 mb-4">
                {language === "bn"
                  ? "PDF, DOCX, DOC, JPG, PNG সমর্থিত"
                  : "Supported: PDF, DOCX, DOC, JPG, PNG"}
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={fileLoading}
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600"
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

            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-white">
                  {language === "bn" ? "আপলোড করা ফাইল" : "Uploaded Files"}
                </h4>
                {uploadedFiles.map((file) => (
                  <Card key={file.id} className="p-4 bg-slate-700/50 border-slate-600/50 backdrop-blur">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{file.name}</p>
                        <p className="text-xs text-slate-400">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                        {file.analysis && (
                          <p className="text-sm text-slate-300 mt-2">{file.analysis}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Research Tab */}
        <TabsContent value="research" className="flex-1 flex flex-col overflow-hidden m-0">
          <div className="flex-1 overflow-y-auto p-6">
            <Card className="p-6 bg-slate-700/50 border-slate-600/50 backdrop-blur h-full">
              <h3 className="text-lg font-semibold text-white mb-4">
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
                className="w-full h-96 p-4 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-slate-800 text-white placeholder:text-slate-400 resize-none"
                data-testid="textarea-research-notes"
              />
              <Button className="mt-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600">
                {language === "bn" ? "সংরক্ষণ করুন" : "Save Notes"}
              </Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
