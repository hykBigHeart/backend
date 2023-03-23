import { createSlice } from "@reduxjs/toolkit";

type SystemConfigStoreInterface = {
  systemApiUrl: string;
  systemPcUrl: string;
  systemH5Url: string;
  systemLogo: string;
  systemName: string;
};

let defaultValue: SystemConfigStoreInterface = {
  systemApiUrl: "",
  systemPcUrl: "",
  systemH5Url: "",
  systemLogo: "",
  systemName: "",
};

const systemConfigSlice = createSlice({
  name: "systemConfig",
  initialState: {
    value: defaultValue,
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
