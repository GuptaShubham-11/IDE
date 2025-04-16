export interface CodeExecutionRequest {
    language: 'node' | 'python';
    code: string;
}

export interface CodeExecutionResponse {
    output: string;
    error?: string;
    exitCode: number;
}