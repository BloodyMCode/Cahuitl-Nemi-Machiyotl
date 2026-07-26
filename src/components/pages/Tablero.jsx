import React, { useState, useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Estilos.css'
import { getImagePath, tonalliSimbolos, orientation, handleCategoryChange, getCellClass, revNumbers } from '../funtions/funtions'

const Tablero = () => {
  const revOrientation = [...orientation].toReversed()//invertir el orden
  // Estado para los checkboxes y celdas seleccionadas
  const [selectedCategories, setSelectedCategories] = useState({
    animales: false,
    naturales: false,
    cosas: false,
    abstractos: false,
    vegetales: false
  })
  const [board, setBoard] = useState([])
  const [featuredCells, setFeaturedCells] = useState(new Set())
  const tableContainerRef = useRef(null)
  //Inicializar tablero
  useEffect(() => {
    const initializeBoard = () => {
      const newBoard = []
      let imageIndex = 0
      const reversedImages = [...tonalliSimbolos].toReversed()//invertir el orden de simbolos
      //console.log(reversedImages)
      for (let row = 0; row < 5; row++) {
        const newRow = []
        for (let col = 0; col < 52; col++) {
          newRow.push({
            ...reversedImages[imageIndex % reversedImages.length],
            row,
            col
          })
          imageIndex++ //aumentar posicion del tablero hasta 260
          //console.log(imageIndex)
        }
        newBoard.push(newRow)
      }
      setBoard(newBoard)
    }
    initializeBoard()
  }, [])

  // Actualizar celdas cuando cambian las categorías
  useEffect(() => {
    const updateFeaturedCells = () => {
      const newFeaturedCells = new Set()
      // Si no hay categorías seleccionadas, no destacar nada
      if (!selectedCategories.animales & !selectedCategories.naturales && !selectedCategories.cosas && !selectedCategories.abstractos && !selectedCategories.vegetales) {
        setFeaturedCells(newFeaturedCells)
        return
      }
      //Recorrer todas las celdas y marcar las que coincidan con las categorías seleccionadas
      board.forEach(row => {
        row.forEach(cell => {
          if (selectedCategories[cell.category]) {
            const cellId = `${cell.row}-${cell.col}`
            newFeaturedCells.add(cellId)
          }
        })
      })
      setFeaturedCells(newFeaturedCells)
    }
    updateFeaturedCells()
  }, [selectedCategories, board])

  // Scroll to the rightmost column when the board data is loaded
  useEffect(() => {
    if (board.length > 0 && tableContainerRef.current) {
      const timer = setTimeout(() => {
        if (tableContainerRef.current) {
          tableContainerRef.current.scrollLeft = tableContainerRef.current.scrollWidth;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [board]);


  return (
    <>
      <div className="container text-center">
        <h1 className="text-center mb-4">Tablero de Glifos</h1>
        <div className="row justify-content-center mb-4">
          <h5 className="text-center mb-4">Categorias</h5>
          <div className={`col-md-2 p-2 rounded ${selectedCategories.animales ? 'cell-animales' : ''}`} style={{ transition: 'all 0.3s ease' }}>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="checkAnimal" checked={selectedCategories.animales} onChange={() => handleCategoryChange('animales', setSelectedCategories)} />
              <label className="form-check-label" htmlFor="checkAnimal">Animales</label>
            </div>
          </div>
          <div className={`col-md-2 p-2 rounded ${selectedCategories.naturales ? 'cell-naturales' : ''}`} style={{ transition: 'all 0.3s ease' }}>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="checkNaturales" checked={selectedCategories.naturales} onChange={() => handleCategoryChange('naturales', setSelectedCategories)} />
              <label className="form-check-label" htmlFor="checkNaturales">Naturales</label>
            </div>
          </div>
          <div className={`col-md-2 p-2 rounded ${selectedCategories.cosas ? 'cell-cosas' : ''}`} style={{ transition: 'all 0.3s ease' }}>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="checkCosas" checked={selectedCategories.cosas} onChange={() => handleCategoryChange('cosas', setSelectedCategories)} />
              <label className="form-check-label" htmlFor="checkCosas">Objetos</label>
            </div>
          </div>
          <div className={`col-md-2 p-2 rounded ${selectedCategories.abstractos ? 'cell-abstractos' : ''}`} style={{ transition: 'all 0.3s ease' }}>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="checkAbstractos" checked={selectedCategories.abstractos} onChange={() => handleCategoryChange('abstractos', setSelectedCategories)} />
              <label className="form-check-label" htmlFor="checkAbstractos">Abstractos</label>
            </div>
          </div>
          <div className={`col-md-2 p-2 rounded ${selectedCategories.vegetales ? 'cell-vegetales' : ''}`} style={{ transition: 'all 0.3s ease' }}>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="checkVegetales" checked={selectedCategories.vegetales} onChange={() => handleCategoryChange('vegetales', setSelectedCategories)} />
              <label className="form-check-label" htmlFor="checkVegetales">Vegetales</label>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <h5 className="text-center mb-4">Tablero</h5>
        <div className="row mb-4">
          <div className="col-12">
            <div className="table-responsive" ref={tableContainerRef} style={{ overflowX: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    {Array.from({ length: 52 }).map((_, index) => {
                      const cardinality = revOrientation[index % revOrientation.length]/* revOrientation[ ... ]acceso al elemento del array, .length obtiene el número de elementos en el array, % operador módulo en ciclos repetitivos funciona como un contador cíclico o un detector de múltiplos, Ejecutar código cada N iteraciones, en este caso repetir bucle ENOS en array de 52 posiciones*/
                      if (cardinality === 'Este') { //condicional para marcar inicio de cardinalidad
                        return (<th key={index} scope="col" style={{ color: '#047ff3' }}>{cardinality}</th>)
                      }
                      return (<th key={index} scope="col">{cardinality}</th>)
                    })}
                  </tr>
                  <tr>
                    {Array.from({ length: 52 }).map((_, index) => {
                      const digit = revNumbers[index % revNumbers.length]
                      if (digit === '1') {//condicional para marcar inicio de trecena
                        return (<th key={index} scope="col" style={{ backgroundColor: '#015223', color: '#f6f7f6' }}>{digit}</th>)
                      }
                      return (<th key={index} scope="col">{digit}</th>)
                    })}
                  </tr>
                </thead>
                <tbody>
                  {board.map((row, rowIndex) => (//generar tablero
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => (
                        <td key={`${rowIndex}-${colIndex}`} className={`text-center ${getCellClass(cell, featuredCells, revNumbers)}`}>
                          <div><img src={getImagePath(cell.image)} alt={cell.image} className="img-com" /* className="card-img-top img-com" */ /></div>
                          {/* condicional en el nombre para diferenciar el inicio de veintena */}
                          {cell.name === 'Lagarto' ? <small className="d-block" style={{ fontSize: '0.6rem', color: '#a30101', fontWeight: 'bold' }}>{cell.name}</small> : <small className="d-block" style={{ fontSize: '0.5rem' }}>{cell.name}</small>}
                          {/* <small className="d-block" style={{fontSize:'0.5rem'}}>{cell.name}</small> */}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Tablero