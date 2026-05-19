// ----- Componente Chat IA -----
class ChatIA extends HTMLElement {
    constructor() {
      super();
  
      const shadow = this.attachShadow({ mode: "open" });
  
      shadow.innerHTML = `
        <style>
          :host {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            font-family: Arial, sans-serif;
          }
  
          #chat-button {
            width: 60px;
            height: 60px;
            background: var(--accent);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            font-size: 24px;
            transition: 0.3s ease;
          }
  
          #chat-button:hover {
            background: var(--secondary);
          }
  
          #chat-window {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 320px;
            height: 400px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform: scale(0);
            transform-origin: bottom right;
            transition: 0.2s ease;
          }
  
          #chat-window.open {
            transform: scale(1);
          }
  
          .header {
            background: var(--accent);
            color: white;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
  
          .body {
            flex: 1;
            padding: 10px;
            overflow-y: auto;
            font-size: 14px;
          }
  
          .input-area {
            display: flex;
            border-top: 1px solid #ddd;
          }
  
          .input-area input {
            flex: 1;
            border: none;
            padding: 8px;
            outline: none;
          }
  
          .input-area button {
            border: none;
            background: var(--accent);
            color: white;
            padding: 8px 12px;
            cursor: pointer;
            transition: 0.3s ease;
          }
  
          .input-area button:hover {
            background: var(--secondary);
          }
        </style>
  
        <div id="chat-button">💬</div>
  
        <div id="chat-window">
          <div class="header">
            <span>Chat IA</span>
          </div>
  
          <div class="body" id="messages"></div>
  
          <div class="input-area">
            <input type="text" id="input" placeholder="Digite sua dúvida..." />
            <button id="send">Enviar</button>
          </div>
        </div>
      `;
    }
  
    connectedCallback() {
      this.button = this.shadowRoot.querySelector("#chat-button");
      this.window = this.shadowRoot.querySelector("#chat-window");
      this.closeBtn = this.shadowRoot.querySelector("#close");
      this.sendBtn = this.shadowRoot.querySelector("#send");
      this.input = this.shadowRoot.querySelector("#input");
      this.messages = this.shadowRoot.querySelector("#messages");
  
      this.button.addEventListener("click", () => {
        this.window.classList.toggle("open");
      });
  
      this.closeBtn.addEventListener("click", () => {
        this.window.classList.remove("open");
      });
  
      this.sendBtn.addEventListener("click", () => this.sendMessage());
    }
  
    sendMessage() {
      const text = this.input.value.trim();
      if (!text) return;
  
      this.messages.innerHTML += `<div><b>Você:</b> ${text}</div>`;
      this.input.value = "";
  
      // Aqui depois você conecta com sua API de IA
      setTimeout(() => {
        this.messages.innerHTML += `<div><b>IA:</b> Ainda não conectada 😊</div>`;
        this.messages.scrollTop = this.messages.scrollHeight;
      }, 500);
    }
  }
  
  customElements.define("chat-ia", ChatIA);