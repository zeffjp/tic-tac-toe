import React, { useState, useRef, useEffect } from 'react';
import { MoteurJeu } from './moteur/moteur_jeu';
import { Board } from './composant/board';
import { jouerFacile } from './ai/ia_facile';
import { jouerMoyenne } from './ai/ia_moyenne';
import { jouerMinimax } from './ai/ia_difficile';
import './App.css';

export default function App() {
  const moteurRef = useRef(null);
  const [etat, setEtat] = useState(null);
  const [etape, setEtape] = useState('menu');
  const [mode, setMode] = useState(null);
  const [difficulte, setDifficulte] = useState(null);
  const [historique, setHistorique] = useState({ joueur: [], ia: [] });
  const [score, setScore] = useState({ X: 0, O: 0 });

  useEffect(() => {
    if (etat?.terminé && etat.gagnant) {
      if (etat.gagnant !== 'nul') {
        setScore((s) => ({ ...s, [etat.gagnant]: s[etat.gagnant] + 1 }));
      }
      setHistorique((h) => ({
        ...h,
        [mode]: [
          ...h[mode],
          {
            gagnant: etat.gagnant,
            difficulte: difficulte,
            date: new Date().toLocaleTimeString()
          }
        ]
      }));
    }
  }, [etat?.terminé]);

  const initialiserMoteur = () => {
    moteurRef.current = new MoteurJeu({
      onEtatChange: (etat) => setEtat(etat)
    });
    moteurRef.current.reset();
  };

  const handleChoixMode = (choix) => {
    setMode(choix);
    if (choix === 'joueur') {
      setEtape('jeu');
      initialiserMoteur();
    } else {
      setEtape('difficulte');
    }
  };

  const handleChoixDifficulte = (niveau) => {
    setDifficulte(niveau);
    setEtape('jeu');
    initialiserMoteur();
  };

  const jouerCoup = (index) => {
    if (!moteurRef.current || etat.terminé) return;
    const ok = moteurRef.current.jouerCoup(index);

    if (ok && mode === 'ia' && moteurRef.current.joueurActuel === 'O' && !etat.terminé) {
      setTimeout(() => {
        let coupIA = null;
        if (difficulte === 'facile') {
          coupIA = jouerFacile(moteurRef.current.grille);
        } else if (difficulte === 'moyenne') {
          coupIA = jouerMoyenne(moteurRef.current.grille, 'O');
        } else if (difficulte === 'difficile') {
          coupIA = jouerMinimax(moteurRef.current.grille, 'O');
        }
        moteurRef.current.jouerCoup(coupIA);
      }, 300);
    }
  };

  const redemarrer = () => {
    moteurRef.current?.reset();
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Tic Tac Toe ⚔️</h1>

      {etape === 'menu' && (
        <div>
          <h2>Choisir un mode</h2>
          <button onClick={() => handleChoixMode('joueur')}>Joueur vs Joueur</button>
          <button onClick={() => handleChoixMode('ia')}>Joueur vs IA</button>
        </div>
      )}

      {etape === 'difficulte' && (
        <div>
          <h2>Choisir la difficulté</h2>
          <button onClick={() => handleChoixDifficulte('facile')}>Facile</button>
          <button onClick={() => handleChoixDifficulte('moyenne')}>Moyenne</button>
          <button onClick={() => handleChoixDifficulte('difficile')}>Difficile</button>
        </div>
      )}

      {etape === 'jeu' && etat && (
        <div>
          <div style={{ display: 'inline-block', color: 'black' }}>
            <Board grille={etat.grille} onClick={jouerCoup} victoire={[]} />
          </div>
          <p>
            {etat.terminé
              ? etat.gagnant === 'nul'
                ? "Match nul !"
                : `Victoire de ${etat.gagnant} 🎉`
              : `Au tour de ${etat.joueurActuel}`}
          </p>
          <button onClick={redemarrer}>🔄 Rejouer</button>
          <button onClick={() => setEtape('menu')}>🏠 Retour au menu</button>

          <div style={{ marginTop: '20px' }}>
            <h3>Score</h3>
            <p>X : {score.X} | O : {score.O}</p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>Historique Joueur vs Joueur</h3>
            <ul>
              {historique.joueur.map((item, index) => (
                <li key={index}>
                  {item.date} - {item.gagnant === 'nul' ? 'Match nul' : `Victoire de ${item.gagnant}`}
                </li>
              ))}
            </ul>

            <h3>Historique Joueur vs IA</h3>
            <ul>
              {historique.ia.map((item, index) => (
                <li key={index}>
                  {item.date} - {item.gagnant === 'nul'
                    ? 'Match nul'
                    : `Victoire de ${item.gagnant} (${item.difficulte})`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}