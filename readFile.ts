import { readFileStr } from "https://deno.land/std/fs/mod.ts";

const file = await readFileStr("./README.md", { encoding: "utf8" });
console.log(file);
