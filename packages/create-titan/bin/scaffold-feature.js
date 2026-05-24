#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { renderTemplate } = require('../utils/file-utils');
const { addRouteToAppRoutes, toPascalCase } = require('../utils/route-utils');

const args = process.argv.slice(2);

// Procura por --name=value ou --name value
const nameArg = args.find(arg => arg.startsWith('--name'));
let featureName = null;

if (nameArg) {
  if (nameArg.includes('=')) {
    // formato: --name=test-feature
    featureName = nameArg.split('=')[1];
  } else {
    // formato: --name test-feature
    const nameIndex = args.indexOf(nameArg);
    featureName = args[nameIndex + 1];
  }
}

if (!featureName) {
  console.error('❌ Nome da feature não fornecido.');
  console.error('Uso: npm run titan:scaffold -- feature --name=nome-da-feature');
  console.error('Ou:  npm run titan:scaffold --name=nome-da-feature');
  process.exit(1);
}

const projectRoot = process.cwd();
const featurePath = path.join(projectRoot, 'src/features', featureName);

if (fs.existsSync(featurePath)) {
  console.error(`❌ Feature '${featureName}' já existe em ${featurePath}`);
  process.exit(1);
}

// Criar estrutura de pastas
fs.mkdirSync(featurePath, { recursive: true });

const pascalName = toPascalCase(featureName);

// Template: <name>.page.ts
const pageTS = `import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-${featureName}-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './${featureName}.page.html',
  styleUrls: ['./${featureName}.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ${pascalName}Page implements OnInit {
  ngOnInit() {
    // TODO: Implementar lógica da feature
  }
}
`;

// Template: <name>.page.html
const pageHTML = `<div class="container mx-auto py-8">
  <h1 class="text-3xl font-bold mb-4">${pascalName}</h1>
  <p class="text-gray-600">Implemente sua feature aqui</p>
</div>
`;

// Template: <name>.page.scss
const pageSCSS = `// Estilos da feature ${featureName}
`;

// Template: <name>.page.spec.ts
const pageSpec = `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ${pascalName}Page } from './${featureName}.page';

describe('${pascalName}Page', () => {
  let component: ${pascalName}Page;
  let fixture: ComponentFixture<${pascalName}Page>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [${pascalName}Page],
    }).compileComponents();

    fixture = TestBed.createComponent(${pascalName}Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
`;

// Template: <name>.facade.ts
const facadeTS = `import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ${pascalName}Facade {
  constructor() {}

  // TODO: Adicionar métodos para orquestrar a feature
}
`;

// Escrever arquivos
fs.writeFileSync(path.join(featurePath, `${featureName}.page.ts`), pageTS);
fs.writeFileSync(path.join(featurePath, `${featureName}.page.html`), pageHTML);
fs.writeFileSync(path.join(featurePath, `${featureName}.page.scss`), pageSCSS);
fs.writeFileSync(path.join(featurePath, `${featureName}.page.spec.ts`), pageSpec);
fs.writeFileSync(path.join(featurePath, `${featureName}.facade.ts`), facadeTS);

console.log(`✅ Feature '${featureName}' criada em ${featurePath}`);

// Registrar rota automaticamente
const routeAdded = addRouteToAppRoutes(projectRoot, featureName, featureName);

if (routeAdded) {
  console.log('\n🎉 Feature scaffold concluído!');
  console.log(`\n📍 Próximos passos:`);
  console.log(`   1. Editar: ${featurePath}/${featureName}.page.html`);
  console.log(`   2. Editar: ${featurePath}/${featureName}.facade.ts`);
  console.log(`   3. Importar componentes em ${featureName}.page.ts`);
  console.log(`   4. Acessar: http://localhost:4200/app/${featureName}`);
} else {
  console.error('⚠️  Feature criada, mas rota não foi registrada automaticamente');
  console.log(`Adicione manualmente em src/app/app.routes.ts:`);
  console.log(`{
  path: '${featureName}',
  loadComponent: () => import('@features/${featureName}/${featureName}.page').then(m => m.${pascalName}Page),
}`);
}
