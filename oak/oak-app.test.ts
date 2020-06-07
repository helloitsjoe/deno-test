import { makeApp, makeListener, Listener } from "./oak-app.ts";
import { doFetch } from "./test-helpers.ts";
import {
  assert,
  assertEquals,
  assertMatch,
  assertThrowsAsync,
} from "https://deno.land/std/testing/asserts.ts";

const { test } = Deno;

const testMovies = ["a", "b", "c"];

test("Basic test", () => {
  assertMatch("Hello there", /Hello/);
});

test({
  name: "Basic test, object form",
  fn() {
    assertEquals(1 + 1, 2);
  },
});

// TODO: Make data isolated to each test
let testId = "";

const setup = () => {
  const server = makeListener(
    { app: makeApp(), port: 1234, shouldLogUrl: false },
  );
  server.open();
  return server;
};

const tearDown = (server: Listener) => server.close();

test("Get heroes", async () => {
  const server = setup();

  const data = await doFetch("/heroes");

  assertEquals(data.indy.name, "Indiana Jones");
  assertEquals(data.indy.movies.length, 3);

  await tearDown(server);
});

test("Add hero", async () => {
  const server = setup();

  const data = await doFetch("/hero", { name: "test", movies: testMovies });

  assertEquals(data.name, "test");
  assert(data.id, "should have id");

  testId = data.id;

  await tearDown(server);
});

test("Update hero", async () => {
  const server = setup();

  const data = await doFetch(
    `/hero/${testId}`,
    { name: "Test update" },
    "PUT",
  );

  assertEquals(data.name, "Test update");
  assertEquals(data.movies, testMovies);

  await tearDown(server);
});

test("Delete hero", async () => {
  const server = setup();

  try {
    const data = await doFetch(
      `/hero/${testId}`,
      { name: "hi" },
      "DELETE",
    );

    assertMatch(data.message, /Hero .+ removed/i);
  } finally {
    await tearDown(server);
  }
});

test("POST requires data", async () => {
  const server = setup();

  await assertThrowsAsync(
    async () => {
      await doFetch("/hero", {}, "POST");
    },
    Error,
    "400: No data",
  );

  await tearDown(server);
});
