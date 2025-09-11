import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, TableCell, TableRow } from "@mui/material";
import { useAppSettings } from "../hooks/useAppSettings";
import type { Transaction } from "../types";
import { formatCurrency } from "../utils/currencyUtils";

interface SortableTransactionRowProps {
    transaction: Transaction;
    onEdit: (transaction: Transaction) => void;
    onDelete: (transaction: Transaction, e: React.MouseEvent) => void;
}

export const SortableTransactionRow = ({ transaction, onEdit, onDelete }: SortableTransactionRowProps) => {
    const { settings } = useAppSettings();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: transaction.id,
        transition: {
            duration: 150,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        },
    });

    // Add touch-action and user-select to prevent default touch behaviors
    const dragHandleProps = {
        ...attributes,
        ...listeners,
        style: {
            touchAction: "none" as const,
            WebkitUserSelect: "none" as const,
            userSelect: "none" as const,
        },
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1 : "auto",
        position: "relative",
    } as React.CSSProperties;

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            sx={{
                "&:hover": {
                    backgroundColor: "action.hover",
                },
                cursor: isDragging ? "grabbing" : "grab",
                touchAction: "none",
                ...(isDragging && {
                    "& td": {
                        borderBottom: "1px solid rgba(224, 224, 224, 1)",
                    },
                }),
            }}
        >
            <TableCell
                {...dragHandleProps}
                sx={{
                    width: 40,
                    p: 0,
                    textAlign: "center",
                    cursor: isDragging ? "grabbing" : "grab",
                    "&:active": {
                        cursor: "grabbing" as const,
                        backgroundColor: "action.hover",
                    },
                    // Increase touch target size for better mobile experience
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: "-10px",
                        right: "-10px",
                        bottom: "-10px",
                        left: "-10px",
                    },
                }}
            >
                <DragIndicatorIcon
                    sx={{
                        color: "action.active",
                        opacity: 0.7,
                        "&:hover": {
                            opacity: 1,
                        },
                    }}
                />
            </TableCell>
            <TableCell>{transaction.name}</TableCell>
            <TableCell
                align="right"
                sx={{
                    color: transaction.type === "earnings" ? "success.main" : "error.main",
                }}
            >
                {formatCurrency(parseFloat(transaction.amount), settings?.currency.code)}
            </TableCell>
            <TableCell sx={{ textTransform: "capitalize" }}>{transaction.type}</TableCell>
            <TableCell align="right">
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(transaction);
                    }}
                    color="primary"
                >
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={(e) => onDelete(transaction, e)} color="error">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};
