import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

async function checkDirectory(dir: string): Promise<boolean> {
  try {
    await fs.access(dir);
    return true;
  } catch {
    return false;
  }
}

async function checkFile(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function checkDependencies(): Promise<boolean> {
  try {
    execSync('npm list openai p-limit csv-parse chart.js react-chartjs-2', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function checkSetup() {
  console.log('Checking project setup...\n');

  // Check required directories
  const directories = [
    'app/components/ui',
    'app/components/layout',
    'app/components/blocks',
    'app/lib/utils',
    'app/lib/constants',
    'data',
    'data/generated/cheeses',
    'data/generated/indexes',
    'scripts',
  ];

  console.log('Checking directories...');
  for (const dir of directories) {
    const exists = await checkDirectory(dir);
    console.log(`${exists ? '✅' : '❌'} ${dir}`);
  }

  // Check required files
  const files = [
    'data/data.csv',
    '.env.local',
    'package.json',
    'tsconfig.json',
    'app/lib/sitemap-generator.ts',
    'scripts/generate-data.ts',
    'scripts/generate-sitemaps.ts',
  ];

  console.log('\nChecking files...');
  for (const file of files) {
    const exists = await checkFile(file);
    console.log(`${exists ? '✅' : '❌'} ${file}`);
  }

  // Check dependencies
  console.log('\nChecking dependencies...');
  const depsInstalled = await checkDependencies();
  console.log(`${depsInstalled ? '✅' : '❌'} Required dependencies`);

  // Check environment variables
  console.log('\nChecking environment variables...');
  const envVars = [
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_SITE_URL',
    'NEXT_PUBLIC_ITEMS_PER_PAGE',
    'NEXT_PUBLIC_MAX_PAGES',
    'REVALIDATE_INTERVAL',
  ];

  for (const envVar of envVars) {
    console.log(`${process.env[envVar] ? '✅' : '❌'} ${envVar}`);
  }

  // Final summary
  console.log('\nSetup check complete!');
  console.log('If any checks failed, please refer to the README.md for setup instructions.');
}

checkSetup().catch(console.error);
