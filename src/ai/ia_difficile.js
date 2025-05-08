export function jouerMinimax(grille, joueur) {
    const adversaire = joueur === 'X' ? 'O' : 'X';
  
    function evaluer(grille, joueur, adversaire) {
      const lignes = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ];
  
      for (let [a,b,c] of lignes) {
        if (grille[a] && grille[a] === grille[b] && grille[b] === grille[c]) {
          if (grille[a] === joueur) return 10;
          else if (grille[a] === adversaire) return -10;
        }
      }
  
      if (!grille.includes(null)) return 0;
      return null;
    }
  
    function minimax(grille, profondeur, isMaximizing, alpha, beta) {
      const score = evaluer(grille, joueur, adversaire);
      if (score !== null || profondeur === 0) return score;
  
      const coups = grille
        .map((v, i) => (v === null ? i : null))
        .filter((v) => v !== null);
  
      if (isMaximizing) {
        let maxEval = -Infinity;
        for (let coup of coups) {
          const copie = [...grille];
          copie[coup] = joueur;
          const scoreInterne = minimax(copie, profondeur - 1, false, alpha, beta);
          maxEval = Math.max(maxEval, scoreInterne);
          alpha = Math.max(alpha, scoreInterne);
          if (beta <= alpha) break;
        }
        return maxEval;
      } else {
        let minEval = Infinity;
        for (let coup of coups) {
          const copie = [...grille];
          copie[coup] = adversaire;
          const scoreInterne = minimax(copie, profondeur - 1, true, alpha, beta);
          minEval = Math.min(minEval, scoreInterne);
          beta = Math.min(beta, scoreInterne);
          if (beta <= alpha) break;
        }
        return minEval;
      }
    }
  
    let meilleurScore = -Infinity;
    let meilleurCoup = null;
    const coupsPossibles = grille
      .map((v, i) => (v === null ? i : null))
      .filter((v) => v !== null);
  
    for (let coup of coupsPossibles) {
      const copie = [...grille];
      copie[coup] = joueur;
      const scoreInterne = minimax(copie, 6, false, -Infinity, Infinity);
      if (scoreInterne > meilleurScore) {
        meilleurScore = scoreInterne;
        meilleurCoup = coup;
      }
    }
  
    return meilleurCoup;
  }
  