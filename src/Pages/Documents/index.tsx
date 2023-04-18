import { Stack, Card, CardBody, Text, Button, Heading } from "@chakra-ui/react";
import ScafForm from "../../Assets/Documents/scaf_form.pdf";
import Form8 from "../../Assets/Documents/scaf_form.pdf";
export default function Documents() {
  console.log(ScafForm);

  const downloadDoc = (doc: "scaf" | "form8") => {
    const a = document.createElement("a");
    a.href = doc === "scaf" ? ScafForm : Form8;
    a.click();
  };
  return (
    <>
      <br />
      <br />
      <Stack direction="row" spacing={10}>
        <Card
          direction={{ base: "column", sm: "row" }}
          overflow="hidden"
          variant="outline"
        >
          <Stack>
            <CardBody>
              <Stack direction="column" spacing={5}>
                <Heading size="md">Form 8</Heading>
                <Text>
                  Form 8 is a lorem ipsum sit dolor amet Form 8 is a lorem ipsum
                  sit dolor amet Form 8 is a lorem ipsum sit dolor amet
                </Text>
                <Button
                  variant="solid"
                  colorScheme="blue"
                  width={200}
                  onClick={() => downloadDoc("scaf")}
                >
                  Download Now
                </Button>
              </Stack>
            </CardBody>
          </Stack>
        </Card>
        <Card
          direction={{ base: "column", sm: "row" }}
          overflow="hidden"
          variant="outline"
        >
          <Stack>
            <CardBody>
              <Stack direction="column" spacing={5}>
                <Heading size="md">SCAF Form</Heading>

                <Text>
                  Form 8 is a lorem ipsum sit dolor amet Form 8 is a lorem ipsum
                  sit dolor amet Form 8 is a lorem ipsum sit dolor amet
                </Text>
                <Button variant="solid" colorScheme="blue" width={200}>
                  Download Now
                </Button>
              </Stack>
            </CardBody>
          </Stack>
        </Card>
      </Stack>
    </>
  );
}
