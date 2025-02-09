export function processArticulos(data) {
  return data.map((categoria) => ({
    ...categoria,
    Articulos: categoria.Articulos.map((articulo) => ({
      ...articulo,
      ESTADO: '',
    })),
  }));
}
