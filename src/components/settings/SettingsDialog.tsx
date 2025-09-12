import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
} from "@mui/material";
import { Form, Formik, type FormikHelpers } from "formik";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { useAppSettings } from "../../hooks/useAppSettings";
import type { ThemeMode } from "../../types/userSettings";
import { CURRENCIES } from "../../utils/currencyUtils";
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
    const { t } = useTranslation();
    const { settings, updateSettings } = useAppSettings();
    const [openApply, setOpenApply] = useState(false);
    const [stayOpen, setStayOpen] = useState(false);

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
                ...settings,
                appearance: {
                    ...settings.appearance,
                    theme: values.theme,
                },
                currency: {
                    ...CURRENCIES[values.currency],
                    code: values.currency,
                },
                language: values.language,
            });
            setSubmitting(false);

            if (stayOpen) {
                setStayOpen(false);
            } else {
                onClose();
            }
            setOpenApply(false);
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
                {({ values, setSubmitting, isSubmitting, dirty, resetForm }) => (
                    <>
                        <Form>
                            <DialogTitle>Settings</DialogTitle>
                            <DialogContent dividers>
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
                                    {/* Theme Settings */}
                                    <FormikSelect name="theme" label={t("settings.appearance.theme")} size="small">
                                        <MenuItem value="system">{t("settings.appearance.system")}</MenuItem>
                                        <MenuItem value="light">{t("settings.appearance.light")}</MenuItem>
                                        <MenuItem value="dark">{t("settings.appearance.dark")}</MenuItem>
                                    </FormikSelect>

                                    {/* Currency Settings */}
                                    <FormikSelect name="currency" label={t("settings.currency.title")} size="small">
                                        {Object.values(CURRENCIES).map((curr) => (
                                            <MenuItem key={curr.code} value={curr.code}>
                                                {`${curr.name} (${curr.symbol})`}
                                            </MenuItem>
                                        ))}
                                    </FormikSelect>

                                    {/* Language Settings */}
                                    <FormikSelect name="language" label={t("settings.language.title")} size="small">
                                        <MenuItem value="en">{t("languages.en")}</MenuItem>
                                        <MenuItem value="ph">{t("languages.ph")}</MenuItem>
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
                                    {t("settings.cancel")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outlined"
                                    color="primary"
                                    disabled={isSubmitting || !dirty}
                                    onClick={() => {
                                        setStayOpen(true);
                                        setOpenApply(true);
                                    }}
                                    sx={{ mr: 1 }}
                                >
                                    {t("settings.applyNow")}
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitting || !dirty}
                                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                                    onClick={() => {
                                        setStayOpen(false);
                                        setOpenApply(true);
                                    }}
                                >
                                    {isSubmitting ? t("common.actions.saving") : t("settings.save")}
                                </Button>
                            </DialogActions>
                        </Form>
                        <Dialog open={openApply} onClose={() => setOpenApply(false)} maxWidth="xs" fullWidth>
                            <DialogTitle>{t("settings.applyConfirmTitle")}</DialogTitle>
                            <DialogContent>
                                <p>{t("settings.applyConfirmMessage")}</p>
                            </DialogContent>
                            <DialogActions sx={{ p: 2, justifyContent: "flex-end" }}>
                                <Button onClick={() => setOpenApply(false)} color="inherit">
                                    {t("settings.cancel")}
                                </Button>
                                <Button
                                    onClick={() =>
                                        handleSubmit(values, { setSubmitting } as FormikHelpers<SettingsFormValues>)
                                    }
                                    variant="contained"
                                    color="primary"
                                >
                                    {stayOpen ? t("settings.applyNow") : t("settings.save")}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                )}
            </Formik>
        </Dialog>
    );
};
