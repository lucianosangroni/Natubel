export const COLUMNSPEDIDOS = (cuponesData) => [
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
    },
    {
        Header: "Observaciones",
        accessor: "razon_cancelado",
        width: 'auto',
        Cell: ({ row }) => {
        const { cupon_id, razon_cancelado } = row.original;
        const cupon = cuponesData.find(c => c.id === cupon_id);

        if (cupon) {
            return (
                <>
                    {`Cupón: ${cupon.clave} - ${cupon.descuento}%`}
                    <br />
                    {razon_cancelado || ''}
                </>
            );
        }

        return razon_cancelado || '';
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