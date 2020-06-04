import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

const port = 3000;

type Context = {
  response: { body: any };
};

app.addEventListener("listen", ({ hostname, port, secure }) => {
  const protocol = secure ? "https://" : "http://";
  console.log(`Listening on ${protocol}${hostname ?? "localhost"}:${port}`);
});

app.use(({ response }: Context) => {
  response.body = "Hi there!";
});

await app.listen({ port });
console.log(`Listening on http://localhost:${port}`);
