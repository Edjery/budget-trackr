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
import { useTranslation } from "react-i18next";

interface DataManagementDialogProps {
    open: boolean;
    onClose: () => void;
}

const DataManagementDialog: React.FC<DataManagementDialogProps> = ({ open, onClose }) => {
    const { t } = useTranslation();
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
            showSnackbar(t("dataManagement.export.success"), "success");
        } catch (error) {
            console.error("Error exporting data:", error);
            showSnackbar(t("dataManagement.export.error"), "error");
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
                showSnackbar(t("dataManagement.import.success"), "success");
                setTimeout(() => window.location.reload(), 1500); // Give user time to see the success message
            } catch (error) {
                console.error("Error importing data:", error);
                showSnackbar(t("dataManagement.import.error"), "error");
            }
        };
        reader.readAsText(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{t("dataManagement.title")}</DialogTitle>
            <DialogContent>
                <Typography variant="body1" paragraph>
                    {t("dataManagement.description")}
                </Typography>

                <Box sx={{ display: "flex", gap: 2, mt: 2, mb: 1 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleExportClick}
                        disabled={isExporting}
                        fullWidth
                    >
                        {isExporting ? t("dataManagement.export.exporting") : t("dataManagement.export.button")}
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
                        {t("dataManagement.import.button")}
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    {t("dataManagement.close")}
                </Button>
            </DialogActions>

            <Dialog open={isExportConfirmOpen} onClose={handleExportCancel}>
                <DialogTitle>{t("dataManagement.export.confirm.title")}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{t("dataManagement.export.confirm.message")}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleExportCancel} color="primary">
                        {t("dataManagement.cancel")}
                    </Button>
                    <Button onClick={handleExportConfirm} color="primary" variant="contained" autoFocus>
                        {t("dataManagement.export.button")}
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
