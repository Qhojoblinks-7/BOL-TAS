// Helper functions
import mockDatabase from '../data/mockDatabase.json'; // eslint-disable-line no-unused-vars

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Temporary Usher Assignment Storage Functions

export const getTemporaryAssignments = () => {
  const assignments = localStorage.getItem('temporaryAssignments');
  return assignments ? JSON.parse(assignments) : [];
};

export const saveTemporaryAssignment = (assignment) => {
  const assignments = getTemporaryAssignments();
  assignments.push(assignment);
  localStorage.setItem('temporaryAssignments', JSON.stringify(assignments));
  return assignment;
};

export const getActiveAssignmentForMember = (memberId) => {
  const assignments = getTemporaryAssignments();
  const now = Date.now();

  return assignments.find(assignment =>
    assignment.memberId === memberId &&
    assignment.status === 'active' &&
    assignment.expiration > now
  );
};

export const getActiveAssignmentForEmail = (email) => {
  const assignments = getTemporaryAssignments();
  const now = Date.now();

  return assignments.find(assignment =>
    assignment.memberEmail === email &&
    assignment.status === 'active' &&
    assignment.expiration > now
  );
};

export const getAllActiveAssignments = () => {
  const assignments = getTemporaryAssignments();
  const now = Date.now();

  return assignments.filter(assignment =>
    assignment.status === 'active' &&
    assignment.expiration > now
  );
};

export const revokeAssignment = (assignmentId) => {
  const assignments = getTemporaryAssignments();
  const assignmentIndex = assignments.findIndex(a => a.id === assignmentId);

  if (assignmentIndex !== -1) {
    assignments[assignmentIndex].status = 'revoked';
    localStorage.setItem('temporaryAssignments', JSON.stringify(assignments));
    return true;
  }
  return false;
};

export const cleanupExpiredAssignments = () => {
  const assignments = getTemporaryAssignments();
  const now = Date.now();

  const activeAssignments = assignments.filter(assignment =>
    assignment.status === 'active' && assignment.expiration > now
  );

  // Keep only active assignments and those that were revoked (for audit trail)
  const keptAssignments = assignments.filter(assignment =>
    assignment.status === 'revoked' || activeAssignments.some(active => active.id === assignment.id)
  );

  localStorage.setItem('temporaryAssignments', JSON.stringify(keptAssignments));
  return keptAssignments.length;
};

export const validateTempCredentials = (email, username, password) => {
  const assignment = getActiveAssignmentForEmail(email);

  if (!assignment) {
    return { valid: false, error: 'No active assignment found' };
  }

  if (assignment.credentials.username === username && assignment.credentials.password === password) {
    return { valid: true, assignment };
  }

  return { valid: false, error: 'Invalid credentials' };
};