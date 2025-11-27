import { getDB } from "./db";

export interface IQuestion {
  id: number;
  topic_name: string;
  question: string;
  answer: string;
  createdAt: string;   
}

export interface AddQue{
  topic_name: string;
  question: string;
  answer: string;
}

/* CREATE TABLE */
export const createQuestionTable = async () => {
  const db = await getDB();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_name TEXT,
      question TEXT,
      answer TEXT,
      createdAt TEXT
    );
  `);
};


/* SAFE MIGRATION — Add createdAt column if missing */
export const addCreatedAtColumn = async () => {
  const db = await getDB();

  // Check existing columns
  const columnInfo = await db.execute(`PRAGMA table_info(questions)`);

  const exists = columnInfo.some((c: any) => c.name === "createdAt");

  if (!exists) {
    await db.execute(`
      ALTER TABLE questions ADD COLUMN createdAt TEXT;
    `);
    console.log("Column 'createdAt' added successfully");
  } else {
    console.log("Column 'createdAt' already exists");
  }
};


/* INSERT QUESTION */
export const addQuestion = async (data: AddQue) => {
  const db = await getDB();

  const timestamp = new Date().toISOString();

  const { rowsAffected } = await db.executeAsync(
    `INSERT INTO questions (topic_name, question, answer, createdAt)
     VALUES (?, ?, ?, ?)`,
    [data.topic_name, data.question, data.answer, timestamp]
  );

  console.log(`Inserted: affected ${rowsAffected} rows`);
};


/* GET QUESTIONS BY TOPIC */
export const getQuestionsByTopic = async (topic_name: string): Promise<IQuestion[]> => {
  const db = await getDB();
  const { rows } = await db.executeAsync(
    `SELECT * FROM questions WHERE topic_name = ? ORDER BY createdAt DESC`,
    [topic_name]
  );

  return rows._array as IQuestion[];
};

export const dropQuestionsTable = async () => {
  const db = await getDB();

  await db.executeAsync(`
    DROP TABLE IF EXISTS questions;
  `);

  console.log("Table 'questions' dropped successfully");
};

/* GET ALL QUESTIONS */
export const getAllQuestions = async (): Promise<IQuestion[]> => {
  const db = await getDB();
  const { rows } = await db.executeAsync(`
    SELECT * FROM questions ORDER BY createdAt DESC
  `);

  return rows._array as IQuestion[];
};


export async function getUniqueTopics() {
  const db = await getDB();

  const { rows } = await db.executeAsync(`
    SELECT DISTINCT topic_name FROM questions;
  `);

  return rows._array;
}

/* DELETE QUESTION BY ID */
export const deleteQuestion = async (id: number): Promise<void> => {
  const db = await getDB();

  await db.executeAsync(
    `DELETE FROM questions WHERE id = ?`,
    [id]
  );

  console.log(`Question with ID ${id} deleted`);
};
