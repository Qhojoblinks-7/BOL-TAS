import React, { useState } from 'react';
import { HelpCircle, Users, FileText, BarChart3, UserCheck, Settings, ChevronDown, ChevronUp, Database, Shield } from 'lucide-react';

const AdminHelpTab = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const adminTopics = [
    {
      id: 'getting-started',
      title: 'Getting Started as Admin',
      icon: <HelpCircle size={20} />,
      color: 'blue',
      content: [
        'Access the admin dashboard through the main login with admin credentials',
        'Navigate between different management sections using the sidebar',
        'Use the statistics dashboard to monitor church attendance trends',
        'Export data regularly for record keeping and reporting'
      ]
    },
    {
      id: 'member-management',
      title: 'Managing Church Members',
      icon: <Users size={20} />,
      color: 'green',
      content: [
        'Add new members with complete profile information',
        'Update member details including contact information and ministry roles',
        'Track membership status and spiritual milestones',
        'Export member lists for church directories and communications'
      ]
    },
    {
      id: 'attendance-tracking',
      title: 'Attendance Records & Analytics',
      icon: <BarChart3 size={20} />,
      color: 'purple',
      content: [
        'View real-time attendance data from all church services',
        'Filter records by date, location, and member name',
        'Monitor attendance trends and participation rates',
        'Export attendance reports for leadership meetings'
      ]
    },
    {
      id: 'usher-management',
      title: 'Usher Duty Assignments',
      icon: <UserCheck size={20} />,
      color: 'orange',
      content: [
        'Assign temporary usher privileges to trusted members',
        'Generate secure credentials that auto-expire at 12:00 PM',
        'Monitor active usher assignments and their status',
        'Revoke access immediately if needed for security'
      ]
    },
    {
      id: 'data-export',
      title: 'Data Export & Reporting',
      icon: <FileText size={20} />,
      color: 'red',
      content: [
        'Export attendance records in CSV format for analysis',
        'Generate member lists for church communications',
        'Create reports for leadership and ministry teams',
        'Maintain secure backups of all church data'
      ]
    },
    {
      id: 'system-security',
      title: 'System Security & Access',
      icon: <Shield size={20} />,
      color: 'indigo',
      content: [
        'Maintain admin credentials securely and change regularly',
        'Monitor user access and role assignments',
        'Review system logs for unusual activity',
        'Ensure data privacy and member information protection'
      ]
    }
  ];

  const quickActions = [
    {
      title: 'Add New Member',
      description: 'Register a new church member with complete profile',
      steps: ['Go to Members page', 'Click "Add Member"', 'Fill required fields', 'Save profile']
    },
    {
      title: 'Assign Usher Duty',
      description: 'Give temporary usher access to a member',
      steps: ['Select member from list', 'Click "Assign Usher"', 'Generate credentials', 'Communicate securely']
    },
    {
      title: 'Export Attendance Data',
      description: 'Download attendance records for reporting',
      steps: ['Go to Attendance page', 'Apply filters if needed', 'Click "Export CSV"', 'Save file securely']
    },
    {
      title: 'Monitor Statistics',
      description: 'View church attendance and member metrics',
      steps: ['Visit Statistics page', 'Review dashboard charts', 'Check recent trends', 'Note areas for improvement']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-black">Admin Help & Documentation</h2>
        <p className="text-gray-600">Comprehensive guide for church administrators and system managers</p>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <Settings size={24} />
          Common Administrative Tasks
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">{action.title}</h4>
              <p className="text-sm text-blue-700 mb-3">{action.description}</p>
              <ol className="text-xs text-blue-600 space-y-1">
                {action.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold">
                      {stepIndex + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Topics */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-black">Administrative Functions</h3>
        <div className="space-y-3">
          {adminTopics.map((topic) => (
            <div key={topic.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleFAQ(topic.id)}
                className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-${topic.color}-600`}>{topic.icon}</div>
                  <span className="font-medium text-black">{topic.title}</span>
                </div>
                <div className="text-gray-400">
                  {expandedFAQ === topic.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>
              {expandedFAQ === topic.id && (
                <div className="px-4 pb-4">
                  <div className="pt-2 border-t border-gray-100">
                    <ul className="space-y-2">
                      {topic.content.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <div className={`w-5 h-5 bg-${topic.color}-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <div className={`w-2 h-2 bg-${topic.color}-600 rounded-full`}></div>
                          </div>
                          <span className="text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* System Information */}
      <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Database size={24} />
          System Information
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Data Management</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• All data is stored locally in the browser</li>
              <li>• Regular exports recommended for backup</li>
              <li>• Member information is kept secure and private</li>
              <li>• Attendance records are timestamped automatically</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Security Features</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Role-based access control</li>
              <li>• Temporary credentials for ushers</li>
              <li>• Auto-expiring permissions</li>
              <li>• Secure data export options</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Support Contact */}
      <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 text-center">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle size={24} className="text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-amber-900 mb-2">Need Technical Support?</h3>
        <p className="text-amber-700 mb-4">
          For technical issues, system problems, or feature requests, please contact the system administrator or development team.
        </p>
        <div className="text-sm text-amber-600">
          <p><strong>Remember:</strong> Regular data backups and secure credential management are essential for smooth church operations.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHelpTab;