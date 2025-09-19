// Dynamically import transformers.js only when needed for the fallback
import 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2';

// Define the Summarizer interface for TypeScript
declare global {
  interface Window {
    Summarizer: {
      availability(): Promise<string>;
      create(options: { type: string; length: string; lang?: string }): Promise<any>;
    };
  }
}

let pipeline: (task: string, model: string) => Promise<any>;

const loadTransformers = async () => {
  if (!pipeline) {
    const transformers = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2');
    pipeline = transformers.pipeline;
  }
  return pipeline;
};

class AiSummary extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.shadowRoot!.getElementById('generate-btn')?.addEventListener('click', () => this.summarizeContent());
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        /* This component uses Open Props variables from the host page. */
        :host {
          display: block;
          margin-block-end: var(--size-6);
        }
        .summary-card {
          background-color: var(--yellow-1);
          border: 1px solid var(--stone-2);
          border-radius: var(--radius-3);
          padding: var(--size-6);
          font-family: var(--font-sans);
          color: var(--text-2);
        }
        .summary-title {
          font-weight: var(--font-weight-7);
          font-size: var(--font-size-3);
          color: var(--text-1);
          margin: 0 0 var(--size-2) 0;
        }
        .summary-content {
          font-size: var(--font-size-2);
          line-height: var(--font-lineheight-4);
        }
        .error {
          color: var(--red-6);
        }
        #generate-btn {
          background-color: var(--stone-2);
          border: none;
          border-radius: var(--radius-2);
          padding: var(--size-2) var(--size-4);
          font-family: var(--font-sans);
          font-weight: var(--font-weight-6);
          cursor: pointer;
          transition: background-color 0.2s ease;
          margin-bottom: var(--size-3);
        }
        #generate-btn:hover {
          background-color: var(--stone-3);
        }
        #generate-btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
      </style>
      <div class="summary-card">
        <h3 class="summary-title">TL;DR</h3>
        <button id="generate-btn">Generate Summary</button>
        <p id="status" class="summary-content"></p>
        <p id="output" class="summary-content"></p>
      </div>
    `;
  }

  async summarizeContent() {
    const generateBtn = this.shadowRoot!.getElementById('generate-btn') as HTMLButtonElement;
    const statusElement = this.shadowRoot!.getElementById('status') as HTMLParagraphElement;
    const outputElement = this.shadowRoot!.getElementById('output') as HTMLParagraphElement;
    const selector = this.getAttribute('selector');
    
    const summaryLang = 'en';

    generateBtn.disabled = true;
    generateBtn.style.display = 'none';
    statusElement.textContent = 'Analyzing content...';

    if (!selector) {
      statusElement.textContent = 'Error: "selector" attribute is missing.';
      statusElement.classList.add('error');
      generateBtn.disabled = false;
      generateBtn.style.display = 'block';
      return;
    }

    const sourceElement = document.querySelector(selector) as HTMLElement;
    if (!sourceElement) {
      statusElement.textContent = `Error: Could not find element with selector: ${selector}`;
      statusElement.classList.add('error');
      generateBtn.disabled = false;
      generateBtn.style.display = 'block';
      return;
    }

    const textToSummarize = sourceElement.innerText;

    // --- Native API Path ---
    if ('Summarizer' in window && await window.Summarizer.availability() !== 'unavailable') {
      try {
          const summaryLang = 'en';
          statusElement.textContent = `Generating with built-in AI...`;
          const summarizer = await window.Summarizer.create({ type: 'tldr', length: 'long', lang: summaryLang });
          const summary = await summarizer.summarize(textToSummarize);
          outputElement.textContent = summary;
          statusElement.textContent = '';
          summarizer.destroy();
      } catch (e) {
        statusElement.textContent = 'Error using built-in Summarizer API.';
        outputElement.textContent = '';
        statusElement.classList.add('error');
        console.error(e);
      }
    }
    // --- Fallback Path ---
    else {
      try {
        statusElement.textContent = 'Loading fallback model (this may take a moment)...';

        const pipeline = await loadTransformers();
        const summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-12-6');
        
        const output = await summarizer(textToSummarize, {
          min_length: 40,
          max_length: 160,
          num_beams: 5,
          repetition_penalty: 1.2
        });

        outputElement.textContent = output[0].summary_text;
        statusElement.textContent = 'Summary (via fallback):';
      } catch (e) {
        statusElement.textContent = 'Could not load or run the fallback AI model.';
        outputElement.textContent = '';
        statusElement.classList.add('error');
        console.error(e);
      }
    }
  }
}

customElements.define('ai-summary', AiSummary);
