import React, { useState } from 'react';
import { BookOpen, Heart, Users, Shield, Clock, AlertTriangle, CheckCircle, Star, Target, HandHeart } from 'lucide-react';

const ChurchGuidelinesTab = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const guidelines = [
    {
      id: 'conduct',
      title: 'Code of Conduct',
      icon: <Shield size={20} />,
      color: 'blue',
      content: [
        'Treat everyone with respect, kindness, and love as Christ taught us',
        'Use appropriate language - no swearing, gossip, or disrespectful speech',
        'Respect church property and maintain cleanliness in all areas',
        'Participate actively in services and youth group activities',
        'Follow instructions from youth leaders and church staff',
        'Maintain appropriate physical boundaries and personal space'
      ]
    },
    {
      id: 'attendance',
      title: 'Attendance & Participation',
      icon: <Clock size={20} />,
      color: 'green',
      content: [
        'Attend Sunday services regularly and on time',
        'Participate in youth group meetings and activities',
        'Notify leaders in advance if unable to attend scheduled events',
        'Be prepared for Bible study and group discussions',
        'Contribute positively to group activities and discussions',
        'Support fellow youth members in their spiritual growth'
      ]
    },
    {
      id: 'technology',
      title: 'Technology & Social Media',
      icon: <Users size={20} />,
      color: 'purple',
      content: [
        'Use church technology responsibly and only for approved purposes',
        'Maintain appropriate online behavior representing Christ',
        'Respect privacy - do not share others\' personal information',
        'Use social media to encourage and uplift fellow believers',
        'Avoid inappropriate content and maintain digital witness',
        'Report any concerning online behavior to youth leaders'
      ]
    },
    {
      id: 'safety',
      title: 'Safety & Well-being',
      icon: <Heart size={20} />,
      color: 'red',
      content: [
        'Follow all safety guidelines during church activities',
        'Report any unsafe conditions or behavior immediately',
        'Maintain personal health and hygiene standards',
        'Respect emergency procedures and evacuation routes',
        'Inform leaders of any medical conditions or allergies',
        'Support emotional and spiritual well-being of peers'
      ]
    },
    {
      id: 'service',
      title: 'Service & Ministry',
      icon: <HandHeart size={20} />,
      color: 'orange',
      content: [
        'Participate in church service opportunities with enthusiasm',
        'Serve with a humble and willing heart',
        'Complete assigned tasks to the best of your ability',
        'Learn and grow through service experiences',
        'Encourage others in their service and ministry roles',
        'Reflect Christ\'s love through your service'
      ]
    }
  ];

  const coreValues = [
    { icon: <Heart size={24} />, title: 'Love', description: 'Love God with all your heart and love your neighbor as yourself' },
    { icon: <Shield size={24} />, title: 'Integrity', description: 'Live with honesty, purity, and moral courage' },
    { icon: <Users size={24} />, title: 'Community', description: 'Build meaningful relationships and support one another' },
    { icon: <Target size={24} />, title: 'Excellence', description: 'Strive for excellence in all areas of life and service' },
    { icon: <Star size={24} />, title: 'Faith', description: 'Grow in faith through prayer, Bible study, and obedience' }
  ];

  return (
    <div className="space-y-6 z-2">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-black">Church Guidelines</h2>
        <p className="text-gray-600">Youth code of conduct and policies for our church community</p>
      </div>

      {/* Core Values */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
        <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
          <Star size={24} />
          Our Core Values
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreValues.map((value, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-indigo-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-indigo-600">{value.icon}</div>
                <h4 className="font-semibold text-indigo-900">{value.title}</h4>
              </div>
              <p className="text-sm text-indigo-700">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines Sections */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-black">Youth Guidelines</h3>
        <div className="space-y-3">
          {guidelines.map((guideline) => (
            <div key={guideline.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleSection(guideline.id)}
                className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-${guideline.color}-600`}>{guideline.icon}</div>
                  <span className="font-medium text-black">{guideline.title}</span>
                </div>
                <div className="text-gray-400">
                  {expandedSection === guideline.id ? '−' : '+'}
                </div>
              </button>
              {expandedSection === guideline.id && (
                <div className="px-4 pb-4">
                  <div className="pt-2 border-t border-gray-100">
                    <ul className="space-y-2">
                      {guideline.content.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <CheckCircle size={16} className={`text-${guideline.color}-600 mt-0.5 flex-shrink-0`} />
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

      {/* Biblical Foundation */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
          <BookOpen size={24} />
          Biblical Foundation
        </h3>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-green-900 mb-2">"Love one another as I have loved you."</h4>
            <p className="text-sm text-green-700 mb-1"><strong>John 13:34</strong></p>
            <p className="text-sm text-gray-600">This is the foundation of our community - loving God and loving each other.</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-green-900 mb-2">"Let your light shine before others."</h4>
            <p className="text-sm text-green-700 mb-1"><strong>Matthew 5:16</strong></p>
            <p className="text-sm text-gray-600">As youth in our church, you are called to be examples of Christ's love and character.</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-green-900 mb-2">"Be kind and compassionate to one another."</h4>
            <p className="text-sm text-green-700 mb-1"><strong>Ephesians 4:32</strong></p>
            <p className="text-sm text-gray-600">Kindness and compassion should characterize all our interactions.</p>
          </div>
        </div>
      </div>

      {/* Contact for Questions */}
      <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 text-center">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-amber-900 mb-2">Questions About Guidelines?</h3>
        <p className="text-amber-700 mb-4">
          If you have questions about these guidelines or need clarification on any policy, please speak with your youth leader or pastor.
        </p>
        <div className="text-sm text-amber-600">
          <p>Remember: These guidelines are designed to help you grow in your faith and maintain a safe, loving community.</p>
        </div>
      </div>
    </div>
  );
};

export default ChurchGuidelinesTab;