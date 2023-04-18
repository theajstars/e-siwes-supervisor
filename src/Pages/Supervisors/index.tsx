import { useState, useEffect } from "react";

import { Routes, Route, useNavigate } from "react-router-dom";
import { Endpoints } from "../../lib/Endpoints";
import { FetchData } from "../../lib/FetchData";
import {
  SingleSupervisorResponse,
  SingleStudentResponse,
  Student,
  StudentResponse,
  Supervisor,
  SupervisorResponse,
  DefaultResponse,
} from "../../lib/ResponseTypes";

import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Td,
  Tbody,
  Th,
  Text,
  Button,
  Stack,
  Checkbox,
  InputGroup,
  InputLeftAddon,
  Input,
  StackDivider,
  CardBody,
  Heading,
  Box,
  Card,
  useToast,
} from "@chakra-ui/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { CSVLink } from "react-csv";

export default function Supervisors() {
  const navigate = useNavigate();
  const addToast = useToast();
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [isSupervisorsFetching, setSupervisorsFetching] =
    useState<boolean>(false);

  const ExportHeaders = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
  ];
  const [exportData, setExportData] = useState<any[]>([]);

  const fetchSupervisors = async () => {
    setSupervisorsFetching(true);
    const supervisorsData: SupervisorResponse = await FetchData({
      type: "GET",
      route: Endpoints.GetSupervisorProfiles,
    });

    setSupervisorsFetching(false);
    console.log(supervisorsData);
    if (supervisorsData.data.auth) {
      setSupervisors(supervisorsData.data.data);
      const exportDatum = supervisorsData.data.data.map((singleSupervisor) => {
        let obj = {
          firstName: singleSupervisor.firstName,
          lastName: singleSupervisor.lastName,
          email: singleSupervisor.email,
          phone: singleSupervisor.phone,
        };
        // setExportData((prevData) => [...prevData, obj]);
        return obj;
      });
      console.log("Data to Export: ", exportDatum);
      setExportData(exportDatum);
    }
  };

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const [supervisorKey, setSupervisorKey] = useState<string>("");

  const [isSupervisorKeyGenerating, setSupervisorKeyGenerating] =
    useState<boolean>(false);

  const generateSupervisorKey = async () => {
    setSupervisorKeyGenerating(true);
    const SUPERVISORKEYGENERATE: DefaultResponse = await FetchData({
      type: "GET",
      route: Endpoints.GenerateSupervisorKey,
    });
    setSupervisorKeyGenerating(false);
    if (SUPERVISORKEYGENERATE.data.auth) {
      setSupervisorKey(SUPERVISORKEYGENERATE.data.data);
    } else {
      addToast({
        description: "Could not generate key",
        status: "error",
      });
    }
  };

  return (
    <>
      <br />
      <br />
      <Stack direction={"row"} spacing={5}>
        <Button
          colorScheme={"linkedin"}
          onClick={generateSupervisorKey}
          width={"230px"}
        >
          Generate Supervisor Key &nbsp;{" "}
          {isSupervisorKeyGenerating && (
            <i className="far fa-spinner-third fa-spin" />
          )}
        </Button>
      </Stack>
      {supervisorKey.length > 0 && (
        <Card width={"230px"} marginTop={2}>
          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Key
                </Heading>
                <Stack direction={"row"} alignItems="center">
                  <Text pt="2" fontSize="sm" letterSpacing={1.2}>
                    {supervisorKey.toUpperCase()}
                  </Text>
                  <CopyToClipboard
                    onCopy={() =>
                      addToast({
                        description: "Copied!",
                        status: "success",
                      })
                    }
                    text={supervisorKey.toUpperCase()}
                  >
                    <Text
                      pt="2"
                      fontSize={"18px"}
                      color={"blue.900"}
                      cursor="pointer"
                    >
                      <i className="far fa-clipboard" />
                    </Text>
                  </CopyToClipboard>
                </Stack>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      )}
      <br />
      <br />
      <Stack direction={"row"} spacing={5}>
        <Button
          colorScheme={"linkedin"}
          width={200}
          height={35}
          disabled={isSupervisorsFetching}
          onClick={fetchSupervisors}
        >
          Refresh &nbsp;
          {isSupervisorsFetching && (
            <i className="far fa-spinner-third fa-spin" />
          )}
        </Button>
        <CSVLink
          data={exportData}
          headers={ExportHeaders}
          filename="Supervisors"
        >
          <Button colorScheme={"whatsapp"} width={200} height={35}>
            Export to CSV &nbsp;<i className="far fa-cloud-download-alt"></i>
          </Button>
        </CSVLink>
      </Stack>

      <br />
      <br />
      {isSupervisorsFetching && (
        <center>
          <Text fontSize={"20px"}>
            Loading &nbsp;
            <i className="far fa-spinner-third fa-spin" />
          </Text>
        </center>
      )}
      {supervisors.length > 0 && !isSupervisorsFetching ? (
        <TableContainer border={"1px"} borderRadius={20} borderColor="#E2E8F0">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>S/N</Th>
                <Th>First Name</Th>
                <Th>Last Name</Th>
                <Th>Email</Th>

                <Th>More Details</Th>
              </Tr>
            </Thead>
            <Tbody>
              {supervisors.map((supervisor, index) => {
                return (
                  <Tr key={supervisor.id}>
                    <Td color={"blue.500"}>{index}</Td>
                    <Td>{supervisor.firstName}</Td>
                    <Td>{supervisor.lastName}</Td>
                    <Td>{supervisor.email}</Td>
                    <Td>
                      <Button
                        onClick={() => {
                          navigate(`/home/supervisors/${supervisor.id}`);
                        }}
                        colorScheme={"linkedin"}
                        height={9}
                        fontSize={15}
                      >
                        View Details
                      </Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
          <center>
            <br />
            <Button
              type="submit"
              colorScheme="linkedin"
              width={"300px"}
              height={35}
            >
              View All
            </Button>
            <br />
            <br />
          </center>
        </TableContainer>
      ) : (
        <center>
          {!isSupervisorsFetching && (
            <Text fontSize="xl">There are currently no supervisors!</Text>
          )}
        </center>
      )}
    </>
  );
}
