export interface User {
  id?: number;
  name: string;
  email: string;
  age:number;
  className: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  name: string;
  email: string;
  age: number;
  className: string;
}