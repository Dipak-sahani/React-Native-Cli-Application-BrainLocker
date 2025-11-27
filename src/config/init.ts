import { createUserTable } from "./../database/user.table";
import { createTopicTable } from "./../database/topic.table";
import { createQuestionTable } from "./../database/question.table";

export const initDB = async () => {
  await createUserTable();
  await createTopicTable();
  await createQuestionTable();
};
