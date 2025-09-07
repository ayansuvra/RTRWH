import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calculator, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { UserData } from '../App';

interface CostComparisonProps {
  userData: UserData;
  results: {
    annualCollection: number;
    annualSavings: number;
    paybackPeriod: number;
  };
}

export function CostComparison({ userData, results }: CostComparisonProps) {
  const [monthlyWaterBill, setMonthlyWaterBill] = useState('2500');
  const [monthlyElectricityBill, setMonthlyElectricityBill] = useState('1800');
  const [waterConsumption, setWaterConsumption] = useState('15000'); // liters per month

  const currentAnnualWaterCost = parseFloat(monthlyWaterBill) * 12;
  const currentAnnualElectricityCost = parseFloat(monthlyElectricityBill) * 12;
  const totalCurrentCost = currentAnnualWaterCost + currentAnnualElectricityCost;

  // Calculate savings with RWH
  const waterSavingsPercentage = userData.waterSource === 'municipality' ? 0.45 : 
                                userData.waterSource === 'submersible' ? 0.6 : 0.35;
  const electricitySavingsPercentage = userData.waterSource === 'submersible' ? 0.4 : 0.1;

  const annualWaterSavings = currentAnnualWaterCost * waterSavingsPercentage;
  const annualElectricitySavings = currentAnnualElectricityCost * electricitySavingsPercentage;
  const totalAnnualSavings = annualWaterSavings + annualElectricitySavings;

  const systemCost = userData.useType === 'household' ? 
    (userData.tankCapacity <= 1000 ? 50000 : userData.tankCapacity <= 5000 ? 80000 : 135000) :
    (userData.tankCapacity <= 25000 ? 215000 : 385000);

  const actualPaybackPeriod = systemCost / totalAnnualSavings;

  // Chart data
  const costBreakdown = [
    { name: 'Water Bills', value: currentAnnualWaterCost, color: '#3B82F6' },
    { name: 'Electricity', value: currentAnnualElectricityCost, color: '#EF4444' },
  ];

  const savingsBreakdown = [
    { name: 'Water Savings', value: annualWaterSavings, color: '#10B981' },
    { name: 'Electricity Savings', value: annualElectricitySavings, color: '#F59E0B' },
    { name: 'Remaining Cost', value: totalCurrentCost - totalAnnualSavings, color: '#9CA3AF' },
  ];

  const yearlyProjection = Array.from({ length: 10 }, (_, index) => {
    const year = index + 1;
    const cumulativeSavings = totalAnnualSavings * year;
    const netSavings = cumulativeSavings - systemCost;
    return {
      year: `Year ${year}`,
      cumulativeSavings,
      netSavings: netSavings > 0 ? netSavings : 0,
      breakEven: netSavings > 0
    };
  });

  const monthlyComparison = [
    { category: 'Current Water Bill', current: parseFloat(monthlyWaterBill), withRWH: parseFloat(monthlyWaterBill) * (1 - waterSavingsPercentage) },
    { category: 'Electricity Bill', current: parseFloat(monthlyElectricityBill), withRWH: parseFloat(monthlyElectricityBill) * (1 - electricitySavingsPercentage) },
    { category: 'Total Monthly Cost', current: parseFloat(monthlyWaterBill) + parseFloat(monthlyElectricityBill), withRWH: (parseFloat(monthlyWaterBill) * (1 - waterSavingsPercentage)) + (parseFloat(monthlyElectricityBill) * (1 - electricitySavingsPercentage)) }
  ];

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-500" />
              Your Current Spending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="waterBill">Monthly Water Bill (₹)</Label>
                <Input
                  id="waterBill"
                  type="number"
                  value={monthlyWaterBill}
                  onChange={(e) => setMonthlyWaterBill(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="electricityBill">Monthly Electricity Bill (₹)</Label>
                <Input
                  id="electricityBill"
                  type="number"
                  value={monthlyElectricityBill}
                  onChange={(e) => setMonthlyElectricityBill(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consumption">Monthly Water Usage (L)</Label>
                <Input
                  id="consumption"
                  type="number"
                  value={waterConsumption}
                  onChange={(e) => setWaterConsumption(e.target.value)}
                  placeholder="Enter liters"
                />
              </div>
            </div>
            
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <DollarSign className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <p className="text-red-600 font-medium">Current Annual Cost</p>
                <p className="text-2xl font-bold text-red-800">₹{totalCurrentCost.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-green-600 font-medium">Potential Annual Savings</p>
                <p className="text-2xl font-bold text-green-800">₹{totalAnnualSavings.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Visual Comparison */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Current vs Future Costs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Monthly Cost Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} fontSize={12} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                  <Bar dataKey="current" fill="#EF4444" name="Current" />
                  <Bar dataKey="withRWH" fill="#10B981" name="With RWH" />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded" />
                  <span>Current Spending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded" />
                  <span>With Rainwater Harvesting</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Savings Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Annual Savings Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={savingsBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {savingsBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Payback Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Investment Payback Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-blue-600 font-medium">Initial Investment</p>
                <p className="text-2xl font-bold text-blue-800">₹{systemCost.toLocaleString()}</p>
                <p className="text-sm text-gray-600">One-time setup cost</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-green-600 font-medium">Annual Savings</p>
                <p className="text-2xl font-bold text-green-800">₹{totalAnnualSavings.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Recurring yearly benefit</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-purple-600 font-medium">Payback Period</p>
                <p className="text-2xl font-bold text-purple-800">{actualPaybackPeriod.toFixed(1)} Years</p>
                <p className="text-sm text-gray-600">Break-even timeline</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearlyProjection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                <Line type="monotone" dataKey="cumulativeSavings" stroke="#3B82F6" name="Cumulative Savings" strokeWidth={2} />
                <Line type="monotone" dataKey="netSavings" stroke="#10B981" name="Net Profit" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>

            <div className="flex justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded" />
                <span>Cumulative Savings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span>Net Profit (After Investment)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Financial Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-green-800 mb-2">💰 Financial Impact Summary</h3>
              <p className="text-gray-600">Your complete cost-benefit analysis for rainwater harvesting</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-gray-800 mb-3">Immediate Benefits</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Monthly water bill reduction:</span>
                    <span className="font-medium text-green-600">₹{(parseFloat(monthlyWaterBill) * waterSavingsPercentage).toFixed(0)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Monthly electricity savings:</span>
                    <span className="font-medium text-green-600">₹{(parseFloat(monthlyElectricityBill) * electricitySavingsPercentage).toFixed(0)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Water independence level:</span>
                    <span className="font-medium text-blue-600">{(waterSavingsPercentage * 100).toFixed(0)}%</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-gray-800 mb-3">Long-term Returns</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>5-year total savings:</span>
                    <span className="font-medium text-green-600">₹{(totalAnnualSavings * 5).toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>10-year net profit:</span>
                    <span className="font-medium text-green-600">₹{((totalAnnualSavings * 10) - systemCost).toLocaleString()}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Return on investment:</span>
                    <span className="font-medium text-blue-600">{((totalAnnualSavings / systemCost) * 100).toFixed(0)}% annually</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="bg-white rounded-lg p-4 border border-green-300">
                <p className="text-sm text-gray-600 mb-2">Total Lifetime Savings (20 years)</p>
                <p className="text-3xl font-bold text-green-800">₹{((totalAnnualSavings * 20) - systemCost).toLocaleString()}</p>
                <p className="text-sm text-green-600 mt-1">
                  Plus property value increase and environmental benefits
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}