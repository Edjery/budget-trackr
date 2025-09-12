import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Collapse } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useSettings from "../hooks/useSettings";

const DebugView = ({ data }: { data: any }) => {
    const isDebug = import.meta.env.VITE_ENVIRONMENT == "dev";
    if (!isDebug) return null;

    const { settings } = useSettings();
    const { t } = useTranslation();
    const [expanded, setExpanded] = useState(false);

    return (
        <Box sx={{ mt: 4, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
            <Button
                onClick={() => setExpanded(!expanded)}
                startIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ mb: 1 }}
            >
                {expanded ? t("transaction.form.list.debug.hide") : t("transaction.form.list.debug.show")}
            </Button>
            <Collapse in={expanded}>
                <Box
                    component="pre"
                    sx={{
                        p: 2,
                        bgcolor: "background.default",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                        overflowX: "auto",
                        fontSize: "0.75rem",
                        fontFamily: "monospace",
                        maxHeight: "400px",
                        whiteSpace: "pre-wrap",
                        wordWrap: "break-word",
                    }}
                >
                    {JSON.stringify(settings, null, 2)}
                    {JSON.stringify(data, null, 2)}
                </Box>
            </Collapse>
        </Box>
    );
};

export default DebugView;
