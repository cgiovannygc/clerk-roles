import { NextResponse } from "next/server";
import { headers } from "next/headers"; // funcion para obtener las cabeceras de la req, en este caso, del evento de stripe enviado desde el webhooks
import Stripe from "stripe";
import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { Id } from "@/convex/_generated/dataModel";

const sk = process.env.STRIPE_SECRET_KEY;
if (!sk) throw new Error("Not found STRIPE_SECRET_KEY");
const stripe = new Stripe(sk);

const endpointSecret = process.env.STRIPE_WEBHOOK_EVENT_SECRET_KEY; // la llave secreta para identificar el webhook de stripe
if (endpointSecret === "")
  throw new Error("Not found STRIPE_WEBHOOK_EVENT_SECRET_KEY");

export async function POST(req: Request): Promise<Response> {
  const body = await req.text(); // recibimos el producto que se envio del front
  const headerList = await headers(); // recibimos los datos enviados desde el webhook
  const sig = headerList.get("stripe-signature"); // extraemos la firma unica de stripe

  const event: Stripe.Event = stripe.webhooks.constructEvent(
    body,
    sig!,
    endpointSecret!,
  ); // declaramos una variable para almacenar el evento de stripe, que se construira a partir de la firma y el body recibido

  if (!event) {
    return NextResponse.json({ error: "Invalid event" });
  }

  switch (event.type) {
    case "checkout.session.completed":
      try {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log(`-------webhook--------- ${session.line_items}`);

        const productId = session.metadata!.productId as Id<"products">;
        const userId = session.metadata!.userId as Id<"users">;
        const quantityRaw = session.metadata!.quantity;
        const quantity = quantityRaw ? Number(quantityRaw) : NaN;
        console.log(quantityRaw);
        console.log(quantity);

        if (
          !productId ||
          !userId ||
          !Number.isInteger(quantity) ||
          quantity <= 0
        ) {
          return NextResponse.json(
            { error: "Invalid checkout metadata (productId/userId/quantity)" },
            { status: 400 },
          );
        }

        await fetchMutation(api.purchases.createPurchase, {
          quantity,
          productId,
          userId,
        });

        return NextResponse.json({ ok: true });
      } catch (error) {
        return NextResponse.json(
          { error: `can't update product's stock (WEBHOOK): ${String(error)}` },
          { status: 500 },
        );
      }
      break;
    default:
      return NextResponse.json(
        { error: `Event not supported: ${event.type}` },
        { status: 400 },
      );
  }
}
