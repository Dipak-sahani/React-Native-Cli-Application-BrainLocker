import { open } from "react-native-nitro-sqlite";

let dbInstance: any = null;

export const initDB = async () => {
  if (dbInstance) return dbInstance;

dbInstance = await open({name:"mydb.sqlite"});
  return dbInstance;
};

export const getDB = async () => {
  if (!dbInstance) {
    dbInstance = await initDB();
  }
  return dbInstance;
};
