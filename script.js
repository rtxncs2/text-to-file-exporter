const MAX_SIZE = 1048576; // 1MB in bytes
const textInput = document.getElementById('textInput');
const fileName = document.getElementById('fileName');
const exportBtn = document.getElementById('exportBtn');
const charCount = document.getElementById('charCount');
const progressFill = document.getElementById('progressFill');

// Update character count and progress bar
textInput.addEventListener('input', function() {
    const length = this.value.length;
    charCount.textContent = length.toLocaleString();
    
    const percentage = (length / MAX_SIZE) * 100;
    progressFill.style.width = percentage + '%';
    
    // Change progress bar color based on usage
    if (percentage > 90) {
        progressFill.style.background = 'linear-gradient(90deg, #ff6b6b, #ee5a6f)';
    } else if (percentage > 70) {
        progressFill.style.background = 'linear-gradient(90deg, #ffa500, #ff8c42)';
    } else {
        progressFill.style.background = 'linear-gradient(90deg, #667eea, #764ba2)';
    }
});

// Export text to file
exportBtn.addEventListener('click', function() {
    const text = textInput.value;
    const name = fileName.value.trim() || 'document';
    
    // Validate input
    if (text.length === 0) {
        alert('Please enter some text before exporting.');
        return;
    }
    
    // Check size
    const bytes = new Blob([text]).size;
    if (bytes > MAX_SIZE) {
        alert('Text exceeds 1MB limit. Please reduce the content.');
        return;
    }
    
    // Sanitize filename
    const sanitizedName = name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 255);
    
    // Create blob and download
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = sanitizedName + '.txt';
    
    // Show feedback
    const originalText = exportBtn.textContent;
    exportBtn.textContent = '✓ Downloaded!';
    exportBtn.disabled = true;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Reset button after 2 seconds
    setTimeout(() => {
        exportBtn.textContent = originalText;
        exportBtn.disabled = false;
    }, 2000);
});

// Handle Enter key in filename input
fileName.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        exportBtn.click();
    }
});