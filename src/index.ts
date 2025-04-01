import { before } from "@vendetta/patcher";
import { findByName, findByProps } from "@vendetta/metro";

// New way to find the message action sheet in v250
const MessageActions = findByProps("openMessageActionSheet")?.openMessageActionSheet?.render;

export default {
  onLoad() {
    if (!MessageActions) {
      console.error("[Delete Top] Couldn't find message actions component!");
      return;
    }

    const unpatch = before("render", MessageActions, (_, component) => {
      try {
        const buttons = component?.props?.children?.props?.children;
        if (!Array.isArray(buttons)) return;

        const deleteIndex = buttons.findIndex(b => 
          b?.props?.action === "delete" ||
          b?.props?.id?.endsWith?.("delete")
        );

        if (deleteIndex > 0) {
          const [deleteBtn] = buttons.splice(deleteIndex, 1);
          buttons.unshift(deleteBtn);
        }
      } catch (e) {
        console.error("[Delete Top] Patch failed:", e);
      }
    });

    return () => unpatch?.();
  }
};
