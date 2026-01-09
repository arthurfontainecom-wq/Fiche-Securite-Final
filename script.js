const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-Securite-Final"; // VERIFIE BIEN CE NOM

async function chargerFiches() {
  const listElement = document.getElementById('pdfList');
  // L'URL utilise des backticks ` pour que les variables fonctionnent
  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/fiches?ref=main`;

  try {
    const response = await fetch(url);
    const files = await response.json();
    
    if (!Array.isArray(files)) {
      throw new Error("Le dossier 'fiches' est introuvable ou vide.");
    }

    listElement.innerHTML = ""; // On vide le message de chargement

    files.forEach(file => {
      // On ne prend que les fichiers qui finissent par .pdf
      if (file.name.toLowerCase().endsWith('.pdf')) {
        const li = document.createElement('li');
        // On nettoie le nom pour l'affichage
        const nomAffiche = file.name.replace('.pdf', '').replace(/_/g, ' ').replace(/-/g, ' ');
        li.innerHTML = `<a href="${file.download_url}" target="_blank">${nomAffiche}</a>`;
        listElement.appendChild(li);
      }
    });
  } catch (e) {
    console.log("Erreur :", e);
    listElement.innerHTML = "<li>Aucun PDF trouvé dans le dossier 'fiches'.</li>";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  chargerFiches();

  // Barre de recherche
  const searchBar = document.getElementById('searchBar');
  if (searchBar) {
    searchBar.addEventListener('input', function() {
      const filter = this.value.toLowerCase();
      const items = document.getElementById('pdfList').getElementsByTagName('li');
      for (let item of items) {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(filter) ? "" : "none";
      }
    });
  }
});
