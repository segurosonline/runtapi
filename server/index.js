// server.js
import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configura tu Access Token de sandbox (o producción) :contentReference[oaicite:5]{index=5}
mercadopago.configurations.setAccessToken(
  process.env.MERCADOPAGO_ACCESS_TOKEN ||
  "TAPP_USR-375933332453913-050510-26cb21928990307e53e112051139331b-2413217239"
);

app.get("/", (req, res) => {
  res.send("Servidor Mercado Pago OK");
});

app.post("/create_preference", async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Debes enviar un array 'items' con al menos un elemento" });
    }

    // Crea la preferencia usando el SDK oficial v2 :contentReference[oaicite:6]{index=6}
    const preference = await mercadopago.preferences.create({
      items,
      back_urls: {
        success: "https://tu-dominio.com/success",
        failure: "https://tu-dominio.com/failure",
        pending: "https://tu-dominio.com/pending"
      },
      auto_return: "approved"
    });

    return res.status(200).json({ id: preference.body.id });
  } catch (error) {
    console.error("Error al crear preferencia:", error);
    return res.status(500).json({ error: "Error interno al crear la preferencia" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Servidor escuchando en el puerto ${PORT}`)
);
