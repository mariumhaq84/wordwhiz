
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart } from 'lucide-react';
import PerformanceDashboard from '@/components/PerformanceDashboard';

interface DashboardViewProps {
  sessionResults: any[];
  onBackToWordLists: () => void;
  onClearHistory: () => void;
}

const DashboardView = ({
  sessionResults,
  onBackToWordLists,
  onClearHistory,
}: DashboardViewProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onBackToWordLists}
          className="bg-white hover:bg-blue-50 shadow-sm"
        >
          <ArrowLeft className="mr-1" size={16} />
          Back to Word Lists
        </Button>
        <h2 className="text-2xl font-semibold text-blue-700 flex items-center">
          <BarChart className="mr-2" size={24} />
          Performance Dashboard
        </h2>
        <Button 
          variant="outline" 
          onClick={onClearHistory}
          className="bg-white hover:bg-red-50 text-red-500 hover:text-red-600"
        >
          Clear History
        </Button>
      </div>
      
      <PerformanceDashboard 
        results={sessionResults} 
      />
    </div>
  );
};

export default DashboardView;
