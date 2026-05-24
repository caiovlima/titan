#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');
const { copyDir } = require('../utils/file-utils');

const projectName = process.argv[2];

if (!projectName) {
  console.error('Usage: npm create titan@latest <project-name>');
  process.exit(1);
}

const targetDir = path.resolve(process.cwd(), projectName);
const templateDir = path.resolve(__dirname, '..', 'template');

// Validar se a pasta já existe
if (fs.existsSync(targetDir)) {
  console.error(`❌ Pasta '${projectName}' já existe`);
  process.exit(1);
}

console.log(`📦 Criando projeto Titan em '${projectName}'...\n`);

// 1. Copiar template
try {
  console.log('📋 Copiando template...');
  copyDir(templateDir, targetDir, ['node_modules', '.angular', '.git', 'dist']);
  console.log('✅ Template copiado\n');
} catch (error) {
  console.error('❌ Erro ao copiar template:', error.message);
  process.exit(1);
}

// 2. Atualizar package.json com novo nome
try {
  console.log('🔧 Configurando projeto...');
  const packageJsonPath = path.join(targetDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  packageJson.name = projectName;
  packageJson.version = '0.1.0';

  // Adicionar script titan:scaffold
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts['titan:scaffold'] =
    'node node_modules/create-titan/bin/scaffold-feature.js';

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json atualizado\n');
} catch (error) {
  console.error('❌ Erro ao configurar package.json:', error.message);
  process.exit(1);
}

// 3. Instalar dependências
try {
  console.log('📥 Instalando dependências (isso pode levar alguns minutos)...\n');
  execSync('npm install --legacy-peer-deps', { cwd: targetDir, stdio: 'inherit' });
  console.log('\n✅ Dependências instaladas\n');
} catch (error) {
  console.error('❌ Erro ao instalar dependências:', error.message);
  process.exit(1);
}

// 4. Mensagem de sucesso
console.log('🎉 Projeto Titan criado com sucesso!\n');
console.log('📍 Próximos passos:\n');
console.log(`   cd ${projectName}`);
console.log('   npm start\n');
console.log('🚀 Criar uma nova feature:\n');
console.log('   npm run titan:scaffold feature --name=minha-feature\n');
console.log('📖 Documentação: https://github.com/caiovlima/titan\n');
