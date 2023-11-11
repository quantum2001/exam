export interface IRegisterSchoolReq {
    name: string;
    address: string;
    password: string;
    email: string;
}
export interface ILoginSchoolReq {
    password: string;
    email: string;
}
export interface ICreateStudentReq {
    firstname: string;
    lastname: string;
    middlename?: string;
    class_id: string;
}
