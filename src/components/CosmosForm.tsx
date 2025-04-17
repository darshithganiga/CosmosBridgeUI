import { useMemo } from "react";
import { useState } from "react";
import NotificationBox from "../components/NotificationBox";
import { Container, Form, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  updateField,
  fetchStarted,
  fetchSuccess,
  fetchFailed,
} from "../store/formSlice";
import { transferData } from "../services/api";

const CosmosForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const formState = useAppSelector((state) => state.form);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const isFormValid = useMemo(() => {
    return (
      formState.CosmosDBConnectionString.trim() !== "" &&
      formState.ContainerName.trim() !== "" &&
      formState.CosmosDBDatabaseName.trim() !== "" &&
      formState.SQLServerConnectionString.trim() !== "" &&
      formState.SQLTableName.trim() !== "" &&
      formState.SQLDatabaseName.trim() !== "" &&
      formState.Query.trim() !== ""
    );
  }, [formState]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(updateField({ name: e.target.name, value: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(fetchStarted());

    try {
      const result = await transferData(formState);
      dispatch(
        fetchSuccess(result.message || "Data transfer completed successfully!")
      );
      setNotification({
        type: "success",
        message: result.message || "Data transfer completed successfully",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      dispatch(fetchFailed(errorMessage));
      setNotification({
        type: "error",
        message: errorMessage,
      });
    }
  };
  {
    notification && (
      <NotificationBox
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification(null)}
      />
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen position-relative">
      {notification && (
        <NotificationBox
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <Container className="py-4">
        <Form
          onSubmit={handleSubmit}
          className="bg-white p-4 shadow-sm rounded"
        >
          <div className="mb-4">
            <h4 className="fw-bold mb-3">Cosmos DB Configuration</h4>
            <div className="row g-3">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Cosmos DB Connection String</Form.Label>
                  <Form.Control
                    type="text"
                    style={{ border: "1px solid #333", borderRadius: "0" }}
                    name="CosmosDBConnectionString"
                    value={formState.CosmosDBConnectionString}
                    onChange={handleChange}
                    placeholder="Enter Cosmos DB connection string"
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Cosmos DB Database ID</Form.Label>
                  <Form.Control
                    type="text"
                    style={{ border: "1px solid #333", borderRadius: "0" }}
                    name="CosmosDBDatabaseName"
                    value={formState.CosmosDBDatabaseName}
                    onChange={handleChange}
                    placeholder="Enter database ID"
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Cosmos DB Container Name</Form.Label>
                  <Form.Control
                    type="text"
                    style={{ border: "1px solid #333", borderRadius: "0" }}
                    name="ContainerName"
                    value={formState.ContainerName}
                    onChange={handleChange}
                    placeholder="Enter container name"
                    required
                  />
                </Form.Group>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="fw-bold mb-3">MS SQL Configuration</h4>
            <div className="row g-3">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>MS SQL Connection String</Form.Label>
                  <Form.Control
                    type="text"
                    style={{ border: "1px solid #333", borderRadius: "0" }}
                    name="SQLServerConnectionString"
                    value={formState.SQLServerConnectionString}
                    onChange={handleChange}
                    placeholder="Enter MS SQL connection string"
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>MS SQL Database Name</Form.Label>
                  <Form.Control
                    type="text"
                    style={{ border: "1px solid #333", borderRadius: "0" }}
                    name="SQLDatabaseName"
                    value={formState.SQLDatabaseName}
                    onChange={handleChange}
                    placeholder="Enter database name"
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>MS SQL Table Name</Form.Label>
                  <Form.Control
                    type="text"
                    style={{ border: "1px solid #333", borderRadius: "0" }}
                    name="SQLTableName"
                    value={formState.SQLTableName}
                    onChange={handleChange}
                    placeholder="Enter table name"
                    required
                  />
                </Form.Group>
              </div>
            </div>
          </div>

          <Form.Group className="mb-4">
            <Form.Label>Query</Form.Label>
            <Form.Control
              type="text"
              style={{ border: "1px solid #333", borderRadius: "0" }}
              name="Query"
              value={formState.Query}
              onChange={handleChange}
              placeholder="Enter your query Example: Select * from c"
              required
            />
          </Form.Group>

          <div className="text-end">
            <Button
              variant="primary"
              type="submit"
              disabled={formState.isLoading || !isFormValid}
              className="px-4"
            >
              {formState.isLoading ? "Processing..." : "Fetch Data"}
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default CosmosForm;
