// ESTA ES LA ESTRUCTURA DE COLUMNAS DEL LISTADO DE CLIENTES

export const COLUMNSCLIENTES = [
{
    Header: "Nombre",
    accessor: "nombre",
    width: 'auto',
},
{
    Header: "Email",
    accessor: "email",
    width: 'auto',
},
{
    Header: "Telefono",
    accessor:"telefono",
    width: 'auto',
},
{
    Header: "Cuit/Cuil",
    accessor:"cuit_cuil",
    width: 'auto',
},
{
    Header: "Direccion",
    accessor:"direccion",
    width: 'auto',
},
{
    Header: "CP",
    accessor: "codigo_postal",
    width: 'auto',
},
{
    Header: "DNI",
    accessor: "dni",
    width: 'auto',
},
{
    Header: "Ciudad",
    accessor:"ciudad",
    width: 'auto',
},
{
    Header: "Provincia",
    accessor:"provincia",
    width: 'auto',
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
    Header: "Envio",
    accessor: "tipo_envio",
    width: 'auto'
},
{
    Header: "Transporte",
    accessor:"forma_de_envio",
    width: 'auto',
},
{
    Header: "Tipo",
    accessor:"tipo_cliente",
    width: 'auto',
},
{
    Header: "PDF",
    accessor:"tipo_pdf_remito",
    width: 'auto',
},
{
    Header: "",
    accessor:"cuenta-corriente",
    width: 'auto',
},
{
    Header: "",
    accessor:"editar",
    width: 'auto',
},
{
    Header: "",
    accessor:"eliminar",
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