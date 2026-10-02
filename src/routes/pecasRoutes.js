import express from "express";
import { } from "../controller/pecasController.js";
import { addPeca, deletePeca, getPecaBySku, getPecas, updatePeca } from "../controller/pecasController.js";

const router = express.Router();

router.post("/pecas", addPeca);//Cria uma peça
router.get("/pecas", getPecas); //Lista as peças
router.get("/pecas/:id", getPecaBySku);//Retorna peça pelo ID
router.put("/pecas/:id", updatePeca); //Atualiza uma peça
router.delete("/pecas/:id", deletePeca);//Deleta peça

export default router;