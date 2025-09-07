import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { WeatherDetails } from './WeatherDetails';
import { CostComparison } from './CostComparison';
import { SystemBlueprint } from './SystemBlueprint';
import { Download, Droplets, PiggyBank, TrendingUp, Award } from 'lucide-react';
import { UserData } from '../App';

interface ResultsPageProps {
  userData: UserData;
}

export function ResultsPage({ userData }: ResultsPageProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate results based on user data
  const rooftopArea = userData.rooftop.area;
  const efficiency = userData.rooftop.type === 'flat' ? 0.95 : 0.87;
  const runoffCoefficient = 0.8;
  const averageRainfall = 800; // mm per year
  
  const annualCollection = (rooftopArea * runoffCoefficient * averageRainfall * efficiency) / 1000;
  const annualSavings = annualCollection * 3; // ₹3 per 1000L
  const monthlyCollection = annualCollection / 12;
  const dailyCollection = annualCollection / 365;

  const results = {
    annualCollection: Math.round(annualCollection),
    annualSavings: Math.round(annualSavings),
    monthlyCollection: Math.round(monthlyCollection),
    dailyCollection: Math.round(dailyCollection),
    paybackPeriod: Math.round((userData.tankCapacity * 0.05) / (annualSavings / 1000)), // years
    carbonOffset: Math.round(annualCollection * 0.5) // kg CO2 saved
  };



  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="mb-4 text-blue-800">🎉 Your Rainwater Harvesting System Results</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Based on your location, rooftop area, and requirements, here's your personalized 
            rainwater harvesting system analysis and recommendations.
          </p>
        </motion.div>

        {/* Key Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <Card className="bg-blue-50 border-blue-200 border">
            <CardContent className="p-4 text-center">
              <Droplets className="w-7 h-7 mx-auto mb-2 text-blue-600" />
              <div className="space-y-1">
                <p className="text-lg font-medium text-blue-800">{results.annualCollection.toLocaleString()}L</p>
                <p className="text-xs text-blue-600">Annual Collection</p>
                <p className="text-xs text-gray-500">{results.monthlyCollection}L/month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200 border">
            <CardContent className="p-4 text-center">
              <PiggyBank className="w-7 h-7 mx-auto mb-2 text-green-600" />
              <div className="space-y-1">
                <p className="text-lg font-medium text-green-800">₹{results.annualSavings.toLocaleString()}</p>
                <p className="text-xs text-green-600">Annual Savings</p>
                <p className="text-xs text-gray-500">₹{Math.round(results.annualSavings/12)}/month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200 border">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-7 h-7 mx-auto mb-2 text-purple-600" />
              <div className="space-y-1">
                <p className="text-lg font-medium text-purple-800">{results.paybackPeriod} Years</p>
                <p className="text-xs text-purple-600">Payback Period</p>
                <p className="text-xs text-gray-500">ROI timeline</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border-emerald-200 border">
            <CardContent className="p-4 text-center">
              <Award className="w-7 h-7 mx-auto mb-2 text-emerald-600" />
              <div className="space-y-1">
                <p className="text-lg font-medium text-emerald-800">{results.carbonOffset}kg</p>
                <p className="text-xs text-emerald-600">CO₂ Offset</p>
                <p className="text-xs text-gray-500">Environmental impact</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="blueprint">Designs</TabsTrigger>
              <TabsTrigger value="comparison">Cost</TabsTrigger>
              <TabsTrigger value="weather">Weather</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-0">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-blue-500" />
                      Detailed Water Collection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-medium text-blue-600">{results.dailyCollection}L</p>
                        <p className="text-sm text-gray-600">Daily Average</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-2xl font-medium text-green-600">{results.monthlyCollection}L</p>
                        <p className="text-sm text-gray-600">Monthly Average</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Rooftop Area:</span>
                        <span className="font-medium">{userData.rooftop.area}m²</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Roof Type:</span>
                        <span className="font-medium capitalize">{userData.rooftop.type}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Collection Efficiency:</span>
                        <span className="font-medium">{(efficiency * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Tank Capacity:</span>
                        <span className="font-medium">{userData.tankCapacity.toLocaleString()}L</span>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-sm text-amber-800">
                        💡 Your tank can store{' '}
                        <span className="font-medium">
                          {Math.round((userData.tankCapacity / results.dailyCollection) * 10) / 10} days
                        </span>{' '}
                        worth of average daily collection.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Use Type:</p>
                        <p className="font-medium capitalize">{userData.useType}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Has Existing Tank:</p>
                        <p className="font-medium">{userData.hasTank ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Water Source:</p>
                        <p className="font-medium capitalize">{userData.waterSource}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Location:</p>
                        <p className="font-medium">{userData.location.name}</p>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="text-green-800 mb-2">Recommended Components</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• First flush diverter (100L capacity)</li>
                        <li>• Mesh filter (1mm aperture)</li>
                        <li>• {userData.rooftop.type === 'flat' ? 'Gravity-fed' : 'Sloped'} collection system</li>
                        <li>• UV sterilization unit (optional)</li>
                        <li>• Overflow management system</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="blueprint" className="mt-0">
              <SystemBlueprint userData={userData} results={results} />
            </TabsContent>

            <TabsContent value="comparison" className="mt-0">
              <CostComparison userData={userData} results={results} />
            </TabsContent>

            <TabsContent value="weather" className="mt-0">
              <WeatherDetails location={userData.location} />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-4"
        >
          <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Complete Report (PDF)
          </Button>
          <Button variant="outline">
            Get Professional Installation Quote
          </Button>
        </motion.div>
      </div>
    </div>
  );
}