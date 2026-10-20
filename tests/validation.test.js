import { test, describe } from "node:test";
import assert from "node:assert";
import bcrypt from "bcryptjs";
import { hashToken, generateSessionToken } from "../server/middleware/auth.js";

describe("Security & Validation Suite", () => {
  test("Password hashing and verification with bcrypt", async () => {
    const rawPassword = "SuperSecretPassword#2026!";
    const hash = await bcrypt.hash(rawPassword, 10);

    assert.notStrictEqual(hash, rawPassword);
    const isValid = await bcrypt.compare(rawPassword, hash);
    assert.strictEqual(isValid, true);

    const isWrong = await bcrypt.compare("WrongPassword", hash);
    assert.strictEqual(isWrong, false);
  });

  test("Session token generation and SHA-256 hashing", () => {
    const token = generateSessionToken();
    assert.strictEqual(typeof token, "string");
    assert.strictEqual(token.length, 64); // 32 bytes hex = 64 characters

    const hash1 = hashToken(token);
    const hash2 = hashToken(token);
    assert.strictEqual(hash1, hash2);
    assert.strictEqual(hash1.length, 64);
  });

  test("Input sanitization and email validation", () => {
    const validEmails = ["dev@example.com", "john.doe+test@gmail.com", "user@sub.domain.org"];
    const invalidEmails = ["not-an-email", "@missing.com", "user@", "spaces in@email.com"];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const email of validEmails) {
      assert.strictEqual(emailRegex.test(email), true, `Expected valid: ${email}`);
    }

    for (const email of invalidEmails) {
      assert.strictEqual(emailRegex.test(email), false, `Expected invalid: ${email}`);
    }
  });
});
