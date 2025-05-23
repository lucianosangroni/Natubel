export const COLUMNSPEDIDOS = [
    {
        Header: "Nº Pedido",
        accessor: "numero_pedido",
        width: 'auto',
    },
    {
        Header: "Fecha",
        accessor:"fecha",
        width: 'auto',
    },
    {
        Header: "Nombre",
        accessor: "persona_nombre",
        width: 'auto',
    },
    {
        Header: "Estado",
        accessor: "estado",
        width: 'auto',
    },
    {
        Header: "Precio",
        accessor: "precio_total",
        width: 'auto',
        Cell: ({ value }) => {
            const montoFormateado = formatearNumero(value);
            return `$${montoFormateado}`;
        },
    },
    {
        Header: "Cliente / Proveedor",
        accessor:"tipo",
        width: 'auto',
    },
    {
        Header: "Creador",
        accessor:"creador",
        width: 'auto',
        minWidth: 250,
    }
]

const formatearNumero = (numero) => {
    if (typeof numero === 'number') {
        const [entero, decimal] = numero.toString().split('.');
        return `${entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${decimal ? `,${decimal}` : ''}`;
    }
    return numero;
};