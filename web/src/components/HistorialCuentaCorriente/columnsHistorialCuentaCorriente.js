// ESTA ES LA ESTRUCTURA DE COLUMNAS DE LA CUENTA CORRIENTE

export const COLUMNSHISTORIALCUENTACORRIENTE = [
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
        accessor: "flag_imputada",
        width: 'auto',
        Cell: ({value}) => {
            return value ? "IMPUTADA" : "PENDIENTE"
        }
    }
]

const formatearNumero = (numero) => {
    if (typeof numero === 'number') {
        const [entero, decimal] = numero.toString().split('.');
        return `${entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${decimal ? `,${decimal}` : ''}`;
    }
    return numero;
};