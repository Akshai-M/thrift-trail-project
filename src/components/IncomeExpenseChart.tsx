
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getMonthlyIncomeExpenseData } from '@/lib/transactionService';

const IncomeExpenseChart: React.FC = () => {
  const [chartData, setChartData] = useState<Array<{ month: string; income: number; expenses: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMonthlyIncomeExpenseData();
        setChartData(data);
      } catch (error) {
        console.error("Error fetching income/expense data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // If we don't have data, show placeholder
  const hasData = chartData.length > 0;
  
  // Custom tooltip content
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border shadow-sm rounded-md">
          <p className="text-sm font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p 
              key={`item-${index}`} 
              className={`text-sm ${entry.name === 'expenses' ? 'text-finance-expense' : 'text-finance-income'}`}
            >
              {`${entry.name}: $${entry.value.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Income & Expenses</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : hasData ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={chartData} 
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              barGap={0}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => `$${value}`}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="income" 
                name="Income"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
              <Bar 
                dataKey="expenses" 
                name="Expenses"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm">No transaction data to display yet</p>
            <p className="text-xs mt-1">Add some transactions to see your income and expense trends</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IncomeExpenseChart;
