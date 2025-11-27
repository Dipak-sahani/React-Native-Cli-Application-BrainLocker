import { getDB } from "./db";

export interface ITopic {
  id?: number;
  name: string;
}

export const createTopicTable = async () => {
  const db = await getDB();
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    );
  `);
};

export const addTopic = async (name: string) => {
  const db = await getDB();
  return db.executeSql(
    `INSERT INTO topics (name) VALUES (?)`,
    [name]
  );
};

export const getAllTopics = async (): Promise<ITopic[]> => {
  const db = await getDB();
  const res = await db.executeSql(`SELECT * FROM topics`);

  return res[0].rows.raw() as ITopic[];
};
