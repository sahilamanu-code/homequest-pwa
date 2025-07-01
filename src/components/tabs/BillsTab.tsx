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
        return 'from-green-500 to-emerald-500';
      case 'pending':
        return 'from-yellow-500 to-orange-500';
      case 'overdue':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <Calendar className="w-5 h-5 text-yellow-400" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-400" />;
    }
  };

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const pendingAmount = bills
    .filter(bill => bill.status === 'pending')
    .reduce((sum, bill) => sum + bill.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <CreditCard className="w-6 h-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">Financial Overview</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-2">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-purple-200">Total Bills</span>
          </div>
          <p className="text-3xl font-bold text-white">{formatAmount(totalAmount)}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-2">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-purple-200">Pending</span>
          </div>
          <p className="text-3xl font-bold text-yellow-400">{formatAmount(pendingAmount)}</p>
        </div>
      </div>

      {/* Bills List */}
      <div>
        <div className="space-y-4">
          {bills.map((bill) => (
            <div key={bill.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/10 rounded-xl p-3">
                    {getStatusIcon(bill.status)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{bill.name}</h3>
                    <p className="text-purple-200 capitalize">{bill.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-white text-xl">{formatAmount(bill.amount)}</p>
                  <p className="text-purple-200 text-sm">Due {formatDate(bill.dueDate)}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r ${getStatusColor(bill.status)} shadow-lg`}>
                  {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                </div>
                {bill.status === 'pending' && (
                  <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg">
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