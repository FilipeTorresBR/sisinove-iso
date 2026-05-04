import multer from "multer";
import path from "path";

// Configuração padrão e limpa
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Salva na pasta uploads na raiz do backend
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Gera um nome único: timestamp + número aleatório
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
