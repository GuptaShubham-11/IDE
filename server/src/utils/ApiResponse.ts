class ApiResponse<T> {
    statusCode: number;
    data: T | null;
    message: string;
    success: boolean;

    constructor(statusCode: number, message: string = "Success", data: T | null = null) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400; // Success if status code < 400
    }
}

export { ApiResponse };
