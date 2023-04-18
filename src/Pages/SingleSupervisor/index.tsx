import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Stack,
  StackDivider,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";

import { useNavigate, useParams } from "react-router-dom";
import {
  DefaultResponse,
  SingleSupervisorResponse,
  Student,
  StudentResponse,
  Supervisor,
  SupervisorResponse,
} from "../../lib/ResponseTypes";
import { FetchData } from "../../lib/FetchData";
import { Endpoints } from "../../lib/Endpoints";

export default function SingleSupervisor() {
  const params = useParams();
  const navigate = useNavigate();
  const addToast = useToast();
  const [supervisor, setSupervisor] = useState<Supervisor>();

  const fetchSupervisor = async () => {
    const SUPERVISOR: SingleSupervisorResponse = await FetchData({
      type: "GET",
      route: Endpoints.GetSupervisorProfile,
    });
    if (SUPERVISOR.data.auth) {
      setSupervisor(SUPERVISOR.data.data);
    }
  };

  useEffect(() => {
    // Query supervisor from DB
    fetchSupervisor().then(() => {});
  }, []);

  return (
    <>
      <div>
        <br />
        <br />
        {supervisor?.id && (
          <>
            <Card>
              <CardHeader>
                <Heading size="md">Supervisor Profile</Heading>
              </CardHeader>

              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Name
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {supervisor.firstName} {supervisor.lastName}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Email
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {supervisor.email}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Phone
                    </Heading>
                    {supervisor.phone.length > 0 ? (
                      <Text pt="2" fontSize="sm">
                        {supervisor.phone}
                      </Text>
                    ) : (
                      <Text pt="2" fontSize="sm">
                        <i>Undefined</i>
                      </Text>
                    )}
                  </Box>
                </Stack>
              </CardBody>
            </Card>
            <br />
            <Stat>
              <StatLabel fontSize={20}>Students</StatLabel>
              <Stack direction={"row"} alignItems="center">
                <StatNumber>{supervisor.students.length}</StatNumber>
                <StatHelpText>
                  <StatArrow
                    type="increase"
                    rotate={supervisor.students.length === 0 ? "90deg" : ""}
                    transform="auto"
                    color={
                      supervisor.students.length === 0
                        ? "black.400"
                        : "green.400"
                    }
                  />
                </StatHelpText>
              </Stack>
            </Stat>

            <Divider />
            <br />
          </>
        )}
      </div>
    </>
  );
}
