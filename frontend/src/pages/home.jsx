import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

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
        <div className="min-h-screen overflow-hidden bg-[#0d0d0f] text-white">

            {/* Background Glow */}

            <div className="pointer-events-none fixed -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px]" />

            <div className="pointer-events-none fixed -bottom-48 -right-40 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[120px]" />


            {/* NAVBAR */}

            <nav className="relative z-10 flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-12">

                {/* BRAND */}

                <div
                    onClick={() => navigate("/")}
                    className="flex cursor-pointer items-center gap-3"
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff9d3d] to-[#f57800] text-lg font-bold shadow-lg shadow-orange-500/20">
                        J
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            JudoCall
                        </h2>

                        <p className="text-xs text-gray-500">
                            Connect. Collaborate.
                        </p>
                    </div>
                </div>


                {/* NAV ACTIONS */}

                <div className="flex items-center gap-3">

                    <button
                        onClick={() => navigate("/history")}
                        className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/[0.08] hover:text-white sm:flex"
                    >
                        <span className="text-lg">↻</span>

                        Meeting History
                    </button>


                    <button
                        onClick={handleLogout}
                        className="rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-gray-200"
                    >
                        Logout
                    </button>

                </div>

            </nav>


            {/* MAIN */}

            <main className="relative z-10 mx-auto grid min-h-[calc(100vh-85px)] max-w-7xl items-center gap-16 px-6 py-12 md:px-12 lg:grid-cols-2">


                {/* LEFT SECTION */}

                <section>

                    {/* BADGE */}

                    <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-300">

                        <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_12px_#4ade80]" />

                        Ready to connect

                    </div>


                    {/* HEADING */}

                    <h1 className="max-w-2xl text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">

                        Start your next

                        <span className="block bg-gradient-to-r from-[#ff9839] to-[#ff7a00] bg-clip-text text-transparent">
                            conversation.
                        </span>

                    </h1>


                    {/* DESCRIPTION */}

                    <p className="mt-7 max-w-xl text-lg leading-8 text-gray-400">

                        Join secure and seamless video meetings with
                        JudoCall. Connect with your team, friends, and
                        family from anywhere in the world.

                    </p>


                    {/* JOIN CARD */}

                    <div className="mt-10 max-w-xl rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl backdrop-blur-xl md:p-7">

                        <div className="mb-6">

                            <h2 className="text-xl font-semibold">
                                Join a meeting
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Enter a meeting code to start connecting.
                            </p>

                        </div>


                        {/* INPUT */}

                        <div className="flex flex-col gap-3 sm:flex-row">

                            <input
                                type="text"
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
                                placeholder="Enter meeting code"
                                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 px-5 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-orange-400/60 focus:ring-4 focus:ring-orange-500/10"
                            />


                            <button
                                onClick={handleJoinVideoCall}
                                className="rounded-xl bg-gradient-to-r from-[#ff9839] to-[#ff7600] px-7 py-4 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:shadow-orange-500/30"
                            >
                                Join →
                            </button>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                ⚠ {error}
                            </div>

                        )}


                        {/* QUICK INFO */}

                        <div className="mt-6 flex flex-wrap gap-5 text-sm text-gray-500">

                            <span className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                Secure connection
                            </span>

                            <span className="flex items-center gap-2">
                                <span className="text-orange-400">✓</span>
                                Instant meetings
                            </span>

                        </div>

                    </div>


                    {/* HISTORY MOBILE */}

                    <button
                        onClick={() => navigate("/history")}
                        className="mt-6 flex items-center gap-2 text-sm text-gray-400 transition hover:text-white sm:hidden"
                    >
                        ↻ View meeting history
                    </button>

                </section>


                {/* RIGHT SECTION */}

                <section className="relative flex items-center justify-center">

                    {/* VISUAL GLOW */}

                    <div className="absolute h-[380px] w-[380px] rounded-full bg-orange-500/10 blur-[100px]" />


                    {/* IMAGE CARD */}

                    <div className="relative w-full max-w-lg">

                        <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-br from-orange-400/20 to-transparent blur-xl" />

                        <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-4 shadow-2xl backdrop-blur-xl">

                            <img
                                src="/logo3.png"
                                alt="JudoCall video meeting"
                                className="w-full rounded-2xl object-cover"
                            />

                        </div>


                        {/* FLOATING CARD 1 */}

                        <div className="absolute -left-4 top-10 rounded-2xl border border-white/10 bg-[#191919]/90 px-4 py-3 shadow-xl backdrop-blur-xl md:-left-12">

                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
                                    🎥
                                </div>

                                <div>

                                    <p className="text-sm font-semibold">
                                        Crystal Clear
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Video Calling
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* FLOATING CARD 2 */}

                        <div className="absolute -bottom-6 -right-2 rounded-2xl border border-white/10 bg-[#191919]/90 px-5 py-4 shadow-xl backdrop-blur-xl md:-right-10">

                            <div className="flex items-center gap-3">

                                <span className="h-3 w-3 rounded-full bg-green-400 shadow-[0_0_12px_#4ade80]" />

                                <div>

                                    <p className="text-sm font-semibold">
                                        You're connected
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Secure & real-time
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default withAuth(HomeComponent);
