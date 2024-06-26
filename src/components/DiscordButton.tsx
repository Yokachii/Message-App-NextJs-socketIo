import { Button, ButtonProps } from "@mantine/core";
import { DiscordIcon } from "@mantinex/dev-icons";

const DiscordButton = (props: ButtonProps & React.ComponentPropsWithoutRef<"button">) => {
  return (
    <Button
      leftSection={<DiscordIcon style={{ width: "1rem", height: "1rem" }} color="#00ACEE" />}
      variant="default"
      {...props}
    />
  );
};

export default DiscordButton;
