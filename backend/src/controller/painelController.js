import * as painelService from '../service/painelService.js';

export const getPainel = async (req, res) => {
    try {
        const metricas = await painelService.getMetricas();
        return res.status(200).json({
            sucesso: true,
            dados: metricas
        });
    } catch (error) {
        return res.status(500).json({
            sucesso: false,
            mensagem: error.message
        });
    }
};