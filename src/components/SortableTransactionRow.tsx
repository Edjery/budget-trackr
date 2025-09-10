import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, TableCell, TableRow } from "@mui/material";
import type { Transaction } from "../types";

interface SortableTransactionRowProps {
    transaction: Transaction;
    onEdit: (transaction: Transaction) => void;
    onDelete: (transaction: Transaction, e: React.MouseEvent) => void;
}

export const SortableTransactionRow = ({ transaction, onEdit, onDelete }: SortableTransactionRowProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: transaction.id,
        transition: {
            duration: 150,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
        },
    });

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
                {...attributes}
                {...listeners}
                sx={{
                    width: "40px",
                    p: 0,
                    textAlign: "center",
                    cursor: isDragging ? "grabbing" : "grab",
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
                {transaction.type === "earnings" ? "+" : "-"}${parseFloat(transaction.amount).toFixed(2)}
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
