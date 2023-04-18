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
  const [students, setStudents] = useState<Student[]>();

  const [allStudents, setAllStudents] = useState<Student[]>();

  const [isStudentsFetching, setStudentsFetching] = useState<boolean>(false);

  const [studentToAssign, setStudentToAssign] = useState<string>("");
  const [isStudentAssigning, setStudentAssigning] = useState<boolean>(false);
  const [currentStudentSupervisor, setCurrentStudentSupervisor] =
    useState<Supervisor>();
  const [isConfirmReassign, setConfirmReassign] = useState<boolean>(false);

  const initialFocusRef = useRef<HTMLButtonElement>(null);
  const fetchSupervisor = async () => {
    const SUPERVISOR: SingleSupervisorResponse = await FetchData({
      type: "GET",
      route: Endpoints.GetSingleSupervisor.concat(params.supervisorID || ""),
    });
    if (SUPERVISOR.data.auth) {
      setSupervisor(SUPERVISOR.data.data);
    }
  };
  const fetchAllStudents = async () => {
    const STUDENTS: StudentResponse = await FetchData({
      type: "GET",
      route: Endpoints.GetStudents,
    });
    if (STUDENTS.data.auth) {
      setAllStudents(STUDENTS.data.data);
    }
  };
  const fetchSupervisorStudents = async () => {
    const SUPERVISORSTUDENTS: StudentResponse = await FetchData({
      route: Endpoints.GetSupervisorStudents,
      type: "POST",
      data: { supervisorID: params.supervisorID },
    });
    if (SUPERVISORSTUDENTS.data.auth) {
      setStudents(SUPERVISORSTUDENTS.data.data);
    }
  };
  useEffect(() => {
    // Query supervisor from DB
    fetchSupervisor().then(() => {
      fetchSupervisorStudents();
      fetchAllStudents();
    });
  }, []);

  const AssignStudent = async (forceAssign: boolean) => {
    if (studentToAssign === "") {
      addToast({
        title: "Please select a student!",
      });
    } else {
      const SuperAssign = () => {
        setStudentAssigning(true);
        FetchData({
          type: "POST",
          data: {
            supervisorID: params.supervisorID,
            studentID: studentToAssign,
          },
          route: Endpoints.AssignStudentToSupervisor,
        }).then((assign: DefaultResponse) => {
          setStudentToAssign("");
          setConfirmReassign(false);
          setStudentAssigning(false);
          if (assign.data.auth) {
            addToast({
              title: "Success!",
              description: "Student assigned to supervisor",
              status: "success",
            });
            fetchAllStudents();
            fetchSupervisor();
            fetchSupervisorStudents();
          }
        });
      };
      if (!forceAssign) {
        // Check if student is already assigned

        const isStudentAlreadyAssigned = allStudents?.filter(
          (stud) =>
            stud.id === studentToAssign &&
            stud.supervisor.length > 0 &&
            stud.supervisor !== params.supervisorID
        );

        if (isStudentAlreadyAssigned && isStudentAlreadyAssigned?.length > 0) {
          console.log(isStudentAlreadyAssigned);
          setConfirmReassign(true);
          FetchData({
            type: "GET",
            route: Endpoints.GetSingleSupervisor.concat(
              isStudentAlreadyAssigned[0].supervisor
            ),
          }).then((supervisorResponse: SingleSupervisorResponse) => {
            if (supervisorResponse.data.auth) {
              setCurrentStudentSupervisor(supervisorResponse.data.data);
            }
          });
        } else {
          SuperAssign();
        }
      } else {
        SuperAssign();
      }
    }
  };
  const UnassignStudent = async (studentID: string) => {
    const unassign: DefaultResponse = await FetchData({
      type: "POST",
      data: { supervisorID: params.supervisorID, studentID },
      route: Endpoints.UnassignStudentToSupervisor,
    });

    if (unassign.data.auth) {
      addToast({
        title: "Success!",
        description: "Student removed from supervisor",
        status: "success",
      });
      fetchAllStudents();
      fetchSupervisor();
      fetchSupervisorStudents();
    }
  };
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
              <Select
                variant="filled"
                placeholder="Assign student..."
                value={studentToAssign}
                onChange={(e) => {
                  setStudentToAssign(e.target.value);
                }}
              >
                {allStudents
                  ?.filter((s) => s.supervisor !== params.supervisorID)
                  .map((student, index) => {
                    return (
                      <option value={student.id}>
                        {student.firstName} {student.lastName}
                      </option>
                    );
                  })}
              </Select>
              <Popover
                initialFocusRef={initialFocusRef}
                placement="bottom"
                closeOnBlur={false}
                isOpen={isConfirmReassign}
              >
                <PopoverTrigger>
                  <Button
                    colorScheme={"linkedin"}
                    height={9}
                    marginTop={3}
                    marginBottom={3}
                    onClick={() => AssignStudent(false)}
                    disabled={isStudentAssigning}
                  >
                    {!isStudentAssigning ? (
                      <Text>Assign New Student</Text>
                    ) : (
                      <Text>
                        Loading &nbsp;{" "}
                        <i className="far fa-spinner-third fa-spin" />
                      </Text>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  color="white"
                  bg="blue.800"
                  borderColor="blue.800"
                >
                  <PopoverHeader pt={4} fontWeight="bold" border="0">
                    Student Already Assigned
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverCloseButton
                    onClick={() => setConfirmReassign(false)}
                  />
                  <PopoverBody>
                    This student has already been assigned to:{" "}
                    {currentStudentSupervisor?.firstName}{" "}
                    {currentStudentSupervisor?.lastName}
                  </PopoverBody>
                  <PopoverFooter
                    border="0"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    pb={4}
                  >
                    <ButtonGroup size="sm">
                      <Button
                        colorScheme="green"
                        onClick={() => AssignStudent(true)}
                      >
                        Assign Anyway
                      </Button>
                      <Button
                        colorScheme="red"
                        ref={initialFocusRef}
                        onClick={() => setConfirmReassign(false)}
                      >
                        Cancel
                      </Button>
                    </ButtonGroup>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
            </Stat>

            <Divider />
            <br />
            {students && students?.length > 0 ? (
              <TableContainer
                border={"1px"}
                borderRadius={20}
                borderColor="#E2E8F0"
              >
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Matric Number</Th>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Phone Number</Th>
                      <Th>Payment Status</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {students.map((student, index) => {
                      return (
                        <Tr>
                          <Td>{student.matricNumber}</Td>
                          <Td>
                            {student.firstName} {student.lastName}
                          </Td>
                          <Td>{student.email}</Td>
                          <Td>{student.phone}</Td>
                          <Td color={student.hasPaid ? "blue.600" : "red.500"}>
                            {student.hasPaid ? "Paid" : "Not Paid"}
                          </Td>
                          <Td>
                            <Button
                              colorScheme={"teal"}
                              onClick={() => UnassignStudent(student.id)}
                            >
                              Unassign
                            </Button>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <center>
                {!isStudentsFetching && (
                  <Text fontSize="xl">No students assigned!</Text>
                )}
              </center>
            )}
          </>
        )}
      </div>
    </>
  );
}
