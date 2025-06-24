const fs = require('fs');

const path = 'package.json';
const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));

const removeIxDeps = (deps) => {
  if (!deps) return;
  Object.keys(deps).forEach((key) => {
    if (key.startsWith('@ix/')) {
      console.log(`🔹 Removendo: ${key}`);
      delete deps[key];
    }
  });
};

// Limpa @ix/ de dependencies e devDependencies
removeIxDeps(pkg.dependencies);
removeIxDeps(pkg.devDependencies);

// Salva o novo package.json formatado
fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
console.log('✅ @ix/* removidos com sucesso!');
