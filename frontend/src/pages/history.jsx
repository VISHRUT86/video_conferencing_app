import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import "../styles/History.css";

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);

    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);

                const history = await getHistoryOfUser();

                setMeetings(history || []);
            } catch (err) {
                console.error(err);
                setError("Unable to load meeting history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const day = date
            .getDate()
            .toString()
            .padStart(2, "0");

        const month = (date.getMonth() + 1)
            .toString()
            .padStart(2, "0");

        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    return (
        <div className="historyPage">

            {/* Background Glow */}

            <div className="historyGlow historyGlowOne"></div>
            <div className="historyGlow historyGlowTwo"></div>


            {/* NAVBAR */}

            <nav className="historyNavbar">

                <div
                    className="historyBrand"
                    onClick={() => navigate("/home")}
                >

                    <div className="historyBrandIcon">
                        J
                    </div>

                    <div>
                        <h2>JudoCall</h2>

                        <p>
                            Connect. Collaborate.
                        </p>
                    </div>

                </div>


                <button
                    className="historyHomeButton"
                    onClick={() => navigate("/home")}
                >
                    ← Back to home
                </button>

            </nav>


            {/* MAIN */}

            <main className="historyMain">

                <div className="historyHeader">

                    <div>

                        <div className="historyBadge">

                            <span></span>

                            Meeting activity

                        </div>


                        <h1>
                            Meeting
                            <span> History.</span>
                        </h1>


                        <p>
                            View and keep track of all your previous
                            JudoCall meetings.
                        </p>

                    </div>


                    <div className="historyCount">

                        <strong>
                            {meetings.length}
                        </strong>

                        <span>
                            Total meetings
                        </span>

                    </div>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="historyError">

                        ⚠ {error}

                    </div>

                )}


                {/* LOADING */}

                {loading && (

                    <div className="historyLoading">

                        <div className="historyLoader"></div>

                        <p>
                            Loading your meetings...
                        </p>

                    </div>

                )}


                {/* EMPTY STATE */}

                {!loading &&
                    !error &&
                    meetings.length === 0 && (

                        <div className="emptyHistory">

                            <div className="emptyHistoryIcon">
                                🕘
                            </div>

                            <h2>
                                No meetings yet
                            </h2>

                            <p>
                                Your meeting history will appear here
                                once you join a meeting.
                            </p>


                            <button
                                onClick={() => navigate("/home")}
                            >
                                Start a meeting →
                            </button>

                        </div>

                    )}


                {/* MEETING GRID */}

                {!loading &&
                    meetings.length > 0 && (

                        <div className="meetingHistoryGrid">

                            {meetings.map((meeting, index) => (

                                <div
                                    className="historyMeetingCard"
                                    key={index}
                                >

                                    <div className="meetingCardTop">

                                        <div className="meetingIcon">
                                            🎥
                                        </div>


                                        <div className="meetingNumber">

                                            Meeting{" "}

                                            {String(index + 1)
                                                .padStart(2, "0")}

                                        </div>

                                    </div>


                                    <div className="meetingCodeSection">

                                        <span>
                                            Meeting Code
                                        </span>

                                        <h2>
                                            {meeting.meetingCode}
                                        </h2>

                                    </div>


                                    <div className="meetingDateSection">

                                        <div>

                                            <span className="dateLabel">
                                                📅 Date
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    meeting.date
                                                )}
                                            </strong>

                                        </div>


                                        <button
                                            className="rejoinButton"
                                            onClick={() =>
                                                navigate(
                                                    `/${meeting.meetingCode}`
                                                )
                                            }
                                        >
                                            Join Again →
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

            </main>

        </div>
    );
}