import { url } from "inspector";
import { nodemailer } from "nodemailer";

export async function sendEmail(email: string, url: string) {
    let account = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransporter({
        host: "smtp.enthereal.email",
        Port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: account.user, // generate etheral uer
            pass: account.pass // generate etheral password
        }
    });

    const mailOptions = {
        from: '"Fred FOo " <foo@example.com>', // sender adress
        to: "bar@example.com, bez@example.com", // list of receivers
        subject: "Hello", // Subject line
        text: "Hello world?", // plain text body
        html: `<a href="${url}">${url}</a>` // html body
    };

    const info = wait transporter.sendEmail(mailOptions);

    console.log("Message sent: %S", info.messageId);
    // Preview only avalible when sending through an Etheral account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}