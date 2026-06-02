const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
    try{
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
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log(info);
            return info;
    }
    catch(error) {
        console.log(error.message);
        throw error;
    }
}


module.exports = mailSender;