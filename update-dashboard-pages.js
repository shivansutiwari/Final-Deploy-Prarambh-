// This script updates all dashboard pages to use the withDynamicImport HOC
const fs = require('fs');
const path = require('path');

// Dashboard pages directory
const dashboardDir = path.join(__dirname, 'src', 'app', 'admin', 'dashboard');

// Get all subdirectories in the dashboard directory
const pages = fs.readdirSync(dashboardDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => path.join(dashboardDir, dirent.name, 'page.tsx'));

// Process each page
pages.forEach(pagePath => {
  if (!fs.existsSync(pagePath)) {
    console.log(`Skipping ${pagePath} - file does not exist`);
    return;
  }

  let content = fs.readFileSync(pagePath, 'utf8');
  
  // Skip if already updated
  if (content.includes('withDynamicImport')) {
    console.log(`Skipping ${pagePath} - already updated`);
    return;
  }

  // Add import for withDynamicImport
  if (!content.includes('import { withDynamicImport }')) {
    content = content.replace(
      /import.*from.*['"]lucide-react['"];/,
      `$&\nimport { withDynamicImport } from '@/components/admin/with-dynamic-import';`
    );
  }

  // Find the component name
  const componentNameMatch = content.match(/export\s+default\s+function\s+(\w+)/);
  if (!componentNameMatch) {
    console.log(`Skipping ${pagePath} - could not find component name`);
    return;
  }

  const componentName = componentNameMatch[1];

  // Replace export default function with function
  content = content.replace(
    /export\s+default\s+function\s+(\w+)/,
    `function $1`
  );

  // Add export default withDynamicImport at the end
  if (!content.includes(`export default withDynamicImport(${componentName})`)) {
    content = content.replace(
      /}\s*$/,
      `}\n\nexport default withDynamicImport(${componentName});\n`
    );
  }

  // Write the updated content back to the file
  fs.writeFileSync(pagePath, content);
  console.log(`Updated ${pagePath}`);
});

console.log('All dashboard pages updated successfully!');