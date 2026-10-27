import { TrayIcon } from "@tauri-apps/api/tray";
import { defaultWindowIcon } from "@tauri-apps/api/app";
import { getCurrentWindow } from "@tauri-apps/api/window";

const TRAY_ID = "handoff";

// Get the tray if it already exists, otherwise create it.
export async function getTray() {
  const existing = await TrayIcon.getById(TRAY_ID);
  if (existing) return existing;

  return TrayIcon.new({
    id: TRAY_ID,
    icon: (await defaultWindowIcon()) ?? undefined,
    title: "0",
    tooltip: "Handoff",
    action: async (event) => {
      if (
        event.type !== "Click" ||
        event.button !== "Left" ||
        event.buttonState !== "Up"
      )
        return;
      const win = getCurrentWindow();
      if (await win.isVisible()) {
        await win.hide();
      } else {
        await win.show();
        await win.setFocus();
      }
    },
  });
}

export async function setCount(count: number) {
  const tray = await getTray();
  await tray.setTitle(String(count));
  await tray.setTooltip(`Handoff: ${count} waiting`);
}
