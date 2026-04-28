import { ProverbSchema } from "../app/_models/proverb";

describe("Proverb Schema", () => {
  it("should validate a correct proverb object", () => {
    const validProverb = {
      ref: "Proverbs 3:5",
      proverb: "Trust in the LORD with all your heart",
    };

    const result = ProverbSchema.safeParse(validProverb);
    expect(result.success).toBe(true);
  });

  it("should reject a proverb missing ref", () => {
    const invalidProverb = {
      proverb: "Trust in the LORD with all your heart",
    };

    const result = ProverbSchema.safeParse(invalidProverb);
    expect(result.success).toBe(false);
  });

  it("should reject a proverb missing proverb text", () => {
    const invalidProverb = {
      ref: "Proverbs 3:5",
    };

    const result = ProverbSchema.safeParse(invalidProverb);
    expect(result.success).toBe(false);
  });

  it("should reject an object with extra fields", () => {
    const proverbWithExtra = {
      ref: "Proverbs 3:5",
      proverb: "Trust in the LORD with all your heart",
      extra: "This should not be allowed",
    };

    const result = ProverbSchema.safeParse(proverbWithExtra);
    expect(result.success).toBe(true);
  });

  it("should infer the correct type", () => {
    const validProverb = {
      ref: "Proverbs 3:5",
      proverb: "Trust in the LORD with all your heart",
    };

    const parsed = ProverbSchema.parse(validProverb);
    const inferred: { ref: string; proverb: string } = parsed;
    expect(inferred.ref).toBe(validProverb.ref);
    expect(inferred.proverb).toBe(validProverb.proverb);
  });
});
