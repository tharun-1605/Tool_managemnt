import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Play,
  Settings,
  Filter,
  Search,
  Hash,
  Clock,
} from 'lucide-react';

const ToolMonitor = ({ tools, detailedUsage }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and search tools based on current state
  const filteredTools = tools.filter((tool) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      tool.name.toLowerCase().includes(searchLower) ||
      tool.category.toLowerCase().includes(searchLower) ||
      (tool.shopkeeper?.shopId || '').toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    switch (filter) {
      case 'low-life':
        return tool.remainingLife <= tool.thresholdLimit;
      case 'in-use':
        // Include reusable tools in 'in-use' filter
        return tool.status === 'in-use' || (tool.reusable && tool.status === 'in-use');
      case 'available':
        return tool.status === 'available';
      case 'maintenance':
        return tool.status === 'maintenance';
      default:
        return true;
    }
  });

  // Determine border and bg color based on tool status and life
  const getStatusColor = (tool) => {
    if (tool.remainingLife <= tool.thresholdLimit) {
      return 'border-red-600 bg-red-50';
    }
    if (tool.status === 'in-use') {
      return 'border-blue-600 bg-blue-50';
    }
    if (tool.status === 'available') {
      return 'border-green-600 bg-green-50';
    }
    if (tool.status === 'maintenance') {
      return 'border-yellow-500 bg-yellow-50';
    }
    return 'border-gray-300 bg-gray-50';
  };

  // Show icon depending on status and life
  const getStatusIcon = (tool) => {
    if (tool.remainingLife <= tool.thresholdLimit) {
      return <AlertTriangle className="w-6 h-6 text-red-600" aria-label="Critical Life Alert" />;
    }
    if (tool.status === 'in-use') {
      return <Play className="w-6 h-6 text-blue-600" aria-label="In Use" />;
    }
    if (tool.status === 'available') {
      return <CheckCircle className="w-6 h-6 text-green-600" aria-label="Available" />;
    }
    if (tool.status === 'maintenance') {
      return <Settings className="w-6 h-6 text-yellow-600" aria-label="Maintenance" />;
    }
    return <Settings className="w-6 h-6 text-gray-500" aria-label="Unknown Status" />;
  };

  return (
    <div className="space-y-6">
      {/* Filter and Search */}
      <section>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="search"
                aria-label="Search tools and shops"
                placeholder="Search tools, categories, shops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700"
              />
            </div>
            <div className="flex items-center gap-2 max-w-xs w-full sm:max-w-[200px]">
              <Filter className="text-gray-600" size={20} />
              <select
                aria-label="Filter tools by status"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="flex-grow rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent py-2 px-3 text-gray-700"
              >
                <option value="all">All Tools</option>
                <option value="low-life">Low Life</option>
                <option value="in-use">In Use</option>
                <option value="available">Available</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section>
        {filteredTools.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-xl font-semibold">No tools found.</p>
            <p className="mt-2 text-sm">Try changing your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const usageData = detailedUsage ? detailedUsage[tool._id] : null;
              const lifePercent = Math.max(0, (tool.remainingLife / tool.lifeLimit) * 100);

              return (
                <article
                  key={tool._id}
                  className={`border-2 rounded-xl p-6 transition-shadow bg-white shadow-sm hover:shadow-md focus-within:shadow-md outline-none ${getStatusColor(
                    tool,
                  )}`}
                  tabIndex={0}
                  aria-labelledby={`tool-title-${tool._id}`}
                  aria-describedby={`tool-desc-${tool._id}`}
                >
                  <header className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3
                        id={`tool-title-${tool._id}`}
                        className="text-lg font-semibold text-gray-900 truncate"
                        title={tool.name}
                      >
                        {tool.name}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">{tool.category}</p>
                      <p className="text-xs text-blue-600 truncate" title={`Shop ID: ${tool.shopkeeper?.shopId}`}>
                        Shop: {tool.shopkeeper?.shopId || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(tool)}
                      {tool.reusable && (
                        <span className="ml-2 inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide select-none">
                          Reusable
                        </span>
                      )}
                    </div>
                  </header>

                  <dl className="space-y-3">
                    <div>
                      <dt className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                        <span>Tool Life</span>
                        <span aria-live="polite" aria-atomic="true">
                          {tool.remainingLife.toFixed(1)}h / {tool.lifeLimit}h
                        </span>
                      </dt>
                      <div
                        className="w-full h-2 rounded bg-gray-300 overflow-hidden"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={tool.lifeLimit}
                        aria-valuenow={tool.remainingLife}
                        aria-label="Tool life progress"
                      >
                        <div
                          className={`h-2 ${
                            tool.remainingLife <= tool.thresholdLimit
                              ? 'bg-red-600'
                              : tool.remainingLife <= tool.lifeLimit * 0.3
                              ? 'bg-yellow-500'
                              : 'bg-green-600'
                          } transition-all duration-500`}
                          style={{ width: `${lifePercent}%` }}
                        />
                      </div>

                      {tool.remainingLife <= tool.thresholdLimit && (
                        <div className="flex items-center gap-1 mt-2 text-red-600 text-sm font-semibold">
                          <AlertTriangle size={16} />
                          <span role="alert" aria-live="assertive">
                            Needs replacement – below threshold of {tool.thresholdLimit}h.
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <dt className="text-sm font-medium text-gray-700 mb-1">Status</dt>
                      <dd className="text-gray-800 capitalize">{tool.status}</dd>
                    </div>

                    {tool.status === 'in-use' && tool.usageStartTime && (
                      <div>
                        <dt className="text-sm font-medium text-gray-700 mb-1">In Use Since</dt>
                        <dd className="flex items-center text-gray-700 space-x-2 font-mono text-sm">
                          <Clock size={16} aria-hidden="true" />
                          <time dateTime={tool.usageStartTime}>
                            {new Date(tool.usageStartTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </time>
                        </dd>
                      </div>
                    )}
                  </dl>

                  {/* Detailed per-instance usage */}
                  {usageData && (
                    <section aria-label="Usage instances" className="mt-4">
                      <h4 className="text-md font-semibold text-gray-900 mb-2">Usage Instances</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.values(usageData.operators).flatMap((operator) =>
                          operator.instances.map((instance, idx) => {
                            const isActive = instance.isActive;
                            return (
                              <article
                                key={idx}
                                tabIndex={0}
                                className="border border-gray-300 rounded p-3 bg-white shadow group focus-within:ring-2 focus-within:ring-green-500"
                                aria-label={`Instance ${instance.instanceNumber}, status ${
                                  isActive ? 'active' : 'completed'
                                }`}
                              >
                                <header className="flex justify-between items-center mb-1">
                                  <h5 className="text-xs font-semibold text-gray-700 flex items-center gap-1 truncate">
                                    <Hash size={12} />
                                    Instance #{instance.instanceNumber}
                                  </h5>
                                  <span
                                    className={`text-xs rounded-full px-2 py-0.5 font-semibold uppercase tracking-wide ${
                                      isActive
                                        ? 'bg-orange-100 text-orange-800'
                                        : 'bg-green-100 text-green-800'
                                    }`}
                                  >
                                    {isActive ? 'Active' : 'Completed'}
                                  </span>
                                </header>
                                <p className="text-xs text-gray-600 flex items-center gap-1">
                                  <Clock size={12} />
                                  {instance.duration
                                    ? `${instance.duration.toFixed(1)}h`
                                    : 'In Progress'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(instance.startTime).toLocaleDateString()}
                                </p>
                              </article>
                            );
                          }),
                        )}
                      </div>
                    </section>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ToolMonitor;
