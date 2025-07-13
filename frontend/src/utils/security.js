// File validation and security utilities

// Allowed file types and sizes
const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/plain',
    'text/csv',
    'application/pdf',
    'application/json',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MIN_FILE_SIZE = 1; // 1 byte

// Room ID validation
const ROOM_ID_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

export const validateFile = (file) => {
    const errors = [];

    if (!file) {
        errors.push('No file selected');
        return { isValid: false, errors };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        errors.push(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    if (file.size < MIN_FILE_SIZE) {
        errors.push('File cannot be empty');
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        errors.push('File type not allowed. Please upload images, documents, or text files only.');
    }

    // Check file name
    if (file.name.length > 255) {
        errors.push('File name is too long');
    }

    // Check for potentially dangerous file extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs', '.js', '.jar'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (dangerousExtensions.includes(fileExtension)) {
        errors.push('This file type is not allowed for security reasons');
    }

    return {
        isValid: errors.length === 0,
        errors,
        fileInfo: {
            name: file.name,
            size: file.size,
            type: file.type,
            sizeFormatted: formatFileSize(file.size)
        }
    };
};

export const validateRoomId = (roomId) => {
    if (!roomId) {
        return { isValid: false, error: 'Room ID is required' };
    }

    if (!ROOM_ID_REGEX.test(roomId)) {
        return {
            isValid: false,
            error: 'Room ID must be 3-20 characters long and contain only letters, numbers, hyphens, and underscores'
        };
    }

    return { isValid: true };
};

export const sanitizeRoomId = (roomId) => {
    return roomId.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 20);
};

export const sanitizeFileName = (fileName) => {
    // Remove dangerous characters and limit length
    return fileName
        .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
        .replace(/\.\./g, '')
        .substring(0, 255);
};

export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Rate limiting for file uploads (client-side)
const uploadAttempts = new Map();
const MAX_UPLOADS_PER_MINUTE = 5;

export const checkUploadRateLimit = (userId) => {
    const now = Date.now();
    const userAttempts = uploadAttempts.get(userId) || [];
    
    // Remove attempts older than 1 minute
    const recentAttempts = userAttempts.filter(timestamp => now - timestamp < 60000);
    
    if (recentAttempts.length >= MAX_UPLOADS_PER_MINUTE) {
        return {
            allowed: false,
            error: 'Too many upload attempts. Please wait a minute before trying again.'
        };
    }

    // Add current attempt
    recentAttempts.push(now);
    uploadAttempts.set(userId, recentAttempts);

    return { allowed: true };
};
