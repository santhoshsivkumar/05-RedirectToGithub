const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  try {
    const userDetails = JSON.parse(event.body);

    // Create the email content
    const emailContent = `
      New visitor details:
      IP Address: ${userDetails.ip}
      City: ${userDetails.city}
      Region: ${userDetails.region}
      Country: ${userDetails.country_name}
      Postal Code: ${userDetails.postal}
      User Agent: ${userDetails.userAgent}
      Referrer: ${userDetails.referrer}
      Date and Time: ${userDetails.dateTime}
    `;

    // Setup Nodemailer transporter using environment variables
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Use environment variable for email address
        pass: process.env.EMAIL_PASS, // Use environment variable for email password
      },
    });

    // Email options
    let mailOptions = {
      from: process.env.EMAIL_USER, // Use environment variable for email address
      to: process.env.EMAIL_USER, // Use environment variable for recipient email address
      subject: "New Visitor to GitHub Profile",
      text: emailContent,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: "Email sent successfully!",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Failed to send email: ${error.message}`,
    };
  }
};
