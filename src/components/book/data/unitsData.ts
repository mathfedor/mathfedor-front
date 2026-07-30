export interface Topic {
  id: string;
  name: string;
  icon: string;
}

export interface Unit {
  id: string;
  name: string;
  color: string;
  topics: [string, string, string][];
}

export const UNITS: Unit[] = [{"id": "u1", "name": "U1 \u00b7 N\u00fameros y Suma", "color": "#7B2FBE", "topics": [["add_conteo", "Conteo", "\ud83d\udd22"], ["add_saltos", "Saltos", "\ud83d\udc38"], ["add_linea", "L\u00ednea num\u00e9rica", "\ud83d\udccf"], ["add_decena", "La Decena", "\ud83d\udd1f"], ["add_sl", "Suma sin llevar", "\u2795"], ["add_docena", "La Docena", "\ud83d\udce6"], ["add_centena", "La Centena", "\ud83d\udcaf"], ["add_ll", "Suma llevando", "\u2934\ufe0f"], ["add_probs", "Problemas", "\ud83d\udcd6"], ["add_final", "Evaluaci\u00f3n", "\ud83c\udfc6"]]}, {"id": "u2", "name": "U2 \u00b7 Sustracci\u00f3n", "color": "#E24B4A", "topics": [["sub_recta", "Recta num\u00e9rica", "\ud83d\udccf"], ["sub_tienda", "Tienda", "\ud83c\udfea"], ["sub_sl", "Resta sin desagrupar", "\u2796"], ["sub_ll", "Resta desagrupando", "\u2935\ufe0f"], ["sub_probs", "Problemas", "\ud83d\udcd6"], ["sub_final", "Evaluaci\u00f3n", "\ud83c\udfc6"]]}, {"id": "u3", "name": "U3 \u00b7 Multiplicaci\u00f3n", "color": "#F0C674", "topics": [["mul_t0", "Tablas f\u00e1ciles", "\u2716\ufe0f"], ["mul_t1", "Tablas retadoras", "\ud83c\udfaf"], ["mul_abrev", "\u00d7 10, 100, 1000", "0\ufe0f\u20e3"], ["mul_probs", "Problemas", "\ud83d\udcd6"], ["mul_final", "Evaluaci\u00f3n", "\ud83c\udfc6"]]}, {"id": "u4", "name": "U4 \u00b7 Divisi\u00f3n", "color": "#4FACFE", "topics": [["div_t0", "Repartir", "\u2797"], ["div_final", "Evaluaci\u00f3n", "\ud83c\udfc6"]]}, {"id": "u5", "name": "U5 \u00b7 Geometr\u00eda", "color": "#4CAF50", "topics": [["geo_t0", "L\u00edneas y puntos", "\ud83d\udcd0"], ["geo_t1", "Figuras planas", "\ud83d\udd37"], ["geo_t2", "Per\u00edmetro y \u00c1rea", "\ud83d\udccf"], ["geo_final", "Evaluaci\u00f3n", "\ud83c\udfc6"]]}, {"id": "u6", "name": "U6 \u00b7 Estad\u00edstica", "color": "#FF8F3F", "topics": [["est_t0", "Tabla de datos", "\ud83d\udcca"], ["est_t1", "Gr\u00e1fica de barras", "\ud83d\udcc8"]]}];
