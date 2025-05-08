export function jouerFacile(grille) {
    const casesLibres = grille
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);
    return casesLibres[Math.floor(Math.random() * casesLibres.length)];
  }