// =============================================
// ADMIN CONFIGURATION - KARIS PRINTERS
// =============================================

import { auth, db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// =============================================
// ADMIN EMAILS (Hardcoded for quick access)
// =============================================
export const ADMIN_EMAILS = [
    'petermuturi2002@gmail.com',
    'karisprinters@gmail.com'
];

// =============================================
// CHECK IF USER IS ADMIN
// =============================================
export async function checkIsAdmin(user) {
    if (!user) return false;
    
    // Check 1: Hardcoded emails
    if (ADMIN_EMAILS.includes(user.email)) {
        console.log('✅ Admin found in hardcoded list:', user.email);
        return true;
    }
    
    // Check 2: Check Firestore admin collection
    try {
        const adminDoc = doc(db, 'admins', user.uid);
        const docSnap = await getDoc(adminDoc);
        if (docSnap.exists() && docSnap.data().role === 'admin') {
            console.log('✅ Admin found in Firestore:', user.email);
            return true;
        }
    } catch (error) {
        console.warn('⚠️ Firestore admin check failed:', error);
    }
    
    return false;
}

// =============================================
// GET ADMIN STATUS SYNC (for quick checks)
// =============================================
export function isAdminEmail(email) {
    return ADMIN_EMAILS.includes(email);
}