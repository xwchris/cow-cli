import fs from 'fs';

export function isValidProject() {
  // Check if package.json file exists
  if (!fs.existsSync('package.json')) {
    return false;
  }
  // Additional validation logic if needed
  // ...

  return true;
}

export function isValidGitProject() {
  // Check if .git folder exists
  if (!fs.existsSync('.git')) {
    return false;
  }
  // Additional validation logic if needed
  // ...

  return true;
}