import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import {
    Badge,
    IconButton,
    TextField,
    Button,
} from "@mui/material";

import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

import styles from "../styles/videoComponent.module.css";
import server from "../environment";

const server_url = server;

const connections = {};

const peerConfigConnections = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302",
        },
    ],
};

export default function VideoMeetComponent() {

    const socketRef = useRef();
    const socketIdRef = useRef();
    const localVideoref = useRef();
    const videoRef = useRef([]);

    const [videoAvailable, setVideoAvailable] = useState(true);
    const [audioAvailable, setAudioAvailable] = useState(true);

    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);

    const [screen, setScreen] = useState(false);
    const [screenAvailable, setScreenAvailable] = useState(false);

    const [showModal, setModal] = useState(false);

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const [newMessages, setNewMessages] = useState(0);

    const [askForUsername, setAskForUsername] = useState(true);
    const [username, setUsername] = useState("");

    const [videos, setVideos] = useState([]);


    /* =====================================
       GET PERMISSIONS
    ===================================== */

    useEffect(() => {

        getPermissions();

        return () => {

            try {

                if (window.localStream) {
                    window.localStream
                        .getTracks()
                        .forEach((track) => track.stop());
                }

            } catch (error) {
                console.log(error);
            }

        };

    }, []);


    const getPermissions = async () => {

        try {

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });


            setVideoAvailable(true);
            setAudioAvailable(true);


            window.localStream = stream;


            if (localVideoref.current) {

                localVideoref.current.srcObject = stream;

            }


        } catch (error) {

            console.log("Media permission error:", error);

            setVideoAvailable(false);
            setAudioAvailable(false);

        }


        if (navigator.mediaDevices.getDisplayMedia) {

            setScreenAvailable(true);

        } else {

            setScreenAvailable(false);

        }

    };


    /* =====================================
       USER MEDIA
    ===================================== */

    const getUserMediaSuccess = (stream) => {

        try {

            if (window.localStream) {

                window.localStream
                    .getTracks()
                    .forEach((track) => track.stop());

            }

        } catch (error) {

            console.log(error);

        }


        window.localStream = stream;


        if (localVideoref.current) {

            localVideoref.current.srcObject = stream;

        }


        for (let id in connections) {

            if (id === socketIdRef.current) continue;


            connections[id].addStream(
                window.localStream
            );


            connections[id]
                .createOffer()
                .then((description) => {

                    connections[id]
                        .setLocalDescription(description)
                        .then(() => {

                            socketRef.current.emit(

                                "signal",

                                id,

                                JSON.stringify({

                                    sdp:
                                        connections[id]
                                            .localDescription,

                                })

                            );

                        })

                        .catch((error) =>
                            console.log(error)
                        );

                });

        }


        stream.getTracks().forEach((track) => {

            track.onended = () => {

                if (track.kind === "video") {

                    setVideo(false);

                }


                if (track.kind === "audio") {

                    setAudio(false);

                }

            };

        });

    };


    const getUserMedia = () => {

        if (
            (video && videoAvailable) ||
            (audio && audioAvailable)
        ) {

            navigator.mediaDevices
                .getUserMedia({

                    video:
                        video && videoAvailable,

                    audio:
                        audio && audioAvailable,

                })

                .then(getUserMediaSuccess)

                .catch((error) => {

                    console.log(error);

                });

        }

    };


    useEffect(() => {

        if (
            video !== undefined &&
            audio !== undefined &&
            !screen
        ) {

            getUserMedia();

        }

    }, [video, audio]);


    /* =====================================
       SCREEN SHARE
    ===================================== */

    const getDisplayMedia = async () => {

        try {

            const stream =
                await navigator.mediaDevices.getDisplayMedia({

                    video: true,

                    audio: true,

                });


            try {

                if (window.localStream) {

                    window.localStream
                        .getTracks()
                        .forEach((track) => track.stop());

                }

            } catch (error) {

                console.log(error);

            }


            window.localStream = stream;


            if (localVideoref.current) {

                localVideoref.current.srcObject = stream;

            }


            for (let id in connections) {

                if (id === socketIdRef.current)
                    continue;


                connections[id]
                    .addStream(window.localStream);


                connections[id]
                    .createOffer()
                    .then((description) => {

                        connections[id]
                            .setLocalDescription(description)
                            .then(() => {

                                socketRef.current.emit(

                                    "signal",

                                    id,

                                    JSON.stringify({

                                        sdp:
                                            connections[id]
                                                .localDescription,

                                    })

                                );

                            });

                    });

            }


            stream
                .getVideoTracks()[0]
                .onended = () => {

                    setScreen(false);

                    getUserMedia();

                };


        } catch (error) {

            console.log(error);

            setScreen(false);

        }

    };


    useEffect(() => {

        if (screen) {

            getDisplayMedia();

        }

    }, [screen]);


    /* =====================================
       SOCKET SIGNAL
    ===================================== */

    const gotMessageFromServer =
        (fromId, message) => {

            const signal =
                JSON.parse(message);


            if (
                fromId !== socketIdRef.current
            ) {

                if (signal.sdp) {

                    connections[fromId]
                        ?.setRemoteDescription(

                            new RTCSessionDescription(
                                signal.sdp
                            )

                        )

                        .then(() => {

                            if (
                                signal.sdp.type === "offer"
                            ) {

                                connections[fromId]
                                    .createAnswer()

                                    .then((description) => {

                                        connections[fromId]
                                            .setLocalDescription(
                                                description
                                            )

                                            .then(() => {

                                                socketRef.current.emit(

                                                    "signal",

                                                    fromId,

                                                    JSON.stringify({

                                                        sdp:
                                                            connections[
                                                                fromId
                                                            ]
                                                                .localDescription,

                                                    })

                                                );

                                            });

                                    });

                            }

                        })

                        .catch((error) =>
                            console.log(error)
                        );

                }


                if (signal.ice) {

                    connections[fromId]
                        ?.addIceCandidate(

                            new RTCIceCandidate(
                                signal.ice
                            )

                        )

                        .catch((error) =>
                            console.log(error)
                        );

                }

            }

        };


    /* =====================================
       CONNECT SOCKET
    ===================================== */

    const connectToSocketServer = () => {

        socketRef.current =
            io.connect(server_url, {

                secure: false,

            });


        socketRef.current.on(
            "signal",
            gotMessageFromServer
        );


        socketRef.current.on(
            "connect",
            () => {

                socketRef.current.emit(

                    "join-call",

                    window.location.href

                );


                socketIdRef.current =
                    socketRef.current.id;


                socketRef.current.on(
                    "chat-message",
                    addMessage
                );


                socketRef.current.on(
                    "user-left",
                    (id) => {

                        setVideos((videos) =>
                            videos.filter(
                                (video) =>
                                    video.socketId !== id
                            )
                        );

                    }
                );


                socketRef.current.on(

                    "user-joined",

                    (id, clients) => {

                        clients.forEach(
                            (socketListId) => {

                                if (
                                    connections[
                                        socketListId
                                    ]
                                ) {
                                    return;
                                }


                                connections[
                                    socketListId
                                ] =
                                    new RTCPeerConnection(
                                        peerConfigConnections
                                    );


                                connections[
                                    socketListId
                                ].onicecandidate =
                                    (event) => {

                                        if (
                                            event.candidate
                                        ) {

                                            socketRef.current.emit(

                                                "signal",

                                                socketListId,

                                                JSON.stringify({

                                                    ice:
                                                        event.candidate,

                                                })

                                            );

                                        }

                                    };


                                connections[
                                    socketListId
                                ].onaddstream =
                                    (event) => {

                                        const exists =
                                            videoRef.current.find(

                                                (video) =>
                                                    video.socketId ===
                                                    socketListId

                                            );


                                        if (exists) {

                                            setVideos(
                                                (videos) => {

                                                    const updated =
                                                        videos.map(
                                                            (video) =>
                                                                video.socketId ===
                                                                socketListId
                                                                    ? {
                                                                        ...video,
                                                                        stream:
                                                                            event.stream,
                                                                    }
                                                                    : video
                                                        );

                                                    videoRef.current =
                                                        updated;

                                                    return updated;

                                                }
                                            );

                                        } else {

                                            const newVideo = {

                                                socketId:
                                                    socketListId,

                                                stream:
                                                    event.stream,

                                            };


                                            setVideos(
                                                (videos) => {

                                                    const updated = [
                                                        ...videos,
                                                        newVideo,
                                                    ];

                                                    videoRef.current =
                                                        updated;

                                                    return updated;

                                                }
                                            );

                                        }

                                    };


                                if (
                                    window.localStream
                                ) {

                                    connections[
                                        socketListId
                                    ].addStream(
                                        window.localStream
                                    );

                                }

                            }
                        );


                        if (
                            id === socketIdRef.current
                        ) {

                            for (
                                let id2 in connections
                            ) {

                                if (
                                    id2 ===
                                    socketIdRef.current
                                )
                                    continue;


                                connections[id2]
                                    .createOffer()

                                    .then(
                                        (description) => {

                                            connections[id2]
                                                .setLocalDescription(
                                                    description
                                                )

                                                .then(() => {

                                                    socketRef.current.emit(

                                                        "signal",

                                                        id2,

                                                        JSON.stringify({

                                                            sdp:
                                                                connections[
                                                                    id2
                                                                ]
                                                                    .localDescription,

                                                        })

                                                    );

                                                });

                                        }
                                    );

                            }

                        }

                    }

                );

            }

        );

    };


    /* =====================================
       JOIN MEETING
    ===================================== */

    const connect = () => {

        if (!username.trim()) {

            return;

        }


        setAskForUsername(false);


        setVideo(videoAvailable);
        setAudio(audioAvailable);


        connectToSocketServer();

    };


    /* =====================================
       CONTROLS
    ===================================== */

    const handleVideo = () => {

        setVideo((prev) => !prev);

    };


    const handleAudio = () => {

        setAudio((prev) => !prev);

    };


    const handleScreen = () => {

        setScreen((prev) => !prev);

    };


    const handleEndCall = () => {

        try {

            if (window.localStream) {

                window.localStream
                    .getTracks()
                    .forEach((track) => track.stop());

            }

        } catch (error) {

            console.log(error);

        }


        try {

            if (socketRef.current) {

                socketRef.current.disconnect();

            }

        } catch (error) {

            console.log(error);

        }


        window.location.href = "/home";

    };


    /* =====================================
       CHAT
    ===================================== */

    const addMessage =
        (data, sender, socketIdSender) => {

            setMessages(
                (prevMessages) => [

                    ...prevMessages,

                    {
                        sender,
                        data,
                    },

                ]
            );


            if (
                socketIdSender !==
                socketIdRef.current
            ) {

                if (!showModal) {

                    setNewMessages(
                        (prev) => prev + 1
                    );

                }

            }

        };


    const openChat = () => {

        setModal(true);

        setNewMessages(0);

    };


    const closeChat = () => {

        setModal(false);

    };


    const sendMessage = () => {

        if (!message.trim()) return;


        socketRef.current.emit(

            "chat-message",

            message,

            username

        );


        setMessage("");

    };


    const handleMessageKeyDown = (event) => {

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    };


    /* =====================================
       LOBBY
    ===================================== */

    if (askForUsername) {

        return (

            <div className={styles.lobbyPage}>

                <div className={styles.lobbyGlow}></div>


                <div className={styles.lobbyCard}>

                    <div className={styles.lobbyIcon}>

                        <MeetingRoomIcon />

                    </div>


                    <div className={styles.lobbyBadge}>

                        <span></span>

                        Ready to join

                    </div>


                    <h1>

                        Join the

                        <span> meeting.</span>

                    </h1>


                    <p>

                        Enter your name to join the
                        conversation and connect with
                        everyone in the room.

                    </p>


                    <TextField

                        fullWidth

                        value={username}

                        placeholder="Enter your name"

                        onChange={(event) =>
                            setUsername(
                                event.target.value
                            )
                        }

                        onKeyDown={(event) => {

                            if (
                                event.key === "Enter"
                            ) {

                                connect();

                            }

                        }}

                        InputProps={{

                            startAdornment: (

                                <PersonIcon
                                    className={
                                        styles.inputIcon
                                    }
                                />

                            ),

                        }}

                    />


                    <Button

                        className={styles.joinLobbyButton}

                        onClick={connect}

                        disabled={!username.trim()}

                    >

                        Join Meeting →

                    </Button>


                    <div className={styles.lobbyPreview}>

                        <video

                            ref={localVideoref}

                            autoPlay

                            muted

                            playsInline

                        />

                    </div>


                </div>

            </div>

        );

    }


    /* =====================================
       MEETING ROOM
    ===================================== */

    return (

        <div
            className={
                styles.meetVideoContainer
            }
        >


            <div className={styles.meetingHeader}>


                <div
                    className={
                        styles.meetingBrand
                    }
                >

                    <div
                        className={
                            styles.brandIcon
                        }
                    >
                        J
                    </div>


                    <div>

                        <h2>JudoCall</h2>

                        <span>
                            Secure video meeting
                        </span>

                    </div>

                </div>


                <div
                    className={
                        styles.meetingStatus
                    }
                >

                    <span></span>

                    Live meeting

                </div>


                <div
                    className={
                        styles.participantInfo
                    }
                >

                    <PersonIcon />

                    {videos.length + 1}

                </div>


            </div>


            {/* MAIN VIDEO AREA */}

            <div
                className={
                    styles.videoArea
                }
            >


                <div
                    className={
                        styles.conferenceView
                    }
                >

                    {videos.map(
                        (remoteVideo) => (

                            <div

                                className={
                                    styles.remoteVideoCard
                                }

                                key={
                                    remoteVideo.socketId
                                }

                            >

                                <video

                                    data-socket={
                                        remoteVideo.socketId
                                    }

                                    ref={(ref) => {

                                        if (
                                            ref &&
                                            remoteVideo.stream
                                        ) {

                                            ref.srcObject =
                                                remoteVideo.stream;

                                        }

                                    }}

                                    autoPlay

                                    playsInline

                                />

                            </div>

                        )
                    )}

                </div>


                <div
                    className={
                        styles.localVideoWrapper
                    }
                >

                    <video

                        className={
                            styles.meetUserVideo
                        }

                        ref={localVideoref}

                        autoPlay

                        muted

                        playsInline

                    />


                    <div
                        className={
                            styles.localVideoName
                        }
                    >

                        You

                    </div>

                </div>


            </div>


            {/* CONTROL BAR */}

            <div
                className={
                    styles.buttonContainers
                }
            >


                <IconButton

                    className={
                        video
                            ? styles.controlButton
                            : styles.controlButtonOff
                    }

                    onClick={handleVideo}

                >

                    {video ? (
                        <VideocamIcon />
                    ) : (
                        <VideocamOffIcon />
                    )}

                </IconButton>


                <IconButton

                    className={
                        audio
                            ? styles.controlButton
                            : styles.controlButtonOff
                    }

                    onClick={handleAudio}

                >

                    {audio ? (
                        <MicIcon />
                    ) : (
                        <MicOffIcon />
                    )}

                </IconButton>


                {screenAvailable && (

                    <IconButton

                        className={
                            screen
                                ? styles.controlButtonActive
                                : styles.controlButton
                        }

                        onClick={handleScreen}

                    >

                        {screen ? (
                            <StopScreenShareIcon />
                        ) : (
                            <ScreenShareIcon />
                        )}

                    </IconButton>

                )}


                <Badge

                    badgeContent={newMessages}

                    max={99}

                    color="error"

                >

                    <IconButton

                        className={
                            styles.controlButton
                        }

                        onClick={openChat}

                    >

                        <ChatIcon />

                    </IconButton>

                </Badge>


                <IconButton

                    className={
                        styles.endCallButton
                    }

                    onClick={handleEndCall}

                >

                    <CallEndIcon />

                </IconButton>


            </div>


            {/* CHAT */}

            {showModal && (

                <div
                    className={
                        styles.chatRoom
                    }
                >

                    <div
                        className={
                            styles.chatHeader
                        }
                    >

                        <div>

                            <h3>Meeting Chat</h3>

                            <span>
                                Messages from participants
                            </span>

                        </div>


                        <IconButton
                            onClick={closeChat}
                        >

                            <CloseIcon />

                        </IconButton>

                    </div>


                    <div
                        className={
                            styles.chattingDisplay
                        }
                    >

                        {messages.length > 0 ? (

                            messages.map(
                                (item, index) => (

                                    <div

                                        className={
                                            styles.messageItem
                                        }

                                        key={index}

                                    >

                                        <strong>
                                            {item.sender}
                                        </strong>

                                        <p>
                                            {item.data}
                                        </p>

                                    </div>

                                )
                            )

                        ) : (

                            <div
                                className={
                                    styles.emptyChat
                                }
                            >

                                <ChatIcon />

                                <p>
                                    No messages yet
                                </p>

                            </div>

                        )}

                    </div>


                    <div
                        className={
                            styles.chattingArea
                        }
                    >

                        <TextField

                            fullWidth

                            value={message}

                            placeholder="Write a message..."

                            onChange={(event) =>
                                setMessage(
                                    event.target.value
                                )
                            }

                            onKeyDown={
                                handleMessageKeyDown
                            }

                        />


                        <IconButton
                            onClick={sendMessage}
                            className={
                                styles.sendButton
                            }
                        >

                            <SendIcon />

                        </IconButton>

                    </div>

                </div>

            )}


        </div>

    );

}