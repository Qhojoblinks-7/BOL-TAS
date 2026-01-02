import mockDatabase from '../data/mockDatabase.json';

// Initialize database in localStorage if not exists
const initializeDatabase = () => {
  let db = localStorage.getItem('boltas_database');
  if (!db) {
    localStorage.setItem('boltas_database', JSON.stringify(mockDatabase));
  } else {
    db = JSON.parse(db);
    // Ensure new collections are added
    db.ushers = mockDatabase.ushers || [];
    localStorage.setItem('boltas_database', JSON.stringify(db));
  }
};

// Get database from localStorage
const getDatabase = () => {
  initializeDatabase();
  return JSON.parse(localStorage.getItem('boltas_database'));
};

// Save database to localStorage
const saveDatabase = (db) => {
  localStorage.setItem('boltas_database', JSON.stringify(db));
};

// Generic CRUD operations
export const getAll = (collection) => {
  const db = getDatabase();
  return db[collection] || [];
};

export const getById = (collection, id) => {
  const items = getAll(collection);
  return items.find(item => item.id === id);
};

export const add = (collection, item) => {
  const db = getDatabase();
  if (!db[collection]) db[collection] = [];
  db[collection].push(item);
  saveDatabase(db);
  return item;
};

export const update = (collection, id, updates) => {
  const db = getDatabase();
  if (!db[collection]) return null;
  const index = db[collection].findIndex(item => item.id === id);
  if (index === -1) return null;
  db[collection][index] = { ...db[collection][index], ...updates };
  saveDatabase(db);
  return db[collection][index];
};

export const remove = (collection, id) => {
  const db = getDatabase();
  if (!db[collection]) return false;
  const index = db[collection].findIndex(item => item.id === id);
  if (index === -1) return false;
  db[collection].splice(index, 1);
  saveDatabase(db);
  return true;
};

// Specific query functions
export const getUserByPersonalCode = (personalCode) => {
  const users = getAll('users');
  return users.find(user => user.personalCode === personalCode);
};

export const getMemberByPersonalCode = (personalCode) => {
  const members = getAll('churchMembers');
  return members.find(member => member.personalCode === personalCode);
};

export const getUserAttendance = (userId) => {
  const records = getAll('attendanceRecords');
  return records.filter(record => record.userId === userId);
};

export const addAttendanceRecord = (record) => {
  return add('attendanceRecords', {
    id: `att_${Date.now()}`,
    ...record,
    timestamp: new Date().toISOString()
  });
};

export const getActiveUsherAssignments = () => {
  const assignments = getAll('usherAssignments');
  const now = new Date();
  return assignments.filter(assignment =>
    assignment.status === 'active' &&
    new Date(assignment.expiresAt) > now
  );
};

export const getUsherAssignmentForEmail = (email) => {
  const assignments = getActiveUsherAssignments();
  const user = getAll('users').find(u => u.email === email);
  if (!user) return null;
  return assignments.find(assignment => assignment.userId === user.id);
};

// Reset database to initial state
export const resetDatabase = () => {
  localStorage.removeItem('boltas_database');
  initializeDatabase();
};