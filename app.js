document.addEventListener('DOMContentLoaded', () => {
  const out = document.getElementById('texteResultat');

  function calc() {
    const A   = parseFloat(document.getElementById('surface').value);
    const t   = parseFloat(document.getElementById('epaisseur').value);
    const rho = parseFloat(document.getElementById('densite').value);
    const R   = parseFloat(document.getElementById('rendement').value);

    if ([A,t,rho,R].some(v => isNaN(v) || v<=0) || R>100) {
      out.textContent = "⚠️ Valeurs invalides (surface, épaisseur, densité, rendement 1–100%)."; return;
    }

    const kg_theorique  = A * t * rho / 1000;
    const kg_pulveriser = kg_theorique / (R/100);
    const kg_marge      = kg_pulveriser * 1.05;
    const couverture    = 1000 / (t * rho);

    out.innerHTML = `
      <ul>
        <li>Théorique (sans pertes) : <b>${kg_theorique.toFixed(3)} kg</b></li>
        <li>À pulvériser (rendement ${R}%) : <b>${kg_pulveriser.toFixed(3)} kg</b></li>
        <li>+ marge 5% : <b>${kg_marge.toFixed(3)} kg</b></li>
      </ul>
      <p><small>Couverture théorique ≈ ${couverture.toFixed(2)} m²/kg à ${t} µm et densité ${rho} g/cm³.</small></p>
    `;
  }

  document.getElementById('calculer').addEventListener('click', calc);
  document.getElementById('reinitialiser').addEventListener('click', () => {
    document.getElementById('surface').value = '';
    document.getElementById('epaisseur').value = 80;
    document.getElementById('densite').value = 1.50;
    document.getElementById('rendement').value = 60;
    out.textContent = "Entrez vos valeurs pour commencer.";
  });
});
