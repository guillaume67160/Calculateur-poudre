// ---- GC Epox-Design • Calculateur (réf. 250 g/m² à 80 µm) ----
document.addEventListener('DOMContentLoaded', () => {
  const out   = document.getElementById('texteResultat');
  const sEl   = document.getElementById('surface');
  const tEl   = document.getElementById('epaisseur');
  const rEl   = document.getElementById('rendement');
  const pEl   = document.getElementById('prix');

  // Référence
  const REF_UM     = 80;     // µm
  const BASE_G_M2  = 250;    // g/m² déposés à 80 µm

  function calc() {
    const A = parseFloat(sEl.value);      // m²
    const t = parseFloat(tEl.value);      // µm
    const R = parseFloat(rEl.value);      // %
    const P = parseFloat(pEl.value);      // €/kg (optionnel)

    if ([A,t,R].some(v => isNaN(v) || v <= 0) || R > 100) {
      out.textContent = "⚠️ Valeurs invalides (surface, épaisseur, rendement 1–100%).";
      return;
    }

    // g/m² déposés à l'épaisseur demandée (linéarisation depuis la référence)
    const g_per_m2 = BASE_G_M2 * (t / REF_UM);

    // Masse théorique déposée (kg) si 100 % d'efficacité
    const kg_theorique = (A * g_per_m2) / 1000;

    // Quantité réelle à pulvériser avec les pertes (rendement)
    const kg_reel = kg_theorique / (R / 100);

    // marge 5 %
    const kg_marge = kg_reel * 1.05;

    // couverture m²/kg au réglage choisi
    const m2_par_kg = 1000 / g_per_m2;

    // coût si prix renseigné
    const cout_reel   = isNaN(P) ? null : (kg_reel * P);
    const cout_avec_m = isNaN(P) ? null : (kg_marge * P);

    out.innerHTML = `
      <ul>
        <li>Base : <b>${BASE_G_M2} g/m²</b> à <b>${REF_UM} µm</b> → à ${t} µm : <b>${g_per_m2.toFixed(0)} g/m²</b></li>
        <li>Théorique (déposé, 100%) : <b>${kg_theorique.toFixed(3)} kg</b></li>
        <li>À pulvériser (rendement ${R}%) : <b>${kg_reel.toFixed(3)} kg</b></li>
        <li>+ marge 5% : <b>${kg_marge.toFixed(3)} kg</b></li>
      </ul>
      <p><small>Couverture ≈ ${m2_par_kg.toFixed(2)} m²/kg à ${t} µm.</small></p>
      ${!isNaN(P) ? `
        <p><small>Coût (prix ${P.toFixed(2)} €/kg) :
        ${kg_reel.toFixed(3)} kg → <b>${cout_reel.toFixed(2)} €</b>,
        avec marge 5% → <b>${cout_avec_m.toFixed(2)} €</b>.</small></p>` : ``}
    `;
  }

  // Actions
  document.getElementById('calculer').addEventListener('click', calc);
  document.getElementById('reinitialiser').addEventListener('click', () => {
    sEl.value = '';
    tEl.value = 80;
    rEl.value = 70;
    pEl.value = '';
    out.textContent = "Entrez vos valeurs pour commencer.";
  });
});
