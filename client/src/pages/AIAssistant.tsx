import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Brain, Send, Upload, FileText, ChevronDown, ChevronUp } from 'lucide-react';

type Message = {
  text: string;
  sender: 'user' | 'bot';
  translation?: string;
};

type Research = {
  id: number;
  title: string;
  content: string;
  analysis?: string;
};

enum FeatureType {
  Chat = 'chat',
  Upload = 'upload',
  Research = 'research',
}

const AIAssistant: React.FC = () => {
  // State
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi there! I'm Curio, your AI assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [translateToBengali, setTranslateToBengali] = useState(false);
  const [activeFeature, setActiveFeature] = useState<FeatureType>(FeatureType.Chat);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [researchPapers, setResearchPapers] = useState<Research[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<Research | null>(null);
  const [showPaperDetails, setShowPaperDetails] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Removed auto-scrolling functionality as requested
  // User will manually scroll as needed

  // Simulated fetch of research papers
  useEffect(() => {
    // Mock data for research papers
    const mockPapers = [
      { 
        id: 1, 
        title: 'Climate Change Impact on Bangladesh Coastal Regions', 
        content: 'This research examines the effects of rising sea levels on coastal communities in Bangladesh...',
        analysis: 'Key findings include increased flooding frequency and agricultural challenges. The research suggests community-based adaptation strategies.'
      },
      { 
        id: 2, 
        title: 'Biodiversity in the Sundarbans Mangrove Forest', 
        content: 'A study of endemic species in the Sundarbans and conservation efforts...',
        analysis: 'The paper identifies 27 endangered species and proposes innovative conservation methods that balance ecological needs with local livelihoods.'
      },
      { 
        id: 3, 
        title: 'Renewable Energy Potential in Rural Bangladesh', 
        content: 'Analysis of solar and biogas implementation in off-grid rural communities...',
        analysis: 'The research demonstrates significant economic and environmental benefits from small-scale solar installations, with a 35% reduction in household energy costs.'
      },
    ];
    setResearchPapers(mockPapers);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message to chat
    const userQuery = input;
    setMessages([...messages, { text: userQuery, sender: 'user' }]);
    setIsLoading(true);
    
    // Clear input field immediately
    setInput('');

    try {
      // Call API to get bot response
      const response = await apiRequest('POST', '/api/chat', {
        userId: 1, // Using a default user ID
        message: userQuery,
        translate_to_bengali: translateToBengali
      });

      if (response.ok) {
        const data = await response.json();
        const newMessage: Message = { 
          text: data.response, 
          sender: 'bot',
        };
        
        // Add translation if available
        if (data.bengali_translation) {
          newMessage.translation = data.bengali_translation;
        }
        
        setMessages(prev => [...prev, newMessage]);
      } else {
        throw new Error('Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [
        ...prev, 
        { text: 'Sorry, I encountered an error. Please try again.', sender: 'bot' }
      ]);
      
      toast({
        title: "Error",
        description: "Unable to get a response from the AI. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Show upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('userId', '1'); // Using default user ID
      formData.append('saveToChat', 'true');
      
      // Upload file to the API
      const response = await fetch('/api/document/upload', {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(interval);
      setUploadProgress(100);
      
      if (!response.ok) {
        throw new Error('Failed to upload file');
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Upload Successful",
          description: `${uploadedFile.name} has been analyzed.`,
        });
        
        // Add a message about the upload
        setMessages(prev => [
          ...prev,
          { text: `I've uploaded ${uploadedFile.name} for analysis.`, sender: 'user' },
          { 
            text: `Thanks for uploading ${uploadedFile.name}. Here's my analysis:\n\n${data.analysis || 'No analysis available'}`, 
            sender: 'bot' 
          }
        ]);
      } else {
        throw new Error(data.message || 'Failed to analyze file');
      }
      
      // Reset file state
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Switch back to chat
      setActiveFeature(FeatureType.Chat);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "There was a problem uploading your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      clearInterval(interval);
      setIsUploading(false);
    }
  };

  const handlePaperSelect = (paper: Research) => {
    setSelectedPaper(paper);
    
    // Add messages about the selected paper
    setMessages(prev => [
      ...prev,
      { text: `I'd like to learn about the paper: ${paper.title}`, sender: 'user' },
      { text: `Here's information about "${paper.title}":\n\n${paper.analysis || 'Analysis is being generated...'}`, sender: 'bot' }
    ]);
    
    // Switch to chat view
    setActiveFeature(FeatureType.Chat);
  };

  const renderChatInterface = () => (
    <div className="p-6 bg-gray-50 h-[60vh] overflow-y-auto">
      {messages.map((message, index) => (
        <div 
          key={index} 
          className={`mb-4 ${message.sender === 'user' ? 'text-right' : ''}`}
        >
          <div 
            className={`inline-block px-4 py-2 rounded-lg ${
              message.sender === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            } max-w-[85%]`}
          >
            {message.text}
            
            {message.translation && (
              <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-md border border-indigo-100 shadow-sm">
                <div className="font-semibold mb-2 text-indigo-700 flex items-center">
                  <span className="mr-2">🇧🇩</span>
                  <span>Bengali Translation:</span>
                </div>
                <p className="font-bengali text-gray-800">{message.translation}</p>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex space-x-1 justify-center items-center text-center text-sm text-muted-foreground p-2 mb-4">
          <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );

  const renderUploadInterface = () => (
    <div className="p-6 bg-gray-50 h-[60vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium mb-2">Upload Research Paper</h3>
        <p className="text-sm text-gray-500 mb-4">
          Upload PDF, DOCX, or TXT files for AI analysis
        </p>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx,.txt"
          className="hidden"
        />
        
        {uploadedFile ? (
          <div className="mt-4">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm truncate max-w-[200px]">{uploadedFile.name}</span>
            </div>
            
            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
            
            <button
              onClick={handleFileUpload}
              disabled={isUploading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </button>
            <button
              onClick={() => setUploadedFile(null)}
              disabled={isUploading}
              className="px-4 py-2 ml-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Select File
          </button>
        )}
      </div>
    </div>
  );

  const [researchText, setResearchText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleResearchAnalysis = async () => {
    if (!researchText.trim() || isAnalyzing) return;
    
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      // Call API to get research analysis
      const response = await apiRequest('POST', '/api/chat?type=analyze', {
        userId: 1,
        message: researchText
      });
      
      if (response.ok) {
        const data = await response.json();
        setAnalysisResult(data.response);
        
        // Add to chat history
        setMessages(prev => [
          ...prev,
          { text: `I'd like to analyze this research: "${researchText.substring(0, 60)}${researchText.length > 60 ? '...' : ''}"`, sender: 'user' },
          { text: data.response, sender: 'bot' }
        ]);
      } else {
        throw new Error('Failed to get analysis');
      }
    } catch (error) {
      console.error('Error analyzing research:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the research paper. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderResearchInterface = () => (
    <div className="p-6 bg-gray-50 h-[60vh] overflow-y-auto">
      <div className="flex gap-4 mb-6">
        <div className="w-1/2">
          <h3 className="text-lg font-medium mb-4">Research Paper Analysis</h3>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <p className="text-sm text-gray-600 mb-3">
              Paste your research abstract or paper content below to get a student-friendly analysis and explanation.
            </p>
            <textarea
              value={researchText}
              onChange={(e) => setResearchText(e.target.value)}
              className="w-full h-40 p-3 border rounded-md text-sm mb-3 resize-none"
              placeholder="Paste your research paper, abstract, or scientific content here for analysis..."
            />
            <button 
              onClick={handleResearchAnalysis}
              disabled={!researchText.trim() || isAnalyzing}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isAnalyzing ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>Analyze Research</>
              )}
            </button>
          </div>
        </div>
        
        <div className="w-1/2">
          <h3 className="text-lg font-medium mb-4">Research Paper Archive</h3>
          <div className="grid gap-4">
            {researchPapers.map((paper) => (
              <div key={paper.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    if (selectedPaper?.id === paper.id) {
                      setShowPaperDetails(!showPaperDetails);
                    } else {
                      setSelectedPaper(paper);
                      setShowPaperDetails(true);
                    }
                  }}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{paper.title}</h4>
                    {selectedPaper?.id === paper.id ? 
                      (showPaperDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />) : 
                      <ChevronDown className="h-5 w-5" />
                    }
                  </div>
                </div>
                
                {selectedPaper?.id === paper.id && showPaperDetails && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600 mb-4">{paper.content}</p>
                    <button
                      onClick={() => handlePaperSelect(paper)}
                      className="px-3 py-1.5 bg-primary text-white text-sm rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Ask Curio about this paper
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Curio AI Assistant | SciVenture</title>
        <meta name="description" content="Get help with scientific concepts from our AI assistant" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b bg-primary/5">
            <div className="flex items-center justify-center">
              <Brain className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-primary">Curio</h1>
            </div>
            <p className="text-center text-gray-600 mt-1">Powered by Google's Gemini AI</p>
            
            {/* Feature tabs */}
            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={() => setActiveFeature(FeatureType.Chat)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFeature === FeatureType.Chat 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveFeature(FeatureType.Upload)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFeature === FeatureType.Upload 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Upload Paper
              </button>
              <button
                onClick={() => setActiveFeature(FeatureType.Research)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFeature === FeatureType.Research 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Research Archive
              </button>
            </div>
          </div>
          
          {/* Content area */}
          {activeFeature === FeatureType.Chat && renderChatInterface()}
          {activeFeature === FeatureType.Upload && renderUploadInterface()}
          {activeFeature === FeatureType.Research && renderResearchInterface()}
          
          {/* Footer/input area */}
          {activeFeature === FeatureType.Chat && (
            <div className="p-4 border-t">
              <div className="flex items-center mb-3">
                <label className="flex items-center cursor-pointer">
                  <div className={`relative flex items-center p-2 px-3 rounded-md transition-all ${
                    translateToBengali 
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 shadow-sm' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}>
                    <input
                      type="checkbox"
                      checked={translateToBengali}
                      onChange={(e) => setTranslateToBengali(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary mr-2 h-4 w-4"
                    />
                    <span className="text-sm font-medium">
                      {translateToBengali ? (
                        <span className="flex items-center">
                          <span className="mr-1">🇧🇩</span>
                          Include Bengali Translation
                        </span>
                      ) : 'Include Bengali Translation'}
                    </span>
                  </div>
                </label>
              </div>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message here..."
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AIAssistant;