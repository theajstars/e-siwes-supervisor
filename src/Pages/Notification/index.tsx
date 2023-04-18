import { useState } from "react";

import {
  Button,
  Input,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { FetchData } from "../../lib/FetchData";
import { Endpoints } from "../../lib/Endpoints";
import { DefaultResponse } from "../../lib/ResponseTypes";

export default function Notification() {
  const addToast = useToast();
  const [notificationTitle, setNotificationTitle] = useState<string>("");
  const [notificationBody, setNotificationBody] = useState<string>("");

  const [isNotificationSending, setNotificationSending] =
    useState<boolean>(false);

  const sendNotification = async () => {
    if (notificationTitle.length !== 0 || notificationBody.length !== 0) {
      const sendData: DefaultResponse = await FetchData({
        type: "POST",
        route: Endpoints.SendStudentNotification,
        data: { title: notificationTitle, body: notificationBody },
      });
      if (sendData.data.auth) {
        addToast({
          title: "Notification sent!",
          status: "success",
        });
        setNotificationTitle("");
        setNotificationBody("");
      } else {
        addToast({
          title: "Notification could not be sent",
          status: "error",
          description: "Please try again",
        });
      }
    } else {
      addToast({
        title: "Please provide both title and body",
      });
    }
  };
  return (
    <>
      <br />
      <br />
      <Stack spacing={10}>
        <Text fontSize={18} fontWeight="bold">
          Send Notification to Students
        </Text>
        <Input
          placeholder="Title"
          onChange={(e) => setNotificationTitle(e.target.value)}
          value={notificationTitle}
          spellCheck={false}
        />
        <Textarea
          placeholder="Body"
          onChange={(e) => setNotificationBody(e.target.value)}
          value={notificationBody}
          spellCheck={false}
        />
        <Button colorScheme={"linkedin"} onClick={sendNotification}>
          Send Notification&nbsp;
          {isNotificationSending && (
            <i className="far fa-spinner-third fa-spin" />
          )}
        </Button>
      </Stack>
    </>
  );
}
