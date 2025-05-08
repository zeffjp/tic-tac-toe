export class MoteurJeu {
    constructor({ onEtatChange }) {
      this.onEtatChange = onEtatChange;
      this.reset();
    }
  
    reset() {
      this.grille = Array(9).fill(null);
      this.joueurActuel = Math.random() < 0.5 ? 'X' : 'O'; // 👈 Choix aléatoire
      this.terminé = false;
      this.gagnant = null;
      this.onEtatChange(this.getEtat());
    }
    
  
    getEtat() {
      return {
        grille: this.grille,
        joueurActuel: this.joueurActuel,
        terminé: this.terminé,
        gagnant: this.gagnant,
      };
    }
  
    jouerCoup(index) {
      if (this.terminé || this.grille[index]) return false;
  
      this.grille[index] = this.joueurActuel;
      this.verifierFin();
  
      if (!this.terminé) {
        this.joueurActuel = this.joueurActuel === 'X' ? 'O' : 'X';
      }
  
      this.onEtatChange(this.getEtat());
      return true;
    }
  
    verifierFin() {
      const lignes = [
        [0,1,2], [3,4,5], [6,7,8], // lignes
        [0,3,6], [1,4,7], [2,5,8], // colonnes
        [0,4,8], [2,4,6],          // diagonales
      ];
  
      for (let [a, b, c] of lignes) {
        if (this.grille[a] && this.grille[a] === this.grille[b] && this.grille[a] === this.grille[c]) {
          this.terminé = true;
          this.gagnant = this.grille[a];
          return;
        }
      }
  
      if (!this.grille.includes(null)) {
        this.terminé = true;
        this.gagnant = 'nul';
      }
    }
  }
  