// src/redux/actions/financeActions.ts

import {
  FinanceTransaction,
  IncomeFormData,
  ExpenseFormData,
  FinancialCategory,
  Donor,
  BudgetSummary,
  FinancialSummary,
  CashFlowData,
  GivingAnalysis,
  PaginationInfo,
  GetTransactionsParams,
} from '../../services/api';

// ============================================
// ACTION TYPES
// ============================================

// Income
export const FETCH_INCOME_REQUEST = 'finance/FETCH_INCOME_REQUEST';
export const FETCH_INCOME_SUCCESS = 'finance/FETCH_INCOME_SUCCESS';
export const FETCH_INCOME_FAILURE = 'finance/FETCH_INCOME_FAILURE';

export const CREATE_INCOME_REQUEST = 'finance/CREATE_INCOME_REQUEST';
export const CREATE_INCOME_SUCCESS = 'finance/CREATE_INCOME_SUCCESS';
export const CREATE_INCOME_FAILURE = 'finance/CREATE_INCOME_FAILURE';

export const UPDATE_INCOME_REQUEST = 'finance/UPDATE_INCOME_REQUEST';
export const UPDATE_INCOME_SUCCESS = 'finance/UPDATE_INCOME_SUCCESS';
export const UPDATE_INCOME_FAILURE = 'finance/UPDATE_INCOME_FAILURE';

export const DELETE_INCOME_REQUEST = 'finance/DELETE_INCOME_REQUEST';
export const DELETE_INCOME_SUCCESS = 'finance/DELETE_INCOME_SUCCESS';
export const DELETE_INCOME_FAILURE = 'finance/DELETE_INCOME_FAILURE';

// Expenses
export const FETCH_EXPENSES_REQUEST = 'finance/FETCH_EXPENSES_REQUEST';
export const FETCH_EXPENSES_SUCCESS = 'finance/FETCH_EXPENSES_SUCCESS';
export const FETCH_EXPENSES_FAILURE = 'finance/FETCH_EXPENSES_FAILURE';

export const CREATE_EXPENSE_REQUEST = 'finance/CREATE_EXPENSE_REQUEST';
export const CREATE_EXPENSE_SUCCESS = 'finance/CREATE_EXPENSE_SUCCESS';
export const CREATE_EXPENSE_FAILURE = 'finance/CREATE_EXPENSE_FAILURE';

export const UPDATE_EXPENSE_REQUEST = 'finance/UPDATE_EXPENSE_REQUEST';
export const UPDATE_EXPENSE_SUCCESS = 'finance/UPDATE_EXPENSE_SUCCESS';
export const UPDATE_EXPENSE_FAILURE = 'finance/UPDATE_EXPENSE_FAILURE';

export const DELETE_EXPENSE_REQUEST = 'finance/DELETE_EXPENSE_REQUEST';
export const DELETE_EXPENSE_SUCCESS = 'finance/DELETE_EXPENSE_SUCCESS';
export const DELETE_EXPENSE_FAILURE = 'finance/DELETE_EXPENSE_FAILURE';

// Categories
export const FETCH_FINANCIAL_CATEGORIES_REQUEST = 'finance/FETCH_CATEGORIES_REQUEST';
export const FETCH_FINANCIAL_CATEGORIES_SUCCESS = 'finance/FETCH_CATEGORIES_SUCCESS';
export const FETCH_FINANCIAL_CATEGORIES_FAILURE = 'finance/FETCH_CATEGORIES_FAILURE';

// Donors
export const FETCH_DONORS_REQUEST = 'finance/FETCH_DONORS_REQUEST';
export const FETCH_DONORS_SUCCESS = 'finance/FETCH_DONORS_SUCCESS';
export const FETCH_DONORS_FAILURE = 'finance/FETCH_DONORS_FAILURE';

// Budget
export const FETCH_BUDGET_REQUEST = 'finance/FETCH_BUDGET_REQUEST';
export const FETCH_BUDGET_SUCCESS = 'finance/FETCH_BUDGET_SUCCESS';
export const FETCH_BUDGET_FAILURE = 'finance/FETCH_BUDGET_FAILURE';

// Financial Summary
export const FETCH_FINANCIAL_SUMMARY_REQUEST = 'finance/FETCH_SUMMARY_REQUEST';
export const FETCH_FINANCIAL_SUMMARY_SUCCESS = 'finance/FETCH_SUMMARY_SUCCESS';
export const FETCH_FINANCIAL_SUMMARY_FAILURE = 'finance/FETCH_SUMMARY_FAILURE';

// Cash Flow
export const FETCH_CASH_FLOW_REQUEST = 'finance/FETCH_CASH_FLOW_REQUEST';
export const FETCH_CASH_FLOW_SUCCESS = 'finance/FETCH_CASH_FLOW_SUCCESS';
export const FETCH_CASH_FLOW_FAILURE = 'finance/FETCH_CASH_FLOW_FAILURE';

// Giving Analysis
export const FETCH_GIVING_ANALYSIS_REQUEST = 'finance/FETCH_GIVING_REQUEST';
export const FETCH_GIVING_ANALYSIS_SUCCESS = 'finance/FETCH_GIVING_SUCCESS';
export const FETCH_GIVING_ANALYSIS_FAILURE = 'finance/FETCH_GIVING_FAILURE';

// UI State
export const SET_FINANCE_TAB = 'finance/SET_TAB';
export const SET_FINANCE_DATE_RANGE = 'finance/SET_DATE_RANGE';
export const CLEAR_FINANCE_ERROR = 'finance/CLEAR_ERROR';
export const RESET_FINANCE_OPERATION = 'finance/RESET_OPERATION';
export const RESET_FINANCE_STATE = 'finance/RESET_STATE';

// ============================================
// ACTION INTERFACES
// ============================================

// Income Actions
interface FetchIncomeRequestAction {
  type: typeof FETCH_INCOME_REQUEST;
  payload?: GetTransactionsParams;
}

interface FetchIncomeSuccessAction {
  type: typeof FETCH_INCOME_SUCCESS;
  payload: {
    transactions: FinanceTransaction[];
    pagination: PaginationInfo;
    summary: { totalAmount: number; recordCount: number };
  };
}

interface FetchIncomeFailureAction {
  type: typeof FETCH_INCOME_FAILURE;
  payload: string;
}

interface CreateIncomeRequestAction {
  type: typeof CREATE_INCOME_REQUEST;
  payload: IncomeFormData;
}

interface CreateIncomeSuccessAction {
  type: typeof CREATE_INCOME_SUCCESS;
  payload: FinanceTransaction;
}

interface CreateIncomeFailureAction {
  type: typeof CREATE_INCOME_FAILURE;
  payload: string;
}

interface UpdateIncomeRequestAction {
  type: typeof UPDATE_INCOME_REQUEST;
  payload: { id: string; data: Partial<IncomeFormData> };
}

interface UpdateIncomeSuccessAction {
  type: typeof UPDATE_INCOME_SUCCESS;
  payload: FinanceTransaction;
}

interface UpdateIncomeFailureAction {
  type: typeof UPDATE_INCOME_FAILURE;
  payload: string;
}

interface DeleteIncomeRequestAction {
  type: typeof DELETE_INCOME_REQUEST;
  payload: string;
}

interface DeleteIncomeSuccessAction {
  type: typeof DELETE_INCOME_SUCCESS;
  payload: string;
}

interface DeleteIncomeFailureAction {
  type: typeof DELETE_INCOME_FAILURE;
  payload: string;
}

// Expense Actions
interface FetchExpensesRequestAction {
  type: typeof FETCH_EXPENSES_REQUEST;
  payload?: GetTransactionsParams;
}

interface FetchExpensesSuccessAction {
  type: typeof FETCH_EXPENSES_SUCCESS;
  payload: {
    transactions: FinanceTransaction[];
    pagination: PaginationInfo;
    summary: { totalAmount: number; recordCount: number };
  };
}

interface FetchExpensesFailureAction {
  type: typeof FETCH_EXPENSES_FAILURE;
  payload: string;
}

interface CreateExpenseRequestAction {
  type: typeof CREATE_EXPENSE_REQUEST;
  payload: ExpenseFormData;
}

interface CreateExpenseSuccessAction {
  type: typeof CREATE_EXPENSE_SUCCESS;
  payload: FinanceTransaction;
}

interface CreateExpenseFailureAction {
  type: typeof CREATE_EXPENSE_FAILURE;
  payload: string;
}

interface UpdateExpenseRequestAction {
  type: typeof UPDATE_EXPENSE_REQUEST;
  payload: { id: string; data: Partial<ExpenseFormData> };
}

interface UpdateExpenseSuccessAction {
  type: typeof UPDATE_EXPENSE_SUCCESS;
  payload: FinanceTransaction;
}

interface UpdateExpenseFailureAction {
  type: typeof UPDATE_EXPENSE_FAILURE;
  payload: string;
}

interface DeleteExpenseRequestAction {
  type: typeof DELETE_EXPENSE_REQUEST;
  payload: string;
}

interface DeleteExpenseSuccessAction {
  type: typeof DELETE_EXPENSE_SUCCESS;
  payload: string;
}

interface DeleteExpenseFailureAction {
  type: typeof DELETE_EXPENSE_FAILURE;
  payload: string;
}

// Categories Actions
interface FetchFinancialCategoriesRequestAction {
  type: typeof FETCH_FINANCIAL_CATEGORIES_REQUEST;
  payload?: string;
}

interface FetchFinancialCategoriesSuccessAction {
  type: typeof FETCH_FINANCIAL_CATEGORIES_SUCCESS;
  payload: {
    income?: FinancialCategory[];
    expense?: FinancialCategory[];
  };
}

interface FetchFinancialCategoriesFailureAction {
  type: typeof FETCH_FINANCIAL_CATEGORIES_FAILURE;
  payload: string;
}

// Donors Actions
interface FetchDonorsRequestAction {
  type: typeof FETCH_DONORS_REQUEST;
  payload?: { year?: number };
}

interface FetchDonorsSuccessAction {
  type: typeof FETCH_DONORS_SUCCESS;
  payload: Donor[];
}

interface FetchDonorsFailureAction {
  type: typeof FETCH_DONORS_FAILURE;
  payload: string;
}

// Budget Actions
interface FetchBudgetRequestAction {
  type: typeof FETCH_BUDGET_REQUEST;
  payload?: { year?: number; category?: string };
}

interface FetchBudgetSuccessAction {
  type: typeof FETCH_BUDGET_SUCCESS;
  payload: BudgetSummary;
}

interface FetchBudgetFailureAction {
  type: typeof FETCH_BUDGET_FAILURE;
  payload: string;
}

// Financial Summary Actions
interface FetchFinancialSummaryRequestAction {
  type: typeof FETCH_FINANCIAL_SUMMARY_REQUEST;
  payload?: { period?: string; startDate?: string; endDate?: string };
}

interface FetchFinancialSummarySuccessAction {
  type: typeof FETCH_FINANCIAL_SUMMARY_SUCCESS;
  payload: FinancialSummary;
}

interface FetchFinancialSummaryFailureAction {
  type: typeof FETCH_FINANCIAL_SUMMARY_FAILURE;
  payload: string;
}

// Cash Flow Actions
interface FetchCashFlowRequestAction {
  type: typeof FETCH_CASH_FLOW_REQUEST;
  payload?: { year?: number; months?: number };
}

interface FetchCashFlowSuccessAction {
  type: typeof FETCH_CASH_FLOW_SUCCESS;
  payload: CashFlowData[];
}

interface FetchCashFlowFailureAction {
  type: typeof FETCH_CASH_FLOW_FAILURE;
  payload: string;
}

// Giving Analysis Actions
interface FetchGivingAnalysisRequestAction {
  type: typeof FETCH_GIVING_ANALYSIS_REQUEST;
  payload?: { year?: number };
}

interface FetchGivingAnalysisSuccessAction {
  type: typeof FETCH_GIVING_ANALYSIS_SUCCESS;
  payload: GivingAnalysis;
}

interface FetchGivingAnalysisFailureAction {
  type: typeof FETCH_GIVING_ANALYSIS_FAILURE;
  payload: string;
}

// UI State Actions
interface SetFinanceTabAction {
  type: typeof SET_FINANCE_TAB;
  payload: string;
}

interface SetFinanceDateRangeAction {
  type: typeof SET_FINANCE_DATE_RANGE;
  payload: { startDate: string; endDate: string };
}

interface ClearFinanceErrorAction {
  type: typeof CLEAR_FINANCE_ERROR;
}

interface ResetFinanceOperationAction {
  type: typeof RESET_FINANCE_OPERATION;
}

interface ResetFinanceStateAction {
  type: typeof RESET_FINANCE_STATE;
}

// Union Type
export type FinanceActionTypes =
  | FetchIncomeRequestAction
  | FetchIncomeSuccessAction
  | FetchIncomeFailureAction
  | CreateIncomeRequestAction
  | CreateIncomeSuccessAction
  | CreateIncomeFailureAction
  | UpdateIncomeRequestAction
  | UpdateIncomeSuccessAction
  | UpdateIncomeFailureAction
  | DeleteIncomeRequestAction
  | DeleteIncomeSuccessAction
  | DeleteIncomeFailureAction
  | FetchExpensesRequestAction
  | FetchExpensesSuccessAction
  | FetchExpensesFailureAction
  | CreateExpenseRequestAction
  | CreateExpenseSuccessAction
  | CreateExpenseFailureAction
  | UpdateExpenseRequestAction
  | UpdateExpenseSuccessAction
  | UpdateExpenseFailureAction
  | DeleteExpenseRequestAction
  | DeleteExpenseSuccessAction
  | DeleteExpenseFailureAction
  | FetchFinancialCategoriesRequestAction
  | FetchFinancialCategoriesSuccessAction
  | FetchFinancialCategoriesFailureAction
  | FetchDonorsRequestAction
  | FetchDonorsSuccessAction
  | FetchDonorsFailureAction
  | FetchBudgetRequestAction
  | FetchBudgetSuccessAction
  | FetchBudgetFailureAction
  | FetchFinancialSummaryRequestAction
  | FetchFinancialSummarySuccessAction
  | FetchFinancialSummaryFailureAction
  | FetchCashFlowRequestAction
  | FetchCashFlowSuccessAction
  | FetchCashFlowFailureAction
  | FetchGivingAnalysisRequestAction
  | FetchGivingAnalysisSuccessAction
  | FetchGivingAnalysisFailureAction
  | SetFinanceTabAction
  | SetFinanceDateRangeAction
  | ClearFinanceErrorAction
  | ResetFinanceOperationAction
  | ResetFinanceStateAction;

// ============================================
// ACTION CREATORS
// ============================================

// Income
export const fetchIncomeRequest = (params?: GetTransactionsParams): FetchIncomeRequestAction => ({
  type: FETCH_INCOME_REQUEST,
  payload: params,
});

export const fetchIncomeSuccess = (
  transactions: FinanceTransaction[],
  pagination: PaginationInfo,
  summary: { totalAmount: number; recordCount: number }
): FetchIncomeSuccessAction => ({
  type: FETCH_INCOME_SUCCESS,
  payload: { transactions, pagination, summary },
});

export const fetchIncomeFailure = (error: string): FetchIncomeFailureAction => ({
  type: FETCH_INCOME_FAILURE,
  payload: error,
});

export const createIncomeRequest = (data: IncomeFormData): CreateIncomeRequestAction => ({
  type: CREATE_INCOME_REQUEST,
  payload: data,
});

export const createIncomeSuccess = (transaction: FinanceTransaction): CreateIncomeSuccessAction => ({
  type: CREATE_INCOME_SUCCESS,
  payload: transaction,
});

export const createIncomeFailure = (error: string): CreateIncomeFailureAction => ({
  type: CREATE_INCOME_FAILURE,
  payload: error,
});

export const updateIncomeRequest = (id: string, data: Partial<IncomeFormData>): UpdateIncomeRequestAction => ({
  type: UPDATE_INCOME_REQUEST,
  payload: { id, data },
});

export const updateIncomeSuccess = (transaction: FinanceTransaction): UpdateIncomeSuccessAction => ({
  type: UPDATE_INCOME_SUCCESS,
  payload: transaction,
});

export const updateIncomeFailure = (error: string): UpdateIncomeFailureAction => ({
  type: UPDATE_INCOME_FAILURE,
  payload: error,
});

export const deleteIncomeRequest = (id: string): DeleteIncomeRequestAction => ({
  type: DELETE_INCOME_REQUEST,
  payload: id,
});

export const deleteIncomeSuccess = (id: string): DeleteIncomeSuccessAction => ({
  type: DELETE_INCOME_SUCCESS,
  payload: id,
});

export const deleteIncomeFailure = (error: string): DeleteIncomeFailureAction => ({
  type: DELETE_INCOME_FAILURE,
  payload: error,
});

// Expenses
export const fetchExpensesRequest = (params?: GetTransactionsParams): FetchExpensesRequestAction => ({
  type: FETCH_EXPENSES_REQUEST,
  payload: params,
});

export const fetchExpensesSuccess = (
  transactions: FinanceTransaction[],
  pagination: PaginationInfo,
  summary: { totalAmount: number; recordCount: number }
): FetchExpensesSuccessAction => ({
  type: FETCH_EXPENSES_SUCCESS,
  payload: { transactions, pagination, summary },
});

export const fetchExpensesFailure = (error: string): FetchExpensesFailureAction => ({
  type: FETCH_EXPENSES_FAILURE,
  payload: error,
});

export const createExpenseRequest = (data: ExpenseFormData): CreateExpenseRequestAction => ({
  type: CREATE_EXPENSE_REQUEST,
  payload: data,
});

export const createExpenseSuccess = (transaction: FinanceTransaction): CreateExpenseSuccessAction => ({
  type: CREATE_EXPENSE_SUCCESS,
  payload: transaction,
});

export const createExpenseFailure = (error: string): CreateExpenseFailureAction => ({
  type: CREATE_EXPENSE_FAILURE,
  payload: error,
});

export const updateExpenseRequest = (id: string, data: Partial<ExpenseFormData>): UpdateExpenseRequestAction => ({
  type: UPDATE_EXPENSE_REQUEST,
  payload: { id, data },
});

export const updateExpenseSuccess = (transaction: FinanceTransaction): UpdateExpenseSuccessAction => ({
  type: UPDATE_EXPENSE_SUCCESS,
  payload: transaction,
});

export const updateExpenseFailure = (error: string): UpdateExpenseFailureAction => ({
  type: UPDATE_EXPENSE_FAILURE,
  payload: error,
});

export const deleteExpenseRequest = (id: string): DeleteExpenseRequestAction => ({
  type: DELETE_EXPENSE_REQUEST,
  payload: id,
});

export const deleteExpenseSuccess = (id: string): DeleteExpenseSuccessAction => ({
  type: DELETE_EXPENSE_SUCCESS,
  payload: id,
});

export const deleteExpenseFailure = (error: string): DeleteExpenseFailureAction => ({
  type: DELETE_EXPENSE_FAILURE,
  payload: error,
});

// Categories
export const fetchFinancialCategoriesRequest = (type?: string): FetchFinancialCategoriesRequestAction => ({
  type: FETCH_FINANCIAL_CATEGORIES_REQUEST,
  payload: type,
});

export const fetchFinancialCategoriesSuccess = (categories: {
  income?: FinancialCategory[];
  expense?: FinancialCategory[];
}): FetchFinancialCategoriesSuccessAction => ({
  type: FETCH_FINANCIAL_CATEGORIES_SUCCESS,
  payload: categories,
});

export const fetchFinancialCategoriesFailure = (error: string): FetchFinancialCategoriesFailureAction => ({
  type: FETCH_FINANCIAL_CATEGORIES_FAILURE,
  payload: error,
});

// Donors
export const fetchDonorsRequest = (params?: { year?: number }): FetchDonorsRequestAction => ({
  type: FETCH_DONORS_REQUEST,
  payload: params,
});

export const fetchDonorsSuccess = (donors: Donor[]): FetchDonorsSuccessAction => ({
  type: FETCH_DONORS_SUCCESS,
  payload: donors,
});

export const fetchDonorsFailure = (error: string): FetchDonorsFailureAction => ({
  type: FETCH_DONORS_FAILURE,
  payload: error,
});

// Budget
export const fetchBudgetRequest = (params?: { year?: number; category?: string }): FetchBudgetRequestAction => ({
  type: FETCH_BUDGET_REQUEST,
  payload: params,
});

export const fetchBudgetSuccess = (budget: BudgetSummary): FetchBudgetSuccessAction => ({
  type: FETCH_BUDGET_SUCCESS,
  payload: budget,
});

export const fetchBudgetFailure = (error: string): FetchBudgetFailureAction => ({
  type: FETCH_BUDGET_FAILURE,
  payload: error,
});

// Financial Summary
export const fetchFinancialSummaryRequest = (params?: {
  period?: string;
  startDate?: string;
  endDate?: string;
}): FetchFinancialSummaryRequestAction => ({
  type: FETCH_FINANCIAL_SUMMARY_REQUEST,
  payload: params,
});

export const fetchFinancialSummarySuccess = (summary: FinancialSummary): FetchFinancialSummarySuccessAction => ({
  type: FETCH_FINANCIAL_SUMMARY_SUCCESS,
  payload: summary,
});

export const fetchFinancialSummaryFailure = (error: string): FetchFinancialSummaryFailureAction => ({
  type: FETCH_FINANCIAL_SUMMARY_FAILURE,
  payload: error,
});

// Cash Flow
export const fetchCashFlowRequest = (params?: { year?: number; months?: number }): FetchCashFlowRequestAction => ({
  type: FETCH_CASH_FLOW_REQUEST,
  payload: params,
});

export const fetchCashFlowSuccess = (cashFlow: CashFlowData[]): FetchCashFlowSuccessAction => ({
  type: FETCH_CASH_FLOW_SUCCESS,
  payload: cashFlow,
});

export const fetchCashFlowFailure = (error: string): FetchCashFlowFailureAction => ({
  type: FETCH_CASH_FLOW_FAILURE,
  payload: error,
});

// Giving Analysis
export const fetchGivingAnalysisRequest = (params?: { year?: number }): FetchGivingAnalysisRequestAction => ({
  type: FETCH_GIVING_ANALYSIS_REQUEST,
  payload: params,
});

export const fetchGivingAnalysisSuccess = (analysis: GivingAnalysis): FetchGivingAnalysisSuccessAction => ({
  type: FETCH_GIVING_ANALYSIS_SUCCESS,
  payload: analysis,
});

export const fetchGivingAnalysisFailure = (error: string): FetchGivingAnalysisFailureAction => ({
  type: FETCH_GIVING_ANALYSIS_FAILURE,
  payload: error,
});

// UI State
export const setFinanceTab = (tab: string): SetFinanceTabAction => ({
  type: SET_FINANCE_TAB,
  payload: tab,
});

export const setFinanceDateRange = (startDate: string, endDate: string): SetFinanceDateRangeAction => ({
  type: SET_FINANCE_DATE_RANGE,
  payload: { startDate, endDate },
});

export const clearFinanceError = (): ClearFinanceErrorAction => ({
  type: CLEAR_FINANCE_ERROR,
});

export const resetFinanceOperation = (): ResetFinanceOperationAction => ({
  type: RESET_FINANCE_OPERATION,
});

export const resetFinanceState = (): ResetFinanceStateAction => ({
  type: RESET_FINANCE_STATE,
});