import multer from "multer";

const storage = multer.memoryStorage(); // untuk akses buffer langsung

const upload = multer({ storage });

export default upload;
