// ESTA ES LA ESTRUCTURA DE COLUMNAS DE LOS PAGOS

export const COLUMNSPAGOSIMPUTACION = [
    {
        Header: "N° Pago",
        accessor: "numero_pago",
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
]

const formatearNumero = (numero) => {
    if (typeof numero === 'number') {
        const [entero, decimal] = numero.toString().split('.');
        return `${entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${decimal ? `,${decimal}` : ''}`;
    }
    return numero;
};