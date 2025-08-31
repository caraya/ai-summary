# AI Summary Web Component

A zero-dependency, progressive enhancement web component that automatically summarizes a given block of text on a webpage.

This component is designed to be as efficient as possible by first attempting to use experimental, built-in browser AI capabilities. If those are not available, it gracefully falls back to a high-quality, in-browser model using the transformers.js library.

## How It Works

The component follows a "native-first" approach to ensure the best performance for your users:

* **Native Chrome Browser AI (Primary Method)**: The component first checks if the browser supports the experimental Summarizer API. This new API allows the browser to use a highly optimized, on-device model for tasks like summarization. This method is extremely fast and efficient, as it requires no external downloads.
* **In-Browser Fallback (Secondary Method)**: If the native API is not supported (which is the case for most browsers today), the component automatically engages its fallback mechanism. It dynamically loads the transformers.js library and a pre-trained summarization model directly into the user's browser to generate the summary.

## The Summarization Models

The Summarization Models
The component leverages two different AI models depending on the user's browser capabilities:

| Model / API | Type | Pros | Cons |
|--------------|------|------|------|
| Built-in Summarizer | Native | • Extremely fast and lightweight.<br>• No external downloads needed.<br>• Best user experience. | • Highly experimental.<br>• Only available in select browsers behind a developer flag. | • Highly experimental.<br>• Only available in select browsers behind a developer flag. |
| Xenova/distilbart-cnn-12-6 | Fallback | • High-quality summaries.<br>• Good balance of speed and size.<br>• Works in any modern browser. |

The fallback, DistilBART, is a "distilled" model. It was trained to be a much smaller and faster version of the larger, state-of-the-art BART model, while retaining most of its summarization accuracy. This makes it an ideal compromise for running on a wide range of devices, including older laptops.

## Enabling the Native AI in Chrome (for Testing)

To test the primary, high-performance method, you need to enable an experimental flag in Google Chrome.

Why is this necessary? The Summarizer API is part of a new set of "Built-in AI" features that are not yet enabled by default. Activating the flag allows developers to test these upcoming browser capabilities.

### How to Enable the Flag

1. Open a new tab in Chrome and navigate to chrome://flags.
2. In the search bar, type Prompt API.
3. Find the "Prompt API for Built-in AI" feature.
4. Change its setting from "Default" to "Enabled".
5. A "Relaunch" button will appear. Click it to restart Chrome.

After relaunching, your browser will now support the Summarizer API, and the web component will use the faster native method.

## Usage

To use the component, simply add the script to your page and use the <ai-summary> tag. You must provide a CSS selector for the content you want to summarize via the selector attribute.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AI Summary Demo</title>
  <!-- 1. Load the Open Props stylesheet for styling -->
  <link rel="stylesheet" href="https://unpkg.com/open-props">
  <!-- 2. Load the component script -->
  <script type="module" src="/src/ai-summary.ts"></script>
</head>
<body>

  <article id="content-to-summarize">
    <h2>The Content You Want to Summarize</h2>
    <p>
      Place your long-form article, blog post, or any other text content here. The component will read the inner text of this element and generate a concise summary.
    </p>
  </article>

  <!-- 3. Use the component and point it to your content -->
  <ai-summary selector="#content-to-summarize"></ai-summary>

</body>
</html>
```

## Building the Component

To work on this component locally, you'll need to have Node.js installed.

Install Dependencies

: Open your terminal in the project directory and run:
: `npm install`

Run the Development Server
: To start a live-reloading server for development, run:
: `npm run dev`
: This will open a new tab in your browser where you can see your changes in real-time.

Create a Production Build
: When you're ready to deploy, create an optimized build of the component by running:
: `npm run build`
: This will compile the TypeScript code into a JavaScript file in the dist directory, which you can then use on a production website.

## License

MIT License (See LICENSE)
