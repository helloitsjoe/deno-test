import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import {
  getIndex,
  getHero,
  getHeroes,
  addHero,
  updateHero,
  deleteHero,
} from "./oak-services.ts";

const port = 3000;

const router = new Router();

router.get("/", getIndex)
  .post("/hero", addHero)
  .get("/heroes", getHeroes)
  .get("/hero/:id", getHero)
  .put("/hero/:id", updateHero)
  .delete("/hero/:id", deleteHero);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
  const protocol = secure ? "https://" : "http://";
  console.log(`Listening on ${protocol}${hostname ?? "localhost"}:${port}`);
});

await app.listen({ port });
