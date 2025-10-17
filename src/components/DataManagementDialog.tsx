import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useDataManagement } from "../hooks/useDataManagement";

interface DataManagementDialogProps {
    open: boolean;
    onClose: () => void;
}

const DataManagementDialog: React.FC<DataManagementDialogProps> = ({ open, onClose }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { exportAllData, importAllData } = useDataManagement();
    const [isExporting, setIsExporting] = useState(false);
    const [isExportConfirmOpen, setIsExportConfirmOpen] = useState(false);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error" | "info" | "warning";
    }>({ open: false, message: "", severity: "info" });

    const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning" = "info") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleExportClick = () => {
        setIsExportConfirmOpen(true);
    };

    const handleExportConfirm = () => {
        setIsExportConfirmOpen(false);
        handleExport();
    };

    const handleExportCancel = () => {
        setIsExportConfirmOpen(false);
    };

    const handleClose = () => {
        onClose();
        setIsExportConfirmOpen(false);
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const data = exportAllData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-").split("T").join("_").slice(0, -5);
            a.download = `budget-trackr-backup-${timestamp}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showSnackbar("Data exported successfully!", "success");
        } catch (error) {
            console.error("Error exporting data:", error);
            showSnackbar("Failed to export data. Please try again.", "error");
        } finally {
            setIsExporting(false);
        }
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                await importAllData(data);
                showSnackbar("Data imported successfully!", "success");
                setTimeout(() => window.location.reload(), 1500); // Give user time to see the success message
            } catch (error) {
                console.error("Error importing data:", error);
                showSnackbar("Failed to import data. The file might be corrupted or in an invalid format.", "error");
            }
        };
        reader.readAsText(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Data Management</DialogTitle>
            <DialogContent>
                <Typography variant="body1" paragraph>
                    Export your data to a backup file or import previously saved data.
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mt: 2, mb: 1 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleExportClick}
                        disabled={isExporting}
                        fullWidth
                    >
                        {isExporting ? "Exporting..." : "Export Data"}
                    </Button>

                    <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        id="import-file"
                    />
                    <Button variant="outlined" color="primary" component="label" htmlFor="import-file" fullWidth>
                        Import Data
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>

            <Dialog open={isExportConfirmOpen} onClose={handleExportCancel}>
                <DialogTitle>Confirm Export</DialogTitle>
                <DialogContent>
                    <DialogContentText>This will export your data to a JSON file. Continue?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleExportCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleExportConfirm} color="primary" variant="contained" autoFocus>
                        Export
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Dialog>
    );
};

export default DataManagementDialog;
