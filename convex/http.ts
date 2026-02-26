import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request);
  if (!event) {
    return new Response("Error occured", {
      status: 400,
    });
  }
  switch (event.type) {
    case "user.created": {
      const existingUser = await ctx.runQuery(internal.users.getUser, {
        subject: event.data.id,
      });

      if (existingUser) throw new Error("User is already exists, use update");
      console.log("-----> WEBHOOK <------ Creating new user ", event.data.id);

      await ctx.runMutation(internal.users.createUserWithWebhookClerk, {
        clerkUser: event.data,
      });
      break;
    }
    case "user.updated": {
      const existingUser = await ctx.runQuery(internal.users.getUser, {
        subject: event.data.id,
      });
      if (!existingUser) {
        throw new Error("User is already exists in convex");
      }
      console.log(
        "updating user",
        event.data.id,
        ", asigned role: ",
        event.data.public_metadata?.role,
      );
      await ctx.runMutation(internal.users.updateRolWithWebhookClerk, {
        clerkId: event.data.id,
        role: event.data.public_metadata?.role as "admin" | "user",
      });
      break;
    }
    case "user.deleted": {
      // Clerk docs say this is required, but the types say optional?
      const id = event.data.id!;
      await ctx.runMutation(internal.users.deleteUserWithWebhookClerk, { id });
      break;
    }
    default: {
      console.log("ignored Clerk webhook event", event.type);
    }
  }
  return new Response(null, {
    status: 200,
  });
});

const http = httpRouter();
http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});

async function validateRequest(
  req: Request,
): Promise<WebhookEvent | undefined> {
  const payloadString = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;
  try {
    evt = wh.verify(payloadString, svixHeaders) as Event;
  } catch (err) {
    console.log(`error verifying:: ${err}`);
    return;
  }

  return evt as unknown as WebhookEvent;
}

export default http;
