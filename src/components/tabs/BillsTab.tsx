import React from 'react';
import { DollarSign, Calendar, AlertCircle, CheckCircle, CreditCard } from 'lucide-react';

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: string;
  category: string;
}

interface BillsTabProps {
  bills: Bill[];
}

const BillsTab: React.FC<BillsTabProps> = ({ bills }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'from-green-100 to-emerald-100 border-green-200';
      case 'pending':
        return 'from-yellow-100 to-orange-100 border-yellow-200';
      case 'overdue':
        return 'from-red-100 to-pink-100 border-red-200';
      default:
        return 'from-gray-100 to-slate-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Calendar className="w-5 h-5 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const pendingAmount = bills
    .filter(bill => bill.status === 'pending')
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <CreditCard className="w-6 h-6 text-gray-700" />
        <h2 className="text-2xl font-bold text-gray-900">Financial Overview</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-blue-100 rounded-xl p-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Total Bills</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatAmount(totalAmount)}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-yellow-100 rounded-xl p-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Pending</span>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{formatAmount(pendingAmount)}</p>
        </div>
      </div>

      {/* Bills List */}
      <div>
        <div className="space-y-4">
          {bills.map((bill) => (
            <div key={bill.id} className={`bg-gradient-to-r backdrop-blur-xl border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 shadow-sm ${getStatusColor(bill.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/80 rounded-xl p-3 shadow-sm">
                    {getStatusIcon(bill.status)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{bill.name}</h3>
                    <p className="text-gray-600 capitalize">{bill.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-xl">{formatAmount(bill.amount)}</p>
                  <p className="text-gray-600 text-sm">Due {formatDate(bill.dueDate)}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-gray-700 bg-white/60 shadow-sm`}>
                  {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                </div>
                {bill.status === 'pending' && (
                  <button className="bg-pink-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-pink-600 transition-all duration-300 shadow-lg">
                    {/* TODO: Implement payment processing */}
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillsTab;