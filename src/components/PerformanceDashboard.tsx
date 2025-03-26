
import React, { useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Star, AlertCircle, Brain, Award, ArrowUp, ArrowDown, CheckCircle2, Timer } from 'lucide-react';

interface SessionResult {
  id: string;
  date: Date;
  score: number;
  totalQuestions: number;
  wordList: string;
  mistakeWords: string[];
  completed?: boolean;
}

interface PerformanceDashboardProps {
  results: SessionResult[];
}

const PerformanceDashboard = ({ results }: PerformanceDashboardProps) => {
  const formattedResults = useMemo(() => {
    return results.map(result => ({
      ...result,
      date: new Date(result.date),
      formattedDate: new Date(result.date).toLocaleDateString(),
      percentage: Math.round((result.score / result.totalQuestions) * 100),
      completed: result.completed !== undefined ? result.completed : true, // Default to true for backward compatibility
    })).slice(0, 10); // Only show the last 10 results
  }, [results]);

  const weakWords = useMemo(() => {
    const wordCounts: Record<string, number> = {};
    
    results.forEach(result => {
      result.mistakeWords.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });
    });
    
    return Object.entries(wordCounts)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 weak words
  }, [results]);

  const overallStats = useMemo(() => {
    if (!results.length) return null;
    
    const totalSessions = results.length;
    const completedSessions = results.filter(r => r.completed !== false).length;
    const totalQuestions = results.reduce((sum, result) => sum + result.totalQuestions, 0);
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const averageScore = totalScore / totalSessions;
    const overallPercentage = (totalScore / totalQuestions) * 100;
    const completionRate = (completedSessions / totalSessions) * 100;
    
    // Check for improvement trend
    const recentSessions = results.slice(0, Math.min(3, results.length));
    const olderSessions = results.slice(Math.min(3, results.length), Math.min(6, results.length));
    
    const recentAvg = recentSessions.length > 0 
      ? recentSessions.reduce((sum, result) => sum + (result.score / result.totalQuestions), 0) / recentSessions.length 
      : 0;
      
    const olderAvg = olderSessions.length > 0
      ? olderSessions.reduce((sum, result) => sum + (result.score / result.totalQuestions), 0) / olderSessions.length
      : recentAvg; // If no older sessions, consider flat trend
    
    const trend = recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable';
    
    return {
      totalSessions,
      completedSessions,
      completionRate,
      totalQuestions,
      totalScore,
      averageScore,
      overallPercentage,
      trend: recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable'
    };
  }, [results]);

  const gradeBadge = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A+', color: 'bg-green-500 text-white' };
    if (percentage >= 80) return { grade: 'A', color: 'bg-green-400 text-white' };
    if (percentage >= 70) return { grade: 'B', color: 'bg-blue-400 text-white' };
    if (percentage >= 60) return { grade: 'C', color: 'bg-yellow-400 text-white' };
    if (percentage >= 50) return { grade: 'D', color: 'bg-orange-400 text-white' };
    return { grade: 'E', color: 'bg-red-400 text-white' };
  };

  const pieData = useMemo(() => {
    if (!overallStats) return [];
    
    return [
      { name: 'Correct', value: overallStats.totalScore, fill: '#10b981' },
      { name: 'Mistakes', value: overallStats.totalQuestions - overallStats.totalScore, fill: '#f87171' },
    ];
  }, [overallStats]);

  const completionPieData = useMemo(() => {
    if (!overallStats) return [];
    
    return [
      { name: 'Completed', value: overallStats.completedSessions, fill: '#60a5fa' },
      { name: 'Ended Early', value: overallStats.totalSessions - overallStats.completedSessions, fill: '#fbbf24' },
    ];
  }, [overallStats]);

  const COLORS = ['#10b981', '#f87171'];
  const COMPLETION_COLORS = ['#60a5fa', '#fbbf24'];

  const formatTooltipValue = (value: any): string => {
    if (typeof value === 'number') {
      return value.toFixed(1);
    }
    return String(value);
  };

  if (results.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500">No practice sessions data available yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-100 shadow-md hover:shadow-lg transition-all">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Practice Sessions</p>
              <h3 className="text-3xl font-bold text-purple-800 mt-1">{overallStats?.totalSessions}</h3>
              {overallStats && (
                <p className="text-xs text-purple-500 mt-1">
                  <CheckCircle2 className="inline h-3 w-3 mr-1" />
                  {Math.round(overallStats.completionRate)}% completion rate
                </p>
              )}
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </Card>
        
        <Card className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 shadow-md hover:shadow-lg transition-all">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Average Score</p>
              <h3 className="text-3xl font-bold text-blue-800 mt-1">
                {overallStats?.averageScore.toFixed(1)}
                <span className="text-sm font-normal text-blue-600 ml-1">per session</span>
              </h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Star className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </Card>
        
        <Card className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100 shadow-md hover:shadow-lg transition-all">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Overall Grade</p>
              <div className="flex items-end gap-2 mt-1">
                <h3 className="text-3xl font-bold text-green-800">
                  {overallStats && gradeBadge(overallStats.overallPercentage).grade}
                </h3>
                <div className={`px-2 py-1 rounded-md text-xs ${overallStats && gradeBadge(overallStats.overallPercentage).color}`}>
                  {overallStats?.overallPercentage.toFixed(1)}%
                </div>
                {overallStats?.trend === 'improving' && (
                  <div className="text-green-500 flex items-center text-xs">
                    <ArrowUp className="h-3 w-3 mr-1" /> Improving
                  </div>
                )}
                {overallStats?.trend === 'declining' && (
                  <div className="text-red-500 flex items-center text-xs">
                    <ArrowDown className="h-3 w-3 mr-1" /> Needs work
                  </div>
                )}
              </div>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Trend Chart */}
        <Card className="p-5 col-span-2 bg-white shadow-md">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Your Progress</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[...formattedResults].reverse()}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="formattedDate" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.substring(0, 5)}
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
                          <p className="font-medium">{new Date(data.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">{`Score: ${typeof data.score === 'number' ? data.score.toFixed(1) : data.score}/${data.totalQuestions}`}</p>
                          <p className="text-sm font-medium" style={{ color: payload[0].color }}>
                            {`${typeof data.percentage === 'number' ? data.percentage.toFixed(1) : data.percentage}%`}
                          </p>
                          <p className="text-xs mt-1">
                            {data.completed ? 
                              <span className="text-green-500 flex items-center"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</span> : 
                              <span className="text-amber-500 flex items-center"><Timer className="h-3 w-3 mr-1" /> Ended early</span>}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="percentage" 
                  name="Score %" 
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                >
                  {formattedResults.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={!entry.completed ? '#fbbf24' : 
                            entry.percentage >= 80 ? '#10b981' : 
                            entry.percentage >= 60 ? '#60a5fa' : 
                            entry.percentage >= 40 ? '#fbbf24' : '#f87171'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Pie Chart and Weak Words */}
        <div className="flex flex-col gap-6">
          <Card className="p-5 bg-white shadow-md">
            <h3 className="text-lg font-bold text-gray-700 mb-2">Performance Breakdown</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${typeof percent === 'number' ? (percent * 100).toFixed(0) : '0'}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const value = payload[0].value;
                        const totalQuestions = overallStats?.totalQuestions || 1;
                        const percentage = typeof value === 'number' ? (value / totalQuestions) * 100 : 0;
                        
                        return (
                          <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
                            <p className="font-medium" style={{ color: payload[0].payload.fill }}>
                              {payload[0].name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {`${typeof value === 'number' ? value.toFixed(1) : value} points (${percentage.toFixed(1)}%)`}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-5 bg-white shadow-md">
            <h3 className="text-lg font-bold text-gray-700 mb-2">Session Completion</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${typeof percent === 'number' ? (percent * 100).toFixed(0) : '0'}%`}
                    labelLine={false}
                  >
                    {completionPieData.map((entry, index) => (
                      <Cell key={`completion-cell-${index}`} fill={COMPLETION_COLORS[index % COMPLETION_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const value = payload[0].value;
                        const totalSessions = overallStats?.totalSessions || 1;
                        const percentage = typeof value === 'number' ? (value / totalSessions) * 100 : 0;
                        
                        return (
                          <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
                            <p className="font-medium" style={{ color: payload[0].payload.fill }}>
                              {payload[0].name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {`${typeof value === 'number' ? value.toFixed(0) : value} sessions (${percentage.toFixed(1)}%)`}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        
          <Card className="p-5 bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-100 shadow-md">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-amber-800">Focus Areas</h3>
              <AlertCircle className="text-amber-500 h-5 w-5" />
            </div>
            {weakWords.length > 0 ? (
              <ul className="space-y-2">
                {weakWords.map((item, index) => (
                  <li key={index} className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm">
                    <span className="font-medium text-gray-700">{item.word}</span>
                    <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                      {item.count} {item.count === 1 ? 'mistake' : 'mistakes'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 py-2">No mistake patterns found yet!</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
