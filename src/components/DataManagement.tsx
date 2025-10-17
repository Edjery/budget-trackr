import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useDataManagement } from "../hooks/useDataManagement";

const DataManagement = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { exportAllData, importAllData } = useDataManagement();
    const [isExporting, setIsExporting] = useState(false);
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

    const handleExportClick = () => {
        setIsExportDialogOpen(true);
    };

    const handleExportConfirm = () => {
        setIsExportDialogOpen(false);
        handleExport();
    };

    const handleExportCancel = () => {
        setIsExportDialogOpen(false);
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
        } catch (error) {
            console.error("Error exporting data:", error);
            alert("Failed to export data. Please try again.");
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
                alert("Data imported successfully!");
                window.location.reload(); // Force a refresh to update all components
            } catch (error) {
                console.error("Error importing data:", error);
                alert("Failed to import data. The file might be corrupted or in an invalid format.");
            }
        };
        reader.readAsText(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
            <Typography variant="h5" gutterBottom>
                Data Management
            </Typography>
            <Typography variant="body1" paragraph>
                Export your data to a backup file or import previously saved data.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleExportClick}
                    disabled={isExporting}
                    fullWidth
                >
                    {isExporting ? "Exporting..." : "Export Data"}
                </Button>

                <Dialog open={isExportDialogOpen} onClose={handleExportCancel} aria-labelledby="export-dialog-title">
                    <DialogTitle id="export-dialog-title">Confirm Export</DialogTitle>
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
        </Box>
    );
};

export default DataManagement;
