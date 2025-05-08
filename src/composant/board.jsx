import React from 'react';
import './Board.css';

export function Board({ grille, onClick, victoire }) {
  return (
    <div className="board">
      {grille.map((valeur, index) => (
        <button
          key={index}
          className={`cellule ${valeur ? 'remplie' : ''} ${victoire && victoire.includes(index) ? 'gagnant' : ''}`}
          onClick={() => onClick(index)}
        >
          {valeur}
        </button>
      ))}
    </div>
  );
}
