import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

import "../styles/Home.css";

function HomeComponent() {
    const navigate = useNavigate();

    const [meetingCode, setMeetingCode] = useState("");
    const [error, setError] = useState("");

    const { addToUserHistory } = useContext(AuthContext);

    const handleJoinVideoCall = async () => {
        const code = meetingCode.trim();

        if (!code) {
            setError("Please enter a meeting code.");
            return;
        }

        try {
            setError("");

            await addToUserHistory(code);

            navigate(`/${code}`);
        } catch (err) {
            console.error(err);
            setError("Unable to join the meeting. Please try again.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
    };

    return (
        <div className="homePage">

            {/* Background Effects */}
            <div className="homeGlow homeGlowOne"></div>
            <div className="homeGlow homeGlowTwo"></div>


            {/* NAVBAR */}

            <nav className="homeNavbar">

                <div
                    className="homeBrand"
                    onClick={() => navigate("/")}
                >
                    <div className="homeBrandIcon">
                        J
                    </div>

                    <div>
                        <h2>JudoCall</h2>
                        <p>Connect. Collaborate.</p>
                    </div>
                </div>


                <div className="homeNavActions">

                    <button
                        className="historyButton"
                        onClick={() => navigate("/history")}
                    >
                        <span>↻</span>
                        History
                    </button>


                    <button
                        className="homeLogoutButton"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* MAIN */}

            <main className="homeMainContainer">


                {/* LEFT SIDE */}

                <section className="homeLeftSection">

                    <div className="homeBadge">
                        <span></span>
                        Ready to connect
                    </div>


                    <h1>
                        Start your next
                        <span> conversation.</span>
                    </h1>


                    <p className="homeDescription">
                        Join secure and seamless video meetings with
                        JudoCall. Connect with your team, friends, and
                        family from anywhere in the world.
                    </p>


                    {/* JOIN CARD */}

                    <div className="joinMeetingCard">

                        <div className="joinCardHeader">

                            <h2>Join a meeting</h2>

                            <p>
                                Enter a meeting code to start connecting.
                            </p>

                        </div>


                        <div className="meetingInputContainer">

                            <input
                                type="text"
                                placeholder="Enter meeting code"
                                value={meetingCode}
                                onChange={(e) => {
                                    setMeetingCode(e.target.value);
                                    setError("");
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleJoinVideoCall();
                                    }
                                }}
                            />


                            <button
                                onClick={handleJoinVideoCall}
                            >
                                Join →
                            </button>

                        </div>


                        {error && (
                            <div className="meetingError">
                                ⚠ {error}
                            </div>
                        )}


                        <div className="meetingFeatures">

                            <div>
                                <span>✓</span>
                                Secure connection
                            </div>

                            <div>
                                <span>✓</span>
                                Instant meetings
                            </div>

                        </div>

                    </div>


                    <button
                        className="mobileHistoryButton"
                        onClick={() => navigate("/history")}
                    >
                        ↻ View meeting history
                    </button>

                </section>


                {/* RIGHT SIDE */}

                <section className="homeRightSection">

                    <div className="homeVisualGlow"></div>


                    <div className="homeImageWrapper">

                        <img
                            src="/logo3.png"
                            alt="JudoCall video meeting"
                        />

                    </div>


                    {/* FLOATING CARD */}

                    <div className="homeFloatingCard cardTop">

                        <div className="floatingIcon">
                            🎥
                        </div>

                        <div>
                            <strong>Crystal Clear</strong>
                            <span>Video Calling</span>
                        </div>

                    </div>


                    <div className="homeFloatingCard cardBottom">

                        <div className="onlineDot"></div>

                        <div>
                            <strong>You're connected</strong>
                            <span>Secure & real-time</span>
                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default withAuth(HomeComponent);
