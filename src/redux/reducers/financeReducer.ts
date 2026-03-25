// src/redux/reducers/financeReducer.ts

import {
  FinanceTransaction,
  FinancialCategory,
  Donor,
  BudgetSummary,
  FinancialSummary,
  CashFlowData,
  GivingAnalysis,
  PaginationInfo,
} from '../../services/api';
import {
  FETCH_INCOME_REQUEST,
  FETCH_INCOME_SUCCESS,
  FETCH_INCOME_FAILURE,
  CREATE_INCOME_REQUEST,
  CREATE_INCOME_SUCCESS,
  CREATE_INCOME_FAILURE,
  UPDATE_INCOME_REQUEST,
  UPDATE_INCOME_SUCCESS,
  UPDATE_INCOME_FAILURE,
  DELETE_INCOME_REQUEST,
  DELETE_INCOME_SUCCESS,
  DELETE_INCOME_FAILURE,
  FETCH_EXPENSES_REQUEST,
  FETCH_EXPENSES_SUCCESS,
  FETCH_EXPENSES_FAILURE,
  CREATE_EXPENSE_REQUEST,
  CREATE_EXPENSE_SUCCESS,
  CREATE_EXPENSE_FAILURE,
  UPDATE_EXPENSE_REQUEST,
  UPDATE_EXPENSE_SUCCESS,
  UPDATE_EXPENSE_FAILURE,
  DELETE_EXPENSE_REQUEST,
  DELETE_EXPENSE_SUCCESS,
  DELETE_EXPENSE_FAILURE,
  FETCH_FINANCIAL_CATEGORIES_REQUEST,
  FETCH_FINANCIAL_CATEGORIES_SUCCESS,
  FETCH_FINANCIAL_CATEGORIES_FAILURE,
  FETCH_DONORS_REQUEST,
  FETCH_DONORS_SUCCESS,
  FETCH_DONORS_FAILURE,
  FETCH_BUDGET_REQUEST,
  FETCH_BUDGET_SUCCESS,
  FETCH_BUDGET_FAILURE,
  FETCH_FINANCIAL_SUMMARY_REQUEST,
  FETCH_FINANCIAL_SUMMARY_SUCCESS,
  FETCH_FINANCIAL_SUMMARY_FAILURE,
  FETCH_CASH_FLOW_REQUEST,
  FETCH_CASH_FLOW_SUCCESS,
  FETCH_CASH_FLOW_FAILURE,
  FETCH_GIVING_ANALYSIS_REQUEST,
  FETCH_GIVING_ANALYSIS_SUCCESS,
  FETCH_GIVING_ANALYSIS_FAILURE,
  SET_FINANCE_TAB,
  SET_FINANCE_DATE_RANGE,
  CLEAR_FINANCE_ERROR,
  RESET_FINANCE_OPERATION,
  RESET_FINANCE_STATE,
  FinanceActionTypes,
} from '../actions/financeActions';

// ============================================
// STATE INTERFACE
// ============================================

export interface FinanceState {
  // Income
  incomeTransactions: FinanceTransaction[];
  incomePagination: PaginationInfo | null;
  incomeSummary: { totalAmount: number; recordCount: number } | null;
  isLoadingIncome: boolean;
  isCreatingIncome: boolean;
  isUpdatingIncome: boolean;
  isDeletingIncome: boolean;
  createIncomeSuccess: boolean;
  updateIncomeSuccess: boolean;
  deleteIncomeSuccess: boolean;

  // Expenses
  expenseTransactions: FinanceTransaction[];
  expensePagination: PaginationInfo | null;
  expenseSummary: { totalAmount: number; recordCount: number } | null;
  isLoadingExpenses: boolean;
  isCreatingExpense: boolean;
  isUpdatingExpense: boolean;
  isDeletingExpense: boolean;
  createExpenseSuccess: boolean;
  updateExpenseSuccess: boolean;
  deleteExpenseSuccess: boolean;

  // Categories
  incomeCategories: FinancialCategory[];
  expenseCategories: FinancialCategory[];
  isLoadingCategories: boolean;

  // Donors
  donors: Donor[];
  isLoadingDonors: boolean;

  // Budget
  budget: BudgetSummary | null;
  isLoadingBudget: boolean;

  // Reports
  financialSummary: FinancialSummary | null;
  isLoadingSummary: boolean;
  cashFlow: CashFlowData[];
  isLoadingCashFlow: boolean;
  givingAnalysis: GivingAnalysis | null;
  isLoadingGiving: boolean;

  // UI State
  activeTab: string;
  dateRange: {
    startDate: string;
    endDate: string;
  };

  // Errors
  error: string | null;
  incomeError: string | null;
  expenseError: string | null;
}

// ============================================
// INITIAL STATE
// ============================================

const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
};

const initialState: FinanceState = {
  incomeTransactions: [],
  incomePagination: null,
  incomeSummary: null,
  isLoadingIncome: false,
  isCreatingIncome: false,
  isUpdatingIncome: false,
  isDeletingIncome: false,
  createIncomeSuccess: false,
  updateIncomeSuccess: false,
  deleteIncomeSuccess: false,

  expenseTransactions: [],
  expensePagination: null,
  expenseSummary: null,
  isLoadingExpenses: false,
  isCreatingExpense: false,
  isUpdatingExpense: false,
  isDeletingExpense: false,
  createExpenseSuccess: false,
  updateExpenseSuccess: false,
  deleteExpenseSuccess: false,

  incomeCategories: [],
  expenseCategories: [],
  isLoadingCategories: false,

  donors: [],
  isLoadingDonors: false,

  budget: null,
  isLoadingBudget: false,

  financialSummary: null,
  isLoadingSummary: false,
  cashFlow: [],
  isLoadingCashFlow: false,
  givingAnalysis: null,
  isLoadingGiving: false,

  activeTab: 'overview',
  dateRange: getDefaultDateRange(),

  error: null,
  incomeError: null,
  expenseError: null,
};

// ============================================
// REDUCER
// ============================================

const financeReducer = (state = initialState, action: FinanceActionTypes): FinanceState => {
  switch (action.type) {
    // Income
    case FETCH_INCOME_REQUEST:
      return { ...state, isLoadingIncome: true, error: null };

    case FETCH_INCOME_SUCCESS:
      return {
        ...state,
        isLoadingIncome: false,
        incomeTransactions: action.payload.transactions,
        incomePagination: action.payload.pagination,
        incomeSummary: action.payload.summary,
        error: null,
      };

    case FETCH_INCOME_FAILURE:
      return { ...state, isLoadingIncome: false, error: action.payload };

    case CREATE_INCOME_REQUEST:
      return { ...state, isCreatingIncome: true, createIncomeSuccess: false, incomeError: null };

    case CREATE_INCOME_SUCCESS:
      return {
        ...state,
        isCreatingIncome: false,
        incomeTransactions: [action.payload, ...state.incomeTransactions],
        createIncomeSuccess: true,
        incomeError: null,
      };

    case CREATE_INCOME_FAILURE:
      return { ...state, isCreatingIncome: false, createIncomeSuccess: false, incomeError: action.payload };

    case UPDATE_INCOME_REQUEST:
      return { ...state, isUpdatingIncome: true, updateIncomeSuccess: false, incomeError: null };

    case UPDATE_INCOME_SUCCESS:
      return {
        ...state,
        isUpdatingIncome: false,
        incomeTransactions: state.incomeTransactions.map((t) =>
          t._id === action.payload._id ? action.payload : t
        ),
        updateIncomeSuccess: true,
        incomeError: null,
      };

    case UPDATE_INCOME_FAILURE:
      return { ...state, isUpdatingIncome: false, updateIncomeSuccess: false, incomeError: action.payload };

    case DELETE_INCOME_REQUEST:
      return { ...state, isDeletingIncome: true, deleteIncomeSuccess: false, incomeError: null };

    case DELETE_INCOME_SUCCESS:
      return {
        ...state,
        isDeletingIncome: false,
        incomeTransactions: state.incomeTransactions.filter((t) => t._id !== action.payload),
        deleteIncomeSuccess: true,
        incomeError: null,
      };

    case DELETE_INCOME_FAILURE:
      return { ...state, isDeletingIncome: false, deleteIncomeSuccess: false, incomeError: action.payload };

    // Expenses
    case FETCH_EXPENSES_REQUEST:
      return { ...state, isLoadingExpenses: true, error: null };

    case FETCH_EXPENSES_SUCCESS:
      return {
        ...state,
        isLoadingExpenses: false,
        expenseTransactions: action.payload.transactions,
        expensePagination: action.payload.pagination,
        expenseSummary: action.payload.summary,
        error: null,
      };

    case FETCH_EXPENSES_FAILURE:
      return { ...state, isLoadingExpenses: false, error: action.payload };

    case CREATE_EXPENSE_REQUEST:
      return { ...state, isCreatingExpense: true, createExpenseSuccess: false, expenseError: null };

    case CREATE_EXPENSE_SUCCESS:
      return {
        ...state,
        isCreatingExpense: false,
        expenseTransactions: [action.payload, ...state.expenseTransactions],
        createExpenseSuccess: true,
        expenseError: null,
      };

    case CREATE_EXPENSE_FAILURE:
      return { ...state, isCreatingExpense: false, createExpenseSuccess: false, expenseError: action.payload };

    case UPDATE_EXPENSE_REQUEST:
      return { ...state, isUpdatingExpense: true, updateExpenseSuccess: false, expenseError: null };

    case UPDATE_EXPENSE_SUCCESS:
      return {
        ...state,
        isUpdatingExpense: false,
        expenseTransactions: state.expenseTransactions.map((t) =>
          t._id === action.payload._id ? action.payload : t
        ),
        updateExpenseSuccess: true,
        expenseError: null,
      };

    case UPDATE_EXPENSE_FAILURE:
      return { ...state, isUpdatingExpense: false, updateExpenseSuccess: false, expenseError: action.payload };

    case DELETE_EXPENSE_REQUEST:
      return { ...state, isDeletingExpense: true, deleteExpenseSuccess: false, expenseError: null };

    case DELETE_EXPENSE_SUCCESS:
      return {
        ...state,
        isDeletingExpense: false,
        expenseTransactions: state.expenseTransactions.filter((t) => t._id !== action.payload),
        deleteExpenseSuccess: true,
        expenseError: null,
      };

    case DELETE_EXPENSE_FAILURE:
      return { ...state, isDeletingExpense: false, deleteExpenseSuccess: false, expenseError: action.payload };

    // Categories
    case FETCH_FINANCIAL_CATEGORIES_REQUEST:
      return { ...state, isLoadingCategories: true };

    case FETCH_FINANCIAL_CATEGORIES_SUCCESS:
      return {
        ...state,
        isLoadingCategories: false,
        incomeCategories: action.payload.income || state.incomeCategories,
        expenseCategories: action.payload.expense || state.expenseCategories,
      };

    case FETCH_FINANCIAL_CATEGORIES_FAILURE:
      return { ...state, isLoadingCategories: false, error: action.payload };

    // Donors
    case FETCH_DONORS_REQUEST:
      return { ...state, isLoadingDonors: true };

    case FETCH_DONORS_SUCCESS:
      return { ...state, isLoadingDonors: false, donors: action.payload };

    case FETCH_DONORS_FAILURE:
      return { ...state, isLoadingDonors: false, error: action.payload };

    // Budget
    case FETCH_BUDGET_REQUEST:
      return { ...state, isLoadingBudget: true };

    case FETCH_BUDGET_SUCCESS:
      return { ...state, isLoadingBudget: false, budget: action.payload };

    case FETCH_BUDGET_FAILURE:
      return { ...state, isLoadingBudget: false, error: action.payload };

    // Financial Summary
    case FETCH_FINANCIAL_SUMMARY_REQUEST:
      return { ...state, isLoadingSummary: true };

    case FETCH_FINANCIAL_SUMMARY_SUCCESS:
      return { ...state, isLoadingSummary: false, financialSummary: action.payload };

    case FETCH_FINANCIAL_SUMMARY_FAILURE:
      return { ...state, isLoadingSummary: false, error: action.payload };

    // Cash Flow
    case FETCH_CASH_FLOW_REQUEST:
      return { ...state, isLoadingCashFlow: true };

    case FETCH_CASH_FLOW_SUCCESS:
      return { ...state, isLoadingCashFlow: false, cashFlow: action.payload };

    case FETCH_CASH_FLOW_FAILURE:
      return { ...state, isLoadingCashFlow: false, error: action.payload };

    // Giving Analysis
    case FETCH_GIVING_ANALYSIS_REQUEST:
      return { ...state, isLoadingGiving: true };

    case FETCH_GIVING_ANALYSIS_SUCCESS:
      return { ...state, isLoadingGiving: false, givingAnalysis: action.payload };

    case FETCH_GIVING_ANALYSIS_FAILURE:
      return { ...state, isLoadingGiving: false, error: action.payload };

    // UI State
    case SET_FINANCE_TAB:
      return { ...state, activeTab: action.payload };

    case SET_FINANCE_DATE_RANGE:
      return { ...state, dateRange: action.payload };

    case CLEAR_FINANCE_ERROR:
      return { ...state, error: null, incomeError: null, expenseError: null };

    case RESET_FINANCE_OPERATION:
      return {
        ...state,
        isCreatingIncome: false,
        isUpdatingIncome: false,
        isDeletingIncome: false,
        createIncomeSuccess: false,
        updateIncomeSuccess: false,
        deleteIncomeSuccess: false,
        isCreatingExpense: false,
        isUpdatingExpense: false,
        isDeletingExpense: false,
        createExpenseSuccess: false,
        updateExpenseSuccess: false,
        deleteExpenseSuccess: false,
        incomeError: null,
        expenseError: null,
      };

    case RESET_FINANCE_STATE:
      return initialState;

    default:
      return state;
  }
};

export default financeReducer;