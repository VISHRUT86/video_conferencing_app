import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import "../styles/History.css";

export default function History() {
    const { getHistoryOfUser } = useContext(AuthContext);

    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const routeTo = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);

                const history = await getHistoryOfUser();

                setMeetings(history || []);
            } catch (err) {
                console.error(err);
                setError("Unable to load your meeting history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [getHistoryOfUser]);

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

            {/* Background Effects */}

            <div className="historyGlow historyGlowOne"></div>
            <div className="historyGlow historyGlowTwo"></div>


            {/* NAVBAR */}

            <nav className="historyNavbar">

                <div
                    className="historyBrand"
                    onClick={() => routeTo("/home")}
                >
                    <div className="historyBrandIcon">
                        J
                    </div>

                    <div>
                        <h2>JudoCall</h2>
                        <p>Connect. Collaborate.</p>
                    </div>
                </div>


                <button
                    className="backDashboardButton"
                    onClick={() => routeTo("/home")}
                >
                    ← Back to dashboard
                </button>

            </nav>


            {/* MAIN */}

            <main className="historyContainer">

                <div className="historyHeader">

                    <div className="historyBadge">
                        <span></span>
                        Meeting activity
                    </div>

                    <h1>
                        Your meeting
                        <span> history.</span>
                    </h1>

                    <p>
                        Keep track of all the meetings you've joined
                        with JudoCall.
                    </p>

                </div>


                {/* CONTENT */}

                {loading && (

                    <div className="historyState">
                        <div className="historyLoader"></div>
                        <p>Loading your meetings...</p>
                    </div>

                )}


                {!loading && error && (

                    <div className="historyError">
                        ⚠ {error}
                    </div>

                )}


                {!loading &&
                    !error &&
                    meetings.length === 0 && (

                        <div className="emptyHistory">

                            <div className="emptyHistoryIcon">
                                🕘
                            </div>

                            <h2>No meetings yet</h2>

                            <p>
                                Your meeting history will appear here
                                after you join a meeting.
                            </p>

                            <button
                                onClick={() =>
                                    routeTo("/home")
                                }
                            >
                                Join your first meeting →
                            </button>

                        </div>

                    )}


                {!loading &&
                    !error &&
                    meetings.length > 0 && (

                        <div className="meetingHistoryGrid">

                            {meetings.map((meeting, index) => (

                                <div
                                    className="meetingHistoryCard"
                                    key={index}
                                >

                                    <div className="meetingCardTop">

                                        <div className="meetingNumber">
                                            {String(
                                                index + 1
                                            ).padStart(2, "0")}
                                        </div>

                                        <div className="meetingStatus">
                                            <span></span>
                                            Joined
                                        </div>

                                    </div>


                                    <div className="meetingCardContent">

                                        <p>Meeting Code</p>

                                        <h3>
                                            {meeting.meetingCode}
                                        </h3>

                                    </div>


                                    <div className="meetingCardDate">

                                        <span>📅</span>

                                        <div>
                                            <p>Date</p>

                                            <strong>
                                                {formatDate(
                                                    meeting.date
                                                )}
                                            </strong>
                                        </div>

                                    </div>


                                    <button
                                        className="rejoinButton"
                                        onClick={() =>
                                            routeTo(
                                                `/${meeting.meetingCode}`
                                            )
                                        }
                                    >
                                        Rejoin meeting →
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

            </main>

        </div>
    );
}