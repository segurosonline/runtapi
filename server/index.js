// /api/create_preference.js
import mercadopago from "mercadopago";

mercadopago.configurations.setAccessToken(
  process.env.MERCADOPAGO_ACCESS_TOKEN ||
  "APP_USR-375933332453913-050510-26cb21928990307e53e112051139331b-2413217239"
);

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método no permitido" });
    }
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Debes enviar un array 'items' con al menos un elemento" });
    }

    const preference = await mercadopago.preferences.create({
      items,
      back_urls: {
        success: "https://tudominio.com/success",
        failure: "https://tudominio.com/failure",
        pending: "https://tudominio.com/pending"
      },
      auto_return: "approved"
    });
    return res.status(200).json({ id: preference.body.id });
  } catch (error) {
    console.error("Error creando preferencia:", error);
    return res.status(500).json({ error: "Error interno al crear la preferencia" });
  }
}
