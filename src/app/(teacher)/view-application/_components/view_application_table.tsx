import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";
import { IViewApplication } from "../_libs/constants";
import {
  APPLICATION_STATUS,
  APPLICATION_STATUS_TRANSLATOR,
  REQUEST_TYPE,
  REQUEST_TYPE_TRANSLATOR,
} from "../../_utils/constants";
import { useEffect, useState } from "react";
import { getApplication } from "../_libs/apiApplication";
import AttachFileIcon from "@mui/icons-material/AttachFile";

interface ViewApplicationTableProps {
  teacherId: number;
  schoolYearId: number;
  sessionToken: string;
}

export default function ViewApplicationTable({
  teacherId,
  schoolYearId,
  sessionToken,
}: ViewApplicationTableProps) {
  const [applications, setApplications] = useState<IViewApplication[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (teacherId && schoolYearId && sessionToken) {
        const response = await getApplication(
          teacherId,
          schoolYearId,
          sessionToken
        );
        if (response?.result?.items) {
          setApplications(response.result.items);
        }
      }
    };
    fetchApplications();
  }, [teacherId, schoolYearId, sessionToken]);

  const getRequestTypeValue = (requestType: string): number => {
    const found = REQUEST_TYPE.find((type) => type.key === requestType);
    return found ? found.value : 1;
  };
  const getStatusValue = (status: string): number => {
    const found = APPLICATION_STATUS.find((type) => type.key === status);
    return found ? found.value : 3; // Default to Pending (3) if not found
  };
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "success";
      case "rejected":
        return "error";
      default:
        return "warning";
    }
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "95%",
        margin: "20px auto",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Table aria-label="application table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "1rem", textAlign: "center" }}
            >
              Loại đơn
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "1rem", textAlign: "center" }}
            >
              Nội dung
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "1rem", textAlign: "center" }}
            >
              Ngày tạo
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "1rem", textAlign: "center" }}
            >
              File đính kèm
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", fontSize: "1rem", textAlign: "center" }}
            >
              Trạng thái
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(applications) &&
            applications.map((application) => (
              <TableRow
                key={application.id}
                sx={{ "&:hover": { backgroundColor: "#f8f9fa" } }}
              >
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {
                      REQUEST_TYPE_TRANSLATOR[
                        getRequestTypeValue(application["request-type"])
                      ]
                    }
                  </Typography>
                </TableCell>
                <TableCell
                  style={{
                    maxWidth: "200px",
                    borderRight: "1px solid #e0e0e0",
                  }}
                >
                  <Typography variant="body1">
                    {application["request-description"]}
                  </Typography>
                </TableCell>
                <TableCell
                  style={{
                    borderRight: "1px solid #e0e0e0",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#666",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {new Date(application["create-date"]).toLocaleString(
                      "vi-VN",
                      {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </Typography>
                </TableCell>

                <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>
                  {application["attached-file"] ? (
                    <a
                      href={application["attached-file"]}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#1976d2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                      }}
                    >
                      <AttachFileIcon fontSize="small" />
                      <span style={{ textDecoration: "underline" }}>
                        Xem file
                      </span>
                    </a>
                  ) : (
                    <Typography
                      variant="body1"
                      style={{
                        color: "#999",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Không có file
                    </Typography>
                  )}
                </TableCell>

                <TableCell style={{ borderRight: "1px solid #e0e0e0" }}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Chip
                      variant="outlined"
                      label={
                        APPLICATION_STATUS_TRANSLATOR[
                          getStatusValue(application.status)
                        ]
                      }
                      color={getStatusColor(application.status)}
                      size="small"
                      sx={{
                        fontWeight: 500,
                      }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
