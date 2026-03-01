const chatBox = document.getElementById("chat");

// Helpers for API key storage (OpenRouter keys)
function getApiKey(){
  return localStorage.getItem('OPENROUTER_API_KEY') || '';
}
function setApiKey(key){
  localStorage.setItem('OPENROUTER_API_KEY', key);
}

// NOTE: A demo key is seeded below so basic testing works immediately;
// the token may expire and has limited usage. Replace with your own key via the
// widget or console for continued functionality.

// ensure a demo key exists if nothing stored yet
if(!getApiKey()){
  setApiKey('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');
}

async function callOpenRouter(messages){
  const key = getApiKey();
  if(!key) throw new Error('API key not set. Click "Set API Key" in the widget (or configure via console using localStorage).');

  const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages, temperature: 0.2, max_tokens: 800 })
  });

  if(!resp.ok){
    const errText = await resp.text();
    throw new Error('API error: ' + errText);
  }

  const data = await resp.json();
  return data.choices[0].message.content.trim();
}

function addMessage(text, type){
  const message = document.createElement('div');
  message.className = type;
  message.innerText = text;
  chatBox.appendChild(message);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage(){
  const inputField = document.getElementById('userInput');
  const userText = inputField.value.trim();
  if(!userText) return;
  addMessage(userText, 'user');
  inputField.value = '';
  addMessage('Thinking... ⏳', 'bot');
  try{
    const reply = await callOpenRouter([
      {role:'system', content:'You are a helpful assistant.'},
      {role:'user', content:userText}
    ]);
    chatBox.lastChild.remove();
    addMessage(reply, 'bot');
  }catch(e){
    chatBox.lastChild.remove();
    addMessage('Error: ' + e.message, 'bot');
  }
}

// ---- Widget UI logic ----
const aiFab = document.getElementById('ai-fab');
const aiPanel = document.getElementById('ai-panel');
const aiClose = document.getElementById('ai-close');
const aiText = document.getElementById('ai-text');
const aiImage = document.getElementById('ai-image');
const aiImageDesc = document.getElementById('ai-image-desc');
const aiImagePreview = document.getElementById('ai-image-preview');
const aiOutput = document.getElementById('ai-output');
let currentImageDataURL = '';

aiFab.addEventListener('click', ()=> aiPanel.classList.toggle('hidden'));
aiClose.addEventListener('click', ()=> aiPanel.classList.add('hidden'));

aiImage.addEventListener('change', async (e)=>{
  const f = e.target.files[0];
  if(!f) return;
  const reader = new FileReader();
  reader.onload = () =>{
    currentImageDataURL = reader.result; // data:image/... base64
    aiImagePreview.innerHTML = `<img src="${currentImageDataURL}" alt="uploaded image">`;
  };
  reader.readAsDataURL(f);
});

document.getElementById('ai-set-key').addEventListener('click', ()=>{
  const existing = getApiKey();
  const key = prompt('Paste your OpenRouter API key (sk-or-...):', existing || '');
  if(key) { setApiKey(key.trim()); alert('API key saved to localStorage.'); }
});

function renderOutput(html){ aiOutput.innerHTML = html; aiOutput.scrollTop = aiOutput.scrollHeight; }

async function generateWithTemplate(template){
  const userText = aiText.value.trim();
  const imgDesc = aiImageDesc.value.trim();
  let prompt = template + "\n\nText:\n" + (userText || '[none]');
  if(currentImageDataURL){
    prompt += "\n\nImage: (user uploaded an image).";
    if(imgDesc) prompt += " Image description: " + imgDesc + ".";
    else prompt += " Provide a short description or context for the image if relevant.";
  }

  renderOutput('<div style="opacity:.8">Generating... ⏳</div>');
  try{
    const resp = await callOpenRouter([
      {role:'system', content:'You are a concise assistant that returns readable outputs for learners.'},
      {role:'user', content: prompt}
    ]);
    renderOutput('<pre style="white-space:pre-wrap">' + resp + '</pre>');
  }catch(e){
    renderOutput('<div style="color:#ff6b6b">Error: ' + e.message + '</div>');
  }
}

document.getElementById('ai-summary').addEventListener('click', ()=>{
  const t = `Summarize the provided text and any image description in 3 short paragraphs (each 1-3 sentences). Then list 5 key takeaways and provide a 1-sentence suggested next step for a learner.`;
  generateWithTemplate(t);
});

document.getElementById('ai-quiz').addEventListener('click', ()=>{
  const t = `Create a short quiz from the provided text (and image if described). Provide 5 multiple-choice questions. For each question include 4 options (A-D) and mark the correct answer after the question under 'Answer:'. Keep questions varied in difficulty.`;
  generateWithTemplate(t);
});

document.getElementById('ai-flashcards').addEventListener('click', ()=>{
  const t = `Generate 8 concise flashcards from the provided content. Return as numbered pairs: "Q: ..." then "A: ...". Keep answers short (one sentence).`;
  generateWithTemplate(t);
});

document.getElementById('ai-fill').addEventListener('click', ()=>{
  const t = `Create 6 "fill-in-the-blank" sentences based on the provided content. Replace one key word per sentence with a blank like _____ and then provide an "Answer Key:" listing the correct words in order.`;
  generateWithTemplate(t);
});

// Keep the existing sendMessage available globally
window.sendMessage = sendMessage;