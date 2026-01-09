const repoOwner = "arthurfontainecom-wq";
const repoName = "Fiche-Securite-Final";

// 1. TES RECHERCHES ASSOCIÉES (SYNONYMES)
const synonymes = {
    "caca": "etron poop merde",
    "acide_chlorhydrique": "hcl danger corrosif acide fort",
    "ethanol": "alcool inflammable nettoyage",
    "acetone": "solvant vernis inflammable"
};

// 2. CHARGER ET AFFICHER LES PDF
async function chargerFiches() {
    const listElement = document.getElementById('pdfList');
    try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/fiches`);
        const files = await response.json();
        
        if (!Array.isArray(files)) return;
        listElement.innerHTML = "";

        files.forEach(file => {
            if (file.name.toLowerCase().endsWith('.pdf')) {
                const li = document.createElement('li');
                const idFichier = file.name.replace('.pdf', '').toLowerCase();
                const nomAffiche = idFichier.replace(/_/g, ' ').replace(/-/g, ' ');
                
                // On attache les synonymes pour la recherche
                const tags = synonymes[idFichier] || "";
                li.setAttribute('data-keywords', tags);
                
                li.innerHTML = `<a href="${file.download_url}" target="_blank">${nomAffiche}</a>`;
                listElement.appendChild(li);
            }
        });
    } catch (e) {
        listElement.innerHTML = "<li>Erreur de chargement.</li>";
    }
}

// 3. FONCTION D'UPLOAD (REMPLACE NETLIFY)
async function uploadPDF() {
    const title = document.getElementById('fileTitle').value.trim();
    const file = document.getElementById('fileInput').files[0];
    const token = document.getElementById('ghToken').value;
    const status = document.getElementById('uploadStatus');

    if (!title || !file || !token) {
        status.innerText = "⚠️ Remplissez tous les champs (Nom, Fichier, Token).";
        return;
    }

    const fileName = title.replace(/\s+/g, '_').toLowerCase() + ".pdf";
    const reader = new FileReader();

    reader.onload = async () => {
        const content = reader.result.split(',')[1]; // Base64
        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/fiches/${fileName}`;

        status.innerText = "⏳ Envoi en cours...";

        const response = await fetch(url, {
            method: "PUT",
            headers: { "Authorization": `token ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                message: `Ajout de la fiche ${title}`,
                content: content
            })
        });

        if (response.ok) {
            status.innerText = "✅ Succès ! Le PDF est en ligne. Rafraîchissez dans 1 min.";
            chargerFiches();
        } else {
            status.innerText = "❌ Erreur. Vérifiez votre Token ou le nom du fichier.";
        }
    };
    reader.readAsDataURL(file);
}

// 4. BARRE DE RECHERCHE
document.getElementById('searchBar').addEventListener('input', function() {
    const filter = this.value.toLowerCase();
    document.querySelectorAll('#pdfList li').forEach(item => {
        const text = item.textContent.toLowerCase();
        const tags = item.getAttribute('data-keywords') || "";
        item.style.display = (text.includes(filter) || tags.includes(filter)) ? "" : "none";
    });
});

document.addEventListener('DOMContentLoaded', chargerFiches);
