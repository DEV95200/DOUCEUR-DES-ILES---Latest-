import nodemailer from "nodemailer";
import { Resend } from "resend";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
  submittedAt?: unknown;
};

type CleanContact = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_REQUEST_BYTES = 24_000;
const minimumCompletionTimeMs = 1_500;

function json(body: Record<string, unknown>, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
    .replaceAll("\n", "<br />");
}

function validate(payload: ContactPayload): { data?: CleanContact; error?: string } {
  const name = cleanText(payload.name, 100);
  const email = cleanText(payload.email, 180).toLowerCase();
  const phone = cleanText(payload.phone, 40);
  const subject = cleanText(payload.subject, 120);
  const message = cleanText(payload.message, 4_000);
  const website = cleanText(payload.website, 200);

  if (website) return { error: "SPAM_DETECTED" };

  const submittedAt = typeof payload.submittedAt === "number" ? payload.submittedAt : 0;
  if (submittedAt > 0 && Date.now() - submittedAt < minimumCompletionTimeMs) {
    return { error: "SPAM_DETECTED" };
  }

  if (name.length < 2) return { error: "Le nom doit contenir au moins 2 caractères." };
  if (!EMAIL_PATTERN.test(email)) return { error: "L’adresse e-mail est invalide." };
  if (subject.length < 2) return { error: "Sélectionnez un sujet." };
  if (message.length < 20) return { error: "Le message doit contenir au moins 20 caractères." };

  return { data: { name, email, phone, subject, message } };
}

function ownerEmailHtml(contact: CleanContact) {
  return `
    <div style="margin:0;background:#fbf3e4;padding:32px;font-family:Arial,sans-serif;color:#14231b">
      <div style="max-width:680px;margin:0 auto;overflow:hidden;border-radius:24px;background:#ffffff;border:1px solid rgba(20,35,27,.12)">
        <div style="background:#0f3d2e;padding:28px 32px;color:#fbf3e4">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#c6f24d">Kalawang · Nouveau contact</p>
          <h1 style="margin:0;font-size:28px">${escapeHtml(contact.subject)}</h1>
        </div>
        <div style="padding:32px">
          <table role="presentation" style="width:100%;border-collapse:collapse;font-size:15px">
            <tr><td style="padding:8px 0;color:#66736c;width:120px">Nom</td><td style="padding:8px 0;font-weight:700">${escapeHtml(contact.name)}</td></tr>
            <tr><td style="padding:8px 0;color:#66736c">E-mail</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(contact.email)}" style="color:#0f3d2e">${escapeHtml(contact.email)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#66736c">Téléphone</td><td style="padding:8px 0">${contact.phone ? escapeHtml(contact.phone) : "Non renseigné"}</td></tr>
          </table>
          <div style="margin-top:24px;border-radius:18px;background:#fbf3e4;padding:22px;line-height:1.7">${escapeHtml(contact.message)}</div>
          <p style="margin:24px 0 0;font-size:13px;color:#66736c">Réponds directement à cet e-mail : l’adresse du client est configurée comme adresse de réponse.</p>
        </div>
      </div>
    </div>`;
}

function customerEmailHtml(contact: CleanContact) {
  return `
    <div style="margin:0;background:#fbf3e4;padding:32px;font-family:Arial,sans-serif;color:#14231b">
      <div style="max-width:620px;margin:0 auto;overflow:hidden;border-radius:24px;background:#ffffff;border:1px solid rgba(20,35,27,.12)">
        <div style="background:#0f3d2e;padding:28px 32px;color:#fbf3e4">
          <p style="margin:0;color:#c6f24d;font-size:13px;font-weight:700;letter-spacing:.16em">KALAWANG</p>
          <h1 style="margin:10px 0 0;font-size:27px">Message bien reçu 🌴</h1>
        </div>
        <div style="padding:32px;line-height:1.7">
          <p>Bonjour ${escapeHtml(contact.name)},</p>
          <p>Merci de nous avoir écrit au sujet de « ${escapeHtml(contact.subject)} ». Ton message a bien été transmis à notre équipe.</p>
          <p>Nous reviendrons vers toi dès que possible à l’adresse <strong>${escapeHtml(contact.email)}</strong>.</p>
          <div style="margin-top:24px;border-radius:18px;background:#fbf3e4;padding:18px;font-size:14px;color:#526058">
            <strong>Copie de ton message :</strong><br /><br />${escapeHtml(contact.message)}
          </div>
          <p style="margin-top:28px">À très bientôt,<br /><strong>L’équipe Kalawang</strong></p>
        </div>
      </div>
    </div>`;
}

async function sendOwnerWithGmail(contact: CleanContact) {
  const user = process.env.GMAIL_SMTP_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD?.replaceAll(" ", "");
  const recipient = process.env.CONTACT_TO_EMAIL || user;

  if (!user || !appPassword || !recipient) {
    throw new Error("GMAIL_CONFIGURATION_MISSING");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass: appPassword },
  });

  await transporter.sendMail({
    from: `Kalawang — Formulaire <${user}>`,
    to: recipient,
    replyTo: `${contact.name} <${contact.email}>`,
    subject: `[Contact Kalawang] ${contact.subject} — ${contact.name}`,
    text: `Nouveau message de ${contact.name}\nE-mail : ${contact.email}\nTéléphone : ${contact.phone || "Non renseigné"}\nSujet : ${contact.subject}\n\n${contact.message}`,
    html: ownerEmailHtml(contact),
  });
}

async function sendOwnerWithResend(contact: CleanContact) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const recipient = process.env.CONTACT_TO_EMAIL || process.env.GMAIL_SMTP_USER;

  if (!apiKey || !from || !recipient) {
    throw new Error("RESEND_CONFIGURATION_MISSING");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [recipient],
    replyTo: contact.email,
    subject: `[Contact Kalawang] ${contact.subject} — ${contact.name}`,
    html: ownerEmailHtml(contact),
    text: `Nouveau message de ${contact.name}\nE-mail : ${contact.email}\nTéléphone : ${contact.phone || "Non renseigné"}\nSujet : ${contact.subject}\n\n${contact.message}`,
  });

  if (error) throw new Error(`RESEND_OWNER_FAILED: ${error.message}`);
}

async function sendCustomerConfirmation(contact: CleanContact) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) return false;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [contact.email],
    replyTo: process.env.CONTACT_TO_EMAIL || process.env.GMAIL_SMTP_USER,
    subject: "Nous avons bien reçu ton message — Kalawang",
    html: customerEmailHtml(contact),
    text: `Bonjour ${contact.name},\n\nMerci de nous avoir écrit au sujet de « ${contact.subject} ». Ton message a bien été transmis à notre équipe.\n\nÀ très bientôt,\nL’équipe Kalawang`,
  });

  if (error) throw new Error(`RESEND_CONFIRMATION_FAILED: ${error.message}`);
  return true;
}

async function handleContact(request: Request) {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Méthode non autorisée." }, 405);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return json({ ok: false, error: "Le message est trop volumineux." }, 413);
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return json({ ok: false, error: "Requête invalide." }, 400);
  }

  const validation = validate(payload);
  if (!validation.data) {
    const isSpam = validation.error === "SPAM_DETECTED";
    return json(
      { ok: false, error: isSpam ? "Impossible d’envoyer ce message." : validation.error },
      isSpam ? 400 : 422,
    );
  }

  const contact = validation.data;
  let deliveredWith: "gmail" | "resend";

  try {
    await sendOwnerWithGmail(contact);
    deliveredWith = "gmail";
  } catch (gmailError) {
    console.error("Gmail SMTP delivery failed", gmailError);
    try {
      await sendOwnerWithResend(contact);
      deliveredWith = "resend";
    } catch (resendError) {
      console.error("Resend fallback delivery failed", resendError);
      return json(
        {
          ok: false,
          error: "Le service de messagerie est momentanément indisponible. Réessaie dans quelques instants.",
        },
        503,
      );
    }
  }

  let confirmationSent = false;
  try {
    confirmationSent = await sendCustomerConfirmation(contact);
  } catch (confirmationError) {
    console.error("Customer confirmation failed", confirmationError);
  }

  return json({ ok: true, deliveredWith, confirmationSent });
}

export default {
  fetch: handleContact,
};
