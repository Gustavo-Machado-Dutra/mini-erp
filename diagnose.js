const fs = require(fs);
console.log(=== DIAGNÓSTICO CSS ===);

const pkg = JSON.parse(fs.readFileSync(package.json, utf8));
const deps = Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {});
console.log(tailwindcss:, deps.tailwindcss);
console.log(postcss:, deps.postcss);
console.log(autoprefixer:, deps.autoprefixer);

const globals = fs.readFileSync(src/app/globals.css, utf8);
console.log(\nglobals.css tem --card:, globals.includes(--card));
console.log(globals.css tem --popover:, globals.includes(--popover));
console.log(globals.css tem @tailwind:, globals.includes(@tailwind));

const layout = fs.readFileSync(src/app/layout.tsx, utf8);
console.log(\nlayout.tsx importa globals.css:, layout.includes(import './globals.css'));

const tailwind = fs.readFileSync(tailwind.config.ts, utf8);
console.log(tailwind.config tem card:, tailwind.includes(card));
console.log(tailwind.config tem popover:, tailwind.includes(popover));
