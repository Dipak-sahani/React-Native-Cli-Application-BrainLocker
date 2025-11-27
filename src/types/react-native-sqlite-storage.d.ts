declare module "react-native-sqlite-storage" {
  export interface SQLiteDatabase {
    executeSql: (
      sqlStatement: string,
      args?: any[]
    ) => Promise<{
      rows: {
        length: number;
        item: (index: number) => any;
        raw: () => any[];
      };
    }[]>;
    close: () => Promise<void>;
  }

  export function openDatabase(config: {
    name: string;
    location: string;
  }): Promise<SQLiteDatabase>;

  export function enablePromise(enable: boolean): void;

  const SQLite: {
    enablePromise: (value: boolean) => void;
    openDatabase: typeof openDatabase;
  };

  export default SQLite;
}
