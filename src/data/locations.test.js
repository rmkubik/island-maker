import { objects } from "./locations";

beforeAll(() => {});

describe("location objects", () => {
  const objectEntries = Object.entries(objects);

  objectEntries
    .filter(([, object]) => object.isInJournal)
    .forEach(([objectKey, object]) => {
      it(`${objectKey} should have name and description if in journal`, () => {
        expect(object).toHaveProperty("name");
        expect(object).toHaveProperty("desc");
      });
    });

  describe("plant", () => {
    it("should return valid cards onPlace", () => {});
  });
});
