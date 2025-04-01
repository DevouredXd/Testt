import { React } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";

const { FormRow, FormSwitch } = Forms;

export default () => {
  const [enabled, setEnabled] = React.useState(true);

  return (
    <FormRow
      label="Enable Delete on Top"
      trailing={
        <FormSwitch 
          value={enabled} 
          onValueChange={setEnabled}
        />
      }
    />
  );
};
