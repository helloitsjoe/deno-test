import { makeApp, App } from "./oak-app.ts";
import { doFetch } from "./test-helpers.ts";
import {
  assert,
  assertEquals,
  assertMatch,
  assertThrowsAsync,
} from "https://deno.land/std/testing/asserts.ts";

const { test } = Deno;

test("Basic test", () => {
  assertMatch("Hello there", /Hello/);
});

test({
  name: "Basic test, object form",
  fn() {
    assertEquals(1 + 1, 2);
  },
});

const setup = () => {
  const app = makeApp({ port: 1234, shouldLogUrl: false });
  app.open();
  return app;
};

const tearDown = (app: App) => app.close();

test("Get heroes", async () => {
  const app = setup();

  const data = await doFetch("/heroes");

  assertEquals(data.indy.name, "Indiana Jones");
  assertEquals(data.indy.movies.length, 3);

  await tearDown(app);
});

test("Add hero", async () => {
  const app = setup();

  const data = await doFetch("/hero", { name: "test" });

  assertEquals(data.name, "test");
  assert(data.id, "should have id");

  await tearDown(app);
});

test("Update hero", async () => {
  const app = setup();

  try {
    const data = await doFetch(
      "/hero/indy",
      { name: "Bindiana Bones" },
      "PUT",
    );

    assertEquals(data.name, "Bindiana Bones");
    assertEquals(data.movies.length, 3);
  } finally {
    await tearDown(app);
  }
});

test("Delete hero", async () => {
  const app = setup();

  try {
    const data = await doFetch(
      "/hero/indy",
      { name: "Bindiana Bones" },
      "DELETE",
    );

    assertEquals(data.name, "Bindiana Bones");
    assertEquals(data.movies.length, 3);
  } finally {
    await tearDown(app);
  }
});

test("POST requires data", async () => {
  const app = setup();

  await assertThrowsAsync(
    async () => {
      const data = await doFetch("/hero", {}, "POST");
    },
    Error,
    "400: No data",
  );

  await tearDown(app);
});
