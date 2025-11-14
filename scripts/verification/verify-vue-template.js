import { TemplateRegistry } from '../../dist/core/template/registry.js';

const registry = new TemplateRegistry();
const templates = registry.list();

console.log('Available templates:');
templates.forEach(t => {
  console.log(`- ${t.id}: ${t.name} - ${t.description}`);
});

console.log('\nVue template details:');
const vueTemplate = registry.get('vue');
if (vueTemplate) {
  console.log('✓ Vue template found');
  console.log(`  ID: ${vueTemplate.id}`);
  console.log(`  Name: ${vueTemplate.name}`);
  console.log(`  Description: ${vueTemplate.description}`);
  console.log(`  Extends: ${vueTemplate.extends}`);
  console.log(`  Dependencies: ${vueTemplate.dependencies.join(', ')}`);
  console.log(`  DevDependencies: ${vueTemplate.devDependencies.slice(0, 3).join(', ')}...`);
} else {
  console.log('✗ Vue template not found');
}

console.log('\nVue template with base merged:');
const vueWithBase = registry.getWithBase('vue');
if (vueWithBase) {
  console.log('✓ Vue template merged with base');
  console.log(`  Total devDependencies: ${vueWithBase.devDependencies.length}`);
  console.log(`  Has web-ext: ${vueWithBase.devDependencies.includes('web-ext@^8.3.0')}`);
  console.log(`  Has concurrently: ${vueWithBase.devDependencies.includes('concurrently@^9.1.0')}`);
  console.log(`  Has vue: ${vueWithBase.dependencies.includes('vue@^3.5.0')}`);
  console.log(`  Scripts: ${Object.keys(vueWithBase.scripts).join(', ')}`);
} else {
  console.log('✗ Vue template merge failed');
}
