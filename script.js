const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-Securite-Final"; // Vérifie que c'est bien le nom de ton nouveau repo

async function chargerFiches() {
  const listElement = document.getElementById('pdfList');
  if (!listElement) return; // Sécurité si l'élément n'existe pas

  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/fiches?ref=main`;

  try {
    const response = await fetch(url);
    
    // Si GitHub renvoie une erreur (ex: dossier fiches inexistant)
    if (!response.ok) {
      throw new Error(`Erreur GitHub: ${response.status}`);
    }

    const files = await response.json();
    
    // On vérifie que c'est bien une liste de fichiers
    if (!Array.isArray(files)) {
      listElement.innerHTML = "<li>Le dossier 'fiches' est vide ou mal configuré.</li>";
      return;
    }

    listElement.innerHTML = ""; // On vide le message de chargement

    let hasPdf = false;

    files.forEach(file => {
      // FORCE LA VÉRIFICATION : Uniquement les fichiers finissant par .pdf
      if (file.name && file.name.toLowerCase().endsWith('.pdf')) {
        hasPdf = true;
        const li = document.createElement('li');
        
        // Nettoyage du nom pour l'affichage
        const nomAffiche = file.name
          .replace(/\.[^/.]+$/, "") // Enlève l'extension proprement
          .replace(/_/g, ' ')
          .replace(/-/g, ' ');
        
        li.innerHTML = `<a href="${file.download_url}" target="_blank" rel="noopener noreferrer">${nomAffiche}</a>`;
        listElement.appendChild(li);
      }
    });

    if (!hasPdf) {
      listElement.innerHTML = "<li>Aucun fichier PDF trouvé dans le dossier.</li>";
    }

  } catch (e) {
    console.error("Erreur de chargement:", e);
    listElement.innerHTML = "<li>Impossible de charger les fiches. Vérifiez le dossier 'fiches'.</li>";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  chargerFiches();

  // Barre de recherche sécurisée
  const searchBar = document.getElementById('searchBar');
  if (searchBar) {
    searchBar.addEventListener('input', function() {
      const filter = this.value.toLowerCase();
      const items = document.querySelectorAll('#pdfList li');
      
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(filter) ? "" : "none";
      });
    });
  }
});
