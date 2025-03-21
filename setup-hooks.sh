#!/bin/sh

# Copy the pre-commit hook to the .git/hooks directory
cp githooks/pre-commit .git/hooks/pre-commit
# Copy the commit-msg hook to the .git/hooks directory
cp githooks/commit-msg .git/hooks/commit-msg

# Make sure the hook script is executable
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/commit-msg

echo "Git hooks set up successfully."