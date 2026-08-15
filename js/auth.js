// =============================================
// AUTHENTICATION - KARIS PRINTERS
// =============================================

import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { 
    doc, setDoc, getDoc, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// =============================================
// REGISTER USER (WITH FIRESTORE SAVE)
// =============================================
export async function registerUser(email, password, displayName, phone = '', address = '') {
    try {
        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update profile with display name
        await updateProfile(user, {
            displayName: displayName
        });
        
        // =============================================
        // SAVE USER DATA TO FIRESTORE
        // =============================================
        try {
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                uid: user.uid,
                displayName: displayName,
                email: email,
                phone: phone || '',
                address: address || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            console.log('✅ User data saved to Firestore');
        } catch (firestoreError) {
            console.warn('⚠️ Firestore save failed (security rules may be strict):', firestoreError.message);
            // Don't fail the registration if Firestore save fails
            // The user is still created in Authentication
        }
        
        console.log('✅ User registered:', user.email);
        return { success: true, user: user };
        
    } catch (error) {
        console.error('❌ Registration error:', error.message);
        return { success: false, error: error.message };
    }
}

// =============================================
// LOGIN USER
// =============================================
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('✅ User logged in:', user.email);
        return { success: true, user: user };
    } catch (error) {
        console.error('❌ Login error:', error.message);
        return { success: false, error: error.message };
    }
}

// =============================================
// LOGOUT USER
// =============================================
export async function logoutUser() {
    try {
        await signOut(auth);
        console.log('✅ User logged out');
        return { success: true };
    } catch (error) {
        console.error('❌ Logout error:', error.message);
        return { success: false, error: error.message };
    }
}

// =============================================
// RESET PASSWORD
// =============================================
export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log('✅ Password reset email sent to:', email);
        return { success: true };
    } catch (error) {
        console.error('❌ Password reset error:', error.message);
        return { success: false, error: error.message };
    }
}

// =============================================
// GET CURRENT USER
// =============================================
export function getCurrentUser() {
    return auth.currentUser;
}

// =============================================
// AUTH STATE LISTENER
// =============================================
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('👤 User is signed in:', user.email);
            callback(user);
        } else {
            console.log('👤 User is signed out');
            callback(null);
        }
    });
}

// =============================================
// GET USER DATA FROM FIRESTORE
// =============================================
export async function getUserData(uid) {
    try {
        const userDocRef = doc(db, 'users', uid);
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists()) {
            return { success: true, data: docSnap.data() };
        } else {
            return { success: false, error: 'User document not found' };
        }
    } catch (error) {
        console.error('Error getting user data:', error);
        return { success: false, error: error.message };
    }
}

// =============================================
// UPDATE USER DATA IN FIRESTORE
// =============================================
export async function updateUserData(uid, data) {
    try {
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, {
            ...data,
            updatedAt: new Date().toISOString()
        });
        console.log('✅ User data updated in Firestore');
        return { success: true };
    } catch (error) {
        console.error('Error updating user data:', error);
        return { success: false, error: error.message };
    }
}

// =============================================
// GET USER EMAIL (Helper)
// =============================================
export function getUserEmail() {
    const user = getCurrentUser();
    return user ? user.email : null;
}

// =============================================
// GET USER DISPLAY NAME (Helper)
// =============================================
export function getUserDisplayName() {
    const user = getCurrentUser();
    return user ? user.displayName : null;
}