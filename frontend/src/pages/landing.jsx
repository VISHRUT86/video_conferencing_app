import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="landingPageContainer">

            <div className="landingGlow glowOne"></div>
            <div className="landingGlow glowTwo"></div>

            <nav className="landingNav">

                <div className="navHeader">
                    <div className="brandIcon">J</div>
                    <h2>JudoCall</h2>
                </div>

                <div className="navlist">
                    <button
                        className="navTextButton"
                        onClick={() => navigate("/aljk23")}
                    >
                        Join as Guest
                    </button>

                    <button
                        className="navTextButton"
                        onClick={() => navigate("/auth")}
                    >
                        Register
                    </button>

                    <button
                        className="loginButton"
                        onClick={() => navigate("/auth")}
                    >
                        Login
                    </button>
                </div>

            </nav>

            <main className="landingMainContainer">

                <div className="landingContent">

                    <div className="heroBadge">
                        <span className="statusDot"></span>
                        Connect from anywhere
                    </div>

                    <h1>
                        Connect with people
                        <span> who matter most.</span>
                    </h1>

                    <p>
                        Experience seamless video conversations with
                        JudoCall. Meet, collaborate and stay connected
                        from anywhere in the world.
                    </p>

                    <div className="heroButtons">

                        <button
                            className="primaryButton"
                            onClick={() => navigate("/auth")}
                        >
                            Get Started
                            <span>→</span>
                        </button>

                        <button
                            className="secondaryButton"
                            onClick={() => navigate("/aljk23")}
                        >
                            Join a Meeting
                        </button>

                    </div>

                    <div className="heroStats">

                        <div>
                            <strong>Real-time</strong>
                            <span>Video Calling</span>
                        </div>

                        <div className="statsDivider"></div>

                        <div>
                            <strong>Secure</strong>
                            <span>Meetings</span>
                        </div>

                        <div className="statsDivider"></div>

                        <div>
                            <strong>Simple</strong>
                            <span>To Connect</span>
                        </div>

                    </div>

                </div>


                <div className="landingVisual">

                    <div className="visualGlow"></div>

                    <div className="phoneContainer">

                        <div className="phoneTopBar">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                        <img
                            src="/mobile.png"
                            alt="JudoCall video conferencing application"
                        />

                    </div>

                    <div className="floatingCard cardOne">
                        <div className="miniIcon">🎥</div>
                        <div>
                            <strong>Crystal Clear</strong>
                            <span>Video Calling</span>
                        </div>
                    </div>

                    <div className="floatingCard cardTwo">
                        <div className="onlineIndicator"></div>
                        <div>
                            <strong>You're connected</strong>
                            <span>Secure & real-time</span>
                        </div>
                    </div>

                </div>

            </main>

        </div>
    );
}
