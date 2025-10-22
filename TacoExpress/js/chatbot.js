// === Chatbot avanzado Taco Express ===
let estado = null; // Guardará el contexto de conversación (ej: "menu", "pedido", etc.)

function toggleChat() {
    document.getElementById("chatbot").classList.toggle("active");
}

function handleKeyPress(e) {
    if (e.key === "Enter") sendMessage();
}

function sendMessage() {
    const input = document.getElementById("userInput");
    const mensaje = input.value.trim();
    if (!mensaje) return;

    addMessage(mensaje, "user");
    input.value = "";

    setTimeout(() => {
        const respuesta = getBotResponse(mensaje.toLowerCase());
        addMessage(respuesta, "bot");
    }, 700);
}

function addMessage(text, sender) {
    const container = document.getElementById("chatMessages");
    const msgDiv = document.createElement("div");
    msgDiv.className = `message ${sender}`;
    msgDiv.innerHTML = `<div class="message-content">${text}</div>`;
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

function getBotResponse(msg) {
    // --- SALUDO GENERAL ---
    if (msg.includes("hola") || msg.includes("buenas")) {
        estado = null;
        return "¡Hola! 😊 Soy TacoBot 🌮, tu asistente de Taco Express.<br>¿Quieres conocer nuestro <b>menú</b>, <b>precios</b> o hacer un <b>pedido</b>?";
    }

    // --- MENÚ COMPLETO ---
    if (msg.includes("menú") || msg.includes("menu")) {
        estado = "menu";
        return "Tenemos una gran variedad:<br>🌮 <b>Tacos al Pastor</b> – $25 c/u<br>🌯 <b>Burrito Especial</b> – $70<br>🥤 <b>Agua de Horchata</b> – $20<br>🍽️ <b>Combo Express</b> (3 tacos + bebida) – $60<br><br>¿Quieres saber más sobre algún platillo?";
    }

    // --- DETALLE DE PRODUCTO ---
    if (msg.includes("taco")) {
        estado = "menu";
        return "Nuestros <b>Tacos al Pastor</b> están hechos con carne marinada, piña, cebolla y cilantro 🌮.<br>Son los favoritos de nuestros clientes 😋.<br>¿Deseas conocer los combos disponibles?";
    }
    if (msg.includes("burrito")) {
        estado = "menu";
        return "El <b>Burrito Especial</b> está relleno de carne asada, frijoles, arroz y queso fundido 🌯.<br>Perfecto para una comida completa.";
    }
    if (msg.includes("combo")) {
        estado = "menu";
        return "El <b>Combo Express</b> incluye 3 tacos al pastor y una bebida por solo $60 MXN 🍽️.<br>¿Te gustaría hacer un pedido simulado?";
    }

    // --- PEDIDOS SIMULADOS ---
    if (msg.includes("pedido") || msg.includes("ordenar")) {
        estado = "pedido";
        return "¡Perfecto! 🚴‍♂️ ¿Qué te gustaría pedir?<br>Ejemplo: <em>3 tacos y 1 agua</em>";
    }

    if (estado === "pedido") {
        if (msg.includes("taco") || msg.includes("burrito") || msg.includes("combo") || msg.includes("agua")) {
            estado = "confirmar";
            return "Excelente elección 😋<br>¿Deseas que te lo entreguemos en casa o pasarás a recogerlo?";
        }
    }

    if (estado === "confirmar") {
        if (msg.includes("entrega") || msg.includes("domicilio")) {
            estado = null;
            return "Perfecto 🏠. Tu pedido está registrado. En un futuro, esta función permitirá delivery real.<br>Gracias por confiar en <b>Taco Express</b> 🌮";
        }
        if (msg.includes("recoger") || msg.includes("local")) {
            estado = null;
            return "¡Excelente! 😄 Te esperamos en Calle del Sabor #123, Tulancingo.<br>Tu pedido estará listo en 10 minutos ⏰.";
        }
    }

    // --- INFORMACIÓN GENERAL ---
    if (msg.includes("precio") || msg.includes("cuánto")) {
        return "Nuestros precios van desde $20 (bebidas) hasta $70 (burritos grandes) 💰.<br>El <b>Combo Express</b> cuesta $60 e incluye tacos + bebida.";
    }

    if (msg.includes("horario")) {
        return "Abrimos todos los días de <b>9:00 a.m. a 10:00 p.m.</b> 🕙.";
    }

    if (msg.includes("dirección") || msg.includes("ubicación")) {
        return "Nos encontramos en <b>Calle del Sabor #123, Tulancingo, Hidalgo</b> 📍.";
    }

    if (msg.includes("gracias")) {
        return "¡Con gusto! 😊 Esperamos verte pronto en Taco Express 🌮.";
    }

    if (msg.includes("adiós") || msg.includes("bye")) {
        estado = null;
        return "¡Hasta pronto! 👋 Que tengas un excelente día lleno de sabor 🌮🔥.";
    }

    // --- RESPUESTA POR DEFECTO ---
    return "No entendí muy bien 🤔.<br>Puedes preguntarme por nuestro <b>menú</b>, <b>precios</b>, <b>horario</b> o <b>hacer un pedido</b>.";
}