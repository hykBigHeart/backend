import { createSlice } from "@reduxjs/toolkit";

type SystemConfigStoreInterface = {
  "ldap-enabled"?: boolean;
  systemApiUrl?: string;
  systemPcUrl?: string;
  systemH5Url?: string;
  systemLogo?: string;
  systemName?: string;
  memberDefaultAvatar?: string;
  courseDefaultThumbs?: string[];
};

const systemConfigSlice = createSlice({
  name: "systemConfig",
  initialState: {
    value: {},
  },
  reducers: {
    saveConfigAction(stage, e) {
      stage.value = e.payload;
    },
  },
});

export default systemConfigSlice.reducer;
export const { saveConfigAction } = systemConfigSlice.actions;

export type { SystemConfigStoreInterface };
