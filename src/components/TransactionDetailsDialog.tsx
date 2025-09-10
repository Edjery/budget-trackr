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
import { useCallback, useState } from "react";
import { useTransactionOrder } from "../hooks/useTransactionOrder";
import type { Transaction } from "../types";
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

    // Handle drag end event
    const handleDragEnd = useCallback(
        (event: any) => {
            const { active, over } = event;
            if (active.id !== over.id) {
                updateOrder(active.id, over.id);
            }
        },
        [updateOrder]
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                <Box display="flex" justifyContent="space-between">
                    Transaction Details
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

                <Typography variant="h6" color="textPrimary" fontWeight="bold" gutterBottom>
                    {new Date(selectedTransaction.date).toLocaleDateString("en-PH", {
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
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                                autoScroll={false}
                            >
                                <TableBody>
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
                                </TableBody>
                            </DndContext>
                        </Table>
                    </TableContainer>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, flexDirection: "column", gap: 2, alignItems: "flex-start" }}>
                <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
                    <Typography fontWeight="bold" my={2}>
                        Total for this day:{" "}
                        {(() => {
                            const total = selectedDateTransactions.reduce((sum, t) => {
                                const amount = parseFloat(t.amount) || 0;
                                return t.type === "earnings" ? sum + amount : sum - amount;
                            }, 0);
                            const formattedTotal = Math.abs(total).toFixed(2);
                            return total < 0 ? `-$${formattedTotal}` : `$${formattedTotal}`;
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
                                Add
                            </Button>
                        )}
                        {onDelete && selectedDateTransactions.length > 0 && (
                            <Button
                                onClick={handleDeleteAllClick}
                                color="error"
                                variant="contained"
                                startIcon={<DeleteIcon />}
                            >
                                Delete All
                            </Button>
                        )}
                    </Box>
                    <Button onClick={onClose}>Close</Button>
                </Box>
            </DialogActions>

            {/* Single Transaction Delete Confirmation Dialog */}
            <Dialog open={!!transactionToDelete} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
                <DialogTitle>
                    <Box display="flex" alignItems="center" gap={1}>
                        <WarningAmberIcon color="warning" />
                        <span>Delete Transaction</span>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this transaction? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: "flex-end" }}>
                    <Button onClick={handleCancelDelete} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained" startIcon={<DeleteIcon />}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete All Confirmation Dialog */}
            <Dialog open={showDeleteAllDialog} onClose={handleCancelDelete} maxWidth="xs" fullWidth>
                <DialogTitle>
                    <Box display="flex" alignItems="center" gap={1}>
                        <WarningAmberIcon color="error" />
                        <span>Delete All Transactions</span>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete all {selectedDateTransactions.length} transactions for this
                        date? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: "flex-end" }}>
                    <Button onClick={handleCancelDelete} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDeleteAll}
                        color="error"
                        variant="contained"
                        startIcon={<DeleteIcon />}
                    >
                        Delete All
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};

export default TransactionDetailsDialog;
