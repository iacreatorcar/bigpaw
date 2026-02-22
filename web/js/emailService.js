// file: web/js/emailService.js
async function sendAutoEmail(structureEmail, userMessage, lang = 'it') {
    const emailTemplates = {
        it: {
            subject: "Richiesta informazioni da BigPaw",
            body: `Gentile struttura,\n\nAbbiamo ricevuto una richiesta da un utente BigPaw:\n\n"${userMessage}"\n\nPuoi rispondere direttamente a questo messaggio.\n\nGrazie,\nBigPaw Team`
        },
        en: {
            subject: "Information request from BigPaw",
            body: `Dear structure,\n\nWe received a request from a BigPaw user:\n\n"${userMessage}"\n\nYou can reply directly to this message.\n\nThank you,\nBigPaw Team`
        }
    };
    
    // Qui integrerai con un servizio email (es. SendGrid, Mailgun, AWS SES)
    console.log('📧 Email da inviare:', {
        to: structureEmail,
        subject: emailTemplates[lang].subject,
        body: emailTemplates[lang].body
    });
}