import {
  Button,
  useToast,
  Card,
  CardBody,
  Image,
  Stack,
  Text,
  Box,
  Divider,
  Badge,
  CardFooter,
  Heading,
  StackDivider,
  CardHeader,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { PaystackConsumer } from "react-paystack";
import { getFullDate, getPayStackConfig } from "../../App";
import { Endpoints } from "../../lib/Endpoints";
import { FetchData } from "../../lib/FetchData";
import {
  DefaultResponse,
  Receipt,
  ReceiptsResponse,
  SingleStudentResponse,
  Student,
} from "../../lib/ResponseTypes";
import MegaLoader from "../MegaLoader";

export default function Payments() {
  const addToast = useToast();
  const [student, setStudent] = useState<Student>();
  const [receipts, setStudentReceipts] = useState<Receipt[]>([]);

  const getStudentProfile = async () => {
    const fetchStudent: SingleStudentResponse = await FetchData({
      route: Endpoints.GetSingleStudent.concat("currentIsStudent"),
      type: "GET",
    }).catch(() =>
      addToast({
        description: "An error occured",
        status: "warning",
      })
    );
    if (fetchStudent.data.auth) {
      setStudent(fetchStudent.data.data);
    }
  };
  const getStudentReceipts = async () => {
    const fetchStudentReceipts: ReceiptsResponse = await FetchData({
      route: Endpoints.GetStudentReceipts,
      type: "GET",
    }).catch(() =>
      addToast({
        description: "An error occured",
        status: "warning",
      })
    );
    console.log("Receipts: ", fetchStudentReceipts);
    if (fetchStudentReceipts.data.auth) {
      setStudentReceipts(fetchStudentReceipts.data.data);
    }
  };

  useEffect(() => {
    getStudentProfile();
    getStudentReceipts();
  }, []);
  const config = getPayStackConfig({
    email: student?.email ?? "",
    amount: 1000,
  });

  const handlePaymentSuccess = () => {
    addToast({ description: "Payment Successful!", status: "success" });
    FetchData({
      route: Endpoints.ConfirmStudentPayment,
      type: "POST",
      data: { studentID: student?.id ?? "" },
    }).then((res: DefaultResponse) => {
      if (res.data.auth) {
        addToast({ description: "Payment Confirmed", status: "success" });
        getStudentReceipts();
      } else {
        addToast({
          description: "An error occured! Please contact Admin",
          status: "error",
        });
      }
    });
  };
  const handlePaymentClose = () => {
    addToast({ description: "Payment failed!", status: "error" });
  };

  return (
    <>
      <br />
      {student?.id ? (
        <>
          {receipts.length > 0 ? (
            <>
              <br />
              {receipts.map((receipt) => {
                return (
                  <Card>
                    <CardHeader>
                      <Heading size="md">Payment Receipt</Heading>
                    </CardHeader>

                    <CardBody>
                      <Stack divider={<StackDivider />} spacing="4">
                        <Box>
                          <Heading size="xs" textTransform="uppercase">
                            Reference
                          </Heading>
                          <Text pt="2" fontSize="sm">
                            {receipt.id}
                          </Text>
                        </Box>
                        <Box>
                          <Heading size="xs" textTransform="uppercase">
                            Date
                          </Heading>
                          <Text pt="2" fontSize="sm">
                            {getFullDate(receipt.date)}
                          </Text>
                        </Box>
                        <Box>
                          <Heading size="xs" textTransform="uppercase">
                            Amount
                          </Heading>
                          <Text pt="2" fontSize="sm" color="blue.500">
                            ₦ {receipt.amount.toLocaleString()}
                          </Text>
                        </Box>
                        <Box>
                          <Heading
                            size="xs"
                            textTransform="uppercase"
                            marginBottom={2}
                          >
                            Paid
                          </Heading>

                          {receipt.paid ? (
                            <Badge colorScheme="green">PAID</Badge>
                          ) : (
                            <Badge colorScheme="red">UNPAID</Badge>
                          )}
                        </Box>
                      </Stack>
                    </CardBody>
                  </Card>
                );
              })}
            </>
          ) : (
            <Stack alignItems="center" justifyContent="center">
              <br />
              <br />
              <Card maxW="sm">
                <CardBody>
                  <Stack spacing="3">
                    <Heading size="md" textAlign="center">
                      No Payment Found
                    </Heading>
                    <Text>
                      You have not made payment yet. Please click the button
                      below to make a one-time payment
                    </Text>
                    <center>
                      <Text color="blue.600" fontSize="2xl">
                        ₦ {(2000).toLocaleString()}
                      </Text>
                    </center>
                  </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                  <PaystackConsumer
                    {...config}
                    onSuccess={handlePaymentSuccess}
                    onClose={handlePaymentClose}
                  >
                    {({ initializePayment }) => (
                      <Button
                        colorScheme="linkedin"
                        onClick={() => initializePayment()}
                        width="100%"
                      >
                        Pay Now
                      </Button>
                    )}
                  </PaystackConsumer>
                </CardFooter>
              </Card>
            </Stack>
          )}
        </>
      ) : (
        <MegaLoader />
      )}
    </>
  );
}
