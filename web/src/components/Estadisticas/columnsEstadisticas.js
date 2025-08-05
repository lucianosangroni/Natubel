export const COLUMNSSTATS= [

    {
        Header:"N° Pedido",
        accessor:"numero_pedido",
        width: 'auto',
    },
    {
        Header:"N° Remito",
        accessor:"numero_remito",
        width: 'auto',
    },
    {
        Header:"Cliente",
        accessor:"cliente",
        width: 'auto',
    },
    {
        Header: "Fecha",
        accessor:"fecha",
        width: 'auto',
    },
    {
        Header:"Monto",
        accessor:"monto",
        width: 'auto',
        Cell: ({ value }) => {
            const montoFormateado = formatearNumero(value);
            return `$${montoFormateado}`;
        },
    },


]

const formatearNumero = (numero) => {
    if (typeof numero === 'number') {
        const [entero, decimal] = numero.toFixed(2).toString().split('.');
        return `${entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${decimal ? `,${decimal}` : ''}`;
    }
    return numero;
};