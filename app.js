// ---- GC Epox-Design • Calculateur (250 g/m² @ 80 µm) ----
document.addEventListener('DOMContentLoaded', () => {
  const out = document.getElementById('texteResultat');
  const sEl = document.getElementById('surface');
  const tEl = document.getElementById('epaisseur');
  const rEl = document.getElementById('rendement');
  const pEl = document.getElementById('prix');

  const REF_UM = 80;      // µm
  const BASE_G_M2 = 250;  // g/m² déposés à 80 µm

  function calc(){
    const A = parseFloat(sEl.value);
    const t = parseFloat(tEl.value);
    const R = parseFloat(rEl.value);
    const P = parseFloat(pEl.value);

    if ([A,t,R].some(v => isNaN(v) || v <= 0) || R>100) {
      out.textContent = "⚠️ Valeurs invalides (surface, épaisseur, rendement 1–100%).";
      return;
    }

    const g_per_m2 = BASE_G_M2 * (t / REF_UM);   // g/m² à l'épaisseur choisie
    const kg_theo  = (A * g_per_m2) / 1000;      // masse déposée (kg) à 100%
    const kg_reel  = kg_theo / (R/100);          // quantité à pulvériser
    const kg_marge = kg_reel * 1.05;             // +5%
    const m2_par_kg = 1000 / g_per_m2;

    const prix_reel = !isNaN(P) ? (kg_reel * P) : null;
    const prix_marge = !isNaN(P) ? (kg_marge * P) : null;

    out.innerHTML = `
      <ul>
        <li>Base : <b>${BASE_G_M2} g/m²</b> à <b>${REF_UM} µm</b> → à ${t} µm : <b>${g_per_m2.toFixed(0)} g/m²</b></li>
        <li>Théorique (déposé 100%) : <b>${kg_theo.toFixed(3)} kg</b></li>
        <li>À pulvériser (rendement ${R}%) : <b>${kg_reel.toFixed(3)} kg</b></li>
        <li>+ marge 5% : <b>${kg_marge.toFixed(3)} kg</b></li>
      </ul>
      <p><small>Couverture ≈ ${m2_par_kg.toFixed(2)} m²/kg à ${t} µm.</small></p>
      ${!isNaN(P) ? `<p><small>Coût : ${kg_reel.toFixed(3)} kg × ${P.toFixed(2)} €/kg = <b>${prix_reel.toFixed(2)} €</b> (marge 5% → <b>${prix_marge.toFixed(2)} €</b>).</small></p>` : ``}
    `;
  }

  document.getElementById('calculer').addEventListener('click', calc);
  document.getElementById('reinitialiser').addEventListener('click', ()=>{
    sEl.value=''; tEl.value=80; rEl.value=70; pEl.value='';
    out.textContent="Entrez vos valeurs pour commencer.";
  });
});
