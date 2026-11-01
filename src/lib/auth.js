import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const isProduction = process.env.NODE_ENV === "production";
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
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: authSecret,
  database: mongodbAdapter(database, { client: mongoClient, transaction: false }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders,
});
