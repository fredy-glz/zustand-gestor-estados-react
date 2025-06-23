import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { createPersonSlice, PersonSlice } from "./person.slice";
import { createGuestSlice, GuestSlice } from "./guest.slice";
import { createDateSlice, DateSlice } from "./date.slice";
import {
  ConfirmationSlice,
  createConfirmationSlice,
} from "./confirmation.slice";
import { usePersonStore } from "../person/person.store";

type ShareState = PersonSlice & GuestSlice & DateSlice & ConfirmationSlice;

export const useWeddingBoundStore = create<ShareState>()(
  devtools((...a) => ({
    ...createPersonSlice(...a),
    ...createGuestSlice(...a),
    ...createDateSlice(...a),
    ...createConfirmationSlice(...a),
  }))
);

useWeddingBoundStore.subscribe((nextState) => {
  const { firstName, lastName } = nextState;
  const per = usePersonStore.getState();

  if (per.firstName !== firstName) per.setFirstName(firstName);
  if (per.lastName !== lastName) per.setLastName(lastName);
});
