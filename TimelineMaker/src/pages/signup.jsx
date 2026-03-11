import React, { useState } from 'react'
import { Navigate, Link } from "react-router-dom"
import { doCreateUserWithEmailAndPassword, signInWithGoogle } from '../firebase/auth'
import { useAuth } from "../contexts/AuthContext/index";

const Signup = () => { 
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSigningUp, setIsSigningUp ] = useState(false);
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if(isSigningUp) {
            return;
        }

        if(password != confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            setIsSigningUp(true);
            await doCreateUserWithEmailAndPassword(email, password);
        } catch (err) {
            if(err.code == "auth/email-already-exists" || err.code == "auth/email-already-in-use") {
                setErrorMessage("Account already exists. Log in instead.")
            }
            else if(err.code == "auth/weak-password") {
                setErrorMessage("Password must be at least 6 characters")
            }
            else {
                setErrorMessage(err.message);
            }
            setIsSigningUp(false);
        }
    };

    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        if(!isSigningIn) {
            setIsSigningIn(true);
            try {
                await signInWithGoogle();
            } catch(err) {
                if(err.code == "auth/popup-closed-by-user") {
                    setErrorMessage("Sign-in popup closed. Please try again.");
                }
                else if(err.code == "auth/popup-blocked") {
                    setErrorMessage("Allow popups for Google sign-in");
                }
                else {
                    setErrorMessage(err.message);
                }
                setIsSigningIn(false);
            }
        }
    }

    if(userLoggedIn) {
        return <Navigate to="/timelines" replace />;
    }

    return (
        <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background orbs */}
            <div className="absolute top-[20%] right-[15%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[20%] left-[15%] w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <p className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent text-4xl font-bold">
                            Chrono
                        </p>
                        <p className="text-slate-400 mt-2 text-sm">Create your account</p>
                    </div>

                    <form className="space-y-4" onSubmit={onSubmit}>
                        <div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/25 transition-all duration-300"
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/25 transition-all duration-300"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/25 transition-all duration-300"
                                required
                            />
                        </div>

                        {errorMessage && (
                            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{errorMessage}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isSigningUp}
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isSigningUp ? "Creating account..." : "Sign Up"}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-[#0a0f1e] px-4 text-slate-500">or</span>
                        </div>
                    </div>

                    <button
                        onClick={onGoogleSignIn}
                        disabled={isSigningIn || isSigningUp}
                        className="w-full backdrop-blur-xl bg-white/5 border border-white/10 text-slate-200 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] disabled:opacity-50"
                    >
                        Sign up with Google
                    </button>

                    <p className="text-center text-slate-500 text-sm mt-6">
                        Already have an account?{" "}
                        <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup