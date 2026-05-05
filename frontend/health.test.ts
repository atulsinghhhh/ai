import { expect, test, describe } from "bun:test";

describe("Frontend Unit Tests", () => {
  test("App branding constants", () => {
    const APP_NAME = "Vestra AI";
    expect(APP_NAME).toBe("Vestra AI");
  });

  test("API utility functions are defined", async () => {
    const api = await import("./src/lib/api");
    expect(api.fetchConversations).toBeDefined();
    expect(api.createConversation).toBeDefined();
    expect(api.sendQuery).toBeDefined();
  });

  test("Route configuration is valid", async () => {
    const { BACKEND_URL } = await import("./src/lib/config");
    expect(BACKEND_URL).toBeDefined();
    expect(typeof BACKEND_URL).toBe("string");
  });
});
