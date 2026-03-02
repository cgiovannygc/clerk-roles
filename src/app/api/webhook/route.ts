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
    console.error("Error al construir el evento de Stripe");
    return NextResponse.json({ error: "Invalid event" });
  }

  switch (event.type) {
    case "checkout.session.completed":
      try {
        await fetchMutation(api.products.updateStockProduct, {
          id: event.data.object.metadata?.productId as Id<"products">, // obtenemos el id del producto desde los metadatos de la sesion de checkout
        });
        return NextResponse.json({ success: true });
      } catch (error) {
        return NextResponse.json({
          error: `can't update product's stock (WEBHOOK): ${error}`,
        });
      }
      break;
    default:
      console.warn(`Evento no soportado: ${event.type}`);
      return NextResponse.json({ error: "Event not supported" });
  }
}
