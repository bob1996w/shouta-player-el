export class AppIpcRequest {
    public request: string = null;
    public data: any = null;
    
    constructor (request: string, data: any) {
        this.request = request;
        this.data = data;
    }
}