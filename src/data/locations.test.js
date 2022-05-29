import { objects } from "./locations";

test("hello world", () => {
  expect(objects).toHaveProperty("witchHut");
});
