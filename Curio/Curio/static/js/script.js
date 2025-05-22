document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const typingIndicator = document.getElementById('typing-indicator');
    const chatTab = document.getElementById('chat-tab');
    const historyTab = document.getElementById('history-tab');
    const uploadTab = document.getElementById('upload-tab');
    const researchTab = document.getElementById('research-tab');
    const chatTabContent = document.getElementById('chat-tab-content');
    const historyTabContent = document.getElementById('history-tab-content');
    const uploadTabContent = document.getElementById('upload-tab-content');
    const researchTabContent = document.getElementById('research-tab-content');
    const historyContainer = document.getElementById('history-container');
    const bengaliTranslateCheckbox = document.getElementById('bengali-translate');
    
    // Upload form elements
    const uploadForm = document.getElementById('upload-form');
    const fileUpload = document.getElementById('file-upload');
    const selectedFileName = document.getElementById('selected-file-name');
    const uploadResult = document.querySelector('.upload-result');
    const uploadResultContent = document.getElementById('upload-result-content');
    
    // Research form elements
    const researchForm = document.getElementById('research-form');
    const researchResult = document.querySelector('.research-result');
    const researchResultContent = document.getElementById('research-result-content');
    
    let historyLoaded = false;

    // Function to add a message to the chat
    function addMessage(message, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'message user-message' : 'message bot-message';
        messageDiv.textContent = message;
        
        // Insert the message before the typing indicator
        chatBox.insertBefore(messageDiv, typingIndicator);
        
        // Scroll to the bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Function to send a message to the backend
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message to the chat
        addMessage(message, true);
        
        // Clear input field
        userInput.value = '';
        
        // Show typing indicator
        typingIndicator.style.display = 'flex';
        
        try {
            // Send message to backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    translate_to_bengali: bengaliTranslateCheckbox.checked
                }),
            });

            const data = await response.json();
            
            // Hide typing indicator
            typingIndicator.style.display = 'none';
            
            // Add bot response to the chat
            addMessage(data.response, false);
            
            // Add Bengali translation in a separate bubble if available
            if (data.bengali_translation) {
                const bengaliDiv = document.createElement('div');
                bengaliDiv.className = 'message bot-message bengali-message';
                bengaliDiv.textContent = data.bengali_translation;
                
                // Insert the message before the typing indicator
                chatBox.insertBefore(bengaliDiv, typingIndicator);
                
                // Scroll to the bottom
                chatBox.scrollTop = chatBox.scrollHeight;
            }
            
            // Reset history loaded flag so it reloads next time
            historyLoaded = false;
        } catch (error) {
            // Hide typing indicator
            typingIndicator.style.display = 'none';
            
            // Add error message
            addMessage('Sorry, something went wrong. Please try again.', false);
            console.error('Error:', error);
        }
    }
    
    // Function to load chat history
    async function loadChatHistory() {
        if (historyLoaded) return;
        
        historyContainer.innerHTML = '<p class="loading-text">Loading conversation history...</p>';
        
        try {
            const response = await fetch('/api/history');
            const data = await response.json();
            
            historyContainer.innerHTML = '';
            
            if (data.history && data.history.length > 0) {
                data.history.forEach(item => {
                    const historyItem = document.createElement('div');
                    historyItem.className = 'history-item';
                    
                    const timestamp = document.createElement('div');
                    timestamp.className = 'history-timestamp';
                    timestamp.textContent = new Date(item.timestamp).toLocaleString();
                    
                    const userMessage = document.createElement('div');
                    userMessage.className = 'message user-message';
                    userMessage.textContent = item.user_message;
                    
                    const botResponse = document.createElement('div');
                    botResponse.className = 'message bot-message';
                    botResponse.textContent = item.bot_response;
                    
                    // Add translation badge if applicable
                    if (item.is_translated) {
                        const translationBadge = document.createElement('div');
                        translationBadge.className = 'translation-badge';
                        translationBadge.textContent = 'Bengali Translation';
                        historyItem.appendChild(translationBadge);
                    }
                    
                    historyItem.appendChild(timestamp);
                    historyItem.appendChild(userMessage);
                    historyItem.appendChild(botResponse);
                    
                    historyContainer.appendChild(historyItem);
                });
            } else {
                historyContainer.innerHTML = '<p class="loading-text">No conversation history found.</p>';
            }
            
            historyLoaded = true;
        } catch (error) {
            historyContainer.innerHTML = '<p class="loading-text">Error loading conversation history.</p>';
            console.error('Error loading history:', error);
        }
    }
    
    // File upload functionality
    function updateFileName() {
        if (fileUpload.files.length > 0) {
            selectedFileName.textContent = fileUpload.files[0].name;
        } else {
            selectedFileName.textContent = 'No file selected';
        }
    }
    
    async function uploadAndAnalyzeFile(e) {
        e.preventDefault();
        
        if (!fileUpload.files.length) {
            alert('Please select a file first.');
            return;
        }
        
        const formData = new FormData();
        formData.append('file', fileUpload.files[0]);
        
        // Show loading state
        uploadResultContent.textContent = 'Analyzing file...';
        uploadResult.style.display = 'block';
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.error) {
                uploadResultContent.textContent = 'Error: ' + data.error;
            } else {
                uploadResultContent.textContent = data.analysis || 'File uploaded successfully.';
            }
        } catch (error) {
            uploadResultContent.textContent = 'Error uploading file: ' + error.message;
            console.error('Upload error:', error);
        }
    }
    
    // Research paper functionality
    const researchTabButtons = document.querySelectorAll('.research-tab-btn');
    const researchTabPanels = document.querySelectorAll('.research-tab-panel');
    const resultTabButtons = document.querySelectorAll('.result-tab-btn');
    const resultTabContents = document.querySelectorAll('.result-tab-content');
    const summaryResultContent = document.getElementById('summary-result-content');
    const methodologyResultContent = document.getElementById('methodology-result-content');
    const strengthsResultContent = document.getElementById('strengths-result-content');
    const futureResultContent = document.getElementById('future-result-content');
    const saveAnalysisButton = document.getElementById('save-analysis');
    const shareAnalysisButton = document.getElementById('share-analysis');
    const downloadPdfButton = document.getElementById('download-pdf');
    const doiForm = document.getElementById('doi-form');
    const savedPapersList = document.getElementById('saved-papers-list');
    
    // Tab switching for research sections
    function switchResearchTab(tabName) {
        // Hide all panels and deactivate all buttons
        researchTabPanels.forEach(panel => panel.classList.remove('active'));
        researchTabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Activate the selected panel and button
        document.getElementById(`${tabName}-panel`).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }
    
    // Tab switching for result sections
    function switchResultTab(tabName) {
        // Hide all contents and deactivate all buttons
        resultTabContents.forEach(content => content.classList.remove('active'));
        resultTabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Activate the selected content and button
        document.getElementById(`${tabName}-content`).classList.add('active');
        document.querySelector(`[data-result-tab="${tabName}"]`).classList.add('active');
    }
    
    // Add event listeners to research tab buttons
    researchTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            switchResearchTab(tabName);
        });
    });
    
    // Add event listeners to result tab buttons
    resultTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-result-tab');
            switchResultTab(tabName);
        });
    });
    
    // Research paper analysis functionality
    async function analyzeResearchPaper(e) {
        e.preventDefault();
        
        const title = document.getElementById('research-title').value.trim();
        const authors = document.getElementById('research-authors')?.value.trim() || '';
        const abstract = document.getElementById('research-abstract').value.trim();
        const content = document.getElementById('research-content').value.trim();
        
        // Get analysis options
        const analysisOptions = [];
        document.querySelectorAll('input[name="analysis_options"]:checked').forEach(checkbox => {
            analysisOptions.push(checkbox.value);
        });
        
        if (!title || !abstract) {
            alert('Please provide at least a title and abstract for analysis.');
            return;
        }
        
        // Show loading state
        summaryResultContent.textContent = 'Analyzing paper...';
        methodologyResultContent.textContent = 'Analyzing methodology...';
        strengthsResultContent.textContent = 'Identifying strengths and limitations...';
        futureResultContent.textContent = 'Evaluating future research directions...';
        researchResult.style.display = 'block';
        
        try {
            const response = await fetch('/api/research', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                    authors: authors,
                    abstract: abstract,
                    content: content,
                    options: analysisOptions
                }),
            });
            
            const data = await response.json();
            
            if (data.error) {
                summaryResultContent.textContent = 'Error: ' + data.error;
                methodologyResultContent.textContent = '';
                strengthsResultContent.textContent = '';
                futureResultContent.textContent = '';
            } else {
                // Parse the analysis into sections
                if (data.analysis) {
                    // For now, just put the whole analysis in the summary section
                    summaryResultContent.textContent = data.analysis;
                    
                    // In a real implementation, we would parse different sections
                    // from the API response or request specific sections
                    methodologyResultContent.textContent = "Methodology analysis would appear here with a more detailed API response.";
                    strengthsResultContent.textContent = "Strengths and limitations would appear here with a more detailed API response.";
                    futureResultContent.textContent = "Future research directions would appear here with a more detailed API response.";
                } else {
                    summaryResultContent.textContent = 'Analysis completed, but no details were returned.';
                }
            }
            
            // Switch to summary tab
            switchResultTab('summary');
        } catch (error) {
            summaryResultContent.textContent = 'Error analyzing research paper: ' + error.message;
            console.error('Research analysis error:', error);
        }
    }
    
    // DOI import functionality
    async function fetchPaperByDOI(e) {
        e.preventDefault();
        
        const doi = document.getElementById('paper-doi').value.trim();
        
        if (!doi) {
            alert('Please enter a valid DOI.');
            return;
        }
        
        // Show loading state in the form
        const submitButton = doiForm.querySelector('button');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Fetching...';
        submitButton.disabled = true;
        
        // In a real implementation, we would fetch the paper details from a DOI API
        // and then analyze it. For now, we'll simulate this.
        setTimeout(() => {
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            
            // Switch to manual entry with pre-filled data for demo purposes
            document.getElementById('research-title').value = 'Example Paper Retrieved from DOI: ' + doi;
            document.getElementById('research-authors').value = 'John Doe, Jane Smith';
            document.getElementById('research-abstract').value = 'This is a sample abstract for a paper that would be retrieved using the DOI: ' + doi;
            
            switchResearchTab('manual-entry');
            alert('Paper details retrieved. You can now edit them before analysis.');
        }, 1500);
    }
    
    // Action buttons functionality
    function setupActionButtons() {
        saveAnalysisButton.addEventListener('click', () => {
            alert('Analysis saved successfully!');
        });
        
        shareAnalysisButton.addEventListener('click', () => {
            alert('Sharing options would appear here.');
        });
        
        downloadPdfButton.addEventListener('click', () => {
            alert('PDF download would start here.');
        });
    }
    
    // Load saved papers
    function loadSavedPapers() {
        // In a real implementation, we would fetch saved papers from the database
        // For now, show a message
        savedPapersList.innerHTML = '<p>No saved papers found. Analyze a paper and save it to see it here.</p>';
    }
    
    // Set up event listeners for research paper functionality
    doiForm.addEventListener('submit', fetchPaperByDOI);
    setupActionButtons();
    
    // Tab switching functionality
    function switchTab(tabName) {
        // Remove active class from all tabs
        chatTab.classList.remove('active');
        historyTab.classList.remove('active');
        uploadTab.classList.remove('active');
        researchTab.classList.remove('active');
        
        // Hide all tab contents
        chatTabContent.style.display = 'none';
        historyTabContent.style.display = 'none';
        uploadTabContent.style.display = 'none';
        researchTabContent.style.display = 'none';
        
        // Activate the selected tab
        if (tabName === 'chat') {
            chatTab.classList.add('active');
            chatTabContent.style.display = 'flex';
        } else if (tabName === 'history') {
            historyTab.classList.add('active');
            historyTabContent.style.display = 'flex';
            loadChatHistory();
        } else if (tabName === 'upload') {
            uploadTab.classList.add('active');
            uploadTabContent.style.display = 'flex';
        } else if (tabName === 'research') {
            researchTab.classList.add('active');
            researchTabContent.style.display = 'flex';
        }
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Tab switching listeners
    chatTab.addEventListener('click', () => switchTab('chat'));
    historyTab.addEventListener('click', () => switchTab('history'));
    uploadTab.addEventListener('click', () => switchTab('upload'));
    researchTab.addEventListener('click', () => switchTab('research'));
    
    // File upload listeners
    fileUpload.addEventListener('change', updateFileName);
    uploadForm.addEventListener('submit', uploadAndAnalyzeFile);
    
    // Research form listener
    researchForm.addEventListener('submit', analyzeResearchPaper);
});