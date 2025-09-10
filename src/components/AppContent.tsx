import { useTransactionCalculations } from "../hooks/useTransactionCalculations";
import { useTransactionSubmission } from "../hooks/useTransactionSubmission";
import { SummaryCards } from "./SummaryCards";
import { TransactionList } from "./TransactionList";

const AppContent = () => {
    const { transactions } = useTransactionSubmission();
    const { totalEarnings, totalSpendings, balance } = useTransactionCalculations(transactions);

    return (
        <>
            <SummaryCards totalEarnings={totalEarnings} totalSpendings={totalSpendings} balance={balance} />
            <TransactionList transactions={transactions} />
        </>
    );
};

export default AppContent;
