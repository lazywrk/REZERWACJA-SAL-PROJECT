const nodemailer = require('nodemailer');

// Konfiguracja transportu email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// EMAIL
async function sendEmail(to, subject, message) {
    try {

        await transporter.sendMail({
            from: `"Room Booking System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text: message
        });

        console.log('EMAIL SENT:', to);

    } catch (err) {
        console.error('EMAIL ERROR:', err);
    }
}


// SMS (przygotowane pod Twilio)
async function sendSMS(phone, message) {
    try {

        if (!phone) return;

        // TODO: integracja z Twilio
        console.log('SMS SENT:', phone);
        console.log(message);

    } catch (err) {
        console.error('SMS ERROR:', err);
    }
}


// FORMATOWANIE
function formatBookingMessage(booking) {
    return `
Sala: ${booking.room_id}
Od: ${new Date(booking.start_time).toLocaleString()}
Do: ${new Date(booking.end_time).toLocaleString()}
`;
}


// BOOKING CONFIRMATION
async function bookingConfirmation(userEmail, booking, phone = null) {

    const message = `
Twoja rezerwacja została utworzona

${formatBookingMessage(booking)}
`;

    await sendEmail(
        userEmail,
        'Potwierdzenie rezerwacji',
        message
    );

    if (phone) {
        await sendSMS(phone, message);
    }
}


// REMINDER
async function bookingReminder(userEmail, booking, phone = null) {

    const message = `
Przypomnienie o rezerwacji

${formatBookingMessage(booking)}
`;

    await sendEmail(
        userEmail,
        'Przypomnienie o rezerwacji',
        message
    );

    if (phone) {
        await sendSMS(phone, message);
    }
}


module.exports = {
    sendEmail,
    sendSMS,
    bookingConfirmation,
    bookingReminder
};