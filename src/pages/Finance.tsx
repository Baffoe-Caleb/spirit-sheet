// src/pages/Finance.tsx

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Plus,
    Search,
    Filter,
    Loader2,
    RefreshCw,
    Edit,
    Trash2,
    MoreHorizontal,
    ArrowUpCircle,
    ArrowDownCircle,
    Users,
    PieChart,
    Calendar,
    CreditCard,
    Banknote,
    Receipt,
    Download,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/redux/reducers";
import {
    fetchIncomeRequest,
    fetchExpensesRequest,
    createIncomeRequest,
    updateIncomeRequest,
    deleteIncomeRequest,
    createExpenseRequest,
    updateExpenseRequest,
    deleteExpenseRequest,
    fetchFinancialCategoriesRequest,
    fetchDonorsRequest,
    fetchFinancialSummaryRequest,
    fetchCashFlowRequest,
    fetchGivingAnalysisRequest,
    setFinanceTab,
    resetFinanceOperation,
} from "@/redux/actions/financeActions";
import { fetchMembersRequest } from "@/redux/actions/memberActions";
import { IncomeFormData, ExpenseFormData, FinanceTransaction } from "@/services/api";

// ============================================
// CONSTANTS
// ============================================

const PAYMENT_METHODS = [
    { value: "cash", label: "Cash" },
    { value: "check", label: "Check" },
    { value: "credit_card", label: "Credit Card" },
    { value: "debit_card", label: "Debit Card" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "online", label: "Online" },
    { value: "mobile_payment", label: "Mobile Payment" },
    { value: "other", label: "Other" },
];

const INCOME_SOURCES = [
    { value: "tithes", label: "Tithes" },
    { value: "offerings", label: "Offerings" },
    { value: "donations", label: "Donations" },
    { value: "fundraising", label: "Fundraising" },
    { value: "grants", label: "Grants" },
    { value: "rental", label: "Rental Income" },
    { value: "other", label: "Other" },
];

const INITIAL_INCOME_FORM: IncomeFormData = {
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    category: "tithes",
    incomeSource: "tithes",
    paymentMethod: "cash",
    description: "",
    isTaxDeductible: true,
    isAnonymous: false,
};

const INITIAL_EXPENSE_FORM: ExpenseFormData = {
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    category: "facilities",
    paymentMethod: "check",
    vendor: "",
    description: "",
};

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(amount);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const getPaymentMethodIcon = (method: string) => {
    switch (method) {
        case "cash":
            return <Banknote className="h-4 w-4" />;
        case "check":
            return <Receipt className="h-4 w-4" />;
        case "credit_card":
        case "debit_card":
            return <CreditCard className="h-4 w-4" />;
        default:
            return <DollarSign className="h-4 w-4" />;
    }
};

const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
        tithes: "bg-blue-100 text-blue-800",
        offerings: "bg-green-100 text-green-800",
        donations: "bg-purple-100 text-purple-800",
        fundraising: "bg-orange-100 text-orange-800",
        grants: "bg-indigo-100 text-indigo-800",
        rental: "bg-cyan-100 text-cyan-800",
        personnel: "bg-red-100 text-red-800",
        facilities: "bg-yellow-100 text-yellow-800",
        programs: "bg-pink-100 text-pink-800",
        administrative: "bg-gray-100 text-gray-800",
        missions: "bg-teal-100 text-teal-800",
        utilities: "bg-amber-100 text-amber-800",
        default: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.default;
};

// ============================================
// COMPONENT
// ============================================

const Finance = () => {
    const dispatch = useDispatch();
    const { toast } = useToast();

    // Redux State
    const {
        incomeTransactions,
        incomePagination,
        incomeSummary,
        isLoadingIncome,
        isCreatingIncome,
        isUpdatingIncome,
        isDeletingIncome,
        createIncomeSuccess,
        updateIncomeSuccess,
        deleteIncomeSuccess,
        incomeError,
        expenseTransactions,
        expensePagination,
        expenseSummary,
        isLoadingExpenses,
        isCreatingExpense,
        isUpdatingExpense,
        isDeletingExpense,
        createExpenseSuccess,
        updateExpenseSuccess,
        deleteExpenseSuccess,
        expenseError,
        incomeCategories,
        expenseCategories,
        donors,
        isLoadingDonors,
        financialSummary,
        isLoadingSummary,
        cashFlow,
        isLoadingCashFlow,
        givingAnalysis,
        isLoadingGiving,
        activeTab,
    } = useSelector((state: RootState) => state.finance);

    const { members } = useSelector((state: RootState) => state.members);

    // Local State
    const [searchTerm, setSearchTerm] = useState("");
    const [currentIncomePage, setCurrentIncomePage] = useState(1);
    const [currentExpensePage, setCurrentExpensePage] = useState(1);

    // Income Modal State
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [isEditingIncome, setIsEditingIncome] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState<FinanceTransaction | null>(null);
    const [incomeFormData, setIncomeFormData] = useState<IncomeFormData>(INITIAL_INCOME_FORM);

    // Expense Modal State
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isEditingExpense, setIsEditingExpense] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<FinanceTransaction | null>(null);
    const [expenseFormData, setExpenseFormData] = useState<ExpenseFormData>(INITIAL_EXPENSE_FORM);

    // Delete Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<{
        id: string;
        type: "income" | "expense";
    } | null>(null);

    // Refs for tracking operations
    const isCreatingIncomeRef = useRef(false);
    const isUpdatingIncomeRef = useRef(false);
    const isDeletingIncomeRef = useRef(false);
    const isCreatingExpenseRef = useRef(false);
    const isUpdatingExpenseRef = useRef(false);
    const isDeletingExpenseRef = useRef(false);

    // ============================================
    // EFFECTS
    // ============================================

    // Initial data fetch
    useEffect(() => {
        dispatch(fetchFinancialCategoriesRequest());
        dispatch(fetchFinancialSummaryRequest({ period: "current-month" }));
        dispatch(fetchCashFlowRequest({ year: new Date().getFullYear() }));
        dispatch(fetchGivingAnalysisRequest({ year: new Date().getFullYear() }));
        dispatch(fetchMembersRequest({ status: "active" }));
    }, [dispatch]);

    // Fetch data based on active tab
    useEffect(() => {
        if (activeTab === "income") {
            dispatch(fetchIncomeRequest({ page: currentIncomePage, limit: 10 }));
        } else if (activeTab === "expenses") {
            dispatch(fetchExpensesRequest({ page: currentExpensePage, limit: 10 }));
        } else if (activeTab === "donors") {
            dispatch(fetchDonorsRequest({ year: new Date().getFullYear() }));
        }
    }, [dispatch, activeTab, currentIncomePage, currentExpensePage]);

    // Handle Income Create Success
    useEffect(() => {
        if (!isCreatingIncomeRef.current) return;
        if (isCreatingIncome) return;

        if (incomeError) {
            toast({ title: "Error", description: incomeError, variant: "destructive" });
            isCreatingIncomeRef.current = false;
        } else if (createIncomeSuccess) {
            toast({ title: "Success", description: "Income recorded successfully" });
            setIsIncomeModalOpen(false);
            setIncomeFormData(INITIAL_INCOME_FORM);
            isCreatingIncomeRef.current = false;
            dispatch(resetFinanceOperation());
            dispatch(fetchFinancialSummaryRequest({ period: "current-month" }));
        }
    }, [isCreatingIncome, incomeError, createIncomeSuccess, toast, dispatch]);

    // Handle Income Update Success
    useEffect(() => {
        if (!isUpdatingIncomeRef.current) return;
        if (isUpdatingIncome) return;

        if (incomeError) {
            toast({ title: "Error", description: incomeError, variant: "destructive" });
            isUpdatingIncomeRef.current = false;
        } else if (updateIncomeSuccess) {
            toast({ title: "Success", description: "Income updated successfully" });
            setIsIncomeModalOpen(false);
            setIncomeFormData(INITIAL_INCOME_FORM);
            setIsEditingIncome(false);
            setSelectedIncome(null);
            isUpdatingIncomeRef.current = false;
            dispatch(resetFinanceOperation());
        }
    }, [isUpdatingIncome, incomeError, updateIncomeSuccess, toast, dispatch]);

    // Handle Income Delete Success
    useEffect(() => {
        if (!isDeletingIncomeRef.current) return;
        if (isDeletingIncome) return;

        if (incomeError) {
            toast({ title: "Error", description: incomeError, variant: "destructive" });
            isDeletingIncomeRef.current = false;
        } else if (deleteIncomeSuccess) {
            toast({ title: "Success", description: "Income deleted successfully" });
            setDeleteDialogOpen(false);
            setTransactionToDelete(null);
            isDeletingIncomeRef.current = false;
            dispatch(resetFinanceOperation());
            dispatch(fetchFinancialSummaryRequest({ period: "current-month" }));
        }
    }, [isDeletingIncome, incomeError, deleteIncomeSuccess, toast, dispatch]);

    // Handle Expense Create Success
    useEffect(() => {
        if (!isCreatingExpenseRef.current) return;
        if (isCreatingExpense) return;

        if (expenseError) {
            toast({ title: "Error", description: expenseError, variant: "destructive" });
            isCreatingExpenseRef.current = false;
        } else if (createExpenseSuccess) {
            toast({ title: "Success", description: "Expense recorded successfully" });
            setIsExpenseModalOpen(false);
            setExpenseFormData(INITIAL_EXPENSE_FORM);
            isCreatingExpenseRef.current = false;
            dispatch(resetFinanceOperation());
            dispatch(fetchFinancialSummaryRequest({ period: "current-month" }));
        }
    }, [isCreatingExpense, expenseError, createExpenseSuccess, toast, dispatch]);

    // Handle Expense Update Success
    useEffect(() => {
        if (!isUpdatingExpenseRef.current) return;
        if (isUpdatingExpense) return;

        if (expenseError) {
            toast({ title: "Error", description: expenseError, variant: "destructive" });
            isUpdatingExpenseRef.current = false;
        } else if (updateExpenseSuccess) {
            toast({ title: "Success", description: "Expense updated successfully" });
            setIsExpenseModalOpen(false);
            setExpenseFormData(INITIAL_EXPENSE_FORM);
            setIsEditingExpense(false);
            setSelectedExpense(null);
            isUpdatingExpenseRef.current = false;
            dispatch(resetFinanceOperation());
        }
    }, [isUpdatingExpense, expenseError, updateExpenseSuccess, toast, dispatch]);

    // Handle Expense Delete Success
    useEffect(() => {
        if (!isDeletingExpenseRef.current) return;
        if (isDeletingExpense) return;

        if (expenseError) {
            toast({ title: "Error", description: expenseError, variant: "destructive" });
            isDeletingExpenseRef.current = false;
        } else if (deleteExpenseSuccess) {
            toast({ title: "Success", description: "Expense deleted successfully" });
            setDeleteDialogOpen(false);
            setTransactionToDelete(null);
            isDeletingExpenseRef.current = false;
            dispatch(resetFinanceOperation());
            dispatch(fetchFinancialSummaryRequest({ period: "current-month" }));
        }
    }, [isDeletingExpense, expenseError, deleteExpenseSuccess, toast, dispatch]);

    // ============================================
    // HANDLERS
    // ============================================

    const handleTabChange = (tab: string) => {
        dispatch(setFinanceTab(tab));
    };

    const handleRefresh = () => {
        dispatch(fetchFinancialSummaryRequest({ period: "current-month" }));
        if (activeTab === "income") {
            dispatch(fetchIncomeRequest({ page: currentIncomePage, limit: 10 }));
        } else if (activeTab === "expenses") {
            dispatch(fetchExpensesRequest({ page: currentExpensePage, limit: 10 }));
        }
    };

    // Income Handlers
    const handleOpenIncomeModal = () => {
        setIsEditingIncome(false);
        setIncomeFormData(INITIAL_INCOME_FORM);
        setIsIncomeModalOpen(true);
    };

    const handleEditIncome = (transaction: FinanceTransaction) => {
        setIsEditingIncome(true);
        setSelectedIncome(transaction);
        setIncomeFormData({
            date: transaction.date.split("T")[0],
            amount: transaction.amount,
            category: transaction.category,
            incomeSource: transaction.incomeSource,
            donorId: transaction.donorId?._id,
            donorName: transaction.donorName,
            isAnonymous: transaction.isAnonymous,
            isTaxDeductible: transaction.isTaxDeductible,
            paymentMethod: transaction.paymentMethod,
            checkNumber: transaction.checkNumber,
            description: transaction.description,
            notes: transaction.notes,
        });
        setIsIncomeModalOpen(true);
    };

    const handleSubmitIncome = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditingIncome && selectedIncome) {
            isUpdatingIncomeRef.current = true;
            dispatch(updateIncomeRequest(selectedIncome._id, incomeFormData));
        } else {
            isCreatingIncomeRef.current = true;
            dispatch(createIncomeRequest(incomeFormData));
        }
    };

    // Expense Handlers
    const handleOpenExpenseModal = () => {
        setIsEditingExpense(false);
        setExpenseFormData(INITIAL_EXPENSE_FORM);
        setIsExpenseModalOpen(true);
    };

    const handleEditExpense = (transaction: FinanceTransaction) => {
        setIsEditingExpense(true);
        setSelectedExpense(transaction);
        setExpenseFormData({
            date: transaction.date.split("T")[0],
            amount: transaction.amount,
            category: transaction.category,
            vendor: transaction.vendor,
            payee: transaction.payee,
            paymentMethod: transaction.paymentMethod,
            checkNumber: transaction.checkNumber,
            description: transaction.description,
            notes: transaction.notes,
        });
        setIsExpenseModalOpen(true);
    };

    const handleSubmitExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditingExpense && selectedExpense) {
            isUpdatingExpenseRef.current = true;
            dispatch(updateExpenseRequest(selectedExpense._id, expenseFormData));
        } else {
            isCreatingExpenseRef.current = true;
            dispatch(createExpenseRequest(expenseFormData));
        }
    };

    // Delete Handler
    const handleDeleteTransaction = (id: string, type: "income" | "expense") => {
        setTransactionToDelete({ id, type });
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!transactionToDelete) return;

        if (transactionToDelete.type === "income") {
            isDeletingIncomeRef.current = true;
            dispatch(deleteIncomeRequest(transactionToDelete.id));
        } else {
            isDeletingExpenseRef.current = true;
            dispatch(deleteExpenseRequest(transactionToDelete.id));
        }
    };

    // ============================================
    // RENDER
    // ============================================

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Finance</h1>
                    <p className="text-muted-foreground">
                        Manage income, expenses, and financial reports
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleRefresh}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            {isLoadingSummary ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card className="shadow-soft">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Income
                            </CardTitle>
                            <ArrowUpCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(financialSummary?.totalIncome || 0)}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                                {(financialSummary?.growth?.income || 0) >= 0 ? (
                                    <TrendingUp className="h-3 w-3 text-green-600" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 text-red-600" />
                                )}
                                <span
                                    className={`text-xs font-medium ${(financialSummary?.growth?.income || 0) >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}
                                >
                                    {financialSummary?.growth?.income || 0}% vs last period
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-soft">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Expenses
                            </CardTitle>
                            <ArrowDownCircle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {formatCurrency(financialSummary?.totalExpenses || 0)}
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                                {(financialSummary?.growth?.expenses || 0) <= 0 ? (
                                    <TrendingDown className="h-3 w-3 text-green-600" />
                                ) : (
                                    <TrendingUp className="h-3 w-3 text-red-600" />
                                )}
                                <span
                                    className={`text-xs font-medium ${(financialSummary?.growth?.expenses || 0) <= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}
                                >
                                    {Math.abs(financialSummary?.growth?.expenses || 0)}% vs last period
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-soft">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Net Income
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`text-2xl font-bold ${(financialSummary?.netIncome || 0) >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                            >
                                {formatCurrency(financialSummary?.netIncome || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">This month</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-soft">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Active Donors
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">
                                {givingAnalysis?.donorCount || 0}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Avg: {formatCurrency(givingAnalysis?.averageGiving || 0)}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    <TabsTrigger value="donors">Donors</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Cash Flow Chart */}
                        <Card className="shadow-soft">
                            <CardHeader>
                                <CardTitle>Cash Flow</CardTitle>
                                <CardDescription>Monthly income vs expenses</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoadingCashFlow ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                ) : cashFlow.length > 0 ? (
                                    <div className="space-y-3">
                                        {cashFlow.slice(-6).map((month, index) => (
                                            <div key={index} className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">{month.month}</span>
                                                    <span
                                                        className={`font-medium ${month.netFlow >= 0 ? "text-green-600" : "text-red-600"
                                                            }`}
                                                    >
                                                        {formatCurrency(month.netFlow)}
                                                    </span>
                                                </div>
                                                <div className="flex gap-1 h-2">
                                                    <div
                                                        className="bg-green-500 rounded"
                                                        style={{
                                                            width: `${month.income > 0
                                                                ? (month.income / (month.income + month.expenses)) * 100
                                                                : 0
                                                                }%`,
                                                        }}
                                                    />
                                                    <div
                                                        className="bg-red-500 rounded"
                                                        style={{
                                                            width: `${month.expenses > 0
                                                                ? (month.expenses / (month.income + month.expenses)) * 100
                                                                : 0
                                                                }%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex gap-4 text-xs mt-4">
                                            <div className="flex items-center gap-1">
                                                <div className="w-3 h-3 bg-green-500 rounded" />
                                                <span>Income</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-3 h-3 bg-red-500 rounded" />
                                                <span>Expenses</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                        <PieChart className="h-12 w-12 mb-4 opacity-50" />
                                        <p>No cash flow data available</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Giving Categories */}
                        <Card className="shadow-soft">
                            <CardHeader>
                                <CardTitle>Top Giving Categories</CardTitle>
                                <CardDescription>Income breakdown by category</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoadingGiving ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    </div>
                                ) : givingAnalysis?.topCategories?.length ? (
                                    <div className="space-y-4">
                                        {givingAnalysis.topCategories.map((cat, index) => (
                                            <div key={index}>
                                                <div className="flex justify-between mb-1">
                                                    <Badge className={getCategoryColor(cat.category)}>
                                                        {cat.category.charAt(0).toUpperCase() + cat.category.slice(1)}
                                                    </Badge>
                                                    <span className="text-sm font-medium">
                                                        {formatCurrency(cat.amount)} ({cat.percentage}%)
                                                    </span>
                                                </div>
                                                <Progress value={cat.percentage} className="h-2" />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                        <PieChart className="h-12 w-12 mb-4 opacity-50" />
                                        <p>No category data available</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="shadow-soft md:col-span-2">
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Common financial tasks</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Button
                                        className="h-auto py-4 flex flex-col gap-2"
                                        onClick={handleOpenIncomeModal}
                                    >
                                        <ArrowUpCircle className="h-6 w-6" />
                                        <span>Record Income</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-auto py-4 flex flex-col gap-2"
                                        onClick={handleOpenExpenseModal}
                                    >
                                        <ArrowDownCircle className="h-6 w-6" />
                                        <span>Record Expense</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-auto py-4 flex flex-col gap-2"
                                        onClick={() => handleTabChange("donors")}
                                    >
                                        <Users className="h-6 w-6" />
                                        <span>View Donors</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-auto py-4 flex flex-col gap-2"
                                    >
                                        <Download className="h-6 w-6" />
                                        <span>Export Report</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Income Tab */}
                <TabsContent value="income">
                    <Card className="shadow-soft">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Income Records</CardTitle>
                                <CardDescription>
                                    {incomeSummary
                                        ? `${incomeSummary.recordCount} records • Total: ${formatCurrency(
                                            incomeSummary.totalAmount
                                        )}`
                                        : "Manage all income transactions"}
                                </CardDescription>
                            </div>
                            <Button onClick={handleOpenIncomeModal}>
                                <Plus className="h-4 w-4 mr-2" />
                                Record Income
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {isLoadingIncome ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : incomeTransactions.length > 0 ? (
                                <>
                                    <div className="space-y-4">
                                        {incomeTransactions.map((transaction) => (
                                            <div
                                                key={transaction._id}
                                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <ArrowUpCircle className="h-5 w-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                                                            <Badge className={getCategoryColor(transaction.category)}>
                                                                {transaction.category}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>{formatDate(transaction.date)}</span>
                                                            {transaction.donorName && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>{transaction.donorName}</span>
                                                                </>
                                                            )}
                                                            {getPaymentMethodIcon(transaction.paymentMethod)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEditIncome(transaction)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => handleDeleteTransaction(transaction._id, "income")}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {incomePagination && incomePagination.pages > 1 && (
                                        <div className="flex items-center justify-between mt-6">
                                            <p className="text-sm text-muted-foreground">
                                                Page {incomePagination.page} of {incomePagination.pages}
                                            </p>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={currentIncomePage === 1}
                                                    onClick={() => setCurrentIncomePage((p) => p - 1)}
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={currentIncomePage === incomePagination.pages}
                                                    onClick={() => setCurrentIncomePage((p) => p + 1)}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <DollarSign className="h-12 w-12 mb-4 opacity-50" />
                                    <p className="text-lg font-medium">No income records</p>
                                    <p className="text-sm">Start by recording your first income</p>
                                    <Button className="mt-4" onClick={handleOpenIncomeModal}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Record Income
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Expenses Tab */}
                <TabsContent value="expenses">
                    <Card className="shadow-soft">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Expense Records</CardTitle>
                                <CardDescription>
                                    {expenseSummary
                                        ? `${expenseSummary.recordCount} records • Total: ${formatCurrency(
                                            expenseSummary.totalAmount
                                        )}`
                                        : "Manage all expense transactions"}
                                </CardDescription>
                            </div>
                            <Button onClick={handleOpenExpenseModal}>
                                <Plus className="h-4 w-4 mr-2" />
                                Record Expense
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {isLoadingExpenses ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : expenseTransactions.length > 0 ? (
                                <>
                                    <div className="space-y-4">
                                        {expenseTransactions.map((transaction) => (
                                            <div
                                                key={transaction._id}
                                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-red-100 rounded-lg">
                                                        <ArrowDownCircle className="h-5 w-5 text-red-600" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                                                            <Badge className={getCategoryColor(transaction.category)}>
                                                                {transaction.category}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Calendar className="h-3 w-3" />
                                                            <span>{formatDate(transaction.date)}</span>
                                                            {transaction.vendor && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>{transaction.vendor}</span>
                                                                </>
                                                            )}
                                                            {getPaymentMethodIcon(transaction.paymentMethod)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => handleEditExpense(transaction)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => handleDeleteTransaction(transaction._id, "expense")}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {expensePagination && expensePagination.pages > 1 && (
                                        <div className="flex items-center justify-between mt-6">
                                            <p className="text-sm text-muted-foreground">
                                                Page {expensePagination.page} of {expensePagination.pages}
                                            </p>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={currentExpensePage === 1}
                                                    onClick={() => setCurrentExpensePage((p) => p - 1)}
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={currentExpensePage === expensePagination.pages}
                                                    onClick={() => setCurrentExpensePage((p) => p + 1)}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <DollarSign className="h-12 w-12 mb-4 opacity-50" />
                                    <p className="text-lg font-medium">No expense records</p>
                                    <p className="text-sm">Start by recording your first expense</p>
                                    <Button className="mt-4" onClick={handleOpenExpenseModal}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Record Expense
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Donors Tab */}
                <TabsContent value="donors">
                    <Card className="shadow-soft">
                        <CardHeader>
                            <CardTitle>Donors</CardTitle>
                            <CardDescription>
                                {donors.length} donors • Total giving: {formatCurrency(givingAnalysis?.totalGiving || 0)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoadingDonors ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : donors.length > 0 ? (
                                <div className="space-y-4">
                                    {donors.map((donor) => (
                                        <div
                                            key={donor.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-primary font-medium">
                                                        {donor.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{donor.name}</p>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <span>{donor.giftCount} gifts</span>
                                                        <span>•</span>
                                                        <span>Avg: {formatCurrency(donor.averageGiving)}</span>
                                                        <Badge variant="outline">{donor.frequency}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-primary">
                                                    {formatCurrency(donor.totalGiving)}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    Last: {formatDate(donor.lastGift)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <Users className="h-12 w-12 mb-4 opacity-50" />
                                    <p className="text-lg font-medium">No donors yet</p>
                                    <p className="text-sm">Donors will appear here when you record income with donor information</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Income Modal */}
            <Dialog open={isIncomeModalOpen} onOpenChange={setIsIncomeModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{isEditingIncome ? "Edit Income" : "Record Income"}</DialogTitle>
                        <DialogDescription>
                            {isEditingIncome ? "Update income record details" : "Add a new income transaction"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitIncome}>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="income-date">Date *</Label>
                                    <Input
                                        id="income-date"
                                        type="date"
                                        value={incomeFormData.date}
                                        onChange={(e) =>
                                            setIncomeFormData({ ...incomeFormData, date: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="income-amount">Amount *</Label>
                                    <Input
                                        id="income-amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={incomeFormData.amount || ""}
                                        onChange={(e) =>
                                            setIncomeFormData({
                                                ...incomeFormData,
                                                amount: parseFloat(e.target.value) || 0,
                                            })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="income-category">Category *</Label>
                                <Select
                                    value={incomeFormData.category}
                                    onValueChange={(value) =>
                                        setIncomeFormData({ ...incomeFormData, category: value, incomeSource: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {INCOME_SOURCES.map((source) => (
                                            <SelectItem key={source.value} value={source.value}>
                                                {source.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="income-donor">Donor (Optional)</Label>
                                <Select
                                    value={incomeFormData.donorId || ""}
                                    onValueChange={(value) => {
                                        const member = members.find((m) => m._id === value);
                                        setIncomeFormData({
                                            ...incomeFormData,
                                            donorId: value,
                                            donorName: member ? `${member.firstName} ${member.lastName}` : "",
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select donor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">Anonymous</SelectItem>
                                        {members.map((member) => (
                                            <SelectItem key={member._id} value={member._id}>
                                                {member.firstName} {member.lastName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="income-method">Payment Method *</Label>
                                <Select
                                    value={incomeFormData.paymentMethod}
                                    onValueChange={(value) =>
                                        setIncomeFormData({ ...incomeFormData, paymentMethod: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PAYMENT_METHODS.map((method) => (
                                            <SelectItem key={method.value} value={method.value}>
                                                {method.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="income-description">Description</Label>
                                <Textarea
                                    id="income-description"
                                    value={incomeFormData.description || ""}
                                    onChange={(e) =>
                                        setIncomeFormData({ ...incomeFormData, description: e.target.value })
                                    }
                                    rows={2}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsIncomeModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isCreatingIncome || isUpdatingIncome}
                            >
                                {(isCreatingIncome || isUpdatingIncome) && (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                )}
                                {isEditingIncome ? "Update" : "Record"} Income
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Expense Modal */}
            <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{isEditingExpense ? "Edit Expense" : "Record Expense"}</DialogTitle>
                        <DialogDescription>
                            {isEditingExpense ? "Update expense record details" : "Add a new expense transaction"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitExpense}>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="expense-date">Date *</Label>
                                    <Input
                                        id="expense-date"
                                        type="date"
                                        value={expenseFormData.date}
                                        onChange={(e) =>
                                            setExpenseFormData({ ...expenseFormData, date: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="expense-amount">Amount *</Label>
                                    <Input
                                        id="expense-amount"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={expenseFormData.amount || ""}
                                        onChange={(e) =>
                                            setExpenseFormData({
                                                ...expenseFormData,
                                                amount: parseFloat(e.target.value) || 0,
                                            })
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="expense-category">Category *</Label>
                                <Select
                                    value={expenseFormData.category}
                                    onValueChange={(value) =>
                                        setExpenseFormData({ ...expenseFormData, category: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="personnel">Personnel</SelectItem>
                                        <SelectItem value="facilities">Facilities</SelectItem>
                                        <SelectItem value="programs">Programs</SelectItem>
                                        <SelectItem value="administrative">Administrative</SelectItem>
                                        <SelectItem value="missions">Missions</SelectItem>
                                        <SelectItem value="utilities">Utilities</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="expense-vendor">Vendor/Payee</Label>
                                <Input
                                    id="expense-vendor"
                                    value={expenseFormData.vendor || ""}
                                    onChange={(e) =>
                                        setExpenseFormData({ ...expenseFormData, vendor: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <Label htmlFor="expense-method">Payment Method *</Label>
                                <Select
                                    value={expenseFormData.paymentMethod}
                                    onValueChange={(value) =>
                                        setExpenseFormData({ ...expenseFormData, paymentMethod: value })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PAYMENT_METHODS.map((method) => (
                                            <SelectItem key={method.value} value={method.value}>
                                                {method.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="expense-description">Description</Label>
                                <Textarea
                                    id="expense-description"
                                    value={expenseFormData.description || ""}
                                    onChange={(e) =>
                                        setExpenseFormData({ ...expenseFormData, description: e.target.value })
                                    }
                                    rows={2}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsExpenseModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isCreatingExpense || isUpdatingExpense}
                            >
                                {(isCreatingExpense || isUpdatingExpense) && (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                )}
                                {isEditingExpense ? "Update" : "Record"} Expense
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this {transactionToDelete?.type} record? This action
                            cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {(isDeletingIncome || isDeletingExpense) && (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            )}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Finance;