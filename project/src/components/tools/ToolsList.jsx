import React, { useState } from 'react';
import axios from 'axios';
import { 
  Edit, 
  Trash2, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  Package,
  ShoppingCart
} from 'lucide-react';
import ToolForm from './ToolForm';

const ToolsList = ({ tools, onUpdate, userRole }) => {
  const [editingTool, setEditingTool] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleDelete = async (toolId) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      try {
        await axios.delete(`https://tool-managemnt.onrender.com/api/tools/${toolId}`);
        onUpdate();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete tool');
      }
    }
  };

  const getStatusIcon = (tool) => {
    switch (tool.status) {
      case 'available':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'maintenance':
        return <Settings className="w-4 h-4 text-yellow-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div key={tool._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{tool.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{tool.category}</p>
                {tool.shopkeeper?.shopName && (
                  <p className="text-xs text-blue-600">Shop: {tool.shopkeeper.shopName}</p>
                )}
              </div>
              <div className="flex items-center gap-1">
                {getStatusIcon(tool)}
                <span className="text-xs text-gray-600 capitalize">{tool.status || 'available'}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4">{tool.description}</p>

            {/* Life Progress - Only for Shopkeepers */}
            {userRole === 'shopkeeper' && (
              <div className="mb-4">
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
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              {userRole === 'shopkeeper' && (
                <>
                  <div>
                    <p className="text-gray-600">Available Stock</p>
                    <p className="font-medium">{tool.stock || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Threshold</p>
                    <p className="font-medium">{tool.thresholdLimit}h</p>
                  </div>
                </>
              )}
              
              {userRole === 'supervisor' && (
                <>
                  <div>
                    <p className="text-gray-600">Life Limit</p>
                    <p className="font-medium">{tool.lifeLimit}h</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Available Stock</p>
                    <p className="font-medium">{tool.stock || 0}</p>
                  </div>
                </>
              )}
            </div>

            {/* Total Orders Summary - Only for Shopkeepers (without usage details) */}
            {userRole === 'shopkeeper' && tool.orderedByCompanies && tool.orderedByCompanies.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Total Orders</h4>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">
                    {tool.orderedByCompanies.reduce((sum, order) => sum + order.orderedQuantity, 0)}
                  </p>
                  <p className="text-xs text-blue-700">Units Ordered by Companies</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {userRole === 'shopkeeper' && (
                <>
                  <button
                    onClick={() => {
                      setEditingTool(tool);
                      setShowEditForm(true);
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tool._id)}
                    className="px-3 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}

              {userRole === 'supervisor' && (
                <div className="w-full bg-green-100 text-green-700 py-2 px-3 rounded-lg text-sm text-center flex items-center justify-center gap-1">
                  <ShoppingCart className="w-4 h-4" />
                  Available for Order
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditForm && editingTool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <ToolForm
              tool={editingTool}
              onSubmit={() => {
                setShowEditForm(false);
                setEditingTool(null);
                onUpdate();
              }}
              onCancel={() => {
                setShowEditForm(false);
                setEditingTool(null);
              }}
            />
          </div>
        </div>
      )}

      {tools.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <div className="text-gray-500 text-lg">No tools found</div>
          <p className="text-gray-400 text-sm mt-2">
            {userRole === 'shopkeeper' ? 'Add your first tool to get started' : 'No tools available for ordering'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ToolsList;