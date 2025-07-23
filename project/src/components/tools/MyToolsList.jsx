import React from 'react';
import { 
  Package, 
  Play, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  TrendingUp
} from 'lucide-react';

const MyToolsList = ({ tools }) => {
  const getLifeColor = (tool) => {
    const percentage = (tool.remainingLife / tool.lifeLimit) * 100;
    if (percentage <= (tool.thresholdLimit / tool.lifeLimit) * 100) return 'text-red-600';
    if (percentage <= 30) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getLifeBarColor = (tool) => {
    const percentage = (tool.remainingLife / tool.lifeLimit) * 100;
    if (percentage <= (tool.thresholdLimit / tool.lifeLimit) * 100) return 'bg-red-500';
    if (percentage <= 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {tools.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <div className="text-gray-500 text-lg">No tools ordered yet</div>
          <p className="text-gray-400 text-sm mt-2">Order tools from shops to see them here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div key={tool._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{tool.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{tool.category}</p>
                  <p className="text-xs text-blue-600">Shop: {tool.shopkeeper?.shopName}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Owned
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">{tool.description}</p>

              {/* Quantity Stats */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <Package className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Ordered</p>
                  <p className="font-bold text-blue-600">{tool.companyQuantity}</p>
                </div>
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Available</p>
                  <p className="font-bold text-green-600">{tool.availableQuantity}</p>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded-lg">
                  <Play className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">In Use</p>
                  <p className="font-bold text-orange-600">{tool.inUseQuantity}</p>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                  <Package className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Reusable</p>
                  <p className="font-bold text-purple-600">{tool.reusable ? 1 : 0}</p>
                </div>
              </div>

              {/* Life Progress or Reusable Badge */}
              <div className="mb-4">
                {tool.reusable ? (
                  <div className="flex items-center justify-center bg-gray-100 text-gray-600 rounded-full py-2">
                    <span className="text-sm font-medium">Reusable</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Tool Life</span>
                      <span className={`text-sm font-bold ${getLifeColor(tool)}`}>
                        {tool.remainingLife.toFixed(1)}h / {tool.lifeLimit}h
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getLifeBarColor(tool)} transition-all`}
                        style={{ width: `${Math.max(0, (tool.remainingLife / tool.lifeLimit) * 100)}%` }}
                      ></div>
                    </div>
                    {tool.remainingLife <= tool.thresholdLimit && (
                      <div className="flex items-center gap-1 mt-2 text-red-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs">Below threshold ({tool.thresholdLimit}h)</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-gray-600">Total Usage</p>
                    <p className="font-medium">{tool.totalUsageHours?.toFixed(1) || 0}h</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                  <div>
                    <p className="text-gray-600">Efficiency</p>
                    <p className="font-medium">
                      {tool.lifeLimit > 0 ? ((tool.totalUsageHours || 0) / tool.lifeLimit * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <div className="flex items-center gap-2">
                    {tool.availableQuantity > 0 && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        Available
                      </span>
                    )}
                    {tool.inUseQuantity > 0 && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <Play className="w-3 h-3" />
                        In Use
                      </span>
                    )}
                    {tool.availableQuantity === 0 && tool.inUseQuantity === 0 && (
                      <span className="text-gray-500">All Used</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyToolsList;