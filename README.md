# Quiz RGIE Belgique 🇧🇪

Une application web interactive pour tester vos connaissances sur le **Règlement Général sur les Installations Électriques (RGIE)** en Belgique.

![React](https://img.shields.io/badge/React-18.2.0-blue.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 📋 Description

Cette application propose un quiz interactif sur le RGIE belge avec différentes catégories de questions, des explications détaillées, et un système de score avec animations de célébration.

### ⚡ Fonctionnalités principales

- **3 catégories de questions** :

  - RGIE - Questions de base (15 questions)
  - RGIE 2019 - Technique avancée (15 questions)
  - Installation électrique (5 questions)

- **Mode sombre/clair** 🌙☀️ avec basculement intuitif
- **Interface moderne** avec sélection de catégories
- **Explications détaillées** pour chaque question
- **Système de score** avec pourcentage
- **Animations de confettis** 🎉 (à partir de 60% de réussite)
- **Design responsive** et accessible
- **Sauvegarde automatique** des préférences utilisateur

## 🚀 Démarrage rapide

### Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn

### Installation

1. **Cloner le repository**

   ```bash
   git clone https://github.com/votre-username/quiz-rgie.git
   cd quiz-rgie
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Lancer l'application**

   ```bash
   npm start
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 📱 Utilisation

### 1. Mode sombre/clair 🌙☀️

- Cliquez sur le bouton 🌙 (en haut à droite) pour activer le mode sombre
- Cliquez sur ☀️ pour revenir au mode clair
- Votre préférence est automatiquement sauvegardée

### 2. Sélection de catégorie

Au démarrage, choisissez parmi les 3 catégories disponibles :

- **RGIE - Questions de base** : Concepts fondamentaux (prise de terre, différentiels, sections...)
- **RGIE 2019 - Technique avancée** : Questions techniques pointues (conducteur PEN, classes d'isolation, volumes salles de bains...)
- **Installation électrique** : Questions générales sur les installations

### 3. Répondre aux questions

- Cliquez sur la réponse de votre choix
- Une explication détaillée s'affiche après chaque réponse
- Naviguez avec le bouton "Question suivante"

### 4. Résultats

- Score final avec pourcentage
- Animation de confettis si score ≥ 60% ✨
- Options pour recommencer ou changer de catégorie

## 🎯 Contenu des questions

### RGIE - Questions de base

- Objectifs de la prise de terre
- Résistances maximales autorisées
- Sections minimales des conducteurs
- Liaisons équipotentielles
- Protection différentielle
- Règles salles de bains (volumes, TBTS)
- Obligations du propriétaire
- Contrôles et dérogations

### RGIE 2019 - Technique avancée

- Conducteur PEN (Protection et Neutre combinés)
- Types de disjoncteurs différentiels (AC, A, B)
- Distances de sécurité en cuisine
- Classes d'isolation des luminaires
- Degrés de protection IP
- Liaisons équipotentielles supplémentaires
- Tensions limites conventionnelles
- Courants de fuite maximaux
- Tests obligatoires
- Calculs de puissance

## 🛠️ Technologies utilisées

- **React 18.2.0** - Framework JavaScript
- **Canvas Confetti** - Animations de célébration
- **CSS3** - Styles, animations et variables CSS
- **HTML5** - Structure sémantique
- **localStorage** - Sauvegarde des préférences utilisateur

## 📁 Structure du projet

```
quiz-rgie/
├── public/
│   ├── index.html
│   └── RGIE_2019_v2.pdf
├── src/
│   ├── components/
│   │   └── Quiz.js
│   ├── data/
│   │   └── questions.json
│   ├── App.js
│   ├── App.css
│   └── index.js
├── package.json
└── README.md
```

## 🎨 Personnalisation

### Modifier les thèmes

Les couleurs sont gérées par des variables CSS dans `src/App.css` :

```css
:root {
  --bg-color: #ffffff; /* Arrière-plan mode clair */
  --text-color: #333333; /* Couleur du texte */
  --card-bg: #f9f9f9; /* Couleur des cartes */
  /* ... autres variables */
}

.dark-mode {
  --bg-color: #1a1a1a; /* Arrière-plan mode sombre */
  --text-color: #e0e0e0; /* Couleur du texte sombre */
  /* ... variables mode sombre */
}
```

### Ajouter des questions

1. Ouvrir `src/data/questions.json`
2. Ajouter vos questions dans la catégorie appropriée :

```json
{
  "question": "Votre question ?",
  "reponse": "Réponse correcte exacte",
  "explication": "Explication détaillée...",
  "options": ["Option 1", "Option 2 (correcte)", "Option 3", "Option 4"]
}
```

### Créer une nouvelle catégorie

1. Ajouter la catégorie dans `questions.json`
2. Mettre à jour le tableau `categories` dans `Quiz.js`

## 📚 Références RGIE

- **RGIE 2019** - Règlement Général sur les Installations Électriques
- **Volumes salles de bains** (art. 9.1.3.5)
- **Protection différentielle** (art. 4.2)
- **Liaisons équipotentielles** (art. 4.1)
- **Sections minimales** (art. 5.2)

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Scripts disponibles

- `npm start` - Lance l'app en mode développement
- `npm run build` - Construit l'app pour la production
- `npm test` - Lance les tests
- `npm run eject` - Éjecte la configuration Create React App

## 🐛 Signaler un bug

Si vous trouvez un bug ou avez une suggestion :

1. Vérifiez les [issues existantes](https://github.com/votre-username/quiz-rgie/issues)
2. Créez une nouvelle issue avec :
   - Description détaillée
   - Étapes pour reproduire
   - Comportement attendu vs obtenu
   - Captures d'écran si applicable

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- **Votre Nom** - _Développement initial_ - [VotreGitHub](https://github.com/votre-username)

## 🙏 Remerciements

- Autorités belges pour la documentation RGIE
- Communauté des électriciens belges
- Contributors React.js

---

**⚠️ Avertissement** : Cette application est destinée à l'apprentissage et à la révision. Pour des questions officielles ou des situations professionnelles, consultez toujours la version officielle du RGIE et faites appel à des professionnels qualifiés.

**📧 Contact** : [votre.email@example.com](mailto:votre.email@example.com)

---

Fait avec ❤️ pour la communauté électrique belge

## 🌙 Mode sombre

L'application propose un **mode sombre** complet pour améliorer l'expérience utilisateur :

### Fonctionnalités

- **Basculement intuitif** avec bouton 🌙/☀️ en en-tête
- **Persistance** - Votre choix est automatiquement sauvegardé
- **Transitions fluides** entre les modes (0.3s)
- **Variables CSS** pour une gestion centralisée des couleurs
- **Compatible** avec tous les éléments de l'interface

### Avantages

- 👁️ **Réduction de la fatigue oculaire** lors de sessions prolongées
- 🔋 **Économie d'énergie** sur les écrans OLED/AMOLED
- 🌃 **Utilisation confortable** dans des environnements sombres
- 🎨 **Design moderne** et professionnel

### Couleurs optimisées

- **Mode clair** : Blanc/gris clair pour une lecture classique
- **Mode sombre** : Noir profond/gris foncé pour le confort visuel
