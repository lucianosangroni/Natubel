// ESTA ES LA ESTRUCTURA DE COLUMNAS DE LOS PAGOS

export const COLUMNSHISTORIALPAGOS = [
    {
        Header: "N° Pago",
        accessor: "numero_pago",
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
        Header: "Destino",
        accessor:"destino",
        width: 'auto',
    },
    {
        Header: "Estado",
        accessor: "flag_imputado",
        width: 'auto',
        Cell: ({value}) => {
            return value ? "IMPUTADO" : "PENDIENTE"
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