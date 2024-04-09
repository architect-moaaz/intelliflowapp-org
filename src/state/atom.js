import { atom } from "recoil";

export const appList = atom({
  key: "appList",
  default: [],
});

export const sidebarDataState = atom({
  key: "sidebarData",
  default: [],
});

export const openFilesState = atom({
  key: "openFiles",
  default: [],
});

export const dynamicCssState = atom({
  key: "dynamicCss",
  default: {},
});
export const selectedCssState = atom({
  key: "selectedDynamicCss",
  default: "Light",
});

export const formbuilderErrorsState = atom({
  key: "formbuilderErrors",
  default: { forms: {}, workflow: {}, businessModel: {}, dataModel: {} },
});

export const dataCount = atom({
  key: "dataCount",
  default: "",
});

export const activeTabNameState = atom({
  key: "activeTabName",
  default: "",
});

export const loggedInUserState = atom({
  key: "loggedInUser",
  default: {},
});

export const autoSave = atom({
  key: "isSaving",
  default: false,
});

// export const formProperties = atom({
//   key: "formProperties",
//   default: {},
// });

export const formPropertiesHomePage = atom({
  key: "formProperties",
  default: {},
});

// export const formBackgroundColor = atom({
//   key: "backcompactPicker",
//   default: "rgba(0,0,0,1)"
// })

// export const formFontStyle = atom({
//   key: "selectedFontFamily",
//   default: "lato"
// })

export const configAtom = atom({
  key: "configAtom",
  default: null,
});

export const autoSaveFeatureAtom = atom({
  key: "autoSaveFeatureAtom",
  default: false,
});

export const isSavingEnabledState = atom({
  key: "isSavingEnabledState",
  default: false,
});

export const getMessagesInstanceState = atom({
  key: "getMessagesInstanceState",
  default: "",
});
