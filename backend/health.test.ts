import { expect, test, describe } from "bun:test";

describe("Backend Unit Tests", () => {
  test("Environment configuration exists", () => {
    expect(process.env.DATABASE_URL).toBeDefined();
    expect(process.env.GROQ_API_KEY).toBeDefined();
  });

  test("Database client initializes", async () => {
    const { prisma } = await import("./db");
    expect(prisma).toBeDefined();
  });

  test("Middleware is exportable", async () => {
    const { middleware } = await import("./middleware");
    expect(typeof middleware).toBe("function");
  });
});
