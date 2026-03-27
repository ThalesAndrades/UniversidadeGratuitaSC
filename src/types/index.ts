export interface PassportData {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  phone: string;
  university: string;
  course: string;
  photo: string;
}

export interface University {
  id: string;
  name: string;
  courses: string[];
}
