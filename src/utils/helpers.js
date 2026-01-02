// Helper functions
import { getAll, add, update, remove } from './database';

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Usher Assignment Functions - Connected to Database

export const getTemporaryAssignments = () => {
  return getAll('usherAssignments');
};

export const saveTemporaryAssignment = (assignment) => {
  // Transform assignment to database format
  const dbAssignment = {
    id: assignment.id,
    userId: assignment.memberId,
    assignedBy: assignment.assignedBy,
    assignedAt: assignment.assignedAt,
    expiresAt: assignment.expiration,
    status: assignment.status,
    memberEmail: assignment.memberEmail,
    credentials: assignment.credentials
  };
  add('usherAssignments', dbAssignment);
  return assignment;
};

export const getActiveAssignmentForMember = (memberId) => {
  const assignments = getAll('usherAssignments');
  const now = Date.now();

  const assignment = assignments.find(assignment =>
    assignment.userId === memberId &&
    assignment.status === 'active' &&
    new Date(assignment.expiresAt) > now
  );

  if (assignment) {
    // Transform back to expected format
    return {
      id: assignment.id,
      memberId: assignment.userId,
      memberEmail: assignment.memberEmail,
      credentials: assignment.credentials,
      expiration: assignment.expiresAt,
      assignedBy: assignment.assignedBy,
      assignedAt: assignment.assignedAt,
      status: assignment.status
    };
  }
  return null;
};

export const getActiveAssignmentForEmail = (email) => {
  const assignments = getAll('usherAssignments');
  const now = Date.now();

  const assignment = assignments.find(assignment =>
    assignment.memberEmail === email &&
    assignment.status === 'active' &&
    new Date(assignment.expiresAt) > now
  );

  if (assignment) {
    return {
      id: assignment.id,
      memberId: assignment.userId,
      memberEmail: assignment.memberEmail,
      credentials: assignment.credentials,
      expiration: assignment.expiresAt,
      assignedBy: assignment.assignedBy,
      assignedAt: assignment.assignedAt,
      status: assignment.status
    };
  }
  return null;
};

export const getAllActiveAssignments = () => {
  const assignments = getAll('usherAssignments');
  const now = Date.now();

  return assignments
    .filter(assignment =>
      assignment.status === 'active' &&
      new Date(assignment.expiresAt) > now
    )
    .map(assignment => ({
      id: assignment.id,
      memberId: assignment.userId,
      memberEmail: assignment.memberEmail,
      memberName: assignment.memberName || 'Unknown',
      credentials: assignment.credentials,
      expiration: assignment.expiresAt,
      assignedBy: assignment.assignedBy,
      assignedAt: assignment.assignedAt,
      status: assignment.status
    }));
};

export const revokeAssignment = (assignmentId) => {
  const assignment = getAll('usherAssignments').find(a => a.id === assignmentId);
  if (assignment) {
    update('usherAssignments', assignmentId, { status: 'revoked' });
    return true;
  }
  return false;
};

export const cleanupExpiredAssignments = () => {
  const assignments = getAll('usherAssignments');
  const now = Date.now();

  const activeAssignments = assignments.filter(assignment =>
    assignment.status === 'active' && new Date(assignment.expiresAt) > now
  );

  // Keep only active assignments and those that were revoked (for audit trail)
  const keptAssignments = assignments.filter(assignment =>
    assignment.status === 'revoked' || activeAssignments.some(active => active.id === assignment.id)
  );

  // Note: In a real implementation, we might remove expired assignments, but for now we keep them
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