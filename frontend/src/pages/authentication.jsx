import * as React from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../styles/Authentication.css";

export default function Authentication() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [formState, setFormState] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const { handleRegister, handleLogin } =
        React.useContext(AuthContext);

    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();

        setError("");

        if (!username || !password) {
            setError("Please fill in all required fields.");
            return;
        }

        if (formState === 1 && !name) {
            setError("Please enter your full name.");
            return;
        }

        try {
            setLoading(true);

            if (formState === 0) {
                await handleLogin(username, password);
            }

            if (formState === 1) {
                const result = await handleRegister(
                    name,
                    username,
                    password
                );

                setMessage(
                    result || "Account created successfully. Please sign in."
                );

                setOpen(true);

                setName("");
                setUsername("");
                setPassword("");

                setFormState(0);
            }
        } catch (err) {
            console.log(err);

            setError(
                err?.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="authPage">

            {/* Background Effects */}

            <div className="authGlow authGlowOne"></div>
            <div className="authGlow authGlowTwo"></div>


            {/* LEFT SIDE */}

            <div className="authLeft">

                <div
                    className="authBrand"
                    onClick={() => navigate("/")}
                >
                    <div className="authBrandIcon">
                        J
                    </div>

                    <h2>JudoCall</h2>
                </div>


                <div className="authHeroContent">

                    <div className="authBadge">
                        <span></span>
                        Secure video conversations
                    </div>

                    <h1>
                        Connect.
                        <br />

                        <span>Collaborate.</span>
                        <br />

                        Anywhere.
                    </h1>

                    <p>
                        Experience seamless video meetings with
                        crystal-clear communication and real-time
                        collaboration.
                    </p>


                    <div className="authFeatureList">

                        <div className="authFeature">
                            <div className="featureCheck">
                                ✓
                            </div>

                            <span>
                                Crystal clear video calling
                            </span>
                        </div>


                        <div className="authFeature">
                            <div className="featureCheck">
                                ✓
                            </div>

                            <span>
                                Secure private meetings
                            </span>
                        </div>


                        <div className="authFeature">
                            <div className="featureCheck">
                                ✓
                            </div>

                            <span>
                                Connect from anywhere
                            </span>
                        </div>

                    </div>

                </div>


                <div className="authFooterText">
                    © {new Date().getFullYear()} JudoCall
                </div>

            </div>


            {/* RIGHT SIDE */}

            <div className="authRight">

                <div className="authCard">

                    <div className="authCardHeader">

                        <div className="authIcon">
                            🔐
                        </div>

                        <h2>
                            {formState === 0
                                ? "Welcome back"
                                : "Create account"}
                        </h2>

                        <p>
                            {formState === 0
                                ? "Enter your details to continue your meetings."
                                : "Join JudoCall and start connecting today."}
                        </p>

                    </div>


                    {/* TOGGLE */}

                    <div className="authTabs">

                        <button
                            className={
                                formState === 0
                                    ? "activeAuthTab"
                                    : ""
                            }
                            onClick={() => {
                                setFormState(0);
                                setError("");
                            }}
                        >
                            Sign In
                        </button>


                        <button
                            className={
                                formState === 1
                                    ? "activeAuthTab"
                                    : ""
                            }
                            onClick={() => {
                                setFormState(1);
                                setError("");
                            }}
                        >
                            Sign Up
                        </button>

                    </div>


                    <form
                        className="authForm"
                        onSubmit={handleAuth}
                    >

                        {formState === 1 && (

                            <div className="authInputGroup">

                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                />

                            </div>

                        )}


                        <div className="authInputGroup">

                            <label>
                                Username
                            </label>

                            <input
                                type="text"
                                placeholder="Choose your username"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                            />

                        </div>


                        <div className="authInputGroup">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />

                        </div>


                        {error && (

                            <div className="authError">
                                ⚠ {error}
                            </div>

                        )}


                        <button
                            type="submit"
                            className="authSubmitButton"
                            disabled={loading}
                        >

                            {loading
                                ? "Please wait..."
                                : formState === 0
                                    ? "Sign In →"
                                    : "Create Account →"}

                        </button>

                    </form>


                    <div className="authSwitchText">

                        {formState === 0
                            ? "Don't have an account?"
                            : "Already have an account?"}

                        <button
                            onClick={() =>
                                setFormState(
                                    formState === 0 ? 1 : 0
                                )
                            }
                        >
                            {formState === 0
                                ? "Create one"
                                : "Sign in"}
                        </button>

                    </div>


                    <button
                        className="backHomeButton"
                        onClick={() => navigate("/")}
                    >
                        ← Back to home
                    </button>

                </div>

            </div>


            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={() => setOpen(false)}
            >

                <Alert
                    severity="success"
                    variant="filled"
                >
                    {message}
                </Alert>

            </Snackbar>

        </div>
    );
}
