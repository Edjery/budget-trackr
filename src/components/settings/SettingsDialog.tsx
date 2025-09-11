import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    CircularProgress,
    MenuItem,
} from "@mui/material";
import { Formik, Form, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { useCallback, useEffect } from "react";
import { CURRENCIES } from "../../utils/currencyUtils";
import { useAppSettings } from "../../hooks/useAppSettings";
import type { ThemeMode } from "../../types/userSettings";
import { FormikSelect } from "../form/FormikSelect";

interface SettingsFormValues {
    theme: ThemeMode;
    currency: string;
    language: string;
}

interface SettingsDialogProps {
    open: boolean;
    onClose: () => void;
}

export const SettingsDialog = ({ open, onClose }: SettingsDialogProps) => {
    const { settings, updateSettings } = useAppSettings();

    // Log current settings for debugging
    useEffect(() => {
        if (open) {
            console.log("Current settings in dialog:", settings);
        }
    }, [open, settings]);

    const getInitialValues = useCallback(
        (): SettingsFormValues => ({
            theme: settings.appearance?.theme || "system",
            currency: settings.currency?.code || "PHP",
            language: settings.language || "en",
        }),
        [settings]
    );

    const initialValues = getInitialValues();

    const validationSchema = Yup.object().shape({
        theme: Yup.string().oneOf(["light", "dark", "system"]).required("Required"),
        currency: Yup.string().required("Required"),
        language: Yup.string().required("Required"),
    });

    const handleSubmit = async (values: SettingsFormValues, { setSubmitting }: FormikHelpers<SettingsFormValues>) => {
        try {
            await updateSettings({
                appearance: { theme: values.theme },
                currency: {
                    ...CURRENCIES[values.currency],
                    code: values.currency,
                },
                language: values.language,
            });
            setSubmitting(false);
            onClose();
        } catch (error) {
            console.error("Failed to save settings:", error);
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Formik
                key={JSON.stringify(initialValues)} // Force re-render when initialValues change
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ isSubmitting, dirty, resetForm }) => (
                    <Form>
                        <DialogTitle>Settings</DialogTitle>
                        <DialogContent dividers>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
                                {/* Theme Settings */}
                                <FormikSelect name="theme" label="Theme" size="small">
                                    <MenuItem value="system">System Default</MenuItem>
                                    <MenuItem value="light">Light</MenuItem>
                                    <MenuItem value="dark">Dark</MenuItem>
                                </FormikSelect>

                                {/* Currency Settings */}
                                <FormikSelect name="currency" label="Currency" size="small">
                                    {Object.values(CURRENCIES).map((curr) => (
                                        <MenuItem key={curr.code} value={curr.code}>
                                            {`${curr.name} (${curr.symbol})`}
                                        </MenuItem>
                                    ))}
                                </FormikSelect>

                                {/* Language Settings */}
                                <FormikSelect name="language" label="Language" size="small">
                                    <MenuItem value="en">English</MenuItem>
                                    <MenuItem value="tl">Filipino</MenuItem>
                                </FormikSelect>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => {
                                    resetForm();
                                    onClose();
                                }}
                                color="inherit"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting || !dirty}
                                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                            >
                                {isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    );
};
