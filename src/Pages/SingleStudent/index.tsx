import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
  Stat,
  StatLabel,
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
import {
  SingleStudentResponse,
  SingleSupervisorResponse,
  Student,
  Supervisor,
} from "../../lib/ResponseTypes";
import { FetchData } from "../../lib/FetchData";
import { Endpoints } from "../../lib/Endpoints";

export default function SingleStudent() {
  const addToast = useToast();
  const params = useParams();
  const studentID = params.studentID;
  const [student, setStudent] = useState<Student>();
  const [studentSupervisor, setStudentSupervisor] = useState<
    Supervisor | undefined
  >();

  const fetchStudent = async () => {
    const STUDENTREQUEST: SingleStudentResponse = await FetchData({
      route: Endpoints.GetSingleStudent.concat(studentID || ""),
      type: "GET",
    });
    console.log(STUDENTREQUEST.data.data);
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
  useEffect(() => {
    if (student?.id) {
      if (student?.supervisor.length > 0) {
        FetchData({
          type: "GET",
          route: Endpoints.GetSingleSupervisor.concat(student.supervisor),
        }).then((SUPERVISORRESPONSE: SingleSupervisorResponse) => {
          if (SUPERVISORRESPONSE.data.auth) {
            setStudentSupervisor(SUPERVISORRESPONSE.data.data);
          }
        });
      }
    }
  }, [student]);
  const isLengthPlusOne = (val: string) => {
    return val.length > 0;
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
                      Year of Study
                    </Heading>
                    <Text pt="2" fontSize="sm">
                      {isLengthPlusOne(student.yearOfStudy) ? (
                        student.yearOfStudy
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

            <br />
          </>
        )}
      </div>
    </>
  );
}
