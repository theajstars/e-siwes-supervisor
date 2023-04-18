import {
  AxiosResponse,
  RawAxiosResponseHeaders,
  AxiosResponseHeaders,
  InternalAxiosRequestConfig,
} from "axios";

export type CourseProgrammes =
  | "computer_science"
  | "cyber_security"
  | "software_engineering"
  | "information_technology";

// export enum CourseProgrammes {
//   ComputerScience = "computer_science",
//   CyberSecurity = "cyber_security",
//   SoftwareEngineering = "software_engineering",
//   InformationTechnology = "information_technology",
// }

export type CourseProgrammesSelect = React.ChangeEvent<HTMLSelectElement> & {
  target: {
    value: CourseProgrammes;
  };
};
export interface DefaultResponse<T = any, D = any> {
  data: {
    auth: boolean;
    message: string;
    data: any;
  };
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: InternalAxiosRequestConfig<D>;
  request?: any;
}
export interface LoginResponse extends Omit<DefaultResponse, "data"> {
  data: {
    auth: boolean;
    data: string;
    message?: string;
  };
}

export interface ValidateStudentAuthResponse
  extends Omit<DefaultResponse, "data"> {
  data: {
    auth: boolean;
    message?: string;
  };
}

export interface Student {
  _id: string;

  __v: any;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  matricNumber: string;
  supervisor: string;
  bankAccount: {
    name: string;
    number: string;
    sortCode: string;
    masterListNumber: string;
  };
  yearOfStudy: string;
  level: string;
  courseOfStudy: CourseProgrammes;
  attachmentPeriod: string;
  company: {
    name: string;
    address: string;
  };
  isProfileComplete: boolean;
  hasPaid: boolean;
}

export interface Admin {
  email: string;
  id: string;
  password: string;
  _id: string;
  message?: string;
}

export interface StudentResponse extends Omit<DefaultResponse, "data"> {
  data: {
    auth: boolean;
    data: Student[] | [];
    message?: string;
  };
}
export type SupervisorTitle = "Mr" | "Dr" | "Professor" | "Ms" | "Mrs";

export interface Supervisor {
  email: string;
  title: SupervisorTitle;
  firstName: string;
  id: string;
  isProfileComplete: boolean;
  lastName: string;
  password: string;
  phone: string;
  students:
    | [
        {
          studentID: string;
        }
      ]
    | [];
}

export interface SupervisorResponse extends Omit<DefaultResponse, "data"> {
  data: {
    auth: boolean;
    data: Supervisor[] | [];
    message?: string;
  };
}

export interface SingleSupervisorResponse
  extends Omit<DefaultResponse, "data"> {
  data: {
    auth: boolean;
    data?: Supervisor;
    message: string;
  };
}
export interface SingleStudentResponse extends Omit<DefaultResponse, "data"> {
  data: {
    auth: boolean;
    data?: Student;
    message: string;
  };
}
export interface AdminResponse extends Omit<DefaultResponse, "data"> {
  data: {
    auth: boolean;
    data: Admin;
  };
}
export interface ValidatePasswordResponse
  extends Omit<DefaultResponse, "data"> {
  data: {
    auth: boolean;
    message?: string;
  };
}

export interface Receipt {
  id: string;
  studentID: string;
  date: number;
  amount: number;
  paid: boolean;
}

export interface ReceiptsResponse extends Omit<DefaultResponse, "data"> {
  data: {
    auth: boolean;
    data: Receipt[] | [];
    message?: string;
  };
}
