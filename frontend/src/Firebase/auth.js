import { auth } from "./firebase";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail, updatePassword, sendEmailVerification } from "firebase/auth";

// Input validation functions
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    return password && password.length >= 6;
};

export const doCreateUserWithEmailAndPassword = async (email, password) => {
    if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
    }
    if (!validatePassword(password)) {
        throw new Error('Password must be at least 6 characters long');
    }
    return createUserWithEmailAndPassword(auth, email, password);
}

export const doSignInWithEmailAndPassword = async (email, password) => {
    if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
    }
    if (!password) {
        throw new Error('Password is required');
    }
    return signInWithEmailAndPassword(auth, email, password);
}

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: 'select_account'
    });
    return signInWithPopup(auth, provider);
}

export const doSignOut = async () => {
    return auth.signOut();
}

export const doPasswordReset = async (email) => {
    if (!validateEmail(email)) {
        throw new Error('Please enter a valid email address');
    }
    return sendPasswordResetEmail(auth, email);
}

export const doPasswordupdate = async (password) => {
    if (!validatePassword(password)) {
        throw new Error('Password must be at least 6 characters long');
    }
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No user is currently signed in');
    }
    return updatePassword(user, password);
}

export const doEmailVerification = async () => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No user is currently signed in');
    }
    return sendEmailVerification(user, {
        url: `${window.location.origin}/home`,
    });
}
