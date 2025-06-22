import { StateCreator } from "zustand";

export interface DateSlice {
  eventDate: Date;

  eventYYYYMMDD: () => string;
  eventHHMM: () => string;
  setEventDate: (partialDate: string) => void;
  setEventTime: (partialTime: string) => void;
}

export const createDateSlice: StateCreator<DateSlice> = (set, get) => ({
  eventDate: new Date(),

  eventYYYYMMDD: () => {
    const date = get().eventDate;
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    return `${year}-${month}-${day}`;
  },
  eventHHMM: () => {
    const hours = get().eventDate.getHours().toString().padStart(2, "0");
    const minutes = get().eventDate.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  },
  setEventDate: (partialDate: string) =>
    set((state) => {
      const [year, month, day] = partialDate.split("-").map(Number);
      const newDate = new Date(state.eventDate);
      newDate.setFullYear(year, month - 1, day);

      return { eventDate: newDate };
    }),
  setEventTime: (partialTime: string) =>
    set((state) => {
      const hours = parseInt(partialTime.split(":")[0]);
      const minutes = parseInt(partialTime.split(":")[1]);
      const newDate = new Date(state.eventDate);
      newDate.setHours(hours, minutes);

      return { eventDate: newDate };
    }),
});
