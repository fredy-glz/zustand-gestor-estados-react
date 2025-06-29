import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { firebaseStorage } from "../storages/firebase.storage";
import { logger } from "../middlewares/logger.middleware";
import { useWeddingBoundStore } from "../wedding";
// import { customSessionStorage } from "../storages/session-storage.storage";

interface PersonState {
  firstName: string;
  lastName: string;
}

interface Actions {
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
}

const storeAPI: StateCreator<
  PersonState & Actions,
  [["zustand/devtools", never]]
> = (set) => ({
  firstName: "",
  lastName: "",

  setFirstName: (value: string) =>
    set({ firstName: value }, false, "setFirstName"),
  setLastName: (value: string) =>
    set({ lastName: value }, false, "setLastName"),
});

export const usePersonStore = create<PersonState & Actions>()(
  // devtools(
  //   persist(storeAPI, {
  //     name: "person-storage",
  //     // storage: customSessionStorage,
  //     storage: firebaseStorage,
  //   })
  // )
  logger(
    persist(devtools(storeAPI), {
      name: "person-storage",
      // storage: customSessionStorage,
      // storage: firebaseStorage,
    })
  )
);

usePersonStore.subscribe((nextState) => {
  const { firstName, lastName } = nextState;
  const wed = useWeddingBoundStore.getState();

  if (wed.firstName !== firstName) wed.setFirstName(firstName);
  if (wed.lastName !== lastName) wed.setLastName(lastName);
});
