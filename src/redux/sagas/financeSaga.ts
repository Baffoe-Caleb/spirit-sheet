// src/redux/sagas/financeSaga.ts

import { call, put, takeLatest, all } from 'redux-saga/effects';
import { ApiResponse } from 'apisauce';
import * as api from '../../services/api';
import {
  FETCH_INCOME_REQUEST,
  FETCH_EXPENSES_REQUEST,
  CREATE_INCOME_REQUEST,
  UPDATE_INCOME_REQUEST,
  DELETE_INCOME_REQUEST,
  CREATE_EXPENSE_REQUEST,
  UPDATE_EXPENSE_REQUEST,
  DELETE_EXPENSE_REQUEST,
  FETCH_FINANCIAL_CATEGORIES_REQUEST,
  FETCH_DONORS_REQUEST,
  FETCH_BUDGET_REQUEST,
  FETCH_FINANCIAL_SUMMARY_REQUEST,
  FETCH_CASH_FLOW_REQUEST,
  FETCH_GIVING_ANALYSIS_REQUEST,
  fetchIncomeSuccess,
  fetchIncomeFailure,
  fetchExpensesSuccess,
  fetchExpensesFailure,
  createIncomeSuccess,
  createIncomeFailure,
  updateIncomeSuccess,
  updateIncomeFailure,
  deleteIncomeSuccess,
  deleteIncomeFailure,
  createExpenseSuccess,
  createExpenseFailure,
  updateExpenseSuccess,
  updateExpenseFailure,
  deleteExpenseSuccess,
  deleteExpenseFailure,
  fetchFinancialCategoriesSuccess,
  fetchFinancialCategoriesFailure,
  fetchDonorsSuccess,
  fetchDonorsFailure,
  fetchBudgetSuccess,
  fetchBudgetFailure,
  fetchFinancialSummarySuccess,
  fetchFinancialSummaryFailure,
  fetchCashFlowSuccess,
  fetchCashFlowFailure,
  fetchGivingAnalysisSuccess,
  fetchGivingAnalysisFailure,
} from '../actions/financeActions';

// Income Sagas
function* fetchIncomeSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.getIncome, action.payload);
    if (response.ok && response.data?.success) {
      yield put(fetchIncomeSuccess(response.data.data, response.data.pagination, response.data.summary));
    } else {
      yield put(fetchIncomeFailure(response.data?.message || 'Failed to fetch income'));
    }
  } catch (error: any) {
    yield put(fetchIncomeFailure(error.message || 'An unexpected error occurred'));
  }
}

function* createIncomeSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.createIncome, action.payload);
    if (response.ok && response.data?.success) {
      yield put(createIncomeSuccess(response.data.data));
    } else {
      yield put(createIncomeFailure(response.data?.message || 'Failed to create income'));
    }
  } catch (error: any) {
    yield put(createIncomeFailure(error.message || 'An unexpected error occurred'));
  }
}

function* updateIncomeSaga(action: any): Generator<any, void, any> {
  try {
    const { id, data } = action.payload;
    const response = yield call(api.updateIncome, id, data);
    if (response.ok && response.data?.success) {
      yield put(updateIncomeSuccess(response.data.data));
    } else {
      yield put(updateIncomeFailure(response.data?.message || 'Failed to update income'));
    }
  } catch (error: any) {
    yield put(updateIncomeFailure(error.message || 'An unexpected error occurred'));
  }
}

function* deleteIncomeSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.deleteIncome, action.payload);
    if (response.ok && response.data?.success) {
      yield put(deleteIncomeSuccess(action.payload));
    } else {
      yield put(deleteIncomeFailure(response.data?.message || 'Failed to delete income'));
    }
  } catch (error: any) {
    yield put(deleteIncomeFailure(error.message || 'An unexpected error occurred'));
  }
}

// Expense Sagas
function* fetchExpensesSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.getExpenses, action.payload);
    if (response.ok && response.data?.success) {
      yield put(fetchExpensesSuccess(response.data.data, response.data.pagination, response.data.summary));
    } else {
      yield put(fetchExpensesFailure(response.data?.message || 'Failed to fetch expenses'));
    }
  } catch (error: any) {
    yield put(fetchExpensesFailure(error.message || 'An unexpected error occurred'));
  }
}

function* createExpenseSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.createExpense, action.payload);
    if (response.ok && response.data?.success) {
      yield put(createExpenseSuccess(response.data.data));
    } else {
      yield put(createExpenseFailure(response.data?.message || 'Failed to create expense'));
    }
  } catch (error: any) {
    yield put(createExpenseFailure(error.message || 'An unexpected error occurred'));
  }
}

function* updateExpenseSaga(action: any): Generator<any, void, any> {
  try {
    const { id, data } = action.payload;
    const response = yield call(api.updateExpense, id, data);
    if (response.ok && response.data?.success) {
      yield put(updateExpenseSuccess(response.data.data));
    } else {
      yield put(updateExpenseFailure(response.data?.message || 'Failed to update expense'));
    }
  } catch (error: any) {
    yield put(updateExpenseFailure(error.message || 'An unexpected error occurred'));
  }
}

function* deleteExpenseSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.deleteExpense, action.payload);
    if (response.ok && response.data?.success) {
      yield put(deleteExpenseSuccess(action.payload));
    } else {
      yield put(deleteExpenseFailure(response.data?.message || 'Failed to delete expense'));
    }
  } catch (error: any) {
    yield put(deleteExpenseFailure(error.message || 'An unexpected error occurred'));
  }
}

// Categories Saga
function* fetchCategoriesSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.getFinancialCategories, action.payload);
    if (response.ok && response.data?.success) {
      yield put(fetchFinancialCategoriesSuccess(response.data.data));
    } else {
      yield put(fetchFinancialCategoriesFailure(response.data?.message || 'Failed to fetch categories'));
    }
  } catch (error: any) {
    yield put(fetchFinancialCategoriesFailure(error.message || 'An unexpected error occurred'));
  }
}

// Donors Saga
function* fetchDonorsSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.getDonors, action.payload);
    if (response.ok && response.data?.success) {
      yield put(fetchDonorsSuccess(response.data.data));
    } else {
      yield put(fetchDonorsFailure(response.data?.message || 'Failed to fetch donors'));
    }
  } catch (error: any) {
    yield put(fetchDonorsFailure(error.message || 'An unexpected error occurred'));
  }
}

// Budget Saga
function* fetchBudgetSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.getBudget, action.payload);
    if (response.ok && response.data?.success) {
      yield put(fetchBudgetSuccess(response.data.data));
    } else {
      yield put(fetchBudgetFailure(response.data?.message || 'Failed to fetch budget'));
    }
  } catch (error: any) {
    yield put(fetchBudgetFailure(error.message || 'An unexpected error occurred'));
  }
}

// Financial Summary Saga
function* fetchFinancialSummarySaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.getFinancialSummary, action.payload);
    if (response.ok && response.data?.success) {
      yield put(fetchFinancialSummarySuccess(response.data.data));
    } else {
      yield put(fetchFinancialSummaryFailure(response.data?.message || 'Failed to fetch summary'));
    }
  } catch (error: any) {
    yield put(fetchFinancialSummaryFailure(error.message || 'An unexpected error occurred'));
  }
}

// Cash Flow Saga
function* fetchCashFlowSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.getCashFlowReport, action.payload);
    if (response.ok && response.data?.success) {
      yield put(fetchCashFlowSuccess(response.data.data));
    } else {
      yield put(fetchCashFlowFailure(response.data?.message || 'Failed to fetch cash flow'));
    }
  } catch (error: any) {
    yield put(fetchCashFlowFailure(error.message || 'An unexpected error occurred'));
  }
}

// Giving Analysis Saga
function* fetchGivingAnalysisSaga(action: any): Generator<any, void, any> {
  try {
    const response = yield call(api.getGivingAnalysisReport, action.payload);
    if (response.ok && response.data?.success) {
      yield put(fetchGivingAnalysisSuccess(response.data.data));
    } else {
      yield put(fetchGivingAnalysisFailure(response.data?.message || 'Failed to fetch giving analysis'));
    }
  } catch (error: any) {
    yield put(fetchGivingAnalysisFailure(error.message || 'An unexpected error occurred'));
  }
}

// Root Finance Saga
export default function* financeSaga() {
  yield all([
    takeLatest(FETCH_INCOME_REQUEST, fetchIncomeSaga),
    takeLatest(CREATE_INCOME_REQUEST, createIncomeSaga),
    takeLatest(UPDATE_INCOME_REQUEST, updateIncomeSaga),
    takeLatest(DELETE_INCOME_REQUEST, deleteIncomeSaga),
    takeLatest(FETCH_EXPENSES_REQUEST, fetchExpensesSaga),
    takeLatest(CREATE_EXPENSE_REQUEST, createExpenseSaga),
    takeLatest(UPDATE_EXPENSE_REQUEST, updateExpenseSaga),
    takeLatest(DELETE_EXPENSE_REQUEST, deleteExpenseSaga),
    takeLatest(FETCH_FINANCIAL_CATEGORIES_REQUEST, fetchCategoriesSaga),
    takeLatest(FETCH_DONORS_REQUEST, fetchDonorsSaga),
    takeLatest(FETCH_BUDGET_REQUEST, fetchBudgetSaga),
    takeLatest(FETCH_FINANCIAL_SUMMARY_REQUEST, fetchFinancialSummarySaga),
    takeLatest(FETCH_CASH_FLOW_REQUEST, fetchCashFlowSaga),
    takeLatest(FETCH_GIVING_ANALYSIS_REQUEST, fetchGivingAnalysisSaga),
  ]);
}