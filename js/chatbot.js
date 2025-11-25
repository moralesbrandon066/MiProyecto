// === Chatbot con Gemini IA ===
class TacoBot {
    constructor() {
        this.historial = [];
        this.modelo = null;
        this.inicializarModelo();
    }

    async inicializarModelo() {
        try {
            if (typeof GEMINI_API_KEY === 'undefined' || !GEMINI_API_KEY) {
                console.warn('API Key no configurada - Usando modo fallback');
                return;
            }

            const genAI = new googleGenerativeAI(GEMINI_API_KEY);
            this.modelo = genAI.getGenerativeModel({ 
                model: "gemini-pro",
                generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.7,
                }
            });
            console.log('✅ Gemini IA inicializado');
        } catch (error) {
            console.error('❌ Error inicializando Gemini:', error);
        }
    }

    async sendMessage(mensajeUsuario) {
        this.addMessage(mensajeUsuario, 'user');
        const typingIndicator = this.addTypingIndicator();

        try {
            let respuesta;
            if (this.modelo) {
                respuesta = await this.getGeminiResponse(mensajeUsuario);
            } else {
                respuesta = this.getFallbackResponse(mensajeUsuario);
            }
            
            this.removeTypingIndicator(typingIndicator);
            this.addMessage(respuesta, 'bot');
        } catch (error) {
            this.removeTypingIndicator(typingIndicator);
            console.error('Error:', error);
            const fallback = this.getFallbackResponse(mensajeUsuario);
            this.addMessage(fallback, 'bot');
        }
    }

    async getGeminiResponse(mensajeUsuario) {
        const prompt = `
Eres TacoBot, el asistente virtual de "Taco Express" restaurante mexicano.

INFORMACIÓN REAL DE TACO EXPRESS:
• MENÚ: Tacos al Pastor ($25), Burrito Especial ($70), Agua de Horchata ($20), Combo Express ($60 - 3 tacos + bebida)
• HORARIO: 9:00 a.m. a 10:00 p.m. todos los días
• UBICACIÓN: Calle del Sabor #123, Tulancingo, Hidalgo
• TELÉFONO: (771) 987-6543
• SERVICIO: Entrega a domicilio en menos de 30 minutos

REGLAS:
1. Responde SOLO sobre Taco Express
2. Sé breve, amigable y en español
3. Usa emojis relevantes (🌮, 🚚, 📍, 🕙, 💰)
4. NO inventes información
5. Si no sabes algo, sugiere llamar al teléfono

HISTORIAL:
${this.historial.slice(-4).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

USUARIO: ${mensajeUsuario}

TACOBOT:`;

        try {
            const result = await this.modelo.generateContent(prompt);
            const response = await result.response;
            let texto = response.text();

            // Limpiar respuesta
            texto = texto
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
                .replace(/\*(.*?)\*/g, '<b>$1</b>')
                .trim();

            // Actualizar historial
            this.historial.push({ role: 'user', content: mensajeUsuario });
            this.historial.push({ role: 'assistant', content: texto });
            
            if (this.historial.length > 6) {
                this.historial = this.historial.slice(-6);
            }

            return texto;
        } catch (error) {
            console.error('Error con Gemini:', error);
            throw error;
        }
    }

    getFallbackResponse(msg) {
        const lowerMsg = msg.toLowerCase();
        
        if (lowerMsg.includes('hola') || lowerMsg.includes('buenas')) {
            return "¡Hola! 😊 Soy TacoBot 🌮<br>Puedo ayudarte con: <b>menú</b>, <b>precios</b>, <b>horario</b> o <b>ubicación</b>.";
        }

        if (lowerMsg.includes('menú') || lowerMsg.includes('menu')) {
            return "🌮 <b>Nuestro Menú</b> 🌮<br>" +
                   "• Tacos al Pastor - $25 c/u<br>" +
                   "• Burrito Especial - $70<br>" +
                   "• Agua de Horchata - $20<br>" +
                   "• Combo Express (3 tacos + bebida) - $60";
        }

        if (lowerMsg.includes('precio') || lowerMsg.includes('cuánto') || lowerMsg.includes('cuesta')) {
            return "💰 <b>Precios</b><br>" +
                   "Desde $20 hasta $70. El <b>Combo Express</b> cuesta $60.";
        }

        if (lowerMsg.includes('horario') || lowerMsg.includes('hora')) {
            return "🕙 <b>Horario</b><br>" +
                   "Abrimos de <b>9:00 a.m. a 10:00 p.m.</b> todos los días";
        }

        if (lowerMsg.includes('dirección') || lowerMsg.includes('ubicación') || lowerMsg.includes('dónde')) {
            return "📍 <b>Ubicación</b><br>" +
                   "Calle del Sabor #123, Tulancingo, Hidalgo<br>" +
                   "📞 Tel: (771) 987-6543";
        }

        if (lowerMsg.includes('pedido') || lowerMsg.includes('ordenar')) {
            return "🚚 <b>¡Excelente!</b><br>" +
                   "Puedes llamarnos al <b>(771) 987-6543</b> para hacer tu pedido.";
        }

        if (lowerMsg.includes('gracias')) {
            return "¡De nada! 😊<br>Es un placer ayudarte. ¡Esperamos verte pronto! 🌮";
        }

        return "🤔 No estoy seguro de entender.<br>" +
               "Puedo ayudarte con: <b>menú</b>, <b>precios</b>, <b>horario</b>, <b>ubicación</b> o <b>pedidos</b>.";
    }

    addMessage(text, sender) {
        const container = document.getElementById("chatMessages");
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${sender}`;
        
        const textoFormateado = text.replace(/\n/g, '<br>');
        msgDiv.innerHTML = `<div class="message-content">${textoFormateado}</div>`;
        
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }

    addTypingIndicator() {
        const container = document.getElementById("chatMessages");
        const typingDiv = document.createElement("div");
        typingDiv.className = "message bot typing";
        typingDiv.innerHTML = `<div class="message-content">TacoBot está escribiendo...</div>`;
        container.appendChild(typingDiv);
        container.scrollTop = container.scrollHeight;
        return typingDiv;
    }

    removeTypingIndicator(typingElement) {
        if (typingElement && typingElement.parentNode) {
            typingElement.parentNode.removeChild(typingElement);
        }
    }
}

// ====== FUNCIONES GLOBALES ======
let tacoBot = new TacoBot();

function toggleChat() {
    const chatbot = document.getElementById("chatbot");
    chatbot.classList.toggle("active");
    
    if (chatbot.classList.contains("active")) {
        setTimeout(() => {
            document.getElementById("userInput").focus();
        }, 300);
    }
}

function handleKeyPress(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById("userInput");
    const mensaje = input.value.trim();
    
    if (!mensaje) return;

    input.value = "";
    tacoBot.sendMessage(mensaje);
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log("🌮 TacoBot inicializado");
});
