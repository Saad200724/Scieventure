import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/providers/LanguageProvider";
import { Send, Brain, Upload as UploadIcon, BookOpen, FileText, Loader2 } from "lucide-react";

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

export default function Curio() {
  // Chat Tab State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm Curio, your science learning companion. I'm here to help you explore and understand science concepts. What would you like to learn about today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Upload Tab State
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [fileLoading, setFileLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Research Tab State
  const [researchNotes, setResearchNotes] = useState<string>("");
  
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

  // Only scroll on initial mount
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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/msword", // .doc
      "image/jpeg",
      "image/png",
    ];

    if (!validTypes.includes(file.type)) {
      toast({
        title: language === "bn" ? "ত্রুটি" : "Error",
        description: language === "bn" ? "শুধুমাত্র PDF, DOCX, DOC, JPG, PNG সমর্থিত" : "Only PDF, DOCX, DOC, JPG, PNG are supported",
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

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();

      const newFile: UploadedFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        content: data.text || "",
        timestamp: new Date(),
        analysis: data.analysis || "File uploaded successfully",
      };

      setUploadedFiles((prev) => [newFile, ...prev]);

      toast({
        title: language === "bn" ? "সফল" : "Success",
        description: language === "bn" ? "ফাইল সফলভাবে আপলোড হয়েছে" : "File uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: language === "bn" ? "ত্রুটি" : "Error",
        description: language === "bn" ? "ফাইল আপলোড ব্যর্থ হয়েছে" : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setFileLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-background to-slate-50 dark:from-slate-950 dark:to-slate-900">
      {/* Beautiful Header */}
      <div className="border-b border-border/50 bg-gradient-to-r from-white to-blue-50 dark:from-slate-950 dark:to-slate-900 px-6 py-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center shadow-lg">
            <Brain className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              {language === "bn" ? "কিউরিও" : "Curio"}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {language === "bn"
                ? "আপনার বিজ্ঞান শিক্ষা সহচর"
                : "Your Science Learning Companion"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="chat" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="rounded-none border-b border-border/50 bg-white dark:bg-slate-950 px-6 py-0 w-full justify-start gap-8 h-auto">
          <TabsTrigger 
            value="chat" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-0 py-4"
          >
            <Brain className="w-4 h-4 mr-2" />
            {language === "bn" ? "কথোপকথন" : "Chat"}
          </TabsTrigger>
          <TabsTrigger 
            value="upload"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-0 py-4"
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            {language === "bn" ? "আপলোড" : "Upload"}
          </TabsTrigger>
          <TabsTrigger 
            value="research"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent px-0 py-4"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {language === "bn" ? "গবেষণা" : "Research"}
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden m-0">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Card
                  className={`max-w-sm lg:max-w-md xl:max-w-lg px-5 py-3 shadow-md ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0"
                      : "bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-border/50"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-2 font-medium ${
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
                <Card className="px-5 py-4 bg-white dark:bg-slate-800 border border-border/50 shadow-md">
                  <div className="flex gap-2 items-center">
                    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{language === "bn" ? "চিন্তা করছি..." : "Thinking..."}</span>
                  </div>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border/50 bg-white dark:bg-slate-950 p-6 shadow-lg">
            <div className="flex gap-3">
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
                className="flex-1 rounded-lg border-border/50 shadow-sm"
                data-testid="input-curio-message"
              />
              <Button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                size="icon"
                className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                data-testid="button-send-message"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              {language === "bn"
                ? "Enter চাপুন পাঠাতে | Shift+Enter নতুন লাইনের জন্য"
                : "Press Enter to send | Shift+Enter for new line"}
            </p>
          </div>
        </TabsContent>

        {/* Upload Tab */}
        <TabsContent value="upload" className="flex-1 flex flex-col overflow-hidden m-0">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Upload Area */}
            <Card className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl p-8 text-center mb-6 bg-blue-50 dark:bg-slate-800">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
                data-testid="input-file-upload"
              />
              <UploadIcon className="w-12 h-12 mx-auto text-blue-500 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {language === "bn" ? "ফাইল আপলোড করুন" : "Upload Document"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {language === "bn"
                  ? "PDF, DOCX, DOC, JPG, PNG সমর্থিত"
                  : "PDF, DOCX, DOC, JPG, PNG supported"}
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={fileLoading}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {fileLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {language === "bn" ? "আপলোড হচ্ছে..." : "Uploading..."}
                  </>
                ) : (
                  <>
                    <UploadIcon className="w-4 h-4 mr-2" />
                    {language === "bn" ? "ফাইল নির্বাচন করুন" : "Select File"}
                  </>
                )}
              </Button>
            </Card>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {language === "bn" ? "আপলোড করা ফাইলসমূহ" : "Uploaded Files"}
                </h4>
                {uploadedFiles.map((file) => (
                  <Card key={file.id} className="p-4 bg-white dark:bg-slate-800 border-border/50">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(file.size / 1024).toFixed(2)} KB · {file.timestamp.toLocaleString()}
                        </p>
                        {file.analysis && (
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{file.analysis}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {uploadedFiles.length === 0 && !fileLoading && (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  {language === "bn"
                    ? "এখনো কোনো ফাইল আপলোড করা হয়নি"
                    : "No files uploaded yet"}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Research Tab */}
        <TabsContent value="research" className="flex-1 flex flex-col overflow-hidden m-0">
          <div className="flex-1 overflow-y-auto p-6">
            <Card className="p-6 bg-white dark:bg-slate-800 border-border/50 h-full">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {language === "bn" ? "গবেষণা নোটস" : "Research Notes"}
              </h3>
              <textarea
                value={researchNotes}
                onChange={(e) => setResearchNotes(e.target.value)}
                placeholder={
                  language === "bn"
                    ? "আপনার গবেষণা নোটস এখানে লিখুন..."
                    : "Write your research notes here..."
                }
                className="w-full h-96 p-4 border border-border/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white resize-none"
                data-testid="textarea-research-notes"
              />
              <Button className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-500">
                {language === "bn" ? "সংরক্ষণ করুন" : "Save Notes"}
              </Button>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
