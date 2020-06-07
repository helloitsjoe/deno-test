import { makeApp } from "./oak-app.ts";
import {
  assert,
  assertEquals,
  assertMatch,
  assertThrowsAsync,
} from "https://deno.land/std/testing/asserts.ts";
import { superoak } from "https://deno.land/x/superoak/mod.ts";

const { test } = Deno;

test("Get heroes", async () => {
  const request = await superoak(makeApp());
  await request.get("/heroes").expect((res) => {
    assertEquals(res.body.indy.name, "Indiana Jones");
    assertEquals(res.body.indy.movies.length, 3);
  });
});

test("Add hero", async () => {
  const request = await superoak(makeApp());
  await request.post("/hero").send({ name: "test" }).expect((res) => {
    assertEquals(res.body.name, "test");
    assert(res.body.id, "should have id");
  });
});

test("Update hero", async () => {
  const request = await superoak(makeApp());
  await request.put("/hero/indy").send({ name: "Bindiana Bones" }).expect(
    (res) => {
      assertEquals(res.body.name, "Bindiana Bones");
      assertEquals(res.body.movies.length, 3);
    },
  );
});

test("Delete hero", async () => {
  const request = await superoak(makeApp());
  await request.delete("/hero/indy").expect((res) => {
    assertMatch(res.body.message, /Hero indy removed/i);
  });
});

test("POST requires data", async () => {
  const request = await superoak(makeApp());
  // await request.delete("/hero/indy").end((err, res) => {
  //   assertMatch(err, /400: No data/i);
  // });
  await assertThrowsAsync(
    async () => {
      await request.post("/hero").send({});
    },
    Error,
    // This isn't the correct message, I think supertest is getting in the way
    "Bad Request",
  );
});
