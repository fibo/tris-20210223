import React, { useCallback } from 'react'
import classNames from 'classnames'

const TrisCell = ({ userOneSelectedCell, cellIdx, handleClickCell }) => {
  return (
    <div
      className={classNames('tris__cell', {
        'tris__cell--selected': userOneSelectedCell
      })}
      onClick={handleClickCell(cellIdx)}
    />
  )
}

const TrisComponent = ({ selectedCells = [], setSelectedCells = () => {} }) => {
  const handleClickCell = useCallback(
    (idx) => () => {
      if (!selectedCells.includes(idx)) {
        setSelectedCells((selectedCells) => selectedCells.concat(idx))
      }
    },
    [setSelectedCells]
  )

  return (
    <div className='tris'>
      <div className='tris__row'>
        {[0, 1, 2].map((idx) => (
          <TrisCell
            userOneSelectedCell
            key={idx}
            cellIdx={idx}
            handleClickCell={handleClickCell}
          />
        ))}
      </div>
      <div className='tris__row'>
        {[3, 4, 5].map((idx) => (
          <TrisCell
            userOneSelectedCell
            key={idx}
            cellIdx={idx}
            handleClickCell={handleClickCell}
          />
        ))}
      </div>
      <div className='tris__row'>
        {[6, 7, 8].map((idx) => (
          <TrisCell key={idx} cellIdx={idx} handleClickCell={handleClickCell} />
        ))}
      </div>
    </div>
  )
}

export default TrisComponent
