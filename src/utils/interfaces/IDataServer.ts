export default interface IDataServer<T> {
    fetchAllData(): void;
    extractData(data: any): void;
    getData(): T[];
    createSQLStatements(data: T[]): string[];
}