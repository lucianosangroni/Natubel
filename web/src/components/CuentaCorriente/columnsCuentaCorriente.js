// ESTA ES LA ESTRUCTURA DE COLUMNAS DE LA CUENTA CORRIENTE

export const COLUMNSCUENTACORRIENTE = [
    {
        Header: "N° Pedido",
        accessor: "numero_pedido",
        width: 'auto',
    },
    {
        Header: "N° Remito",
        accessor: "numero_remito",
        width: 'auto',
    },
    {
        Header: "Fecha",
        accessor: "fecha",
        width: 'auto',
    },
    {
        Header: "Total",
        accessor:"total",
        width: 'auto',
        Cell: ({ value }) => {
            const montoFormateado = formatearNumero(value);
            return `$${montoFormateado}`;
        },
    },
    {
        Header: "Descuento",
        accessor: "descuento",
        width: 'auto',
        Cell: ({ value }) => {
            const montoFormateado = formatearNumero(value);
            return `${montoFormateado}%`;
        },
    },
    {
        Header: "A Pagar",
        accessor: "a_pagar",
        width: 'auto',
        Cell: ({ value }) => {
            const montoFormateado = formatearNumero(value);
            return `$${montoFormateado}`;
        },
    },
]

const formatearNumero = (numero) => {
    if (typeof numero === 'number') {
        const [entero, decimal] = numero.toString().split('.');
        return `${entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${decimal ? `,${decimal}` : ''}`;
    }
    return numero;
};