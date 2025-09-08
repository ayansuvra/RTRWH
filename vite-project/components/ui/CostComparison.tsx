"use client";

import React, { useState } from "react";
import { motion } from "framer-motion"; // ✅ corrected import
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react";
import { UserData } from "../App";

interface CostComparisonProps {
  userData: UserData;
  results: {
    annualCollection: number;
    annualSavings: number;
    paybackPeriod: number;
  };
}

export function CostComparison({ userData, results }: CostComparisonProps) {
  const [monthlyWaterBill, setMonthlyWaterBill] = useState("2500");
  const [monthlyElectricityBill, setMonthlyElectricityBill] = useState("1800");
  const [waterConsumption, setWaterConsumption] = useState("15000"); // liters per month

  const currentAnnualWaterCost = parseFloat(monthlyWaterBill) * 12;
  const currentAnnualElectricityCost =
    parseFloat(monthlyElectricityBill) * 12;
  const totalCurrentCost =
    currentAnnualWaterCost + currentAnnualElectricityCost;

  // Calculate savings with RWH
  const waterSavingsPercentage =
    userData.waterSource === "municipality"
      ? 0.45
      : userData.waterSource === "submersible"
      ? 0.6
      : 0.35;

  const electricitySavingsPercentage =
    userData.waterSource === "submersible" ? 0.4 : 0.1;

  const annualWaterSavings =
    currentAnnualWaterCost * waterSavingsPercentage;
  const annualElectricitySavings =
    currentAnnualElectricityCost * electricitySavingsPercentage;
  const totalAnnualSavings =
    annualWaterSavings + annualElectricitySavings;

  const systemCost =
    userData.useType === "household"
      ? userData.tankCapacity <= 1000
        ? 50000
        : userData.tankCapacity <= 5000
        ? 80000
        : 135000
      : userData.tankCapacity <= 25000
      ? 215000
      : 385000;

  const actualPaybackPeriod = systemCost / totalAnnualSavings;

  // Chart data
  const savingsBreakdown = [
    { name: "Water Savings", value: annualWaterSavings, color: "#10B981" },
    { name: "Electricity Savings", value: annualElectricitySavings, color: "#F59E0B" },
    { name: "Remaining Cost", value: totalCurrentCost - totalAnnualSavings, color: "#9CA3AF" },
  ];

  const yearlyProjection = Array.from({ length: 10 }, (_, index) => {
    const year = index + 1;
    const cumulativeSavings = totalAnnualSavings * year;
    const netSavings = cumulativeSavings - systemCost;
    return {
      year: `Year ${year}`,
      cumulativeSavings,
      netSavings: netSavings > 0 ? netSavings : 0,
      breakEven: netSavings > 0,
    };
  });

  const monthlyComparison = [
    {
      category: "Current Water Bill",
      current: parseFloat(monthlyWaterBill),
      withRWH:
        parseFloat(monthlyWaterBill) * (1 - waterSavingsPercentage),
    },
    {
      category: "Electricity Bill",
      current: parseFloat(monthlyElectricityBill),
      withRWH:
        parseFloat(monthlyElectricityBill) *
        (1 - electricitySavingsPercentage),
    },
    {
      category: "Total Monthly Cost",
      current:
        parseFloat(monthlyWaterBill) +
        parseFloat(monthlyElectricityBill),
      withRWH:
        parseFloat(monthlyWaterBill) *
          (1 - waterSavingsPercentage) +
        parseFloat(monthlyElectricityBill) *
          (1 - electricitySavingsPercentage),
    },
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
                  onChange={(e) =>
                    setMonthlyWaterBill(e.target.value)
                  }
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="electricityBill">
                  Monthly Electricity Bill (₹)
                </Label>
                <Input
                  id="electricityBill"
                  type="number"
                  value={monthlyElectricityBill}
                  onChange={(e) =>
                    setMonthlyElectricityBill(e.target.value)
                  }
                  placeholder="Enter amount"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="consumption">
                  Monthly Water Usage (L)
                </Label>
                <Input
                  id="consumption"
                  type="number"
                  value={waterConsumption}
                  onChange={(e) =>
                    setWaterConsumption(e.target.value)
                  }
                  placeholder="Enter liters"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts, Payback, Summary */}
      {/* ...rest of your component unchanged */}
    </div>
  );
}
