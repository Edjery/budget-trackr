import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { getLocaleByLanguage } from "../constants/languages";
import { useSettings } from "../hooks/useSettings";
import { useTransactionOrder } from "../hooks/useTransactionOrder";
import type { Transaction } from "../types";
import { formatCurrency } from "../utils/currencyUtils";
import { SortableTransactionRow } from "./SortableTransactionRow";

interface TransactionDetailsDialogProps {
    open: boolean;
    onClose: () => void;
    transaction: Transaction | null;
    onEdit?: (transaction: Transaction) => void;
    onDelete?: (transaction: Transaction) => void;
    onAddTransaction?: (date: string) => void;
    transactions: Transaction[];
}

export const TransactionDetailsDialog = ({
    open,
    onClose,
    transaction: selectedTransaction,
    onEdit,
    onDelete,
    onAddTransaction,
    transactions,
}: TransactionDetailsDialogProps) => {
    const { t } = useTranslation();
    const { settings } = useSettings();
    const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
    const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
    const handleDeleteClick = (transaction: Transaction, e: React.MouseEvent) => {
        e.stopPropagation();
        setTransactionToDelete(transaction);
    };

    const handleDeleteAllClick = () => {
        setShowDeleteAllDialog(true);
    };

    const handleCancelDelete = () => {
        setTransactionToDelete(null);
        setShowDeleteAllDialog(false);
    };

    const handleConfirmDelete = () => {
        if (transactionToDelete) {
            onDelete?.(transactionToDelete);
            setTransactionToDelete(null);
        }
    };

    const handleConfirmDeleteAll = () => {
        if (onDelete && selectedDateTransactions.length > 0) {
            // Delete all transactions for the selected date
            selectedDateTransactions.forEach((transaction) => {
                onDelete(transaction);
            });
            setShowDeleteAllDialog(false);
            onClose();
        }
    };

    if (!selectedTransaction) return null;

    // Group transactions by date
    const groupedTransactions = transactions.reduce((acc: Record<string, Transaction[]>, t) => {
        if (!acc[t.date]) {
            acc[t.date] = [];
        }
        acc[t.date].push(t);
        return acc;
    }, {});

    const selectedDateTransactions = selectedTransaction?.date
        ? groupedTransactions[selectedTransaction.date] || []
        : [];

    // Use the transaction order hook
    const { sortedTransactions, updateOrder } = useTransactionOrder(selectedTransaction?.date || "");

    // Set up sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
                tolerance: 5,
                delay: 100,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Get the query client
    const queryClient = useQueryClient();

    // Handle drag end event
    const handleDragEnd = useCallback(
        async (event: any) => {
            const { active, over } = event;
            if (active.id !== over.id) {
                await updateOrder(active.id, over.id);
                // Refresh the transactions after reordering
                queryClient.invalidateQueries({ queryKey: ["transactions"] });
            }
        },
        [updateOrder, queryClient]
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                <Box display="flex" justifyContent="space-between">
                    {t("transaction.details")}
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Typography color="textPrimary" fontWeight="bold" gutterBottom>
                    {new Date(selectedTransaction.date).toLocaleDateString(getLocaleByLanguage(settings?.language), {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "long",
                    })}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box mb={3}>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell width={40}></TableCell>
                                    <TableCell>{t("transaction.name")}</TableCell>
                                    <TableCell align="right">{t("transaction.amount")}</TableCell>
                                    <TableCell>{t("transaction.type")}</TableCell>
                                    <TableCell align="right">{t("common.actionsLabel")}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                    autoScroll={false}
                                >
                                    <SortableContext
                                        items={sortedTransactions.map((tx) => tx.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {sortedTransactions.map((transaction) => (
                                            <SortableTransactionRow
                                                key={transaction.id}
                                                transaction={transaction}
                                                onEdit={onEdit || (() => {})}
                                                onDelete={handleDeleteClick}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, flexDirection: "column", gap: 2, alignItems: "flex-start" }}>
                <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight="bold" my={2}>
                        {t("transaction.totalForDay")}:{" "}
                        {(() => {
                            const total = selectedDateTransactions.reduce((sum, t) => {
                                const amount = parseFloat(t.amount) || 0;
                                return t.type === "earnings" ? sum + amount : sum - amount;
                            }, 0);

                            return formatCurrency(total, settings?.currency.code);
                        })()}
                    </Typography>
                </Box>
                <Box display="flex" gap={2} width="100%" justifyContent="space-between">
                    <Box display="flex" gap={1}>
                        {onAddTransaction && (
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddTransaction(selectedTransaction.date);
                                }}
                                color="primary"
                                variant="contained"
                                startIcon={<AddIcon />}
                            >
                                {t("transaction.add")}
                            </Button>
                        )}
                        {onDelete && selectedDateTransactions.length > 0 && (
                            <Button
                                onClick={handleDeleteAllClick}
                                color="error"
                                variant="contained"
                                startIcon={<DeleteIcon />}
                            >
                                {t("transaction.deleteAll")}
                            </Button>
                        )}
                    </Box>
                    <Button onClick={onClose}>{t("common.actions.close")}</Button>
                </Box>
            </DialogActions>

            {/* Single Transaction Delete Confirmation Dialog */}
            <Dialog open={!!transactionToDelete} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
                <DialogTitle>
                    <Box display="flex" alignItems="center" gap={1}>
                        <WarningAmberIcon color="warning" />
                        <span>{t("transaction.deleteTitle")}</span>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography>{t("transaction.deleteConfirmation")}</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: "flex-end" }}>
                    <Button onClick={handleCancelDelete} color="inherit">
                        {t("common.actions.cancel")}
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" startIcon={<DeleteIcon />}>
                        {t("common.actions.delete")}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete All Confirmation Dialog */}
            <Dialog open={showDeleteAllDialog} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
                <DialogTitle>
                    <Box display="flex" alignItems="center" gap={1}>
                        <WarningAmberIcon color="error" />
                        <span>{t("transaction.deleteAllTitle")}</span>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {t("transaction.deleteAllConfirmation", { count: selectedDateTransactions.length })}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: "flex-end" }}>
                    <Button onClick={handleCancelDelete} color="inherit">
                        {t("common.actions.cancel")}
                    </Button>
                    <Button
                        onClick={handleConfirmDeleteAll}
                        color="error"
                        variant="contained"
                        startIcon={<DeleteIcon />}
                    >
                        {t("transaction.deleteAll")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default TransactionDetailsDialog;
