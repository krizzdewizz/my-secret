import { decrypt, encrypt } from "./encrypt";

describe("encrypt", () => {
  const testData = [
    ["pw", "secret"],
    ["a", "a"]
  ];

  describe("should succeed", () => {
    it("should not have the same result when calling again", () => {
      const res1 = encrypt("a", "a");
      const res2 = encrypt("a", "a");
      expect(res1.value).not.toBe(res2.value);
    });

    testData.forEach(([pw, secret]) => {
      it(`should encrypt '${secret}'`, () => {
        const res = encrypt(pw, secret);
        expect(res.outcome).toBe("ok");
        expect(res.value!.length > 10).toBe(true);
        expect(res.value).not.toEqual(secret);
      });
    });
  });

  describe("should decrypt", () => {
    testData.forEach(([pw, secret]) => {
      it(`should decrypt '${secret}'`, () => {
        const res = encrypt(pw, secret);
        expect(decrypt(pw, res.value).value).toBe(secret);
      });
    });
  });

  describe("should fail", () => {
    const testData = [
      [null, undefined],
      [undefined, null],
      ["pw", ""],
      ["", "a"]
    ];

    testData.forEach(([pw, secret]) => {
      it(`'should fail with pw: '${pw}, secret: ${secret}'`, () => {
        const enc = encrypt(pw!, secret!);
        expect(enc.outcome).toBe("error");
        expect(() => enc.value).toThrow();
      });
    });
  });
});
