import { before } from "@vendetta/patcher";
import { findByName } from "@vendetta/metro";

const MessageActions = findByName("MessageActions");

export default {
  onLoad() {
    const unpatch = before("default", MessageActions, (args) => {
      const buttons = args[0]?.children;
      if (!Array.isArray(buttons)) return;

      const deleteIndex = buttons.findIndex(b => b?.props?.action === "delete");
      if (deleteIndex > 0) {
        const [deleteBtn] = buttons.splice(deleteIndex, 1);
        buttons.unshift(deleteBtn);
      }
    });

    return () => unpatch();
  }
};
