import { RouterMiddleware } from "https://deno.land/x/oak/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { heroes } from "./data.ts";

export const getIndex: RouterMiddleware = ({ response }) => {
  response.body = "Hi there!";
};

export const getHeroes: RouterMiddleware = ({ response }) => {
  response.body = heroes;
};

export const getHero: RouterMiddleware = ({ params, response }) => {
  const { id } = params;
  if (id == null) {
    response.status = 400;
    response.body = { message: "id is required" };
    return;
  }
  response.body = heroes[id];
};

export const addHero: RouterMiddleware = async ({ request, response }) => {
  const body = await request.body();
  const newData = body.value;

  if (!newData) {
    response.status = 400;
    response.body = { message: "No data" };
    return;
  }

  const id = v4.generate();
  const newHero = { ...newData, id };
  heroes[id] = newHero;
  response.body = heroes[id];
};

export const updateHero: RouterMiddleware = async (
  { params: { id }, request, response },
) => {
  if (id == null) {
    response.status = 400;
    response.body = { message: "id is required" };
    return;
  }

  const { value: newHeroData } = await request.body();

  if (!newHeroData) {
    response.status = 400;
    response.body = { message: "No data" };
    return;
  }

  const oldHero = heroes[id];
  heroes[id] = { ...oldHero, ...newHeroData };
  response.body = heroes[id];
};

export const deleteHero: RouterMiddleware = ({ params: {id}, response }) => {
  if (id == null) {
    response.status = 400;
    response.body = { message: "id is required" };
    return;
  }
  delete heroes[id];
  response.body = { message: `Hero ${id} removed` };
};
