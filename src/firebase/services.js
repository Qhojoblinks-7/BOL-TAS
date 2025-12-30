import { db } from './config';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Example service functions
export const addMember = async (memberData) => {
  try {
    const docRef = await addDoc(collection(db, 'members'), memberData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding member: ', error);
    throw error;
  }
};

export const getMembers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'members'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting members: ', error);
    throw error;
  }
};

export const updateMember = async (id, updatedData) => {
  try {
    const memberRef = doc(db, 'members', id);
    await updateDoc(memberRef, updatedData);
  } catch (error) {
    console.error('Error updating member: ', error);
    throw error;
  }
};

export const deleteMember = async (id) => {
  try {
    await deleteDoc(doc(db, 'members', id));
  } catch (error) {
    console.error('Error deleting member: ', error);
    throw error;
  }
};