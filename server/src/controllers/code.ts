import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { CodeExecutionRequest } from "../types/codeTypes";
import { runCodeInDocker } from "../helpers/docker";
import { FormatDockerError } from "../utils/FormatDockerError";

const runCode = asyncHandler(async (req, res) => {
    const { language, code } = req.body as CodeExecutionRequest;

    if (!language || !code) {
        throw new ApiError(400, "Language and code are required");
    }

    const result = await runCodeInDocker(language, code);

    if (!result) {
        throw new ApiError(500, "Code execution failed");
    }

    // Check if there was an error in the Docker run
    if (result.exitCode !== 0) {
        const userFriendlyMessage = FormatDockerError(result.error || result.output);
        throw new ApiError(500, `Code execution failed: ${userFriendlyMessage}`);
    }

    res.status(200).json(
        new ApiResponse(200, "Code executed successfully", result)
    );
});

export {
    runCode
}



