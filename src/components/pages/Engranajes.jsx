import React, { useEffect, useRef, useState } from 'react'
import { tonalliSimbolos, numerosNombres, getImagePath } from '../funtions/funtions'
import '../styles/Estilos.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const Engranajes = () => {
  // Referencias para los SVG
  const engrane1Ref = useRef(null);
  const engrane2Ref = useRef(null);
  // Estados para los ángulos de rotación
  const [anguloEngrane1, setAnguloEngrane1] = useState(0);
  const [anguloEngrane2, setAnguloEngrane2] = useState(0);
  // Configuración de los engranajes
  const configEngrane1 = {
    dientes: 20,
    radio: 120,
    anchoDiente: 25,
    altoDiente: 35,
    velocidad: -0.5,
    simbolos: tonalliSimbolos
  }
  const configEngrane2 = {
    dientes: 13,
    radio: 80,
    anchoDiente: 25,
    altoDiente: 30,
    velocidad: 0.769,// Relación 20/13 para que encajen
    simbolos: numerosNombres
  }
  // Efecto para la animación
  useEffect(() => {
    let animationFrameId;
    // const intervalo = setInterval(() => {
    const intervalo = () => {
      // Engrane 1 gira en sentido horario
      //setAnguloEngrane1(prev => (prev +1) % 360);
      setAnguloEngrane1(prev => prev + configEngrane1.velocidad);
      // Engrane 2 gira en sentido antihorario (se ajusta para que encaje)
      //setAnguloEngrane2(prev => (prev - (20/13)) % 360);
      setAnguloEngrane2(prev => prev + configEngrane2.velocidad);
      animationFrameId = requestAnimationFrame(intervalo)
    }
    animationFrameId = requestAnimationFrame(intervalo)
    return () => {
      cancelAnimationFrame(animationFrameId)
    }

    //return () => clearInterval(intervalo);
  }, [])
  // Función para calcular la posición de un diente
  const calcularPosicionDiente = (indice, totalDientes, radio, anchoDiente, altoDiente) => {
    const angulo = (indice / totalDientes) * 2 * Math.PI;
    const x = radio * Math.cos(angulo);
    const y = radio * Math.sin(angulo);
    const rotacion = (angulo * 180 / Math.PI) + 90;

    return { x, y, rotacion };
  }
  // Renderizar dientes para el engrane 1
  const renderDientesEngrane1 = () => {
    const dientes = [];
    for (let i = 0; i < configEngrane1.dientes; i++) {
      const { x, y, rotacion } = calcularPosicionDiente(
        i,
        configEngrane1.dientes,
        configEngrane1.radio,
        configEngrane1.anchoDiente,
        configEngrane1.altoDiente
      );

      dientes.push(
        <g key={i} transform={`translate(${x}, ${y}) rotate(${rotacion})`}>
          <rect
            x={-configEngrane1.anchoDiente / 2}
            y={-configEngrane1.altoDiente / 2}
            width={configEngrane1.anchoDiente}
            height={configEngrane1.altoDiente}
            fill="#dbdbdbff"
            /*  stroke="#495057" */
            strokeWidth="2"
          />
          <image href={getImagePath(configEngrane1.simbolos[i].image)} alt="" x={-configEngrane2.anchoDiente / 1.8}
            y={-configEngrane2.altoDiente / 1.5}
            width={configEngrane1.anchoDiente * 1.12}
            height={configEngrane1.altoDiente * 1.1} />
          {/* <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {configEngrane1.simbolos[i].español}
                </text> */}
        </g>
      );
    }
    return dientes;
  }
  // Renderizar dientes para el engrane 2
  const renderDientesEngrane2 = () => {
    const dientes = [];
    for (let i = 0; i < configEngrane2.dientes; i++) {
      const { x, y, rotacion } = calcularPosicionDiente(
        i,
        configEngrane2.dientes,
        configEngrane2.radio,
        configEngrane2.anchoDiente,
        configEngrane2.altoDiente
      );

      dientes.push(
        <g key={i} transform={`translate(${x}, ${y}) rotate(${rotacion})`}>
          <rect
            x={-configEngrane2.anchoDiente / 2}
            y={-configEngrane2.altoDiente / 2}
            width={configEngrane2.anchoDiente}
            height={configEngrane2.altoDiente}
            fill="#dbdbdbff"
            /* stroke="#0056b3" */
            strokeWidth="2"
          />
          {/* <polyline points={`${-configEngrane2.anchoDiente / 2}, 16 ${-configEngrane2.anchoDiente / 2},${-configEngrane2.altoDiente / 2} 16, ${-configEngrane2.altoDiente / 2} 16,16`} fill="none" stroke="#b9b9b9ff" stroke-width="1" /> */}
          <image href={getImagePath(configEngrane2.simbolos[i].image)} alt="" x={-configEngrane2.anchoDiente / 2}
            y={-configEngrane2.altoDiente / 2}
            width={configEngrane2.anchoDiente}
            height={configEngrane2.altoDiente} />
          {/* <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="black"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {configEngrane2.simbolos[i]}
                </text> */}
        </g>

      );
    }
    return dientes;
  }
  return (
    <div class="container text-center  py-4">
      <div class="row justify-content-center align-items-center">
        <div class="col-md-12 text-center mb-4">
          <h2>Engranajes Giratorios</h2>
        </div>
        <div class="col-auto text-center">
          {/* Engranaje 2 - 13 dientes */}
          <div class="position-relative" style={{ width: '350px', height: '350px' }}>
            <svg
              ref={engrane2Ref}
              width="300"
              height="300"
              viewBox="-100 -100 200 200"
              style={{
                transform: `rotate(${anguloEngrane2}deg)`,
                transition: 'transform 0.05s linear'
              }}
            >
              {/* Círculo base del engrane */}
              <circle
                cx="0"
                cy="0"
                r={configEngrane2.radio - 10}
                fill="#dbdbdbff"
                stroke="#dbdbdbff"
                strokeWidth="3"
              />
              {/* Dientes */}
              {renderDientesEngrane2()}

              {/* Círculo central */}
              <circle
                cx="0"
                cy="0"
                r="60"
                fill="#dbdbdbff"
                stroke="#ffffffff"
                strokeWidth="2"
              />
            </svg>
            {/* Componente en el centro del engranaje 2 */}
            <div class="position-absolute top-50 start-50 translate-middle" style={{ backgroundColor: '#dbdbdbff' }}>
              <ResultadoDisplay title="Engranaje 2" color="primary" />
            </div>
          </div>
        </div>
        <div class="col-auto text-center">
          {/* Engranaje 1 - 20 dientes */}
          <div class="position-relative" style={{ width: '400px', height: '400px' }}>
            <svg
              ref={engrane1Ref}
              width="400"
              height="400"
              viewBox="-150 -150 300 300"
              style={{
                transform: `rotate(${anguloEngrane1}deg)`,
                transition: 'transform 0.05s linear'
              }}
            >
              {/* Círculo base del engrane */}
              <circle
                cx="0"
                cy="0"
                r={configEngrane1.radio - 10}
                fill="#dbdbdbff"
                stroke="#dbdbdbff"
                strokeWidth="3"
              />
              {/* Dientes */}
              {renderDientesEngrane1()}
              {/* Círculo central */}
              <circle
                cx="0"
                cy="0"
                r="95"
                fill="#dbdbdbff"
                stroke="#ffffffff"
                strokeWidth="2"
              />
            </svg>
            {/* Componente en el centro del engranaje 1 */}
            <div class="position-absolute top-50 start-50 translate-middle" style={{ backgroundColor: '#dbdbdbff', width: '50%', height: '50%' }}>
              <ResultadoDisplay title="Engrane 1" color="#353535ff" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
// Componente importado que se mostrará dentro de los engranajes
const ResultadoDisplay = ({ title, color = 'primary' }) => {
  return (
    <div class="d-flex flex-column justify-content-center align-items-center text-center p-2" style={{ borderRadius: '50%', width: '95px', height: '95px', }}>
      <h5 class="text-center mb-3" style={{ color, fontSize: '0.8rem' }}>{title}</h5>
    </div>
  )
}

export default Engranajes