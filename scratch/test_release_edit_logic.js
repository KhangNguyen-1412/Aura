// Test simulation for release log edit logic

function simulateReleaseSave(editingReleaseLogId, existingLog, formData, currentPendingReleaseMedia, isExistingMediaRemoved) {
    let hasVideo = false;
    let videoType = null;
    let videoDuration = 0;
    let videoUrl = '';
    let videoFileName = '';

    if (currentPendingReleaseMedia) {
        hasVideo = true;
        videoType = currentPendingReleaseMedia.type;
        videoDuration = currentPendingReleaseMedia.duration || 0;
        videoUrl = currentPendingReleaseMedia.type === 'url' ? currentPendingReleaseMedia.url : '';
        videoFileName = currentPendingReleaseMedia.name || '';
    } else if (existingLog && !isExistingMediaRemoved) {
        hasVideo = true;
        videoType = existingLog.videoType || 'camera';
        videoDuration = existingLog.videoDuration || 0;
        videoUrl = existingLog.videoUrl || '';
        videoFileName = existingLog.videoFileName || '';
    } else {
        hasVideo = false;
        videoType = null;
        videoDuration = 0;
        videoUrl = '';
        videoFileName = '';
    }

    return {
        ...formData,
        hasVideo,
        videoType,
        videoDuration,
        videoUrl,
        videoFileName
    };
}

// Case 1: Existing log with camera video, user edits only notes
const log1 = {
    id: "log_123",
    type: "Quan hệ (Intercourse)",
    hardness: 8,
    duration: 15,
    notes: "Ghi chú cũ",
    hasVideo: true,
    videoType: "camera",
    videoDuration: 18,
    videoFileName: "Ghi_hinh_1.webm"
};

const updatedLog1 = simulateReleaseSave(
    "log_123",
    log1,
    { type: log1.type, hardness: 9, duration: 20, notes: "Ghi chú mới" },
    null, // no new recording
    false // not removed
);

console.log("Test 1 (Keep video when editing notes):", updatedLog1.hasVideo === true && updatedLog1.videoType === "camera" && updatedLog1.videoDuration === 18 ? "PASS" : "FAIL");

// Case 2: Existing log with camera video, user explicitly marks for removal
const updatedLog2 = simulateReleaseSave(
    "log_123",
    log1,
    { type: log1.type, hardness: 9, duration: 20, notes: "Ghi chú mới" },
    null, // no new recording
    true  // marked removed
);

console.log("Test 2 (Remove video when explicitly marked):", updatedLog2.hasVideo === false && updatedLog2.videoType === null ? "PASS" : "FAIL");

// Case 3: Existing log with camera video, user uploads a replacement file
const updatedLog3 = simulateReleaseSave(
    "log_123",
    log1,
    { type: log1.type, hardness: 9, duration: 20, notes: "Ghi chú mới" },
    { type: "upload", name: "new_video.mp4", duration: 25 }, // new video
    false
);

console.log("Test 3 (Replace video when new file provided):", updatedLog3.hasVideo === true && updatedLog3.videoType === "upload" && updatedLog3.videoFileName === "new_video.mp4" ? "PASS" : "FAIL");
