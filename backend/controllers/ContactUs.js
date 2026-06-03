const { contactUsEmail } = require("../mail/templates/contactFormRes")
const mailSender = require("../utils/mailSender")

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } = req.body
  console.log(req.body)
  try {
    // 1. Send confirmation email to the user who submitted the form
    try {
      await mailSender(
        email,
        "Your message has been received! - StudyNotion",
        contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
      )
    } catch (userMailError) {
      console.log("Error sending confirmation email to user:", userMailError.message)
      // Do not rethrow; we still want the admin to get the email and the submission to succeed
    }

    // 2. Send notification email to the admin (MAIL_USER)
    const adminEmail = process.env.MAIL_USER;
    if (adminEmail) {
      await mailSender(
        adminEmail,
        `New Contact Form Message from ${firstname} ${lastname}`,
        `<h2>New Contact Form Submission</h2>
         <p><strong>From:</strong> ${firstname} ${lastname} (<a href="mailto:${email}">${email}</a>)</p>
         <p><strong>Phone:</strong> ${countrycode || ""} ${phoneNo}</p>
         <p><strong>Message:</strong></p>
         <p style="white-space: pre-wrap; background-color: #f4f4f4; padding: 15px; border-radius: 5px; font-family: sans-serif; font-size: 14px; color: #333;">${message}</p>`
      )
    }

    return res.json({
      success: true,
      message: "Email send successfully",
    })
  } catch (error) {
    console.log("Error in contactUsController:", error)
    return res.json({
      success: false,
      message: "Something went wrong...",
    })
  }
}