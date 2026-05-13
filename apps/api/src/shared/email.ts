import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error conectando con Gmail:", error);
  } else {
    console.log("Servidor de correo listo");
  }
});

export async function enviarEmail(
  destinatario: string,
  asunto: string,
  html: string
) {
  try {
    const info = await transporter.sendMail({
      from: `"Evenxa" <${process.env.GMAIL_USER}>`,
      to: destinatario,
      subject: asunto,
      html,
    });

    console.log("Email enviado:", info.messageId);
    console.log("Respuesta SMTP:", info.response);

    return info;
  } catch (error) {
    console.error("Error enviando email:", error);
    throw error;
  }
}

export async function enviarCodigoVerificacion(
  destinatario: string,
  codigo: string,
  nombre: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #1a1a2e;">Verifica tu cuenta de Evenxa</h1>
      <p>Hola ${nombre},</p>
      <p>Tu código de verificación es:</p>
      <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #1a1a2e; font-size: 36px; letter-spacing: 8px;">${codigo}</h2>
      </div>
      <p>Este código expira en <strong>15 minutos</strong>.</p>
      <p>Si no creaste una cuenta en Evenxa, ignora este correo.</p>
    </div>
  `;

  await enviarEmail(destinatario, "Verifica tu cuenta de Evenxa", html);
}