export function jouerMoyenne(grille, joueur) {
  const casesLibres = grille
    .map((val, idx) => (val === null ? idx : null))
    .filter((val) => val !== null);

  // Gagner ?
  for (let idx of casesLibres) {
    const copie = [...grille];
    copie[idx] = joueur;
    if (verifierVictoire(copie, joueur)) return idx;
  }

  // Bloquer l'adversaire s'il va gagner
  const adversaire = joueur === 'X' ? 'O' : 'X';
  for (let idx of casesLibres) {
    const copie = [...grille];
    copie[idx] = adversaire;
    if (verifierVictoire(copie, adversaire)) return idx;
  }

  // Jouer aléatoirement
  return casesLibres[Math.floor(Math.random() * casesLibres.length)];
}

function verifierVictoire(grille, joueur) {
  const lignes = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return lignes.some(([a, b, c]) =>
    grille[a] === joueur && grille[b] === joueur && grille[c] === joueur
  );
}