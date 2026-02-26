import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: "https://delicate-skink-80.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
