import { Stack, Text } from "@chakra-ui/react";

export default function MegaLoader() {
  return (
    <div className="flex-row mega-loader-container">
      <Stack
        direction="row"
        spacing={5}
        alignItems="center"
        color="linkedin.700"
      >
        <Text fontSize={25}>Loading</Text>
        <Text fontSize={25}>
          <i className="far fa-spinner-third fa-spin" />
        </Text>
      </Stack>
    </div>
  );
}
