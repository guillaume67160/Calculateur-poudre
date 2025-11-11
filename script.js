document.getElementById('calculer').addEventListener('click', () => {
  const surface = parseFloat(document.getElementById('surface').value);
  const e = parseFloat(document.getElementById('epaisseur').value);    // µm
  const dens = parseFloat(document.getElementById('densite').value);   // g/cm³
  const r = parseFloat(document.getElementById('rendement').value);    // %

  const out = document.getElementById('resultats');

  if (isNaN(surface) || surface <= 0) {
    out.innerHTML = '<p>⚠️ Saisis une surface &gt; 0 m².</p>'; return;
  }
  if (isNaN(e) || e <= 0 || isNaN(dens) || dens <= 0 || isNaN(r) || r <= 0 || r > 100) {
    out.innerHTML = '<p>⚠️ Valeurs invalides (épaisseur, densité, rendement 1–100%).</p>'; return;
  }

  // Masse théorique (kg) = A(m²) * t(µm) * ρ(g/cm³) / 1000
  const kg_theorique = surface * e * dens / 1000;

  // Quantité à pulvériser = théorique / (rendement/100)
  const kg_a_pulveriser = kg_theorique / (r / 100);

  // Marge 5% (optionnelle)
  const kg_marge = kg_a_pulveriser * 1.05;

  // Couverture m²/kg utile à afficher
  // m²/kg (théorique) = 1000 / (t(µm) * ρ)
  const couverture = 1000 / (e * dens);

  out.innerHTML = `
    <p><strong>Quantité estimée :</strong></p>
    <ul>
      <li>Théorique (sans pertes) : <strong>${kg_theorique.toFixed(3)} kg</strong></li>
      <li>À pulvériser (rendement ${r}%): <strong>${kg_a_pulveriser.toFixed(3)} kg</strong></li>
      <li>+ marge 5% : <strong>${kg_marge.toFixed(3)} kg</strong></li>
    </ul>
    <p><small>Couverture théorique ≈ ${couverture.toFixed(2)} m²/kg à ${e} µm et densité ${dens} g/cm³.</small></p>
  `;
});

document.getElementById('reinitialiser').addEventListener('click', () => {
  ['surface','epaisseur','densite','rendement'].forEach(id => {
    const el = document.getElementById(id);
    if (id === 'epaisseur') el.value = 70;
    else if (id === 'densite') el.value = 1.5;
    else if (id === 'rendement') el.value = 60;
    else el.value = '';
  });
  document.getElementById('resultats').innerHTML = '<p>Entre tes valeurs puis clique sur <strong>Calculer</strong>.</p>';
});
