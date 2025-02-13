export default interface ISQL<T>{
    createSQLStatements(data: T[]): string[];
}