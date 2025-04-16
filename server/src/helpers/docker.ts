import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { ApiError } from '../utils/ApiError';
import { languageConfigs } from '../utils/languageConfigs';

// Define result type
interface CodeExecutionResult {
    exitCode: number;
    output: string;
    error?: string;
}

export const runCodeInDocker = async (
    language: string,
    code: string
): Promise<CodeExecutionResult> => {
    const config = languageConfigs[language];

    if (!config) {
        throw new ApiError(400, `Unsupported language: ${language}`);
    }

    const codeDir = path.join(__dirname, '../../temp');
    await fs.mkdir(codeDir, { recursive: true });

    const filePath = path.join(codeDir, config.fileName);
    await fs.writeFile(filePath, code);

    const dockerRunCommand = `docker run --rm -v ${codeDir}:/app ${config.dockerImage} sh -c "${config.runCommand}"`;

    return new Promise((resolve) => {
        exec(dockerRunCommand, (error, stdout, stderr) => {
            if (error) {
                resolve({
                    exitCode: error.code ?? 1,
                    output: stderr || error.message,
                    error: stderr || error.message,
                });
            } else {
                resolve({
                    exitCode: 0,
                    output: stdout,
                });
            }
        });
    });
};
