# GitHub Pages Deployment Guide

## Deployment Options Explained

### Option 1: Deploy from `gh-pages` Branch (RECOMMENDED) ✅
**What it is:** Your source code stays on `main` branch, and only the built files go to `gh-pages` branch.

**Pros:**
- ✅ Keeps source code separate from build files
- ✅ Clean repository structure
- ✅ Source code remains private/clean
- ✅ Standard practice for React/Vite apps
- ✅ Already configured in your project!

**Cons:**
- Requires running `npm run deploy` command

**How it works:**
1. You work on `main` branch (your source code)
2. Run `npm run deploy` - it builds and pushes to `gh-pages` branch
3. GitHub Pages serves from `gh-pages` branch

---

### Option 2: Deploy from `main` Branch
**What it is:** GitHub Pages serves directly from your main branch (usually `/docs` folder or root).

**Pros:**
- ✅ Simpler setup
- ✅ Automatic deployment on push

**Cons:**
- ❌ Exposes all source code publicly
- ❌ Clutters main branch with build files
- ❌ Not recommended for production apps

---

## Recommended Setup (Current Configuration)

Your project is **already configured** for Option 1 (gh-pages branch)!

### Step-by-Step Deployment Instructions:

1. **Initialize Git Repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository**:
   - Go to GitHub.com
   - Create a new repository named `Arterycheck` (or your preferred name)
   - **DO NOT** initialize with README, .gitignore, or license (you already have these)

3. **Connect Local Repository to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/Arterycheck.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **Deploy from a branch**
   - Select **gh-pages** branch
   - Select **/ (root)** folder
   - Click **Save**

5. **Deploy Your App**:
   ```bash
   npm run deploy
   ```

   This command will:
   - Build your app (`npm run build`)
   - Create/update the `gh-pages` branch
   - Push the built files to GitHub
   - Your site will be live at: `https://YOUR_USERNAME.github.io/Arterycheck/`

6. **Future Updates**:
   - Make changes to your code
   - Commit and push to `main`:
     ```bash
     git add .
     git commit -m "Your commit message"
     git push origin main
     ```
   - Deploy updates:
     ```bash
     npm run deploy
     ```

---

## Important Notes

- **Repository Name**: Your `vite.config.ts` has `base: '/Arterycheck/'` - make sure your GitHub repo name matches this (case-sensitive)
- **URL**: Your app will be at `https://YOUR_USERNAME.github.io/Arterycheck/`
- **Build Time**: First deployment may take 1-2 minutes to go live
- **Custom Domain**: You can add a custom domain later in GitHub Pages settings

---

## Troubleshooting

**If deployment fails:**
1. Make sure `gh-pages` package is installed: `npm install --save-dev gh-pages`
2. Check that your GitHub username matches in `package.json` homepage
3. Ensure repository name matches the base path in `vite.config.ts`

**If routes don't work:**
- Make sure `base: '/Arterycheck/'` in `vite.config.ts` matches your repo name
- React Router should work automatically with the base path

---

## Quick Reference

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/Arterycheck.git
git push -u origin main

# Deploy
npm run deploy

# Update and redeploy
git add .
git commit -m "Update message"
git push origin main
npm run deploy
```
