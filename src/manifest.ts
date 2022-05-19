import packageJson from "../package.json";
import type { ManifestType } from "@src/manifest-type";

const manifest: ManifestType = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
  background: { service_worker: "src/background/index.js", type: "module" },
  action: {
    default_popup: "src/popup/index.html",
    default_icon: "icon-34.png",
  },
  icons: {
  },
  web_accessible_resources: [
    {
      resources: [],
      matches: [],
    },
  ],
  permissions: [
    "activeTab",
    "tabs",
    "storage",
    "contextMenus",
    "notifications",
    "bookmarks",
  ]
};

export default manifest;
