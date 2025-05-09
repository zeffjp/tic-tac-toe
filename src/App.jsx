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
  const [historique, setHistorique] = useState({ joueur: [], ia: { facile: [], moyenne: [], difficile: [] } });
  const [score, setScore] = useState({
    joueur: { X: 0, O: 0 },
    ia: { facile: { X: 0, O: 0 }, moyenne: { X: 0, O: 0 }, difficile: { X: 0, O: 0 } }
  });

  // Lorsqu'une partie se termine, on met à jour l'historique et le score
  useEffect(() => {
    if (etat?.terminé && etat.gagnant) {
      if (etat.gagnant !== 'nul') {
        setScore((s) => ({
          ...s,
          [mode]: mode === 'ia' ? {
            ...s[mode],
            [difficulte]: {
              ...s[mode][difficulte],
              [etat.gagnant]: s[mode][difficulte][etat.gagnant] + 1
            }
          } : {
            ...s[mode],
            [etat.gagnant]: s[mode][etat.gagnant] + 1
          }
        }));
      }
      setHistorique((h) => ({
        ...h,
        [mode]: mode === 'ia' ? {
          ...h[mode],
          [difficulte]: [
            ...h[mode][difficulte],
            {
              gagnant: etat.gagnant,
              difficulte: difficulte,
              date: new Date().toLocaleTimeString()
            }
          ]
        } : [
          ...h[mode],
          {
            gagnant: etat.gagnant,
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

    // L'IA joue immédiatement si elle commence (joueur 'O')
    if (mode === 'ia' && moteurRef.current.joueurActuel === 'O') {
      setTimeout(() => {
        let coupIA = null;
        if (difficulte === 'facile') {
          coupIA = jouerFacile(moteurRef.current.grille);
        } else if (difficulte === 'moyenne') {
          coupIA = jouerMoyenne(moteurRef.current.grille, 'O');
        } else if (difficulte === 'difficile') {
          coupIA = jouerMinimax(moteurRef.current.grille, 'O');
        }
        moteurRef.current.jouerCoup(coupIA); // L'IA joue ici
      }, 100); // Petit délai pour que React mette à jour l'interface avant l'action de l'IA
    }
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

    // Si l'IA joue en premier, on empêche le joueur de jouer tant qu'elle n'a pas joué
    if (mode === 'ia' && moteurRef.current.joueurActuel === 'O') return;

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
        moteurRef.current.jouerCoup(coupIA); // L'IA joue ici
      }, 300); // Le délai pour que l'IA joue
    }
  };

  const redemarrer = () => {
    moteurRef.current?.reset();
    initialiserMoteur(); // Redémarrer et réinitialiser le moteur pour laisser l'IA jouer si elle commence
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

          {/* Afficher le bouton "Changer de niveau" seulement si mode IA */}
          {mode === 'ia' && (
            <button onClick={() => setEtape('difficulte')}>Changer de niveau</button>
          )}

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3>Score Joueur vs Joueur</h3>
              <p>X : {score.joueur.X} | O : {score.joueur.O}</p>
            </div>
            <div>
              <h3>Score Joueur vs IA - Facile</h3>
              <p>X : {score.ia.facile.X} | O : {score.ia.facile.O}</p>
            </div>
            <div>
              <h3>Score Joueur vs IA - Moyenne</h3>
              <p>X : {score.ia.moyenne.X} | O : {score.ia.moyenne.O}</p>
            </div>
            <div>
              <h3>Score Joueur vs IA - Difficile</h3>
              <p>X : {score.ia.difficile.X} | O : {score.ia.difficile.O}</p>
            </div>
          </div>

          {mode === 'joueur' && (
            <div style={{ marginTop: '20px' }}>
              <h3>Historique Joueur vs Joueur</h3>
              <ul>
                {historique.joueur.map((item, index) => (
                  <li key={index}>
                    {item.date} - {item.gagnant === 'nul' ? 'Match nul' : `Victoire de ${item.gagnant}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mode === 'ia' && (
            <div style={{ marginTop: '20px' }}>
              <h3>Historique Joueur vs IA - Facile</h3>
              <ul>
                {historique.ia.facile.map((item, index) => (
                  <li key={index}>
                    {item.date} - {item.gagnant === 'nul'
                      ? 'Match nul'
                      : `Victoire de ${item.gagnant} (${item.difficulte})`}
                  </li>
                ))}
              </ul>

              <h3>Historique Joueur vs IA - Moyenne</h3>
              <ul>
                {historique.ia.moyenne.map((item, index) => (
                  <li key={index}>
                    {item.date} - {item.gagnant === 'nul'
                      ? 'Match nul'
                      : `Victoire de ${item.gagnant} (${item.difficulte})`}
                  </li>
                ))}
              </ul>

              <h3>Historique Joueur vs IA - Difficile</h3>
              <ul>
                {historique.ia.difficile.map((item, index) => (
                  <li key={index}>
                    {item.date} - {item.gagnant === 'nul'
                      ? 'Match nul'
                      : `Victoire de ${item.gagnant} (${item.difficulte})`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
