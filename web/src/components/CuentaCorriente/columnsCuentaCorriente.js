// ESTA ES LA ESTRUCTURA DE COLUMNAS DE LA CUENTA CORRIENTE

export const COLUMNSCUENTACORRIENTE = [
    {
        Header: "N° Pedido",
        accessor: "numero_pedido",
        width: 'auto',
    },
    {
        Header: "Fecha",
        accessor: "fecha",
        width: 'auto',
    },
    {
        Header: "Monto",
        accessor:"monto",
        width: 'auto',
        Cell: ({ value }) => {
            const montoFormateado = formatearNumero(value);
            return `$${montoFormateado}`;
        },
    },
    {
        Header: "Estado",
        accessor:"estado",
        width: 'auto',
    },
    
]

const formatearNumero = (numero) => {
    if (typeof numero === 'number') {
        const [entero, decimal] = numero.toString().split('.');
        return `${entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${decimal ? `,${decimal}` : ''}`;
    }
    return numero;
};