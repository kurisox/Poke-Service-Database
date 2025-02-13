export default interface IFetching<T> {
    fetchAllData(): void;
    extractData(data: any): void;
    getData(): T[];
}