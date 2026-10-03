import express from "express";
import { } from "../controller/pecasController.js";
import { addPeca, deletePeca, getPecaBySku, getPecas, updatePeca } from "../controller/pecasController.js";

const pecasRoutes = express.Router();

pecasRoutes.post("/pecas", addPeca);//Cria uma peça
pecasRoutes.get("/pecas", getPecas); //Lista as peças
pecasRoutes.get("/pecas/:id", getPecaBySku);//Retorna peça pelo ID
pecasRoutes.put("/pecas/:id", updatePeca); //Atualiza uma peça
pecasRoutes.delete("/pecas/:id", deletePeca);//Deleta peça

export default pecasRoutes;