import { useEffect, useRef, useState } from "react";
import { useSocket } from "../../context/socketContext";
import styles from "./fileTransfer.module.css";

function FileTransfer() {
    const socket = useSocket();
    const fileInputRef = useRef(null);
    const [room, setRoom] = useState("");
    const [progress, setProgress] = useState("");
    const [receivedFile, setReceivedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previousRooms, setPreviousRooms] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const joinRoom = () => {
        if (!room) {
            setProgress("Please enter a room ID.");
            return;
        }
        if (!socket) {
            setProgress("Socket not connected.");
            return;
        }
        socket.emit("join_room", room);
        setProgress(`Joined room: ${room}`);
        setPreviousRooms((prev) => prev.includes(room) ? prev : [room, ...prev]);
    };

    const sendFile = () => {
        setReceivedFile(null);
        const file = fileInputRef.current.files[0];
        if (!file || !room || !socket) {
            setProgress("Please select a file and enter a room ID.");
            return;
        }
        setProgress("Reading file...");
        const reader = new FileReader();
        reader.onprogress = (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                setUploadProgress(percent);
            }
        };
        reader.onload = (e) => {
            setUploadProgress(100);
            setProgress("Sending file...");
            socket.emit("send_file", {
                fileName: file.name,
                fileType: file.type,
                fileBuffer: e.target.result,
                toRoom: room,
            });
            setProgress("File sent!");
            setTimeout(() => {
                setUploadProgress(0);
                setProgress("");
                if (fileInputRef.current) fileInputRef.current.value = "";
            }, 1200);
        };
        reader.onerror = () => {
            setProgress("Error reading file.");
        };
        setUploadProgress(0);
        reader.readAsArrayBuffer(file);
    };

    const leaveRoom = () => {
        if (room && socket) {
            socket.emit("leave_room", room);
            setProgress(`Left room: ${room}`);
            setRoom("");
            setReceivedFile(null);
            setUploadProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            fileInputRef.current.files = e.dataTransfer.files;
            sendFile();
        }
    };

    useEffect(() => {
        if (!socket) return;
        const handleReceiveFile = (data) => {
            if (socket.id !== data.from) {
                setReceivedFile(data);
                setProgress("File received!");
            }
        };
        const handleTransferComplete = (info) => {
            if (socket.id !== info.from) {
                setProgress(`File "${info.fileName}" transfer complete!`);
            }
        };
        socket.on("receive_file", handleReceiveFile);
        socket.on("file_transfer_complete", handleTransferComplete);
        return () => {
            socket.off("receive_file", handleReceiveFile);
            socket.off("file_transfer_complete", handleTransferComplete);
        };
    }, [socket]);

    if (!socket) {
        return <div className={styles["file-transfer-status"]}>Connecting to server...</div>;
    }

    return (
        <div className={styles["file-transfer-container"]}>
            <h1 className={styles["file-transfer-title"]}>File Transfer</h1>
            
            <div className={styles["file-transfer-row"]}>
                <input
                    className={styles["file-transfer-input"]}
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Enter Room ID"
                />
                <button className={styles["file-transfer-btn"]} onClick={joinRoom}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4V20M12 4L6 10M12 4L18 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Join Room
                </button>
                <button className={styles["file-transfer-btn"]} onClick={leaveRoom} style={{background:'#d32f2f'}}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 20V4M12 20L6 14M12 20L18 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Leave Room
                </button>
            </div>

            {previousRooms.length > 0 && (
                <div className={styles["previous-rooms"]}>
                    {previousRooms.map((r, idx) => (
                        <button
                            key={r+idx}
                            className={styles["room-chip"]}
                            onClick={() => setRoom(r)}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            )}

            <div 
                className={styles["file-transfer-row"]}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                    border: isDragging ? '2px dashed #4ECDC4' : 'none',
                    borderRadius: '12px',
                    padding: isDragging ? '20px' : '0',
                    transition: 'all 0.3s ease'
                }}
            >
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className={styles["file-transfer-input"]}
                    onChange={sendFile}
                />
                <button className={styles["file-transfer-btn"]} onClick={sendFile}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4L12 16M12 16L8 12M12 16L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 15V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Send File
                </button>
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
                <div className={styles["file-transfer-progress"]}>
                    <div
                        className={styles["file-transfer-progress-bar"]}
                        style={{ width: `${uploadProgress}%` }}
                    />
                </div>
            )}

            {progress && <div className={styles["file-transfer-status"]}>{progress}</div>}

            {receivedFile && (
                <a
                    className={styles["file-transfer-download"]}
                    href={URL.createObjectURL(
                        new Blob([receivedFile.fileBuffer], { type: receivedFile.fileType })
                    )}
                    download={receivedFile.fileName}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4V16M12 16L8 12M12 16L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 15V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Download {receivedFile.fileName}
                </a>
            )}
        </div>
    );
}

export default FileTransfer;

