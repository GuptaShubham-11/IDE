import { ZodError } from "zod";

const ZodErrorFormater = (validatedData: { error: ZodError }) => {
    return Object.values(validatedData.error.format())
        .map(error => (error as any)._errors?.join(", ")) // Extract error messages
        .filter(Boolean) // Remove empty values
        .join(", "); // Convert to a single string
};

export default ZodErrorFormater;
