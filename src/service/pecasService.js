import supabase from "../config/supabase.js";

// Auxiliar simples para criar erro com HTTP status sem duplicar código
const buildError = (message, statusCode) => {
    const err = new Error(message);
    err.statusCode = statusCode;
    return err;
};

export const createPeca = async (pecaData) => {
    const { data, error } = await supabase
        .from("pecas")
        .insert([pecaData])
        .select()
        .single();

    if (error) {
        // 23505 = unique_violation no PostgreSQL (SKU duplicado)
        if (error.code === "23505") {
            throw buildError(`A peça com o SKU '${pecaData.sku}' já existe.`, 409);
        }
        throw error;
    }

    return data;
};

export const getPecas = async () => {
    const { data, error } = await supabase.from("pecas").select("*");

    if (error) throw error;
    return data;
};

export const getPecaBySku = async (sku) => {
    const { data, error } = await supabase
        .from("pecas")
        .select("*")
        .eq("sku", sku)
        .single();

    if (error) {
        // PGRST116 = NENHUM REGISTRO ENCONTRADO
        if (error.code === "PGRST116") {
            throw buildError(`Peça com SKU '${sku}' não encontrada.`, 404);
        }
        throw error;
    }

    return data;
};

export const updatePeca = async (sku, updates) => {
    const { data, error } = await supabase
        .from("pecas")
        .update(updates)
        .eq("sku", sku)
        .select();

    if (error) throw error;

    // Se o array de retorno for vazio, o SKU não existia no banco
    if (!data || data.length === 0) {
        throw buildError(`Não foi possível atualizar: Peça com SKU '${sku}' não encontrada.`, 404);
    }

    return data[0];
};

export const deletePeca = async (sku) => {
    const { data, error } = await supabase
        .from("pecas")
        .delete()
        .eq("sku", sku)
        .select();

    if (error) throw error;

    if (!data || data.length === 0) {
        throw buildError(`Não foi possível deletar: Peça com SKU '${sku}' não encontrada.`, 404);
    }

    return { message: "Peça removida com sucesso." };
};