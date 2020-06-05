export type Hero = {
  id: string;
  name: string;
  movies: string[];
};

type HeroMap = { [key: string]: Hero };

export const heroes: HeroMap = {
  indy: {
    id: "indy",
    name: "Indiana Jones",
    movies: ["Raiders of the Lost Ark", "Temple of Doom", "The Last Crusade"],
  },
};
