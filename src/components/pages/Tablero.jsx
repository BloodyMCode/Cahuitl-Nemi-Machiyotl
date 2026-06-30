import React, { useState, useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { getImagePath } from '../funtions/funtions'



const Tablero = () => {
  const images = [
    { id: 1, name: 'Lagarto', category: 'animales', image: 'lagarto.png' },
    { id: 2, name: 'Viento', category: 'naturales', image: 'viento.png' },
    { id: 3, name: 'Casa', category: 'cosas', image: 'casa.png' },
    { id: 4, name: 'Lagartija', category: 'animales', image: 'lagartija.png' },
    { id: 5, name: 'Serpiente', category: 'animales', image: 'serpiente.png' },
    { id: 6, name: 'Muerte', category: 'abstractos', image: 'muerte.png' },
    { id: 7, name: 'Venado', category: 'animales', image: 'venado.png' },
    { id: 8, name: 'Conejo', category: 'animales', image: 'conejo.png' },
    { id: 9, name: 'Agua', category: 'naturales', image: 'agua.png' },
    { id: 10, name: 'Perro', category: 'animales', image: 'perro.png' },
    { id: 11, name: 'Mono', category: 'animales', image: 'mono.png' },
    { id: 12, name: 'Hierba', category: 'vegetales', image: 'hierba.png' },
    { id: 13, name: 'Caña', category: 'vegetales', image: 'caña.png' },
    { id: 14, name: 'Jaguar', category: 'animales', image: 'jaguar.png' },
    { id: 15, name: 'Águila', category: 'animales', image: 'aguila.png' },
    { id: 16, name: 'Zopilote', category: 'animales', image: 'zopilote.png' },
    { id: 17, name: 'Movimiento', category: 'abstractos', image: 'movimiento.png' },
    { id: 18, name: 'Pedernal', category: 'cosas', image: 'pedernal.png' },
    { id: 19, name: 'Lluvia', category: 'naturales', image: 'lluvia.png' },
    { id: 20, name: 'Flor', category: 'vegetales', image: 'flor.png' }
  ]
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"]
  const revNumbers = [...numbers].toReversed()//invertir el orden
  const orientation = ['Este', 'Norte', 'Oeste', 'Sur']
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
      const reversedImages = [...images].toReversed()//invertir el orden de simbolos
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
  /*  useEffect(()=>{
     const initializeBoard=()=>{
       const newBoard =[]
       let imageIndex=0
       for(let row = 0;row < 5;row++){
         const newRow=[]
         for(let col = 0;col < 52;col++){
           newRow.push({
             ...images[imageIndex % images.length],
             row,
             col
           })
           imageIndex++
         }
         newBoard.push(newRow)
       }
       setBoard(newBoard)
     }
     initializeBoard()
   },[]) */
  //Manejo de cambios checkbox
  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }
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

  // Función para destacar celda CSS según la categoría
  const getCellClass = (cell) => {
    const cellId = `${cell.row}-${cell.col}`
    const isFeatured = featuredCells.has(cellId)
    if (isFeatured) {
      switch (cell.category) {
        case 'animales':
          return 'cell-animales text-white'
        case 'naturales':
          return 'cell-naturales text-white'
        case 'cosas':
          return 'cell-cosas text-white'
        case 'abstractos':
          return 'cell-abstractos text-white'
        case 'vegetales':
          return 'cell-vegetales text-white'
        default:
          return ''
      }
    }
    const isColOne = revNumbers[cell.col % revNumbers.length] === '1'
    if (isColOne) {
      return 'bg-column-one'
    }
    return ''
  }
  return (
    <>
      <div className="container text-center">
        <h1 className="text-center mb-4">Tablero de Imágenes</h1>
        <div className="row justify-content-center mb-4">
          <h5 className="text-center mb-4">Categorias</h5>
          <div className={`col-md-2 p-2 rounded ${selectedCategories.animales ? 'cell-animales' : ''}`} style={{ transition: 'all 0.3s ease' }}>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="checkAnimal" checked={selectedCategories.animales} onChange={() => handleCategoryChange('animales')} />
              <label className="form-check-label" htmlFor="checkAnimal">Animales</label>
            </div>
          </div>
          <div className={`col-md-2 p-2 rounded ${selectedCategories.naturales ? 'cell-naturales' : ''}`} style={{ transition: 'all 0.3s ease' }}>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="checkNaturales" checked={selectedCategories.naturales} onChange={() => handleCategoryChange('naturales')} />
              <label className="form-check-label" htmlFor="checkNaturales">Naturales</label>
            </div>
          </div>
          <div className={`col-md-2 p-2 rounded ${selectedCategories.cosas ? 'cell-cosas' : ''}`} style={{ transition: 'all 0.3s ease' }}>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="checkCosas" checked={selectedCategories.cosas} onChange={() => handleCategoryChange('cosas')} />
              <label className="form-check-label" htmlFor="checkCosas">Objetos</label>
            </div>
          </div>
          <div className={`col-md-2 p-2 rounded ${selectedCategories.abstractos ? 'cell-abstractos' : ''}`} style={{ transition: 'all 0.3s ease' }}>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="checkAbstractos" checked={selectedCategories.abstractos} onChange={() => handleCategoryChange('abstractos')} />
              <label className="form-check-label" htmlFor="checkAbstractos">Abstractos</label>
            </div>
          </div>
          <div className={`col-md-2 p-2 rounded ${selectedCategories.vegetales ? 'cell-vegetales' : ''}`} style={{ transition: 'all 0.3s ease' }}>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="checkVegetales" checked={selectedCategories.vegetales} onChange={() => handleCategoryChange('vegetales')} />
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
                        <td key={`${rowIndex}-${colIndex}`} className={`text-center ${getCellClass(cell)}`}>
                          <div><img src={getImagePath(cell.image)} alt={cell.image} className="card-img-top img-com" /></div>
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