import * as pecasService from "../service/pecasService.js";

export const addPeca = async (req, res) => {
    try {
        const { id, nome_peca, categoria, custo_unitario, fornecedor, estoque_atual } = req.body;

        // Erro do Cliente: Validação do contrato básico antes de chamar o banco
        if (!id || !nome_peca || custo_unitario === undefined) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Campos obrigatórios ausentes."
            });
        }
        const sku = id.trim().toUpperCase();

        const pecaData = {
            sku,
            nome_peca,
            custo_unitario,
            categoria,
            fornecedor,
            estoque_atual
        };

        const novaPeca = await pecasService.createPeca(pecaData);
        return res.status(201).json({ sucesso: true, dados: novaPeca });
    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({ sucesso: false, mensagem: error.message });
    }
};

export const getPecas = async (req, res) => {
    try {
        const pecas = await pecasService.getPecas();
        return res.status(200).json({ sucesso: true, total: pecas.length, dados: pecas });
    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({ sucesso: false, mensagem: error.message });
    }
};

export const getPecaBySku = async (req, res) => {
    try {
        const { id } = req.params;
        const peca = await pecasService.getPecaBySku(id);
        return res.status(200).json({ sucesso: true, dados: peca });
    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({ sucesso: false, mensagem: error.message });
    }
};

export const updatePeca = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Corpo da requisição não pode estar vazio para atualização."
            });
        }

        const {
            nome_peca,
            categoria,
            custo_unitario,
            fornecedor,
            estoque_atual
        } = req.body;

        const pecaDataAtualizada = {
            nome_peca,
            categoria,
            custo_unitario,
            fornecedor,
            estoque_atual
        };

        const pecaAtualizada = await pecasService.updatePeca(
            id,
            pecaDataAtualizada
        );

        return res.status(200).json({
            sucesso: true,
            dados: pecaAtualizada
        });

    } catch (error) {
        const status = error.statusCode || 500;

        return res.status(status).json({
            sucesso: false,
            mensagem: error.message
        });
    }
};

export const deletePeca = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await pecasService.deletePeca(id);
        return res.status(200).json({ sucesso: true, mensagem: resultado.message });
    } catch (error) {
        const status = error.statusCode || 500;
        return res.status(status).json({ sucesso: false, mensagem: error.message });
    }
};