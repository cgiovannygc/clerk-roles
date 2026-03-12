import { ProductAndUserProps } from "@/lib/props/props";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// primero instanciamos stripe para tener acceso a sus propiedades, como parametro recibe la api key secret
const sk = process.env.STRIPE_SECRET_KEY;
if (!sk) {
  throw new Error("Not found STRIPE_SECRET_KEY");
}
const stripe = new Stripe(sk);

export async function POST(req: Request) {
  const body = (await req.json()) as ProductAndUserProps;
  const imageUrl = body.product.imageUrl;
  const productId = body.product._id;
  const userId = body.user._id;

  if (!imageUrl || !productId || !userId) {
    return NextResponse.json(
      { error: "Missing required checkout data" },
      { status: 400 },
    );
  }

  const session = await stripe.checkout.sessions.create({
    // creamos una sesion de checkout, basicamente es una instancia de compra, a la que le pasamos los siguientes parametros:
    success_url: "http://localhost:3000/store/success", // url a la que se redirecciona al usuario despues de una compra exitosa
    cancel_url: "http://localhost:3000/store/cancel", // url a la que se redirecciona al usuario despues de cancelar la compra
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(body.product.price * 100), // el precio se multiplica por 100 porque stripe maneja los precios en centavos
          product_data: {
            name: body.product.name,
            description: body.product.description,
            images: [imageUrl],
          },
        },
      },
    ],
    metadata: {
      quantity: 1,
      productId,
      userId,
    },
  });
  console.log(body);
  return NextResponse.json(session);
}
