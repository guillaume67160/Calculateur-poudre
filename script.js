document.getElementById('calculer').addEventListener('click', () => {
  const surface = parseFloat(document.getElementById('surface').value);
  const e = parseFloat(document.getElementById('epaisseur').value);
  const dens = parseFloat(document.getElementById('densite').value);
  const r = parseFloat(document.getElementById('rendement').value);

  const out = document.getElementById('resultats');

  if (isNaN(surface) || surface <= 0) {
    out.innerHTML = '<p>⚠️ Saisis une surface &gt; 0 m².</p>'; return;
  }
  if (isNaN(e) || e <= 0 || isNaN(dens) || dens <= 0 || isNaN(r) || r <= 0) {
    out.innerHTML = '<p>⚠️ Valeurs invalides (épaisseur, densité, rendement).</p>'; return;
  }

  const couverture = 100 / (e * dens);
  const kg_brut = surface / couverture;
  const kg_reels = kg_brut / (r / 100);
  const kg_marge = kg_reels * 1.05;

  out.innerHTML = `
    <p><strong>Quantité estimée :</strong></p>
    <ul>
      <li>Théorique (sans pertes) : <strong>${kg_brut.toFixed(3)} kg</strong></li>
      <li>Avec rendement ${r}% : <strong>${kg_reels.toFixed(3)} kg</strong></li>
      <li>+ marge 5% : <strong>${kg_marge.toFixed(3)} kg</strong></li>
    </ul>
    <p><small>Couverture ≈ ${couverture.toFixed(2)} m²/kg à ${e} µm et densité ${dens} g/cm³.</small></p>
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
