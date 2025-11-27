// userModel.ts
import { getDB } from "./db";

export interface IUser {
  id?: number;
  name: string;
  age: number;
  className: string;
  email?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/* CREATE TABLE */
export const createUserTable = async () => {
  const db = await getDB();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      age INTEGER,
      className TEXT,
      email TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );
  `);
};

/* INSERT USER */
export const saveUser = async (user: IUser) => {
  const db = await getDB();

  const timestamp = new Date().toISOString();

  const { rowsAffected } = await db.executeAsync(
    `INSERT INTO users (name, age, className, email, createdAt, updatedAt) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      user.name,
      user.age,
      user.className,
      user.email ?? null,
      timestamp,
      timestamp,
    ]
  );

  console.log(`Inserted ${rowsAffected} row(s)`);
};

/* GET FIRST USER */
export const getUser = async (): Promise<IUser | null> => {
  const db = await getDB();
  const { rows } = await db.execute("SELECT * FROM users LIMIT 1");

  if (rows.length === 0) return null;
  return rows._array[0];
};

export const dropUsersTable = async () => {
  const db = await getDB();
  await db.execute("DROP TABLE IF EXISTS users");
};


export const deleteUser=async()=>{
  const db = await getDB();
  await db.execute("DELETE FROM users");
}