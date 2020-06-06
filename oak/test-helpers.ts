import {
  assert,
  assertEquals,
  assertMatch,
} from "https://deno.land/std/testing/asserts.ts";

const { test } = Deno;

export const doFetch = async (
  endpoint: string,
  body?: object,
  method?: string,
) => {
  const res = await fetch(
    `http://localhost:1234${endpoint}`,
    {
      method: !body ? "GET" : method || "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(`${res.status}: ${message}`);
  }

  return res.json();
};

// TODO: Tests
// test("GET", () => {

// });
