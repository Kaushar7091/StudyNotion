const nodemailer = require("nodemailer");
const axios = require("axios");

const mailSender = async (email, title, body) => {
    try {
        console.log("DEBUG: BREVO_API_KEY exists in env:", !!process.env.BREVO_API_KEY);
        console.log("DEBUG: MAIL_HOST exists in env:", !!process.env.MAIL_HOST);
        console.log("DEBUG: MAIL_USER exists in env:", !!process.env.MAIL_USER);

        // If Brevo API Key is configured, use the HTTP API (works on Render Free tier)
        if (process.env.BREVO_API_KEY) {
            console.log("Sending email via Brevo HTTP API...");
            const response = await axios.post(
                "https://api.brevo.com/v3/smtp/email",
                {
                    sender: {
                        name: "StudyNotion",
                        email: process.env.MAIL_USER || "info@studynotion.com",
                    },
                    to: [
                        {
                            email: email,
                        },
                    ],
                    subject: title,
                    htmlContent: body,
                },
                {
                    headers: {
                        accept: "application/json",
                        "api-key": process.env.BREVO_API_KEY,
                        "content-type": "application/json",
                    },
                }
            );
            console.log("Email sent successfully via Brevo API");
            return response.data;
        } 
        
        // Otherwise, fall back to standard SMTP (useful for local development)
        console.log("Sending email via standard SMTP...");
        const transporterConfig = {
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        };

        if (process.env.MAIL_HOST && process.env.MAIL_HOST.includes("gmail")) {
            transporterConfig.service = "gmail";
        } else {
            transporterConfig.host = process.env.MAIL_HOST;
            transporterConfig.port = 587;
            transporterConfig.secure = false;
        }

        let transporter = nodemailer.createTransport(transporterConfig);

        let info = await transporter.sendMail({
            from: `"StudyNotion" <${process.env.MAIL_USER}>`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });
        console.log("Email sent successfully via SMTP:", info.response);
        return info;
    } catch (error) {
        console.error("Error occurred while sending email:", error.message);
        throw error;
    }
};

module.exports = mailSender;