import { useMemo, useState, KeyboardEvent, useRef } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../hooks";

import {
  updateField,
  fetchStarted,
  fetchSuccess,
  fetchFailed,
} from "../store/formSlice";
import { transferData } from "../services/Fetchapi";
import ToastNotifier, { showToast } from "./ToastNotifier";
import LoadingOverlay from "./LoadingOverlay";
import { Validateconnections } from "../services/ValidateApi";

const CosmosForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const formState = useAppSelector((state) => state.form);
  const [isLoading, setisLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const [showSuccess, setShowSuccess] = useState(false);
  // Reference to the form element
  const formRef = useRef<HTMLFormElement>(null);

  const fieldErrors = useMemo(
    () => ({
      CosmosDBConnectionString: !formState.CosmosDBConnectionString.trim(),
      ContainerName: !formState.ContainerName.trim(),
      CosmosDBDatabaseName: !formState.CosmosDBDatabaseName.trim(),
      SQLServerConnectionString: !formState.SQLServerConnectionString.trim(),
      SQLTableName: !formState.SQLTableName.trim(),
      SQLDatabaseName: !formState.SQLDatabaseName.trim(),
      Query: !formState.Query.trim(),
    }),
    [formState]
  );

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(updateField({ name: e.target.name, value: e.target.value }));
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!formRef.current) return;

      const form = formRef.current;
      const inputs = Array.from(
        form.querySelectorAll('input, textarea, select, button[type="submit"]')
      ).filter(
        (el) =>
          !el.hasAttribute("disabled") && el.getAttribute("type") !== "hidden"
      );

      const currentIndex = inputs.indexOf(e.target as HTMLElement);

      if (currentIndex >= 0 && currentIndex < inputs.length - 1) {
        (inputs[currentIndex + 1] as HTMLElement).focus();
      } else if (currentIndex === inputs.length - 1) {
        form.requestSubmit();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouchedFields({
      CosmosDBConnectionString: true,
      ContainerName: true,
      CosmosDBDatabaseName: true,
      SQLServerConnectionString: true,
      SQLTableName: true,
      SQLDatabaseName: true,
      Query: true,
    });

    if (Object.values(fieldErrors).some(Boolean)) return;

    dispatch(fetchStarted());
    setisLoading(true);
    setShowSuccess(false);

    try {
      const validateResponse = await Validateconnections(formState);
      console.log(validateResponse.success);
      if (validateResponse.success) {
        const result = await transferData(formState);
        dispatch(
          fetchSuccess(
            result.message || "Data transfer completed successfully!"
          )
        );
        showToast.success(result.message || "Data transfer successful");
        setShowSuccess(true);
      } else {
        // Handle validation failure
        const validationError =
          validateResponse.message || "Validation failed.";
        dispatch(fetchFailed(validationError));
        showToast.error(validationError);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      dispatch(fetchFailed(errorMessage));
      showToast.error(errorMessage);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen position-relative">
      <ToastNotifier />
      {isLoading && <LoadingOverlay />}

      <Container className="py-4">
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded"
        >
          <div className="mb-4">
            <h4 className="fw-bold mb-3">Cosmos DB Configuration</h4>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="position-relative">
                  <Form.Group className="mb-3">
                    <Form.Label>Cosmos DB Connection String</Form.Label>
                    <Form.Control
                      type="text"
                      style={{ border: "1px solid #333", borderRadius: "0" }}
                      name="CosmosDBConnectionString"
                      value={formState.CosmosDBConnectionString}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter Cosmos DB connection string"
                      required
                      isValid={
                        touchedFields["CosmosDBConnectionString"] &&
                        !fieldErrors.CosmosDBConnectionString
                      }
                      isInvalid={
                        touchedFields["CosmosDBConnectionString"] &&
                        fieldErrors.CosmosDBConnectionString
                      }
                      onBlur={handleBlur}
                    />
                    <Form.Control.Feedback tooltip type="invalid">
                      Connection string is required
                    </Form.Control.Feedback>
                    <Form.Control.Feedback tooltip type="valid">
                      Looks Good!
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>

              <div className="col-md-4">
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Cosmos DB Database ID</Form.Label>
                  <Form.Control
                    type="text"
                    style={{ border: "1px solid #333", borderRadius: "0" }}
                    name="CosmosDBDatabaseName"
                    value={formState.CosmosDBDatabaseName}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder=" Database ID"
                    required
                    isValid={
                      touchedFields["CosmosDBDatabaseName"] &&
                      !fieldErrors.CosmosDBDatabaseName
                    }
                    isInvalid={
                      touchedFields["CosmosDBDatabaseName"] &&
                      fieldErrors.CosmosDBDatabaseName
                    }
                    onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    CosmosDB ID is required
                  </Form.Control.Feedback>
                  <Form.Control.Feedback tooltip type="valid">
                    Looks good!
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="col-md-4">
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Cosmos DB Container Name</Form.Label>
                  <Form.Control
                    type="text"
                    style={{ border: "1px solid #333", borderRadius: "0" }}
                    name="ContainerName"
                    value={formState.ContainerName}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter container name"
                    required
                    isValid={
                      touchedFields["ContainerName"] &&
                      !fieldErrors.ContainerName
                    }
                    isInvalid={
                      touchedFields["ContainerName"] &&
                      fieldErrors.ContainerName
                    }
                    onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="invalid">
                    container Name is required
                  </Form.Control.Feedback>
                  <Form.Control.Feedback tooltip type="valid">
                    Looks good!
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="fw-bold mb-3">MS SQL Configuration</h4>
            <div className="row g-3">
              <div className="col-md-4">
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>MS SQL Connection String</Form.Label>
                  <Form.Control
                    type="text"
                    style={{ border: "1px solid #333", borderRadius: "0" }}
                    name="SQLServerConnectionString"
                    value={formState.SQLServerConnectionString}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter MS SQL connection string"
                    required
                    isValid={
                      touchedFields["SQLServerConnectionString"] &&
                      !fieldErrors.SQLServerConnectionString
                    }
                    isInvalid={
                      touchedFields["SQLServerConnectionString"] &&
                      fieldErrors.SQLServerConnectionString
                    }
                    onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="valid">
                    Looks good !
                  </Form.Control.Feedback>
                  <Form.Control.Feedback tooltip type="invalid">
                    connection string is required
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="col-md-4">
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>MS SQL Database Name</Form.Label>
                  <Form.Control
                    type="text"
                    style={{ border: "1px solid #333", borderRadius: "0" }}
                    name="SQLDatabaseName"
                    value={formState.SQLDatabaseName}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter database name"
                    required
                    isValid={
                      touchedFields["SQLDatabaseName"] &&
                      !fieldErrors.SQLDatabaseName
                    }
                    isInvalid={
                      touchedFields["SQLDatabaseName"] &&
                      fieldErrors.SQLDatabaseName
                    }
                    onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="valid">
                    Looks good !
                  </Form.Control.Feedback>
                  <Form.Control.Feedback tooltip type="invalid">
                    Data base name is required
                  </Form.Control.Feedback>
                </Form.Group>
              </div>

              <div className="col-md-4">
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>MS SQL Table Name</Form.Label>
                  <Form.Control
                    type="text"
                    style={{ border: "1px solid #333", borderRadius: "0" }}
                    name="SQLTableName"
                    value={formState.SQLTableName}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter table name"
                    required
                    isValid={
                      touchedFields["SQLTableName"] && !fieldErrors.SQLTableName
                    }
                    isInvalid={
                      touchedFields["SQLTableName"] && fieldErrors.SQLTableName
                    }
                    onBlur={handleBlur}
                  />
                  <Form.Control.Feedback tooltip type="valid">
                    Looks good !
                  </Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid" tooltip>
                    SQL Table Name is required
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            </div>
          </div>

          <div className="col-md-14">
            <Form.Group className="mb-4 position-relative">
              <Form.Label>Query</Form.Label>
              <Form.Control
                type="text"
                style={{ border: "1px solid #333", borderRadius: "0" }}
                name="Query"
                value={formState.Query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter your query Example: Select * from c"
                required
                isValid={touchedFields["Query"] && !fieldErrors.Query}
                isInvalid={touchedFields["Query"] && fieldErrors.Query}
                onBlur={handleBlur}
              />
              <Form.Control.Feedback tooltip type="valid">
                Looks good !
              </Form.Control.Feedback>
              <Form.Control.Feedback type="invalid" tooltip>
                Query Cannot be Empty
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="text-end">
            <Button
              variant="outline-primary"
              type="submit"
              disabled={isLoading}
              className="px-4"
            >
              Fetch and Transfer
            </Button>
          </div>
        </Form>
      </Container>
    </div>
  );
};

export default CosmosForm;
