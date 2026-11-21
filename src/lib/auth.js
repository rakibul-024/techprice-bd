import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const isProduction = process.env.NODE_ENV === "production";
const isVercel = Boolean(
  process.env.VERCEL_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL === "1",
);
const mongoUrl =
  process.env.MONGODB_URL ||
  (isProduction ? "" : "mongodb://127.0.0.1:27017/tech-price-db");
const authSecret =
  process.env.BETTER_AUTH_SECRET ||
  (isProduction ? "" : "local-only-secret-change-before-deploy-0123456789");

if (!mongoUrl) {
  throw new Error("Production deployment requires MONGODB_URL.");
}

if (!authSecret) {
  throw new Error("Production deployment requires BETTER_AUTH_SECRET.");
}

const mongoClient = new MongoClient(mongoUrl);
const database = mongoClient.db(process.env.MONGODB_DATABASE || "tech-price-db");
const socialProviders = {};

function getHost(value, protocol) {
  if (!value) return null;

  try {
    const url = new URL(value.includes("://") ? value : `${protocol}://${value}`);
    return url.host;
  } catch {
    return null;
  }
}

const configuredAuthUrl = process.env.BETTER_AUTH_URL?.trim();
const configuredAuthHost = getHost(configuredAuthUrl, isVercel ? "https" : "http");
const configuredAuthHostname = configuredAuthHost
  ? new URL(`http://${configuredAuthHost}`).hostname
  : null;
const configuredHostIsLocal = ["localhost", "127.0.0.1", "::1"].includes(
  configuredAuthHostname,
);
const productionHost =
  getHost(process.env.VERCEL_PROJECT_PRODUCTION_URL, "https") ||
  "techprice-bd.vercel.app";
const allowedHosts = isVercel
  ? [
      "techprice-bd.vercel.app",
      productionHost,
      getHost(process.env.VERCEL_URL, "https"),
      configuredHostIsLocal ? null : configuredAuthHost,
    ].filter(Boolean)
  : ["localhost:*", "127.0.0.1:*", configuredAuthHost].filter(Boolean);

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  baseURL: {
    allowedHosts,
    protocol: isVercel ? "https" : "http",
    fallback: isVercel
      ? `https://${productionHost}`
      : configuredAuthUrl || "http://localhost:3000",
  },
  secret: authSecret,
  database: mongodbAdapter(database, { client: mongoClient, transaction: false }),
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: false,
    },
  },
  onAPIError: {
    errorURL: "/auth/error",
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders,
});
