// file: web/js/chatbot.js
const botResponses = {
    it: {
        greeting: "Ciao! Come posso aiutarti?",
        hours: "La struttura è aperta dalle 9:00 alle 20:00",
        pets: "Sì, accettiamo cani di tutte le taglie!",
        price: "Il supplemento per cani è di €10 a notte",
        book: "Per prenotare, visita il nostro sito o chiamaci",
        default: "Grazie per la domanda. Un operatore ti risponderà presto."
    },
    en: {
        greeting: "Hi! How can I help you?",
        hours: "The structure is open from 9:00 AM to 8:00 PM",
        pets: "Yes, we accept dogs of all sizes!",
        price: "The supplement for dogs is €10 per night",
        book: "To book, visit our website or call us",
        default: "Thank you for your question. An operator will reply soon."
    }
};

function getBotResponse(message, lang = 'it') {
    const msg = message.toLowerCase();
    
    if (msg.includes('ciao') || msg.includes('hello')) 
        return botResponses[lang].greeting;
    if (msg.includes('orario') || msg.includes('hours')) 
        return botResponses[lang].hours;
    if (msg.includes('cane') || msg.includes('dog') || msg.includes('pet')) 
        return botResponses[lang].pets;
    if (msg.includes('prezzo') || msg.includes('price') || msg.includes('cost')) 
        return botResponses[lang].price;
    if (msg.includes('prenota') || msg.includes('book')) 
        return botResponses[lang].book;
    
    return botResponses[lang].default;
}