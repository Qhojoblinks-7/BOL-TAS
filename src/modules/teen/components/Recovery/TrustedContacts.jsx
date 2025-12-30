import React from 'react';
import { Users, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const TrustedContacts = ({
  contacts,
  onAdd,
  onRemove,
  newContactName,
  setNewContactName,
  newContactEmail,
  setNewContactEmail,
  newContactPhone,
  setNewContactPhone,
  showAddContact,
  setShowAddContact,
  message,
  messageType
}) => {
  return (
    <div className="bg-white/50 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-300 space-y-4">
      <div className="flex items-center space-x-2">
        <Users size={20} className="text-[hsl(186,70%,34%)]" />
        <p className="font-medium text-black">Trusted Contacts</p>
      </div>

      <p className="text-sm text-gray-600">
        Add trusted people who can help you recover your account if you're locked out.
      </p>

      {/* Contacts List */}
      <div className="space-y-2">
        {contacts.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-4">No trusted contacts added yet.</p>
        ) : (
          contacts.map(contact => (
            <div key={contact.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-bold text-black">{contact.name}</h4>
                  {contact.email && <p className="text-xs text-gray-600">{contact.email}</p>}
                  {contact.phone && <p className="text-xs text-gray-600">{contact.phone}</p>}
                </div>
                <button
                  onClick={() => onRemove(contact.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                  title="Remove contact"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Contact Section */}
      {!showAddContact ? (
        <button
          onClick={() => setShowAddContact(true)}
          className="w-full flex items-center justify-center px-4 py-3 bg-[hsl(186,70%,34%)]/80 hover:bg-[hsl(186,70%,34%)] text-white rounded-lg transition-colors font-bold"
        >
          <Plus size={16} className="mr-2" />
          Add Trusted Contact
        </button>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 space-y-3 bg-gray-50">
          <h4 className="font-bold text-black">Add New Contact</h4>

          <input
            type="text"
            value={newContactName}
            onChange={(e) => setNewContactName(e.target.value)}
            placeholder="Full Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[hsl(186,70%,34%)]/20 focus:border-[hsl(186,70%,34%)]"
          />

          <input
            type="email"
            value={newContactEmail}
            onChange={(e) => setNewContactEmail(e.target.value)}
            placeholder="Email (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[hsl(186,70%,34%)]/20 focus:border-[hsl(186,70%,34%)]"
          />

          <input
            type="tel"
            value={newContactPhone}
            onChange={(e) => setNewContactPhone(e.target.value)}
            placeholder="Phone (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[hsl(186,70%,34%)]/20 focus:border-[hsl(186,70%,34%)]"
          />

          <div className="flex gap-2">
            <button
              onClick={onAdd}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-bold"
            >
              <CheckCircle size={16} className="mr-2" />
              Save Contact
            </button>
            <button
              onClick={() => {
                setShowAddContact(false);
                setNewContactName('');
                setNewContactEmail('');
                setNewContactPhone('');
              }}
              className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {message && (
        <div
          className={`flex items-center space-x-2 text-sm p-3 rounded-md ${
            messageType === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {messageType === 'success' ? (
            <CheckCircle size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default TrustedContacts;
