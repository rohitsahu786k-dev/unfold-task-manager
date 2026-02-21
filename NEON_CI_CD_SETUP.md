# Neon Database CI/CD Setup

This workflow automates the creation and deletion of temporary Neon database branches for pull requests.

## Prerequisites

You need to configure the following in your GitHub repository:

### 1. GitHub Secrets
Go to **Settings → Secrets and variables → Actions** and add:

- **Secret Name:** `NEON_API_KEY`
  - **Value:** Your Neon API key
  - ⚠️ **NEVER** commit this to the repository

### 2. GitHub Variables
Go to **Settings → Secrets and variables → Actions** and add:

- **Variable Name:** `NEON_PROJECT_ID`
  - **Value:** `wandering-truth-93877535`

## How It Works

### When a PR is opened, reopened, or synchronized:
1. Creates a temporary Neon branch: `preview/pr-{PR_NUMBER}-{BRANCH_NAME}`
2. The branch auto-expires after 14 days
3. You can use the database URL for testing

### When a PR is closed:
1. Automatically deletes the temporary Neon branch

## Configuration Reference

**Your Configuration:**
- Project ID: `wandering-truth-93877535`
- API Key Name: `unfold cro task management`
- Workflow File: `.github/workflows/neon-branch-management.yaml`

## Enable Database Migrations (Optional)

To run migrations on the preview branch, uncomment the "Run Migrations" section in the workflow and update your migration command:

```yaml
- name: Run Migrations
  run: npm run db:migrate
  env:
    DATABASE_URL: "${{ steps.create_neon_branch.outputs.db_url_with_pooler }}"
```

## Security Notes

✅ API keys are stored as GitHub secrets (not in version control)
✅ Database URLs are never logged as public output
✅ Temporary branches auto-expire after 14 days
✅ Workflow only runs on pull request events
