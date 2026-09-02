import React, {
    useEffect,
    useRef,
    useState,
} from "react";

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

    const showModalRef = useRef(false);

    const [videoAvailable, setVideoAvailable] =
        useState(true);

    const [audioAvailable, setAudioAvailable] =
        useState(true);

    const [video, setVideo] =
        useState(true);

    const [audio, setAudio] =
        useState(true);

    const [screen, setScreen] =
        useState(false);

    const [screenAvailable, setScreenAvailable] =
        useState(false);

    const [showModal, setModal] =
        useState(false);

    const [messages, setMessages] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const [newMessages, setNewMessages] =
        useState(0);

    const [askForUsername, setAskForUsername] =
        useState(true);

    const [username, setUsername] =
        useState("");

    const [videos, setVideos] =
        useState([]);

    useEffect(() => {
        showModalRef.current = showModal;
    }, [showModal]);

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
                        .forEach((track) =>
                            track.stop()
                        );
                }

                if (socketRef.current) {
                    socketRef.current.disconnect();
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
                localVideoref.current.srcObject =
                    stream;
            }

        } catch (error) {
            console.log(
                "Media permission error:",
                error
            );

            setVideoAvailable(false);
            setAudioAvailable(false);
        }

        if (
            navigator.mediaDevices &&
            navigator.mediaDevices.getDisplayMedia
        ) {
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
                    .forEach((track) =>
                        track.stop()
                    );
            }
        } catch (error) {
            console.log(error);
        }

        window.localStream = stream;

        if (localVideoref.current) {
            localVideoref.current.srcObject =
                stream;
        }

        for (let id in connections) {
            if (
                id === socketIdRef.current
            ) {
                continue;
            }

            try {
                connections[id].addStream(
                    window.localStream
                );

                connections[id]
                    .createOffer()
                    .then((description) => {
                        connections[id]
                            .setLocalDescription(
                                description
                            )
                            .then(() => {
                                socketRef.current?.emit(
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

            } catch (error) {
                console.log(error);
            }
        }

        stream.getTracks().forEach(
            (track) => {
                track.onended = () => {
                    if (
                        track.kind === "video"
                    ) {
                        setVideo(false);
                    }

                    if (
                        track.kind === "audio"
                    ) {
                        setAudio(false);
                    }
                };
            }
        );
    };

    const getUserMedia = () => {
        if (
            (video && videoAvailable) ||
            (audio && audioAvailable)
        ) {
            navigator.mediaDevices
                .getUserMedia({
                    video:
                        video &&
                        videoAvailable,

                    audio:
                        audio &&
                        audioAvailable,
                })
                .then(getUserMediaSuccess)
                .catch((error) =>
                    console.log(error)
                );
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
    }, [
        video,
        audio,
        screen,
        videoAvailable,
        audioAvailable,
    ]);

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
                        .forEach((track) =>
                            track.stop()
                        );
                }
            } catch (error) {
                console.log(error);
            }

            window.localStream = stream;

            if (localVideoref.current) {
                localVideoref.current.srcObject =
                    stream;
            }

            for (let id in connections) {
                if (
                    id === socketIdRef.current
                ) {
                    continue;
                }

                try {
                    connections[id].addStream(
                        window.localStream
                    );

                    connections[id]
                        .createOffer()
                        .then(
                            (description) => {
                                connections[id]
                                    .setLocalDescription(
                                        description
                                    )
                                    .then(() => {
                                        socketRef.current?.emit(
                                            "signal",
                                            id,
                                            JSON.stringify({
                                                sdp:
                                                    connections[
                                                        id
                                                    ]
                                                        .localDescription,
                                            })
                                        );
                                    });
                            }
                        );

                } catch (error) {
                    console.log(error);
                }
            }

            const videoTrack =
                stream.getVideoTracks()[0];

            if (videoTrack) {
                videoTrack.onended = () => {
                    setScreen(false);
                };
            }

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
        (fromId, messageData) => {
            const signal =
                JSON.parse(messageData);

            if (
                fromId ===
                socketIdRef.current
            ) {
                return;
            }

            if (signal.sdp) {
                connections[fromId]
                    ?.setRemoteDescription(
                        new RTCSessionDescription(
                            signal.sdp
                        )
                    )
                    .then(() => {
                        if (
                            signal.sdp.type ===
                            "offer"
                        ) {
                            return connections[
                                fromId
                            ].createAnswer();
                        }
                    })
                    .then((description) => {
                        if (!description) return;

                        return connections[
                            fromId
                        ]
                            .setLocalDescription(
                                description
                            )
                            .then(() => {
                                socketRef.current?.emit(
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
        };

    /* =====================================
       CHAT
    ===================================== */

    const addMessage =
        (
            data,
            sender,
            socketIdSender
        ) => {
            setMessages(
                (previousMessages) => [
                    ...previousMessages,
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
                if (
                    !showModalRef.current
                ) {
                    setNewMessages(
                        (previous) =>
                            previous + 1
                    );
                }
            }
        };

    /* =====================================
       CONNECT SOCKET
    ===================================== */

    const connectToSocketServer = () => {
        socketRef.current =
            io.connect(
                server_url,
                {
                    secure: false,
                }
            );

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
                        try {
                            connections[id]?.close();
                            delete connections[id];
                        } catch (error) {
                            console.log(error);
                        }

                        setVideos(
                            (previousVideos) =>
                                previousVideos.filter(
                                    (videoItem) =>
                                        videoItem.socketId !==
                                        id
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
                                    socketListId ===
                                    socketIdRef.current
                                ) {
                                    return;
                                }

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
                                                (
                                                    videoItem
                                                ) =>
                                                    videoItem.socketId ===
                                                    socketListId
                                            );

                                        if (
                                            exists
                                        ) {
                                            setVideos(
                                                (
                                                    previousVideos
                                                ) => {
                                                    const updated =
                                                        previousVideos.map(
                                                            (
                                                                videoItem
                                                            ) =>
                                                                videoItem.socketId ===
                                                                socketListId
                                                                    ? {
                                                                        ...videoItem,
                                                                        stream:
                                                                            event.stream,
                                                                    }
                                                                    : videoItem
                                                        );

                                                    videoRef.current =
                                                        updated;

                                                    return updated;
                                                }
                                            );

                                        } else {
                                            const newVideo =
                                                {
                                                    socketId:
                                                        socketListId,
                                                    stream:
                                                        event.stream,
                                                };

                                            setVideos(
                                                (
                                                    previousVideos
                                                ) => {
                                                    const updated =
                                                        [
                                                            ...previousVideos,
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
                            id ===
                            socketIdRef.current
                        ) {
                            for (
                                let id2 in connections
                            ) {
                                if (
                                    id2 ===
                                    socketIdRef.current
                                ) {
                                    continue;
                                }

                                connections[id2]
                                    .createOffer()
                                    .then(
                                        (
                                            description
                                        ) => {
                                            connections[id2]
                                                .setLocalDescription(
                                                    description
                                                )
                                                .then(
                                                    () => {
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
                                                    }
                                                );
                                        }
                                    )
                                    .catch(
                                        (
                                            error
                                        ) =>
                                            console.log(
                                                error
                                            )
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
        setVideo(
            (previous) => !previous
        );
    };

    const handleAudio = () => {
        setAudio(
            (previous) => !previous
        );
    };

    const handleScreen = () => {
        if (screen) {
            setScreen(false);
            return;
        }

        setScreen(true);
    };

    const handleEndCall = () => {
        try {
            if (window.localStream) {
                window.localStream
                    .getTracks()
                    .forEach((track) =>
                        track.stop()
                    );
            }

            Object.values(connections)
                .forEach(
                    (connection) => {
                        try {
                            connection.close();
                        } catch (error) {
                            console.log(error);
                        }
                    }
                );

        } catch (error) {
            console.log(error);
        }

        try {
            socketRef.current?.disconnect();
        } catch (error) {
            console.log(error);
        }

        window.location.href =
            "/home";
    };

    /* =====================================
       CHAT CONTROLS
    ===================================== */

    const toggleChat = () => {
        setModal(
            (previousState) => {
                const nextState =
                    !previousState;

                if (nextState) {
                    setNewMessages(0);
                }

                return nextState;
            }
        );
    };

    const openChat = () => {
        setModal(true);
        setNewMessages(0);
    };

    const closeChat = () => {
        setModal(false);
    };

    const sendMessage = () => {
        if (!message.trim()) {
            return;
        }

        if (!socketRef.current) {
            return;
        }

        socketRef.current.emit(
            "chat-message",
            message.trim(),
            username
        );

        setMessage("");
    };

    const handleMessageKeyDown =
        (event) => {
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
            <div
                className={
                    styles.lobbyPage
                }
            >
                <div
                    className={
                        styles.lobbyGlow
                    }
                />

                <div
                    className={
                        styles.lobbyCard
                    }
                >
                    <div
                        className={
                            styles.lobbyIcon
                        }
                    >
                        <MeetingRoomIcon />
                    </div>

                    <div
                        className={
                            styles.lobbyBadge
                        }
                    >
                        <span />

                        Ready to join
                    </div>

                    <h1>
                        Join the

                        <span>
                            {" "}
                            meeting.
                        </span>
                    </h1>

                    <p>
                        Enter your name to
                        join the conversation
                        and connect with
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
                                event.key ===
                                "Enter"
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
                        className={
                            styles.joinLobbyButton
                        }
                        onClick={connect}
                        disabled={
                            !username.trim()
                        }
                    >
                        Join Meeting →
                    </Button>

                    <div
                        className={
                            styles.lobbyPreview
                        }
                    >
                        <video
                            ref={
                                localVideoref
                            }
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
            className={`${styles.meetVideoContainer} ${
                showModal
                    ? styles.chatOpen
                    : ""
            }`}
        >
            {/* HEADER */}

            <div
                className={
                    styles.meetingHeader
                }
            >
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
                        <h2>
                            JudoCall
                        </h2>

                        <span>
                            Secure video
                            meeting
                        </span>
                    </div>
                </div>

                <div
                    className={
                        styles.meetingStatus
                    }
                >
                    <span />

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

            {/* VIDEO AREA */}

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
                    {videos.length === 0 ? (
                        <div
                            className={
                                styles.waitingRoom
                            }
                        >
                            <PersonIcon />

                            <h3>
                                Waiting for
                                participants
                            </h3>

                            <p>
                                Share the
                                meeting link with
                                others to start
                                your conversation.
                            </p>
                        </div>
                    ) : (
                        videos.map(
                            (
                                remoteVideo
                            ) => (
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
                                        ref={(
                                            ref
                                        ) => {
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
                        )
                    )}
                </div>

                {/* LOCAL VIDEO */}

                <div
                    className={
                        styles.localVideoWrapper
                    }
                >
                    <video
                        className={
                            styles.meetUserVideo
                        }
                        ref={
                            localVideoref
                        }
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

            {/* CONTROLS */}

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
                    onClick={
                        handleVideo
                    }
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
                    onClick={
                        handleAudio
                    }
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
                        onClick={
                            handleScreen
                        }
                    >
                        {screen ? (
                            <StopScreenShareIcon />
                        ) : (
                            <ScreenShareIcon />
                        )}
                    </IconButton>
                )}

                <Badge
                    badgeContent={
                        newMessages
                    }
                    max={99}
                    color="error"
                >
                    <IconButton
                        className={
                            styles.controlButton
                        }
                        onClick={
                            toggleChat
                        }
                    >
                        <ChatIcon />
                    </IconButton>
                </Badge>

                <IconButton
                    className={
                        styles.endCallButton
                    }
                    onClick={
                        handleEndCall
                    }
                >
                    <CallEndIcon />
                </IconButton>
            </div>

            {/* CHAT PANEL */}

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
                            <h3>
                                Meeting Chat
                            </h3>

                            <span>
                                Messages from
                                participants
                            </span>
                        </div>

                        <IconButton
                            onClick={
                                closeChat
                            }
                        >
                            <CloseIcon />
                        </IconButton>
                    </div>

                    <div
                        className={
                            styles.chattingDisplay
                        }
                    >
                        {messages.length >
                        0 ? (
                            messages.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <div
                                        className={
                                            styles.messageItem
                                        }
                                        key={
                                            index
                                        }
                                    >
                                        <strong>
                                            {
                                                item.sender
                                            }
                                        </strong>

                                        <p>
                                            {
                                                item.data
                                            }
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
                                    No messages
                                    yet
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
                            value={
                                message
                            }
                            placeholder="Write a message..."
                            onChange={(
                                event
                            ) =>
                                setMessage(
                                    event.target
                                        .value
                                )
                            }
                            onKeyDown={
                                handleMessageKeyDown
                            }
                        />

                        <IconButton
                            onClick={
                                sendMessage
                            }
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