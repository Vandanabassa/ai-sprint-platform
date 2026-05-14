# GitHub Setup Guide for AI Sprint Platform

Your local Git repository is ready! Follow these steps to push it to GitHub:

## Step 1: Create a New GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **"+"** icon in the top-right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `ai-sprint-platform`
   - **Description**: (Optional) "AI-powered sprint planning and capacity management platform"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

## Step 2: Push Your Code to GitHub

After creating the repository, GitHub will show you commands. Use these commands in your terminal:

### Option A: If you want to use HTTPS
```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-sprint-platform.git
git branch -M main
git push -u origin main
```

### Option B: If you want to use SSH (recommended if you have SSH keys set up)
```bash
git remote add origin git@github.com:YOUR_USERNAME/ai-sprint-platform.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

## Step 3: Verify

After pushing, refresh your GitHub repository page. You should see all your files!

## Quick Commands Reference

### Check current branch
```bash
git branch
```

### Check remote URL
```bash
git remote -v
```

### Future updates (after initial push)
```bash
git add .
git commit -m "Your commit message"
git push
```

## Troubleshooting

### If you get authentication errors:
- For HTTPS: You may need to use a Personal Access Token instead of your password
  - Go to GitHub Settings → Developer settings → Personal access tokens → Generate new token
- For SSH: Set up SSH keys following [GitHub's SSH guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)

### If the branch name is 'master' instead of 'main':
```bash
git branch -M main
```

---

**Your project is now ready to be pushed to GitHub!** 🚀