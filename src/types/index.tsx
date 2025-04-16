export interface FormState {
  CosmosDBConnectionString: string;
  ContainerName: string;
  CosmosDBDatabaseName: string;
  SQLServerConnectionString: string;
  SQLTableName: string;
  SQLDatabaseName: string;
  Query: string;
  isLoading: boolean;
  error: string | null;
  success: string | null;
}
