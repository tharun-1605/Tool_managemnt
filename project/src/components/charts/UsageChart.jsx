import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import axios from 'axios';
import { 
  TrendingUp, 
  Clock, 
  Activity, 
  BarChart3, 
  Calendar,
  Target,
  Zap,
  Timer
} from 'lucide-react';

const UsageChart = ({ title = "Usage Analytics" }) => {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const base = import.meta?.env?.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://tool-managemnt.onrender.com');
      const response = await axios.get(`${base}/api/usage/analytics?period=${period}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const totalSessions = data.reduce((sum, item) => sum + item.usageCount, 0);
  const totalHours = data.reduce((sum, item) => sum + item.totalDuration, 0);
  const avgDaily = data.length > 0 ? (totalHours / data.length).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center h-80">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-4 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="w-8 h-8 border-4 border-slate-100 border-t-4 border-t-orange-500 rounded-full animate-spin absolute top-2 left-2" style={{animationDirection: 'reverse'}}></div>
              </div>
              <p className="text-slate-600 font-medium">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    const chartProps = {
      data,
      margin: { top: 10, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeOpacity={0.8} />
            <XAxis 
              dataKey="_id" 
              tickFormatter={formatDate}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              labelFormatter={(value) => `Date: ${formatDate(value)}`}
              formatter={(value, name) => [
                name === 'totalDuration' ? `${value.toFixed(1)} hours` : value,
                name === 'totalDuration' ? 'Total Usage' : 'Usage Count'
              ]}
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                fontSize: '14px'
              }}
            />
            <Bar 
              dataKey="totalDuration" 
              fill="url(#blueGradient)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1}/>
              </linearGradient>
            </defs>
          </BarChart>
        );
      
      case 'area':
        return (
          <AreaChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeOpacity={0.8} />
            <XAxis 
              dataKey="_id" 
              tickFormatter={formatDate}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              labelFormatter={(value) => `Date: ${formatDate(value)}`}
              formatter={(value, name) => [
                name === 'totalDuration' ? `${value.toFixed(1)} hours` : value,
                name === 'totalDuration' ? 'Total Usage' : 'Usage Count'
              ]}
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                fontSize: '14px'
              }}
            />
            <Area
              type="monotone"
              dataKey="totalDuration"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#areaGradient)"
            />
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
          </AreaChart>
        );
      
      default:
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeOpacity={0.8} />
            <XAxis 
              dataKey="_id" 
              tickFormatter={formatDate}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              labelFormatter={(value) => `Date: ${formatDate(value)}`}
              formatter={(value, name) => [
                name === 'totalDuration' ? `${value.toFixed(1)} hours` : value,
                name === 'totalDuration' ? 'Total Usage' : 'Usage Count'
              ]}
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                fontSize: '14px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="totalDuration" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 3, fill: '#ffffff' }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Chart Type Selector */}
            <div className="flex bg-white rounded-lg border border-slate-300 overflow-hidden">
              <button
                onClick={() => setChartType('line')}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  chartType === 'line' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <TrendingUp className="w-3 h-3" />
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  chartType === 'bar' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BarChart3 className="w-3 h-3" />
              </button>
              <button
                onClick={() => setChartType('area')}
                className={`px-3 py-1 text-xs font-medium transition-colors ${
                  chartType === 'area' ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Activity className="w-3 h-3" />
              </button>
            </div>
            
            {/* Period Selector */}
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-medium text-slate-700"
              >
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Content */}
      <div className="p-6">
        {data.length > 0 ? (
          <>
            <div className="h-80 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Total Sessions</p>
                    <p className="text-2xl font-bold text-blue-600">{totalSessions}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Total Hours</p>
                    <p className="text-2xl font-bold text-green-600">{totalHours.toFixed(1)}h</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-xl border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium">Avg Daily</p>
                    <p className="text-2xl font-bold text-orange-600">{avgDaily}h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Insights */}
            {data.length > 1 && (
              <div className="mt-6 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-200 p-2 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Performance Trend</p>
                      <p className="text-xs text-slate-600">Based on recent activity</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {(() => {
                      const recent = data.slice(-2);
                      if (recent.length >= 2) {
                        const change = ((recent[1].totalDuration - recent.totalDuration) / recent.totalDuration) * 100;
                        return (
                          <div className={`flex items-center gap-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            <span className="text-sm font-bold">
                              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                            </span>
                            <TrendingUp className={`w-4 h-4 ${change < 0 ? 'rotate-180' : ''}`} />
                          </div>
                        );
                      }
                      return <span className="text-sm text-slate-500">N/A</span>;
                    })()}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="bg-slate-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-lg font-semibold text-slate-700 mb-2">No Usage Data Available</p>
              <p className="text-sm text-slate-500 max-w-sm">
                Analytics will appear here once tools are used. Start using equipment to track performance metrics.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsageChart;
