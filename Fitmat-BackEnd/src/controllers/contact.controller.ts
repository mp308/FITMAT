import { Request, Response } from "express";
import nodemailer from "nodemailer";
import prisma from "../utils/prisma";

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const adminRecipient = process.env.CONTACT_NOTIFY_EMAIL || emailUser;

const mailer = emailUser && emailPassword
  ? nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    })
  : null;

export const submitContact = async (req: Request, res: Response) => {
  const { name, email, phoneNumber, subject, message } = req.body as {
    name?: string;
    email?: string;
    phoneNumber?: string;
    subject?: string;
    message?: string;
  };

  if (!name || !email || !phoneNumber || !subject || !message) {
    return res.status(400).json({
      message: "name, email, phoneNumber, subject, and message are required.",
    });
  }

  try {
    const contact = await prisma.contactRequest.create({
      data: {
        name,
        email,
        phoneNumber,
        subject,
        message,
      },
    });

    if (mailer && adminRecipient) {
      try {
        await mailer.sendMail({
          from: `Fitmat Contact <${emailUser}>`,
          to: adminRecipient,
          subject: `[Fitmat Contact] ${subject}`,
          text: `New contact request\n\nName: ${name}\nEmail: ${email}\nPhone: ${phoneNumber}\nSubject: ${subject}\n\nMessage:\n${message}`,
          html: `<p>New contact request received.</p>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phoneNumber}</p>
<p><strong>Subject:</strong> ${subject}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, "<br/>")}</p>`,
        });
      } catch (error) {
        console.error("Failed to send contact notification email", error);
      }

      try {
        await mailer.sendMail({
          from: `Fitmat Support <${emailUser}>`,
          to: email,
          subject: `We have received your message - ${subject}`,
          text: `Hello ${name},\n\nThank you for contacting Fitmat! We have received your message and our team will get back to you as soon as possible.\n\nDetails you submitted:\nSubject: ${subject}\nPhone: ${phoneNumber}\nMessage:\n${message}\n\nThank you for reaching out to us,\nThe Fitmat Team`,
          html: `<p>Hello ${name},</p>
<p>Thank you for contacting Fitmat! We have received your message and our team will get back to you as soon as possible.</p>
<p><strong>Details you submitted:</strong></p>
<ul>
  <li><strong>Subject:</strong> ${subject}</li>
  <li><strong>Phone:</strong> ${phoneNumber}</li>
</ul>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, "<br/>")}</p>
<p>Thank you for reaching out to us,<br/>The Fitmat Team</p>`,
        });
      } catch (error) {
        console.error("Failed to send contact auto-reply email", error);
      }
    }

    return res.status(201).json(contact);
  } catch (error) {
    console.error("Failed to store contact request", error);
    return res.status(500).json({ message: "Failed to submit contact request." });
  }
};

export const listContacts = async (_req: Request, res: Response) => {
  try {
    const contacts = await prisma.contactRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.json(contacts);
  } catch (error) {
    console.error("Failed to fetch contact requests", error);
    return res.status(500).json({ message: "Failed to fetch contact requests." });
  }
};
