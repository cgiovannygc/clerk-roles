import { NextResponse } from "next/server";
import Stripe from "stripe";

// primero instanciamos stripe para tener acceso a sus propiedades, como parametro recibe la api key secret
const sk = process.env.STRIPE_SECRET_KEY;
if (!sk) {
  throw new Error("Not found STRIPE_SECRET_KEY");
}
const stripe = new Stripe(sk);

export async function POST(req: Request) {
  const body = await req.json();

  const session = await stripe.checkout.sessions.create({
    // creamos una sesion de checkout, basicamente es una instancia de compra, a la que le pasamos los siguientes parametros:
    success_url: "http://localhost:3000/store/success", // url a la que se redirecciona al usuario despues de una compra exitosa
    cancel_url: "http://localhost:3000/store/cancel", // url a la que se redirecciona al usuario despues de cancelar la compra
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: body.name,
            images: [body.imageUrl],
          },
          unit_amount: body.price * 100, // el precio se multiplica por 100 porque stripe maneja los precios en centavos
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      productId: body._id, // guardamos el id del producto en los metadatos de la sesion, esto nos servira para identificar el producto comprado en el webhook y actualizar el stock
    },
  });
  return NextResponse.json(session);
}
