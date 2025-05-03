import { FormState } from "../types";
import apiClient from "../utils/ApiClient";
import axios from "axios";

export const transferData = async (formData: FormState) => {
  try {
    const payload = {
      Query: formData.Query,
      CosmosDBConnectionString: formData.CosmosDBConnectionString,
      CosmosDBDatabaseName: formData.CosmosDBDatabaseName,
      ContainerName: formData.ContainerName,
      SQLServerConnectionString: formData.SQLServerConnectionString,
      SQLDatabaseName: formData.SQLDatabaseName,
      SQLTableName: formData.SQLTableName,
    };

    const response = await apiClient.post("/api/CosmosToSql/transfer", payload);

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
