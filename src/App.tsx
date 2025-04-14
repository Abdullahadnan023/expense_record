import React, { useState, useEffect } from 'react';
import { Receipt, LogOut } from 'lucide-react';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { useAuth } from './context/AuthContext';
import { Expense, ExpenseFormData } from './types';
import { API_URL } from './config';
import { useNavigate } from 'react-router-dom';

export default function App() {
  const { user, login, googleLogin, signup, logout, isLoading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && user) {
      fetchExpenses();
    }
  }, [user]);

  const fetchExpenses = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token || !user) {
        setError('Please log in to view expenses');
        return;
      }

      const response = await fetch(`${API_URL}/expenses`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          logout(); // Clear invalid auth state
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load expenses');
    }
  };

  const handleAddExpense = async (expenseData: ExpenseFormData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...expenseData,
          payment_type: expenseData.payment_type
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      setExpenses(expenses.filter(expense => expense.id !== id));
      await fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setError(null);
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    try {
      setError(null);
      await googleLogin(credential);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      setError(error instanceof Error ? error.message : 'Google login failed');
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => {
    const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return showLogin ? (
      <Login 
        onLogin={handleLogin} 
        onSwitchToSignup={() => setShowLogin(false)}
        error={error} 
      />
    ) : (
      <Signup 
        onSignup={signup} 
        onSwitchToLogin={() => setShowLogin(true)}
        error={error} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Expense Tracker</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <ExpenseForm onSubmit={handleAddExpense} />
            </div>
            <div className="lg:col-span-2">
              {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              ) : (
                <>
                  <div className="mb-4 bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Total Expenses: {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR'
                      }).format(totalExpenses)}
                    </h2>
                  </div>
                  <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}