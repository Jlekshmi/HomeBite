
import nodemailer from "nodemailer";

const sendResetEmail = async (email, token) => {
  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  const transporter = nodemailer.createTransport({
    service: "Gmail", // Or your email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"HomeBite Support" <homebitecuisines@gmail.com>',
    to: email,
    subject: "Password Reset Request",
    text: `You requested a password reset. Click on this link to reset your password: ${resetLink}`,
    html: `<p>You requested a password reset. Click <a href="${resetLink}" target="_blank" rel="noopener noreferrer">here</a> to reset your password.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

// Export the function using ES module syntax
export { sendResetEmail };
