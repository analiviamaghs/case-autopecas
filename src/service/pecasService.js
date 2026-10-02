import supabase from "../config/supabaseClient.js";

export const createPeca = async (pecaData) => {
    const { data, error } = await supabase
        .from("pecas")
        .insert([pecaData])
        .select();

    if (error) throw new Error(error.message);
    return data;
};

export const getPecas = async () => {
    const { data, error } = await supabase.from("pecas").select("*");

    if (error) throw new Error(error.message);
    return data;
};

export const getPecaBySku = async (sku) => {
    const { data, error } = await supabase
        .from("pecas")
        .select("*")
        .eq("sku", sku)
        .single();

    if (error) throw new Error(error.message);
    return data;
};

export const updatePeca = async (sku, updates) => {
    const { data, error } = await supabase
        .from("pecas")
        .update(updates)
        .eq("sku", sku)
        .select();

    if (error) throw new Error(error.message);
    return data;
};

export const deletePeca = async (sku) => {
    const { error } = await supabase
        .from("pecas")
        .delete()
        .eq("sku", sku);

    if (error) throw new Error(error.message);
    return { success: true, message: "Peça deleteda" };
};
