const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Outlook365',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendReminderEmail = async (to, subject, carId, serviceType, dueDate, dueMileage) => {
    try {
        await transporter.sendMail({
            from: 'adoerr@student.neumont.edu', // sender address
            to, // list of receivers
            subject, // Subject line
            html: reminderEmail(carId, serviceType, dueDate, dueMileage), // plain text body
            // html: '<b>Hello world?</b>' // html body (if needed)
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error(`Error in sendEmail: ${error}`);
    }
};



const reminderEmail = (carId, serviceType, dueDate, dueMileage) => {
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
            }
            .email-container {
                background-color: #ffffff;
                border-radius: 8px;
                padding: 20px;
                margin: auto;
                width: 80%;
                max-width: 600px;
            }
            .header {
                font-size: 24px;
                margin-bottom: 20px;
                color: #333;
            }
            .content {
                font-size: 16px;
                margin-bottom: 20px;
                color: #555;
            }
            .details {
                background-color: #f0f0f0;
                border-radius: 4px;
                padding: 10px;
                margin-bottom: 20px;
            }
            .footer {
                font-size: 12px;
                color: #888;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">Service Reminder</div>
            <div class="content">
                Hello! It appears that your car with ID: <b>${carId}</b> is due for a <b>${serviceType}</b> service. 
                According to our records, this service was due on <b>${dueDate}</b> or at <b>${dueMileage} miles</b>.
            </div>
            <div class="details">
                <div><b>Car ID:</b> ${carId}</div>
                <div><b>Service Type:</b> ${serviceType}</div>
                <div><b>Due Date:</b> ${dueDate}</div>
                <div><b>Due Mileage:</b> ${dueMileage} miles</div>
            </div>
            <div class="content">
                Please schedule this service at your earliest convenience to ensure the longevity and safety of your vehicle. Thank you!
            </div>
            <div class="footer">This is an automated service reminder. Please do not reply to this email.</div>
        </div>
    </body>
    </html>`

    return html;
};

module.exports = {
    sendEmail,
};
