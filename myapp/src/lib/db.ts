import mysql from "mysql2/promise";


export const myDayDB: Parameters<typeof mysql.createPool>[0] = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "12345678",
    database: "employee_details",
    dateStrings: true,
};

import { type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
export const myDayPool = mysql.createPool({
    connectionLimit: 50,
    ...myDayDB,
});
