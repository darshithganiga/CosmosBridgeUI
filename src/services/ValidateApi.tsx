// src/services/ValidateApi.ts

import axios from "axios";
import { FormState } from "../types";

export interface ValidationResult {
  success: boolean;
  message: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Validateconnections = async (
  formData: FormState
): Promise<ValidationResult> => {
  try {
    const response = await axios.post<ValidationResult>(
      `${API_BASE_URL}/api/CosmosToSql/Validate`,
      {
        CosmosDBConnectionString: formData.CosmosDBConnectionString,
        CosmosDBDatabaseName: formData.CosmosDBDatabaseName,
        ContainerName: formData.ContainerName,
        SQLServerConnectionString: formData.SQLServerConnectionString,
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as any)?.message ||
        "Failed to establish the connection";
      throw new Error(message);
    }

    throw error;
  }
};
