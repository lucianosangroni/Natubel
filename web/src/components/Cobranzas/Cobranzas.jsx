import Loading from "../Common/Loading";
import NavbarAdm from "../Common/NavbarAdm";
import { useData } from "../../context/DataContext";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Cobranzas = () => {
    const { isInitialLoading, clientesData, proveedoresData, imputacionesData, facturasData, pagosData } = useData()
    const [selectedInfo, setSelectedInfo] = useState("Cobranzas")
    const [imputaciones, setImputaciones] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const imputacionesGroup = imputacionesData.reduce((acc, imputacion) => {
            const numeroImputacion = imputacion.numero_imputacion;
            
            if (!acc[numeroImputacion]) {
                acc[numeroImputacion] = [];
            }
            
            acc[numeroImputacion].push(imputacion);
            
            return acc;
        }, {});

        const detailedImputaciones = Object.keys(imputacionesGroup).map(numeroImputacion => {
            const imputaciones = imputacionesGroup[numeroImputacion];
            const fecha = imputaciones[0].createdAt;
        
            const facturasUnicas = Array.from(new Set(imputaciones.map(imputacion => imputacion.factura_id)));
            const pagosUnicos = Array.from(new Set(imputaciones.map(imputacion => imputacion.pago_id)));

            let persona = ""

            const montoImputacion = facturasUnicas.reduce((total, factura_id) => {
                const factura = facturasData.find(fac => fac.id === factura_id);
                if(persona === "") persona = factura.persona_nombre
                return total + (factura ? factura.monto : 0);
            }, 0);

            const montoSobrante = pagosUnicos.reduce((total, pago_id) => {
                const pago = pagosData.find(pago => pago.id === pago_id);
                return total + (pago ? pago.monto : 0); 
            }, 0) - montoImputacion; 

            return {
                numero_imputacion: numeroImputacion,
                fecha: formatearFecha(fecha),
                persona,
                montoImputacion,
                montoSobrante
            };
        }).sort((a, b) => Number(b.numero_imputacion) - Number(a.numero_imputacion));

        setImputaciones(detailedImputaciones)
    }, [imputacionesData]);

    const formatearFecha = (fechaDateTime) => {
        const fecha = new Date(fechaDateTime);
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        
        return `${dia}/${mes}/${anio}`;
    };

    const formatearNumero = (numero) => {
        if (typeof numero === 'number') {
            const [entero, decimal] = numero.toFixed(2).toString().split('.');
            return `${entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${decimal ? `,${decimal}` : ''}`;
        }
        return numero;
    };

    const detallesImputacion = (imputacion) => {
        navigate(`/admin/cobranzas/${imputacion.numero_imputacion}`)
    }

    const handleCuentaCorriente = (persona) => {
        navigate(`/admin/cuenta-corriente/${persona.email}`)
    }

    return (
        <>
            {(isInitialLoading) && <Loading/>}
            <NavbarAdm selected={'Cobranzas'}/>

            <div style={{marginTop: "5.5rem", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <select
                    value={selectedInfo}
                    onChange={(e) => setSelectedInfo(e.target.value)}
                >
                    <option key={"Cobranzas"} value={"Cobranzas"}>
                        Cobranzas
                    </option>
                    <option key={"Cuentas Corrientes"} value={"Cuentas Corrientes"}>
                        Cuentas Corrientes
                    </option>
                </select>
            </div>

            {selectedInfo === "Cobranzas" && (
                <>
                    {imputaciones.length > 0 && (
                        <div className="tableDivContainer" style={{marginBottom: "1rem"}}>
                            <table className="tableContainerSinPaginacion">
                                <thead>
                                    <tr>
                                        <th>N° Cobranza</th>
                                        <th>Fecha</th>
                                        <th>Monto</th>
                                        <th>Pagado</th>
                                        <th>Sobrante</th>
                                        <th>Cliente/Proveedor</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {imputaciones.map((imputacion, index) => (
                                        <tr key={index}>
                                            <td>{imputacion.numero_imputacion}</td>
                                            <td>{imputacion.fecha}</td>
                                            <td>${formatearNumero(imputacion.montoImputacion)}</td>
                                            <td>${formatearNumero(imputacion.montoImputacion + imputacion.montoSobrante)}</td>
                                            <td>${formatearNumero(imputacion.montoSobrante)}</td>
                                            <td>{imputacion.persona}</td>
                                            <td>
                                                <button onClick={() => detallesImputacion(imputacion)} className="botonEliminar" style={{padding: "3px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px", marginBottom: "2px", background: "none"}}>
                                                    <FontAwesomeIcon icon={faEye} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {selectedInfo === "Cuentas Corrientes" && (
                <>
                    {proveedoresData.length > 0 && (
                        <div className="tableDivContainer" style={{marginBottom: "1rem"}}>
                            <table className="tableContainerSinPaginacion">
                                <thead>
                                    <tr>
                                        <th>Proveedor</th>
                                        <th>Email</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...proveedoresData].sort((a, b) => a.nombre.localeCompare(b.nombre)).map((proveedor, index) => (
                                        <tr key={index}>
                                            <td>{proveedor.nombre}</td>
                                            <td>{proveedor.email}</td>
                                            <td>
                                                <button onClick={() => handleCuentaCorriente(proveedor)} className="botonEditar" style={{padding: "3px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px", marginBottom: "2px", background: "none"}}>
                                                    <FontAwesomeIcon icon={faSackDollar} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {clientesData.length > 0 && (
                        <div className="tableDivContainer" style={{marginBottom: "1rem"}}>
                            <table className="tableContainerSinPaginacion">
                                <thead>
                                    <tr>
                                        <th>Cliente</th>
                                        <th>Email</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...clientesData].sort((a, b) => a.nombre.localeCompare(b.nombre)).map((cliente, index) => (
                                        <tr key={index}>
                                            <td>{cliente.nombre}</td>
                                            <td>{cliente.email}</td>
                                            <td>
                                                <button onClick={() => handleCuentaCorriente(cliente)} className="botonEditar" style={{padding: "3px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px", marginBottom: "2px", background: "none"}}>
                                                    <FontAwesomeIcon icon={faSackDollar} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default Cobranzas;