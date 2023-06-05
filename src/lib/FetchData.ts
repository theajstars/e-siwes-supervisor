import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { Endpoints } from "./Endpoints";

interface FetchDataParams {
  type: "GET" | "POST";
  route: string;
  data?: any;
}
const token = Cookies.get("supervisor_token");

const FetchData = async ({ type, route, data }: FetchDataParams) => {
  const NoTokenRequiredRoutes: string[] = [
    Endpoints.RegisterSupervisor,
    Endpoints.LoginSupervisor,
    Endpoints.SendResetToken,
    Endpoints.VerifyResetToken,
    Endpoints.ForceUpdateSupervisorPassword,
  ];
  if (!token && !NoTokenRequiredRoutes.includes(route)) {
    return { auth: false };
  } else {
    const config: AxiosRequestConfig = {
      method: type,
      baseURL: "http://localhost:8080".concat(route),
      // baseURL: "https://timothy-siwes-api.onrender.com".concat(route),
      headers: { "x-access-token": token },
      data: type === "POST" ? data : "",
    };
    const response: any = await axios.request(config);
    return response;
  }
};

export { FetchData };
