document.getElementById('summarize-btn').addEventListener('click', async () => {
    const summarizeBtn = document.getElementById('summarize-btn');
    const placeholder = document.getElementById('placeholder');
    const summaryContent = document.getElementById('summary-content');
    const status = document.getElementById('status');
    const loader = summarizeBtn.querySelector('.loader');
    const btnText = summarizeBtn.querySelector('.btn-text');

    // Reset UI
    summaryContent.textContent = '';
    summaryContent.classList.remove('hidden');
    placeholder.classList.add('hidden');
    status.classList.remove('hidden');
    loader.classList.remove('hidden');
    btnText.textContent = 'Analyzing...';
    summarizeBtn.disabled = true;

    try {
        // 1. Get current tab content
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        const [{ result: pageText }] = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                // simple strategy: get all visible text from body
                return document.body.innerText;
            },
        });

        if (!pageText || pageText.trim().length < 50) {
            throw new Error("Page content is too short to summarize.");
        }

        // 2. Call FastAPI backend for streaming summary
        const response = await fetch('http://127.0.0.1:7865/summarize_stream_status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: pageText.substring(0, 10000) }) // Limit text to 10k chars for efficiency
        });

        if (!response.ok) {
            throw new Error(`Backend error: ${response.statusText}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        btnText.textContent = 'Summarizing...';
        loader.classList.add('hidden');

        // 3. Read the stream
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            summaryContent.innerHTML = formatSummary(chunk);

            // Scroll to bottom
            const contentDiv = document.querySelector('.content');
            contentDiv.scrollTop = contentDiv.scrollHeight;
        }

        status.textContent = 'Summary complete.';
    } catch (error) {
        console.error("Summarization failed:", error);
        summaryContent.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        status.textContent = 'Failed.';
    } finally {
        summarizeBtn.disabled = false;
        btnText.textContent = 'Summarize Page';
        loader.classList.add('hidden');
        setTimeout(() => {
            if (status.textContent === 'Summary complete.') {
                status.classList.add('hidden');
            }
        }, 3000);
    }
});

/**
 * Simple "Markdown-lite" formatter for professional output
 */
function formatSummary(text) {
    if (!text) return '';

    return text
        .split('\n')
        .map(line => {
            line = line.trim();
            if (!line) return '<br>';

            // Handle the main professional headings
            if (line.includes('EXECUTIVE SUMMARY') || line.includes('KEY HIGHLIGHTS') || line.includes('STRATEGIC INSIGHT')) {
                const heading = line.replace(/[*]/g, '');
                return `<div class="summary-section"><span class="summary-heading">${heading}</span><div class="summary-body">`;
            }

            // Handle bold text within lines
            let formattedLine = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

            // Handle bullet points
            if (formattedLine.startsWith('* ') || formattedLine.startsWith('- ')) {
                return `<li>${formattedLine.substring(2)}</li>`;
            }

            return `<p>${formattedLine}</p>`;
        })
        .join('') + '</div></div>'; // Close potential open containers
}
