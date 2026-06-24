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
          width: 56px;
          height: 56px;
          background: var(--accent);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(111,66,193,0.3);
          font-size: 24px;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
        }

        #chat-button:hover {
          background: var(--secondary);
          transform: scale(1.08) rotate(5deg);
          box-shadow: 0 6px 20px rgba(75,46,131,0.4);
        }

        #chat-window {
          position: absolute;
          bottom: 76px;
          right: 0;
          width: 340px;
          height: 460px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.04);
          opacity: 0;
          transform: translateY(20) scale(0.95);
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
        }

        #chat-window.open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .header {
          background: var(--secondary);
          color: white;
          padding: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header h3 {
          margin: 0;
          font-family: 'Montserrat', sans-serif;
          font-size: 1rem;
          font-weight: 600;
        }

        #close {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          font-size: 20px;
          cursor: pointer;
          transition: color 0.2s;
          padding: 4px;
        }

        #close:hover {
          color: #ffffff;
        }

        .body {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #f8fafc;
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-family: 'Roboto', sans-serif;
          font-size: 14px;
          line-height: 1.4;
        }

        .msg-bubble {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 14px;
          animation: fadeInMsg 0.25s ease-out;
        }

        .msg-user {
          align-self: flex-end;
          background: var(--accent);
          color: #ffffff;
          border-bottom-right-radius: 4px;
        }

        .msg-ia {
          align-self: flex-start;
          background: #ffffff;
          color: var(--text);
          border-bottom-left-radius: 4px;
          border: 1px solid #e2e8f0;
        }

        @keyframes fadeInMsg {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .input-area {
          padding: 12px 16px;
          background: #ffffff;
          display: flex;
          border-top: 1px solid #f1f5f9;
          gap: 8px;
          align-items: center;
        }

        .input-area input {
          flex: 1;
          border: 1px solid #e2e8f0;
          padding: 10px 14px;
          border-radius: 20px;
          font-family: 'Roboto', sans-serif;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }

        .input-area input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(111, 66, 193, 0.1);
        }

        #send {
          background: var(--accent);
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 20px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.2s;
        }

        #send:hover {
          background: var(--secondary);
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

    if (this.button && this.window) {
      this.button.addEventListener("click", () => {
        this.window.classList.toggle("open");
      });
    }

    if (this.closeBtn && this.window) {
      this.closeBtn.addEventListener("click", () => {
        this.window.classList.remove("open");
      });
    }

    if (this.sendBtn) {
      this.sendBtn.addEventListener("click", () => this.sendMessage());
    }
  }

  sendMessage() {
    const text = this.input.value.trim();
    if (!text) return;

    this.messages.innerHTML += `<div class="msg-bubble msg-user">${text}</div>`;
    this.input.value = "";
    this.messages.scrollTop = this.messages.scrollHeight;

    // Aqui depois você conecta com sua API de IA
    setTimeout(() => {
      this.messages.innerHTML += `<div class="msg-bubble msg-ia"><strong>IA:</strong> Olá! Como posso te ajudar com os peludos hoje?</div>`;
      this.messages.scrollTop = this.messages.scrollHeight;
    }, 500);
  }
}

customElements.define("chat-ia", ChatIA);