import Button3D from "@/components/3D-button";
import BackupButton from "@/components/backup-button";
import ButtonBlack from "@/components/chunky-button";
import ShinyButton from "@/components/Hover-2-seats";
import ArrowButtonExample from "./examples/arrow-button-example";
import GooeyButton from "@/components/goey-button";
import SingleKey from "@/components/mech-key";
import ToggleSwitch from "@/components/toggle-switch";

export const customRegistry = {
  "3d-button": {
    component: Button3D,
    name: "3D Button",
  },
  "arrow-button": {
    component: ArrowButtonExample,
    name: "Arrow Button",
  },
  "backup-button": {
    component: BackupButton,
    name: "Backup Button",
  },
  "chonky-button": {
    component: ButtonBlack,
    name: "Chonky Button",
  },
  "shiny-tooltip-button": {
    component: ShinyButton,
    name: "Shiny Tooltip Button",
  },
  "goey-button": {
    component: GooeyButton,
    name: "Gooey Button",
  },
  "mech-key": {
    component: SingleKey,
    name: "Mechanical Key",
  },
  "toggle-switch": {
    component: ToggleSwitch,
    name: "Toggle Switch",
  },
} as const;


