# TutoRisk — site vitrine

Site corporate statique de TutoRisk (ABC Sécurité) → https://tutorisk.net
HTML/CSS/JS pur, sans build ni framework. Le LCMS est dans le dépôt `tutorisk/tutorisk-backend`.

## Structure

- `*.html` — 13 pages autonomes (accueil, à propos, 4 pages d'activité, formation
  présentielle, conseil-audit, catalogue, contact, mentions légales, confidentialité)
- `css/style.css` — feuille unique, variables CSS en `:root`
- `js/config.js` — **URL du LCMS + endpoint Formspree** (à éditer en cas de changement)
- `js/main.js` — burger, dropdown, compteurs animés
- `assets/` — logos et favicons
- `nginx-tutorisk.conf` — config nginx de prod (site + LCMS)

## Contraintes du site

- **Pas de build** : le HTML est écrit à la main, dupliqué entre les pages
  (nav et footer sont copiés dans chaque fichier). Toute modification de nav/footer doit
  être répercutée dans les 13 pages — utiliser un script Python plutôt que de le faire à la main.
- L'indentation du `<head>` n'est pas homogène : `index.html` a 2 espaces, les autres aucun.
  En cas de remplacement par regex, prévoir `[ \t]*`.
- Le formulaire de contact passe par **Formspree** (`js/config.js`), pas par le backend.

## Identité visuelle

- Rouge de marque : `#CC1515` — fond sombre : `#0F1923`
- Police : Inter (Google Fonts)
- **Le logo contient déjà le mot « TutoRisk » dans sa police propre.** Ne jamais le doubler
  d'un texte HTML à côté : utiliser `logo-horizontal.png` (nav/footer) ou `logo-tutorisk.png`
  (version empilée, hero). `logo-mark.png` = le rond seul.
- Les favicons utilisent le **rond seul** : le mot complet devient illisible à 16 px.
- La zone haute (topbar + navbar) est **blanche** pour mettre le logo en valeur.

## Déploiement (VPS Ikoula)

```bash
cd /var/www/tutorisk-site && git fetch origin && git reset --hard origin/main && \
sed -i 's|https://formation.tutorisk.com|https://lcms.tutorisk.net|g' *.html js/config.js && \
cp nginx-tutorisk.conf /etc/nginx/sites-available/tutorisk && \
chown -R www-data:www-data /var/www/tutorisk-site && \
nginx -t && systemctl reload nginx
```

## Pièges connus (appris à la dure)

1. **`git` refuse `/var/www/tutorisk-site` (« dubious ownership »)** → il faut
   `git config --global --add safe.directory /var/www/tutorisk-site`. Sans ça, git échoue
   en silence au milieu d'une chaîne `&&` et le déploiement semble avoir réussi.

2. **Le `sed` de déploiement modifie les fichiers** → `git pull` est ensuite bloqué.
   Toujours `git fetch && git reset --hard origin/main`.

3. **Ne jamais mettre `types { ... }` dans nginx** : remplace toute la table MIME →
   le site entier se met à se télécharger au lieu de s'afficher. Utiliser `default_type`
   dans une `location` dédiée (cf. le bloc du manifeste dans `nginx-tutorisk.conf`).

4. **Ne jamais utiliser `Cache-Control: immutable`** sur le CSS/JS : le navigateur ne
   revalide plus pendant des semaines et les corrections ne sortent jamais. La config
   actuelle utilise `must-revalidate` + cache-busting `?v=N` dans le HTML.
   En cas de modif du CSS, incrémenter le `?v=` dans les 13 pages.

5. **Cache favicon** : les navigateurs ignorent `?v=N` pour les favicons. Pour en changer un,
   **renommer le fichier** (d'où `icon-32.png`).

## Vérification après déploiement

```bash
curl -so /dev/null -w "%{http_code} %{content_type}\n" https://tutorisk.net/          # 200 text/html
curl -so /dev/null -w "%{http_code} %{content_type}\n" https://tutorisk.net/css/style.css  # 200 text/css
```
