import multer from "multer";

//To uplode images
const uplode = multer({ dest: "uploads/" });

export default uplode;