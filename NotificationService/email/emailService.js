const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  });

const sendReminderEmail = async (to, subject, carId, serviceType, dueDate, dueMileage) => {
    try {
        await transporter.sendMail({
            from: 'carmanagerservice1@gmail.com', // sender address
            to, // list of receivers
            subject, // Subject line
            html: reminderEmailHTML(carId, serviceType, dueDate, dueMileage), // plain text body
            // html: '<b>Hello world?</b>' // html body (if needed)
        });
        console.log('Reminder Email sent successfully');
    } catch (error) {
        console.error(`Error in sendEmail: ${error}`);
    }
};

const sendPasswordResetEmail = async (to, subject, passwordResetToken) => {
    try {
        await transporter.sendMail({
            from: 'carmanagerservice1@gmail.com',
            to, 
            subject, 
            html: passwordResetEmail(passwordResetToken)
        });
        console.log('Password Email sent successfully');
    } catch (error) {
        console.error(`Error in sendEmail: ${error}`);
    }
};

const sendTestEmail = async (to, subject) => {
    try {
        await transporter.sendMail({
            from: 'carmanagerservice1@gmail.com', // sender address
            to, // list of receivers
            subject, // Subject line
            html: 'This is s teat email' // plain text body
            // html: '<b>Hello world?</b>' // html body (if needed)
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error(`Error in sendEmail: ${error}`);
    }
};

const passwordResetEmail = (passwordResetToken) => {
    const resetUrl = `https://your-app.com/reset-password?token=${passwordResetToken}`;
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            /* ...your styles... */
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">Password Reset</div>
            <div class="content">
                Hello! It appears that you have requested a password reset. Please click the link below to reset your password.
            </div>
            <div class="details">
                <a href="${resetUrl}" target="_blank">Reset Password</a>
            </div>
            <div class="content">
                If you did not request a password reset, please ignore this email.
            </div>
            <div class="footer">This is an automated password reset email. Please do not reply to this email.</div>
        </div>
    </body>
    </html>`;

    return html;
};




const reminderEmailHTML = (carId, serviceType, dueDate, dueMileage) => {
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
    sendReminderEmail,
    sendPasswordResetEmail,
    sendTestEmail
};
