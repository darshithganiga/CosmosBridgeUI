import { useMemo, useState, KeyboardEvent, useRef, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../hooks";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

import {
  updateField,
  fetchStarted,
  fetchSuccess,
  fetchFailed,
} from "../store/formSlice";
import { transferData } from "../services/Fetchapi";
import ToastNotifier, { showToast } from "./ToastNotifier";
import LoadingOverlay from "./LoadingOverlay";

const CosmosForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const formState = useAppSelector((state) => state.form);
  const [isLoading, setisLoading] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});

  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7127/NotificationHub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("SignalR Connected");

          connection.on(
            "ReceivedstatusUpdate",
            (statuspayload: { message: string; status?: string }) => {
              const { message, status = "info" } = statuspayload;

              switch (status) {
                case "success":
                  showToast.success(message);
                  break;
                case "error":
                  showToast.error(message);
                  break;
                default:
                  showToast.info(message);
                  break;
              }
            }
          );

          connection.on("ReceivedProgress", (message: string) => {
            console.log("Message:", message);
            setLoadingMessage(message);
          });
        })
        .catch((err) => console.error("SignalR Connection Error: ", err));
    }

    return () => {
      if (connection) {
        connection.off("ReceivedstatusUpdate");
        connection.off("ReceivedProgress");
        connection?.stop();
      }
    };
  }, [connection]);

  useEffect(() => {
    if (!isLoading) {
      setLoadingMessage("Establidhing the Connection");
    }
  }, [isLoading]);

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
    setLoadingMessage("Establishing the Connection");

    try {
      const result = await transferData(formState);
      dispatch(
        fetchSuccess(result.message || "Data transfer completed successfully!")
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      dispatch(fetchFailed(errorMessage));
      console.log(errorMessage);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen position-relative">
      <ToastNotifier
        onShow={() => setIsToastVisible(true)}
        onHide={() => setIsToastVisible(false)}
      />
      {isLoading && <LoadingOverlay message={loadingMessage} />}

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
                  <Form.Group className="mb-3 ">
                    <Form.Label>Cosmos DB Connection String</Form.Label>
                    <Form.Control
                      type="text"
                      style={{
                        border: "1px solid  #333",
                        borderRadius: "0",
                      }}
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

              <Form.Control.Feedback type="invalid" tooltip>
                Query Cannot be Empty
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <div className="text-end">
            <Button
              variant="outline-primary"
              type="submit"
              disabled={isLoading || isToastVisible}
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
