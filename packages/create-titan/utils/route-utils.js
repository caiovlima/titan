const fs = require('node:fs');

/**
 * Registra uma nova rota lazy-loaded em app.routes.ts
 */
function addRouteToAppRoutes(projectRoot, featureName, featurePath) {
  const routesFile = `${projectRoot}/src/app/app.routes.ts`;

  if (!fs.existsSync(routesFile)) {
    console.error('❌ app.routes.ts não encontrado');
    return false;
  }

  let content = fs.readFileSync(routesFile, 'utf-8');

  // Formato da nova rota (lazy-loaded)
  const newRoute = `{
    path: '${featureName}',
    loadComponent: () =>
      import('@features/${featurePath}/${featureName}.page').then(
        (m) => m.${toPascalCase(featureName)}Page,
      ),
  }`;

  // Encontra o array de rotas e adiciona antes do último elemento
  const routeArrayRegex = /const\s+routes:\s+Routes\s*=\s*\[([\s\S]*?)\];/;
  const match = content.match(routeArrayRegex);

  if (!match) {
    console.error('❌ Não foi possível encontrar o array de rotas');
    return false;
  }

  const routesArray = match[1];
  const lastBrace = routesArray.lastIndexOf('}');

  if (lastBrace === -1) {
    console.error('❌ Estrutura de rotas inválida');
    return false;
  }

  // Insere a nova rota
  const updatedRoutes =
    routesArray.substring(0, lastBrace + 1) +
    `,\n  ${newRoute}` +
    routesArray.substring(lastBrace + 1);

  content = content.replace(routeArrayRegex, `const routes: Routes = [${updatedRoutes}];`);

  fs.writeFileSync(routesFile, content, 'utf-8');
  console.log(`✅ Rota '${featureName}' registrada em app.routes.ts`);

  return true;
}

function toPascalCase(str) {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

module.exports = { addRouteToAppRoutes, toPascalCase };
