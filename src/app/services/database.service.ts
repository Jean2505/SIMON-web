import { Injectable } from "@angular/core";
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    private sqlite: SQLiteConnection;
    private db: SQLiteDBConnection | null = null;

    constructor() {
        this.sqlite = new SQLiteConnection(CapacitorSQLite);
    }

    async InitializeDatabase(): Promise<void> {
        try {
            // Check connection consistency
            const retCC = (await this.sqlite.checkConnectionsConsistency()).result;
        
            // Check if is connected
            const isConnection = (await this.sqlite.isConnection("UniversityDB", false)).result;
        
            if (isConnection && !retCC) {
                // Create a new connection
                this.db = await this.sqlite.createConnection("UniversityDB", false, "no-encryption", 1, false);
                await this.db.open();
                await this.createTables();
            } else {
                this.db = await this.sqlite.retrieveConnection("UniversityDB", false);
                await this.db.open();
            }
        } catch (error) {
            console.error("Error initializing database:", error);
        }
    }

    private async createTables(): Promise<void> {
        if (!this.db) throw new Error("Database connection is not established.");
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                age INTEGER NOT NULL
            );
        `;
        await this.db.execute(createTableQuery);
    }

    async addUser(name: string, age: number): Promise<void> {
        if (!this.db) throw new Error("Database connection is not established.");
        const insertQuery = `INSERT INTO students (name, age) VALUES (?, ?);`;
        await this.db.run(insertQuery, [name, age]);
    }

    async getUsers(): Promise<any[]> {
        if (!this.db) throw new Error("Database connection is not established.");
        const result = await this.db.query("SELECT * FROM students;");
        return result.values || [];
    }

    async closeDatabase(): Promise<void> {
        if (this.db) {
            await this.sqlite.closeConnection("UniversityDB", false);
            this.db = null;
        }
    }
}