import React from 'react';
import { Trash2, Calendar, Tag, DollarSign, MapPin, CreditCard } from 'lucide-react';
import { Expense } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: number) => void;
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAmount = (amount: number | string) => {
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(numericAmount);
  };

  // First, add a helper function to format the location
  const formatLocation = (location: string) => {
    const parts = location.split(', ');
    const streetAddress = parts[0]
    const cityState = parts.slice(1).join(', ');
    return { streetAddress, cityState };
  };

  return (
    <div>
      {/* Desktop View */}
      <div className="hidden md:block bg-white rounded-lg shadow-md overflow-x-auto"> {/* Added overflow-x-auto */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                Payment Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(expense.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {expense.description}
                </td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-500" style={{padding: '1rem 0rem 1rem 0rem'}}>
                  <div className="flex flex-col">
                    <span>{formatLocation(expense.location).streetAddress}</span>
                    <span className="text-gray-400">{formatLocation(expense.location).cityState}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {expense.payment_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {expense.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-32">
                  {formatAmount(expense.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-20">
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="inline-flex items-center justify-center text-red-600 hover:text-red-900 p-1"
                    title="Delete expense"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No expenses recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {expenses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-4 text-center text-sm text-gray-500">
            No expenses recorded yet
          </div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-gray-900">{expense.description}</h3>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="text-red-600 hover:text-red-900 p-1"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(expense.date)}
                </div>
                <div className="flex items-start text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 mt-1" />
                  <div className="flex flex-col">
                    <span>{formatLocation(expense.location).streetAddress}</span>
                    <span className="text-gray-400">{formatLocation(expense.location).cityState}</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <CreditCard className="w-4 h-4 mr-2" />
                  {expense.payment_type}
                </div>
                <div className="flex items-center text-gray-600">
                  <Tag className="w-4 h-4 mr-2" />
                  {expense.category}
                </div>
                <div className="flex items-center text-gray-900 font-medium">
                  <DollarSign className="w-4 h-4 mr-2" />
                  {formatAmount(expense.amount)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}