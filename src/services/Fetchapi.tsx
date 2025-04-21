import axios from "axios";
import { FormState } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const transferData = async (formData: FormState) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/CosmosToSql/transfer`,
      {
        Query: formData.Query,
        CosmosDBConnectionString: formData.CosmosDBConnectionString,
        CosmosDBDatabaseName: formData.CosmosDBDatabaseName,
        ContainerName: formData.ContainerName,
        SQLServerConnectionString: formData.SQLServerConnectionString,
        SQLDatabaseName: formData.SQLDatabaseName,
        SQLTableName: formData.SQLTableName,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to transfer the data "
      );
    }
    throw error;
  }
};
