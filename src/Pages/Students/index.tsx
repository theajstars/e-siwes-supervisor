import { useState, useEffect } from "react";

import { Routes, Route, useNavigate, Link } from "react-router-dom";
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
import { getCourseName } from "../../App";

export default function Students() {
  const addToast = useToast();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [temporaryStudents, setTemporaryStudents] = useState<Student[] | []>(
    []
  );
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);

  const [viewBankDetails, setViewBankDetails] = useState<boolean>(false);
  const [viewInternshipDetails, setViewInternshipDetails] =
    useState<boolean>(false);
  const [IsStudentLoading, setIsStudentLoading] = useState<boolean>(false);
  const [IsDataFetching, setIsDataFetching] = useState<boolean>(false);

  const [searchString, setSearchString] = useState<string>("");

  const [supervisorToken, setSupervisorToken] = useState<string>("");
  const [isSupervisorTokenGenerating, setSupervisorTokenGenerating] =
    useState<boolean>(false);

  const DataHeaders = [
    { key: "MatricNumber", label: "Matric Number" },
    { key: "FirstName", label: "First Name" },
    { key: "LastName", label: "Last Name" },
    { key: "Email", label: "Email" },
    { key: "Phone", label: "Phone" },
    { key: "PaymentStatus", label: "Payment Status" },
    { key: "courseOfStudy", label: "Course of Study" },
    { key: "Supervisor", label: "Supervisor" },
    { key: "AttatchmentPeriod", label: "Attatchment Period" },
    { key: "BankName", label: "Bank Name" },
    { key: "BankNumber", label: "Bank Number" },
    { key: "SortCode", label: "Sort Code" },
    { key: "MasterListNumber", label: "Master List Number" },
    { key: "CompanyName", label: "Company Name" },
    { key: "CompanyAddress", label: "Company Address" },
  ];
  const [exportData, setExportData] = useState<any[]>([]);

  const getStudents = () => {
    setIsDataFetching(true);
    FetchData({
      type: "GET",
      route: Endpoints.GetSupervisorStudents,
    })
      .then((response: StudentResponse) => {
        console.log(response);
        setIsDataFetching(false);
        if (response.data.auth) {
          console.log(response.data.data);
          setStudents(response.data.data);
          const exportDatum = response.data.data.map((singleStudentObject) => {
            let obj = {
              AttatchmentPeriod: singleStudentObject.attachmentPeriod,
              BankName: singleStudentObject.bankAccount.name,
              BankNumber: singleStudentObject.bankAccount.number,
              SortCode: singleStudentObject.bankAccount.sortCode,
              MasterListNumber:
                singleStudentObject.bankAccount.masterListNumber,
              CompanyName: singleStudentObject.company.name,
              CompanyAddress: singleStudentObject.company.address,
              courseOfStudy: singleStudentObject.courseOfStudy,
              Email: singleStudentObject.email,
              FirstName: singleStudentObject.firstName,
              PaymentStatus: singleStudentObject.hasPaid ? "Paid" : "Not Paid",
              LastName: singleStudentObject.lastName,
              MatricNumber: singleStudentObject.matricNumber,
              Phone: singleStudentObject.phone,
              Supervisor: getSupervisor(singleStudentObject.supervisor),
            };
            // setExportData((prevData) => [...prevData, obj]);
            return obj;
          });
          console.log("Data to Export: ", exportDatum);
          setExportData(exportDatum);
          setTemporaryStudents(response.data.data);
        }
      })
      .catch(() => {
        setIsDataFetching(false);
      });
  };
  const getSupervisors = () => {
    FetchData({
      type: "GET",
      route: Endpoints.GetSupervisorProfiles,
    }).then((response: SupervisorResponse) => {
      if (response.data.auth) {
        setSupervisors(response.data.data);
      }
    });
  };

  const getSingleStudent = () => {
    FetchData({
      type: "GET",
      route: Endpoints.GetSingleStudent,
    }).then((response: SingleStudentResponse) => {});
  };
  useEffect(() => {
    // Get All Students
    getStudents();
    getSupervisors();
  }, []);
  useEffect(() => {
    let str = searchString;
    str = str.trim();
    str = str.toLowerCase();
    if (str.length > 0) {
      // Perform student filter
      const foundStudents = temporaryStudents.filter((student) => {
        const { firstName, lastName, courseOfStudy, matricNumber } = student;
        const name = firstName.concat(" ").concat(lastName).toLowerCase();
        if (name.indexOf(str) !== -1) {
          return true;
        } else if (courseOfStudy) {
          if (courseOfStudy.toLowerCase().indexOf(str) !== -1) {
            return true;
          }
        } else if (matricNumber.indexOf(str) !== -1) {
          return true;
        }
      });
      setStudents(foundStudents);
    } else {
      setStudents(temporaryStudents);
    }
  }, [searchString]);
  const getSupervisor = (supervisorID: string) => {
    const isSupervisorFound = supervisors.filter(
      (supervisor) => supervisor.id === supervisorID
    );
    if (isSupervisorFound.length > 0) {
      return isSupervisorFound[0].firstName
        .concat(" ")
        .concat(isSupervisorFound[0].lastName);
    } else {
      return null;
    }
  };

  return (
    <>
      <br />
      <br />

      <StackDivider />

      <br />
      <Stack spacing={5} direction="row">
        <Checkbox
          colorScheme="linkedin"
          checked={viewBankDetails}
          onChange={(e) => {
            setViewBankDetails(e.target.checked);
          }}
        >
          Bank Details
        </Checkbox>
        <Checkbox
          colorScheme="linkedin"
          checked={viewInternshipDetails}
          onChange={(e) => {
            setViewInternshipDetails(e.target.checked);
          }}
        >
          Internship Details
        </Checkbox>
      </Stack>
      <br />
      <Stack direction={"row"} spacing={5}>
        <Button
          colorScheme={"linkedin"}
          width={200}
          height={35}
          disabled={IsDataFetching}
          onClick={getStudents}
        >
          Refresh &nbsp;
          {IsDataFetching && <i className="far fa-spinner-third fa-spin" />}
        </Button>
        {/* <CSVLink data={exportData} headers={DataHeaders}> */}
        <Button colorScheme={"whatsapp"} width={200} height={35}>
          <CSVLink data={exportData} headers={DataHeaders} filename="Students ">
            Export to CSV &nbsp;<i className="far fa-cloud-download-alt"></i>
          </CSVLink>
        </Button>
        {/* </CSVLink> */}
      </Stack>
      <br />
      <br />
      {IsStudentLoading && (
        <center>
          <Text fontSize={"20px"}>
            Loading &nbsp;
            <i className="far fa-spinner-third fa-spin" />
          </Text>
        </center>
      )}

      {students.length > 0 && !IsStudentLoading ? (
        <>
          <TableContainer
            border={"1px"}
            borderRadius={20}
            borderColor="#E2E8F0"
          >
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Matric Number</Th>
                  <Th>First Name</Th>
                  <Th>Last Name</Th>
                  <Th>Email</Th>
                  <Th>Phone Number</Th>
                  <Th>Payment Status</Th>

                  {viewBankDetails && (
                    <>
                      <Th>Bank Name</Th>
                      <Th>Account Number</Th>
                      <Th>Sort Code</Th>
                      <Th>Master List Number</Th>
                    </>
                  )}
                  <Th>Level</Th>
                  <Th>Course</Th>
                  {viewInternshipDetails && (
                    <>
                      <Th>Internship Duration</Th>
                      <Th>Company Name</Th>
                      <Th>Address</Th>
                    </>
                  )}
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {students.map((student, index) => {
                  const supervisor = getSupervisor(student.supervisor);

                  return (
                    <Tr key={student.id}>
                      <Td color={"blue.500"}>{student.matricNumber}</Td>
                      <Td>{student.firstName}</Td>
                      <Td>{student.lastName}</Td>
                      <Td>{student.email}</Td>
                      <Td>{student.phone}</Td>

                      <Td color={student.hasPaid ? "blue.600" : "red.500"}>
                        {student.hasPaid ? "Paid" : "Not Paid"}
                      </Td>

                      {viewBankDetails && (
                        <>
                          <Td>{student.bankAccount.name}</Td>
                          <Td>{student.bankAccount.number}</Td>
                          <Td>{student.bankAccount.sortCode}</Td>
                          <Td>{student.bankAccount.masterListNumber}</Td>
                        </>
                      )}

                      <Td>{student.yearOfStudy}</Td>
                      <Td>{getCourseName(student.courseOfStudy)}</Td>
                      {viewInternshipDetails && (
                        <>
                          <Td>{student.attachmentPeriod}</Td>
                          <Td>{student.company.name}</Td>
                          <Td>{student.company.address}</Td>
                        </>
                      )}
                      <Td>
                        <Button
                          onClick={() => {
                            navigate(`/home/students/${student.id}`);
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
        </>
      ) : (
        <center>
          {!IsStudentLoading && (
            <Text fontSize="xl">You have no students!</Text>
          )}
        </center>
      )}
    </>
  );
}
