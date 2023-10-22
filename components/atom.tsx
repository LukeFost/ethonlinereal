import { atom } from "recoil";

export const dataNode = atom({
  key: "dataNode",
  default: [],
});

type ArrayOfArrays = Array<Array<any>>; // Replace 'any' with the actual expected type inside the arrays

export const stemDataNode = atom<ArrayOfArrays>({
  key: "stemDataNode",
  default: [], // This initializes it as an empty array, but it's intended to hold other arrays
});

export const letConnections = atom({
  key: "letConnections",
  default: [],
});
