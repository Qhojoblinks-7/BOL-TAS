import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, AlertCircle, CheckCircle, Smartphone, QrCode, Key, Calendar } from 'lucide-react';

const HelpTab = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      id: 'getting-started',
      question: 'How do I get started with the BOL Teens App?',
      answer: 'Welcome to the Bread of Life Teens Attendance System! Start by viewing your ID card with your unique 5-digit code. This code is used for attendance tracking. You can also update your profile and manage your security settings.',
      icon: <HelpCircle size={20} />
    },
    {
      id: 'qr-code',
      question: 'How does the QR code attendance system work?',
      answer: 'Your unique 5-digit personal code is displayed as a QR code on your ID card. Ushers at church events will scan this code to mark your attendance. Make sure your QR code is clearly visible when entering services.',
      icon: <QrCode size={20} />
    },
    {
      id: 'attendance',
      question: 'How can I check my attendance history?',
      answer: 'Navigate to the Attendance tab to view your attendance records. You can see all your check-ins, including dates, times, and service types. This helps you track your participation in church activities.',
      icon: <Calendar size={20} />
    },
    {
      id: 'security',
      question: 'What security features are available?',
      answer: 'The app includes several security features: password protection, account recovery options, and the ability to change your personal code if needed. Always keep your login credentials secure.',
      icon: <Key size={20} />
    },
    {
      id: 'mobile-app',
      question: 'Is this app available on mobile devices?',
      answer: 'Yes! The BOL Teens App is fully responsive and works on smartphones, tablets, and desktop computers. The interface automatically adapts to your screen size for the best experience.',
      icon: <Smartphone size={20} />
    },
    {
      id: 'troubleshooting',
      question: 'What should I do if I can\'t access my account?',
      answer: 'If you\'re having trouble logging in, try the account recovery options in the Security tab. You can reset your password or recover your account using trusted contacts. If issues persist, contact your church administrator.',
      icon: <AlertCircle size={20} />
    },
    {
      id: 'usher-duty',
      question: 'How do I activate usher duty?',
      answer: 'If you have been assigned usher duties, you\'ll see a "Usher Duty" option in the navigation menu. Click it to enter your temporary credentials provided by your administrator. Usher mode gives you access to attendance scanning tools.',
      icon: <CheckCircle size={20} />
    },
    {
      id: 'profile-update',
      question: 'How do I update my profile information?',
      answer: 'Click the edit button (pencil icon) next to your name in the navigation drawer to access profile editing. You can update your photo, name, and other personal details.',
      icon: <HelpCircle size={20} />
    }
  ];

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="space-y-6 z-5">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-black">Help & FAQ</h2>
        <p className="text-gray-600">Find answers to common questions and learn how to use the BOL Teens App</p>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <HelpCircle size={24} />
          Quick Start Guide
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="font-medium text-blue-900">View Your ID Card</p>
                <p className="text-sm text-blue-700">Check your unique 5-digit code and QR code</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="font-medium text-blue-900">Update Profile</p>
                <p className="text-sm text-blue-700">Add your photo and personal details</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="font-medium text-green-900">Track Attendance</p>
                <p className="text-sm text-green-700">Monitor your church attendance records</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 font-bold text-sm">4</span>
              </div>
              <div>
                <p className="font-medium text-green-900">Stay Secure</p>
                <p className="text-sm text-green-700">Manage passwords and recovery options</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-black">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-blue-600">{faq.icon}</div>
                  <span className="font-medium text-black">{faq.question}</span>
                </div>
                <div className="text-gray-400">
                  {expandedFAQ === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>
              {expandedFAQ === faq.id && (
                <div className="px-4 pb-4">
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-black mb-2">Need More Help?</h3>
        <p className="text-gray-600 mb-4">
          If you can't find the answer you're looking for, contact your church administrator or youth leader for assistance.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <AlertCircle size={16} />
          <span>Support is available during church service hours</span>
        </div>
      </div>
    </div>
  );
};

export default HelpTab;