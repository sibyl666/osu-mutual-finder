import { defineStore } from "pinia";
import { Check, Gamemode } from "../types";
import { clampNumber } from "../utils";

interface Limit {
  countryCode: string;
  start: number; // page start
  end: number; // page end
  index: number; // start index (only for start page)
}

const toggleSetting = <T>(array: T[], item: T) => {
  if (!array.includes(item)) {
    array.push(item);
    return;
  }

  let index = array.findIndex(x => x == item);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

export const clampLimit = (limit: Limit) => {
  limit.start = clampNumber(limit.start, 1, 200);
  limit.end = clampNumber(limit.end, 1, 200);
  limit.index = clampNumber(limit.index, 0, 50);
};

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    friends: [] as number[],
    blacklistIds: [] as number[],
    countries: [] as string[],
    limits: [] as Limit[],
    addFriend: false,
    addBlacklist: false,
    gamemode: Gamemode.osu,
    check: Check.Country,
    uploaded: false
  }),
  actions: {
    toggleAddFriend() {
      this.addFriend = !this.addFriend;
    },
    toggleAddBlacklist() {
      this.addBlacklist = !this.addBlacklist;
    },
    toggleBlacklistId(userId: number) {
      toggleSetting(this.blacklistIds, userId);
    },
    toggleCountry(countryCode: string) {
      toggleSetting(this.countries, countryCode)
    },
    addLimit(newLimit: Limit) {
      clampLimit(newLimit);
      this.limits.push(newLimit);
    },
    removeLimit(limitCode: string) {
      let index = this.limits.findIndex(x => x.countryCode == limitCode);
      if (index !== -1) {
        this.limits.splice(index, 1);
      }
    },
    updateLimit(newLimit: Limit) {
      clampLimit(newLimit);

      let index = this.limits.findIndex(x => x.countryCode == newLimit.countryCode);
      if (index !== -1) {
        this.limits.splice(index, 1, newLimit);        
      } else {
        this.addLimit(newLimit);
      }
    }
  },
  getters: {
    getLimit: (state) => {
      return (code: string) => state.limits.find(limit => limit.countryCode == code)
    }
  },
  persist: true
});
