import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color = 'blue', trend, subtitle, loading = false }) => {
  const colorConfig = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      background: 'from-blue-50 to-blue-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      accent: 'text-blue-600',
      border: 'border-blue-200',
      glow: 'shadow-blue-200/50'
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      background: 'from-green-50 to-green-100',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      accent: 'text-green-600',
      border: 'border-green-200',
      glow: 'shadow-green-200/50'
    },
    red: {
      gradient: 'from-red-500 to-red-600',
      background: 'from-red-50 to-red-100',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      accent: 'text-red-600',
      border: 'border-red-200',
      glow: 'shadow-red-200/50'
    },
    yellow: {
      gradient: 'from-yellow-500 to-yellow-600',
      background: 'from-yellow-50 to-yellow-100',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      accent: 'text-yellow-600',
      border: 'border-yellow-200',
      glow: 'shadow-yellow-200/50'
    },
    orange: {
      gradient: 'from-orange-500 to-orange-600',
      background: 'from-orange-50 to-orange-100',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      accent: 'text-orange-600',
      border: 'border-orange-200',
      glow: 'shadow-orange-200/50'
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      background: 'from-purple-50 to-purple-100',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      accent: 'text-purple-600',
      border: 'border-purple-200',
      glow: 'shadow-purple-200/50'
    },
    slate: {
      gradient: 'from-slate-500 to-slate-600',
      background: 'from-slate-50 to-slate-100',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      accent: 'text-slate-600',
      border: 'border-slate-200',
      glow: 'shadow-slate-200/50'
    }
  };

  const config = colorConfig[color] || colorConfig.blue;

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
            <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-1/3"></div>
          </div>
          <div className="w-14 h-14 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg border ${config.border} p-6 hover:shadow-xl hover:${config.glow} transition-all duration-300 group relative overflow-hidden`}>
      {/* Subtle background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.background} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`${config.iconBg} p-3 rounded-xl shadow-sm`}>
              <Icon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider leading-tight">
                {title}
              </p>
              {subtitle && (
                <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold text-slate-900 mb-1 leading-none">
              {value}
            </div>
            
            {trend && (
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  trend.positive 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  {trend.positive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {trend.value}
                </div>
                {trend.period && (
                  <span className="text-xs text-slate-500">{trend.period}</span>
                )}
              </div>
            )}
          </div>

          {/* Status indicator or accent element */}
          <div className="text-right">
            <div className={`w-2 h-2 ${config.gradient} rounded-full animate-pulse`}></div>
          </div>
        </div>

        {/* Additional metrics row */}
        {(trend?.details || trend?.secondary) && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center">
              {trend.details && (
                <div className="text-xs text-slate-500">
                  {trend.details}
                </div>
              )}
              {trend.secondary && (
                <div className={`text-xs font-medium ${config.accent}`}>
                  {trend.secondary}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Decorative corner element */}
      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl ${config.gradient} opacity-5 rounded-bl-full`}></div>
    </div>
  );
};

export default StatsCard;
