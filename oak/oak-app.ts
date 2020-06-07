import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import {
  getIndex,
  getHero,
  getHeroes,
  addHero,
  updateHero,
  deleteHero,
} from "./oak-services.ts";

export interface Listener {
  open: () => Promise<void>;
  close: () => Promise<void>;
}

const PORT = 3000;

const router = new Router();

router.get("/", getIndex)
  .post("/hero", addHero)
  .get("/heroes", getHeroes)
  .get("/hero/:id", getHero)
  .put("/hero/:id", updateHero)
  .delete("/hero/:id", deleteHero);

export const makeApp = () => {
  const app = new Application();
  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
};

interface ListenerArgs {
  app?: Application;
  port?: number;
  shouldLogUrl?: boolean;
}

export const makeListener = (
  { app = makeApp(), port = PORT, shouldLogUrl = true }: ListenerArgs = {},
): Listener => {
  if (shouldLogUrl) {
    app.addEventListener("listen", ({ hostname, port, secure }) => {
      const protocol = secure ? "https://" : "http://";
      console.log(`Listening on ${protocol}${hostname ?? "localhost"}:${port}`);
    });
  }

  // Helper for closing server
  const controller = new AbortController();
  const { signal } = controller;

  const listenPromise = app.listen({ port, signal });

  const open = () => listenPromise;
  const close = () => {
    controller.abort();
    return listenPromise;
  };

  return { open, close };
};
