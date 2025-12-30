import React, { useState } from 'react';
import RecoveryMethod from './Recovery/RecoveryMethod';
import CodeVerification from './Recovery/CodeVerification';
import BackupCodes from './Recovery/BackupCodes';
import TrustedContacts from './Recovery/TrustedContacts';

const RecoveryTab = ({ onRecover }) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [recoveryMethod, setRecoveryMethod] = useState('email');
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [showCodeVerification, setShowCodeVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [activeTab, setActiveTab] = useState('recovery'); // 'recovery', 'backup', 'trusted'
  const [backupCodes, setBackupCodes] = useState(['BOL-BACKUP-001', 'BOL-BACKUP-002', 'BOL-BACKUP-003']);
  const [trustedContacts, setTrustedContacts] = useState([
    { id: 1, name: 'Sarah Doe', email: 'sarah@email.com', phone: '(555) 555-5555' }
  ]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);

  const handleSendRecovery = async () => {
    if (recoveryMethod === 'email' && !email) {
      setMessage('Please enter your registered email.');
      setMessageType('error');
      return;
    }
    if (recoveryMethod === 'phone' && !phone) {
      setMessage('Please enter your registered phone number.');
      setMessageType('error');
      return;
    }

    setIsSending(true);
    setMessage('');

    // Simulate sending recovery and generating code
    setTimeout(() => {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setRecoveryCode(code);
      setShowCodeVerification(true);
      setMessage(`Recovery code sent to your ${recoveryMethod}. Check for verification code.`);
      setMessageType('success');
      setIsSending(false);
    }, 2000);
  };

  const handleVerifyCode = () => {
    if (!verificationCode) {
      setMessage('Please enter the verification code.');
      setMessageType('error');
      return;
    }

    if (verificationCode === recoveryCode) {
      onRecover();
      setMessage('Verification successful! A new BOL-Key has been generated.');
      setMessageType('success');
      setShowCodeVerification(false);
      setEmail('');
      setPhone('');
      setVerificationCode('');
      setRecoveryCode('');
    } else {
      setMessage('Invalid verification code. Please try again.');
      setMessageType('error');
    }
  };

  const handleReset = () => {
    setEmail('');
    setPhone('');
    setVerificationCode('');
    setRecoveryCode('');
    setShowCodeVerification(false);
    setMessage('');
  };

  const generateBackupCodes = () => {
    const codes = Array.from({ length: 5 }, (_, i) => 
      `BOL-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${i + 1}`
    );
    setBackupCodes(codes);
    setMessage('Backup codes generated successfully!');
    setMessageType('success');
  };

  const downloadBackupCodes = () => {
    const text = 'BOL-TAS Backup Codes\n' + 
                 'Keep these codes safe. Each code can be used once for recovery.\n\n' +
                 backupCodes.map((code, i) => `${i + 1}. ${code}`).join('\n');
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', 'backup-codes.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const addTrustedContact = () => {
    if (!newContactName || (!newContactEmail && !newContactPhone)) {
      setMessage('Please provide at least a name and email or phone.');
      setMessageType('error');
      return;
    }
    const newContact = {
      id: Date.now(),
      name: newContactName,
      email: newContactEmail,
      phone: newContactPhone
    };
    setTrustedContacts([...trustedContacts, newContact]);
    setNewContactName('');
    setNewContactEmail('');
    setNewContactPhone('');
    setShowAddContact(false);
    setMessage('Trusted contact added successfully!');
    setMessageType('success');
  };

  const removeTrustedContact = (id) => {
    setTrustedContacts(trustedContacts.filter(contact => contact.id !== id));
    setMessage('Trusted contact removed.');
    setMessageType('success');
  };

  return (
    <div className="flex-1 flex flex-col space-y-4">
      <h2 className="text-xl text-center font-bold text-black">Account Recovery</h2>
      
      {/* Tab Navigation */}
      <div className="flex gap-2 bg-white/50 rounded-lg p-2">
        {[
          { id: 'recovery', label: 'Recovery' },
          { id: 'backup', label: 'Backup' },
          { id: 'trusted', label: 'Trusted' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-md transition-colors font-medium ${
              activeTab === tab.id
                ? 'bg-[hsl(186,70%,34%)]/80 text-white'
                : 'bg-transparent text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Recovery Tab */}
      {activeTab === 'recovery' && (
        <>
          {!showCodeVerification ? (
            <RecoveryMethod
              method={recoveryMethod}
              setMethod={setRecoveryMethod}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              onSend={handleSendRecovery}
              isSending={isSending}
              message={message}
              messageType={messageType}
            />
          ) : (
            <CodeVerification
              method={recoveryMethod}
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
              onVerify={handleVerifyCode}
              onBack={handleReset}
              message={message}
              messageType={messageType}
            />
          )}
        </>
      )}

      {/* Backup Codes Tab */}
      {activeTab === 'backup' && (
        <BackupCodes
          backupCodes={backupCodes}
          onGenerate={generateBackupCodes}
          onDownload={downloadBackupCodes}
          message={message}
          messageType={messageType}
        />
      )}

      {/* Trusted Contacts Tab */}
      {activeTab === 'trusted' && (
        <TrustedContacts
          contacts={trustedContacts}
          onAdd={addTrustedContact}
          onRemove={removeTrustedContact}
          newContactName={newContactName}
          setNewContactName={setNewContactName}
          newContactEmail={newContactEmail}
          setNewContactEmail={setNewContactEmail}
          newContactPhone={newContactPhone}
          setNewContactPhone={setNewContactPhone}
          showAddContact={showAddContact}
          setShowAddContact={setShowAddContact}
          message={message}
          messageType={messageType}
        />
      )}
    </div>
  );
};

export default RecoveryTab;