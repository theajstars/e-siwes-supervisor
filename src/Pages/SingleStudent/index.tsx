import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Input,
  Stack,
  StackDivider,
  Stat,
  StatLabel,
  Table,
  Button,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
} from "@chakra-ui/react";
import {
  DefaultResponse,
  SingleStudentResponse,
  SingleSupervisorResponse,
  Student,
  Supervisor,
} from "../../lib/ResponseTypes";
import { FetchData } from "../../lib/FetchData";
import { Endpoints } from "../../lib/Endpoints";

interface MessageProp {
  comment: string;
  student: string;
  supervisor: string;
  studentName: string;
  supervisorName: string;
  sender: "supervisor" | "student";
}
export default function SingleStudent() {
  const addToast = useToast();
  const params = useParams();
  const studentID = params.studentID;
  const [student, setStudent] = useState<Student>();
  const [studentSupervisor, setStudentSupervisor] = useState<
    Supervisor | undefined
  >();
  const [messages, setMessages] = useState<MessageProp[]>([]);
  const fetchStudent = async () => {
    const STUDENTREQUEST: SingleStudentResponse = await FetchData({
      route: Endpoints.GetSingleStudent.concat(studentID ?? ""),
      type: "GET",
    });
    console.log(STUDENTREQUEST);
    if (STUDENTREQUEST.data.auth) {
      setStudent(STUDENTREQUEST.data.data);
    } else {
      addToast({
        title: "Student not found!",
        status: "error",
      });
      //Check if student is assigned to supervisor
    }
  };
  useEffect(() => {
    fetchStudent();
  }, []);
  //Fetch student and supervisor messages
  const fetchComments = async (studentID: string) => {
    const r: DefaultResponse = await FetchData({
      route: Endpoints.GetStudentMessages,
      type: "POST",
      data: { studentID: studentID },
    });
    console.log(r.data);
    setMessages(r.data.data ?? []);
  };
  useEffect(() => {
    if (student?.id) {
      if (student?.supervisor.length > 0) {
        FetchData({
          type: "GET",
          route: Endpoints.GetSupervisorProfile,
        }).then((SUPERVISORRESPONSE: SingleSupervisorResponse) => {
          if (SUPERVISORRESPONSE.data.auth) {
            fetchComments(student.id);
            setStudentSupervisor(SUPERVISORRESPONSE.data.data);
          }
        });
      }
    }
  }, [student]);
  const isLengthPlusOne = (val: string) => {
    return val.length > 0;
  };

  const [message, setMessage] = useState<string>("");
  const SendMessage = async () => {
    if (message.length === 0) {
      addToast({ description: "Please enter a message", status: "error" });
    } else {
      const r: DefaultResponse = await FetchData({
        route: Endpoints.SendStudentMessage,
        type: "POST",
        data: {
          comment: message,
          studentID: studentID,
        },
      }).catch(() => {
        addToast({ description: "An error occured", status: "error" });
      });
      setMessage("");
      fetchComments(student ? student.id : "");
      console.log(r);
    }
  };
  return (
    <>
      <div>
        <br />
        <br />
        {student?.id && (
          <>
            <Card>
              <CardHeader>
                <Heading size="md">Student Profile</Heading>
              </CardHeader>

              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Name
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {student.firstName} {student.lastName}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Email
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {student.email}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Matric Number
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {student.matricNumber}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      College
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {student.college}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Course of Study
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {isLengthPlusOne(student.courseOfStudy) ? (
                        student.courseOfStudy
                      ) : (
                        <i>undefined</i>
                      )}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Current Level
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {isLengthPlusOne(student.level) ? (
                        student.level
                      ) : (
                        <i>undefined</i>
                      )}
                    </Text>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Payment Status
                    </Heading>
                    <Badge colorScheme={student.hasPaid ? "green" : "red"}>
                      {student.hasPaid ? "Paid" : "Unpaid"}
                    </Badge>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Phone
                    </Heading>
                    {student.phone.length > 0 ? (
                      <Text pt="2" fontSize="sm">
                        {student.phone}
                      </Text>
                    ) : (
                      <Text pt="2" fontSize="sm">
                        <i>Undefined</i>
                      </Text>
                    )}
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Supervisor
                    </Heading>
                    {studentSupervisor?.id ? (
                      <Text pt="2" fontSize="sm">
                        {studentSupervisor?.firstName}&nbsp;
                        {studentSupervisor?.lastName}
                      </Text>
                    ) : (
                      <Text pt="2" fontSize="sm" colorScheme={"red"}>
                        <i>Not Assigned to Supervisor</i>
                      </Text>
                    )}
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Bank Details
                    </Heading>
                    <br />
                    <TableContainer
                      border={"1px"}
                      borderRadius={20}
                      borderColor="#E2E8F0"
                    >
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Bank Name</Th>
                            <Th>Account Number</Th>
                            <Th>Sort Code</Th>
                            <Th>Master List Number</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td>
                              {isLengthPlusOne(student.bankAccount.name) ? (
                                student.bankAccount.name
                              ) : (
                                <i>undefined</i>
                              )}
                            </Td>
                            <Td>
                              {isLengthPlusOne(student.bankAccount.number) ? (
                                student.bankAccount.number
                              ) : (
                                <i>undefined</i>
                              )}
                            </Td>
                            <Td>
                              {isLengthPlusOne(student.bankAccount.sortCode) ? (
                                student.bankAccount.sortCode
                              ) : (
                                <i>undefined</i>
                              )}
                            </Td>
                            <Td>
                              {isLengthPlusOne(
                                student.bankAccount.masterListNumber
                              ) ? (
                                student.bankAccount.masterListNumber
                              ) : (
                                <i>undefined</i>
                              )}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Box>
                  <Box>
                    <Heading size="xs" textTransform="uppercase">
                      Internship Details
                    </Heading>
                    <br />
                    <TableContainer
                      border={"1px"}
                      borderRadius={20}
                      borderColor="#E2E8F0"
                    >
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>Company Name</Th>
                            <Th>Address</Th>
                            <Th>Attachment Period</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Td>
                              {isLengthPlusOne(student.company.name) ? (
                                student.company.name
                              ) : (
                                <i>undefined</i>
                              )}
                            </Td>
                            <Td>
                              {isLengthPlusOne(student.company.address) ? (
                                student.company.address
                              ) : (
                                <i>undefined</i>
                              )}
                            </Td>
                            <Td>
                              {isLengthPlusOne(student.attachmentPeriod) ? (
                                student.attachmentPeriod
                              ) : (
                                <i>undefined</i>
                              )}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
            <br />
            <Stack direction="column" width="100%">
              <br />
              <Divider width="100%" />
              <br />
              <Text fontSize={18} fontWeight="500">
                Messages
              </Text>
              {messages.length === 0 ? (
                <center>
                  <Alert status="info" width={"80%"} my="20px">
                    <AlertIcon />
                    <AlertTitle>No Messages!</AlertTitle>
                    <AlertDescription>
                      There are no messages found.
                    </AlertDescription>
                  </Alert>
                </center>
              ) : (
                <Card>
                  <CardBody>
                    <Stack divider={<StackDivider />} spacing="4">
                      {messages.map((message, index) => {
                        return (
                          <Box key={index}>
                            <Heading size="xs" textTransform="capitalize">
                              {message.sender === "student"
                                ? `${message.studentName}`
                                : `${message.supervisorName}`}
                            </Heading>
                            <Text pt="2" fontSize="sm">
                              {message.comment}
                            </Text>
                          </Box>
                        );
                      })}
                    </Stack>
                  </CardBody>
                </Card>
              )}
              <Stack direction="row" justifyContent="space-between">
                <Input
                  width={"80%"}
                  placeholder="Leave message..."
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                />
                <Button
                  colorScheme="linkedin"
                  width="17%"
                  onClick={SendMessage}
                >
                  Send
                </Button>
              </Stack>
            </Stack>
            <br />
          </>
        )}
      </div>
    </>
  );
}
