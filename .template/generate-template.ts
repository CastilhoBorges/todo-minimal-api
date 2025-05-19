import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import dirTree, { DirectoryTree } from 'directory-tree';

const name = process.argv[2];

const src = '../src/modules';

const data = {
  namePascalCase: toPascalCase(name),
  nameCamelCase: toCamelCase(name),
  nameKebabCase: toKebabCase(name),
  nameSnakeCase: toSnakeCase(name),
};

function toCamelCase(str) {
  return str
    .replace(/[-_ ]+(.)/g, (_, group1) => group1.toUpperCase())
    .replace(/^(.)/, (_, group1) => group1.toLowerCase());
}

function toPascalCase(str) {
  return str
    .replace(/[-_ ]+(.)/g, (_, group1) => group1.toUpperCase())
    .replace(/^(.)/, (_, group1) => group1.toUpperCase());
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/\s+/g, '_')
    .replace(/-+/g, '_')
    .toLowerCase();
}

function folderExists(folderPath: string): boolean {
  return fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory();
}

function deleteFolder(folderPath: string) {
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
  }
}

function generateTemplate(folder, file) {
  const templatePath = path.join(
    __dirname,
    `module/${folder ? `${folder}/` : ''}${file}.hbs`,
  );
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateContent);
  const result = template(data);
  const outputDir = path.join(
    __dirname,
    src,
    data.namePascalCase.toLowerCase(),
    folder || '',
  );
  const outputPath = path.join(
    outputDir,
    `${data.namePascalCase.toLowerCase()}.${file}.ts`,
  );
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, result);
}

function formatTree(node: DirectoryTree): any {
  if (node?.children) {
    node?.children.forEach((child) => {
      if (child?.children?.length) {
        child.name =
          node.name === 'module' ? child.name : `${node.name}/${child.name}`;
        formatTree(child);
      }

      if (!child?.children?.length) {
        const childName = String(child.name).split('.hbs');
        generateTemplate(node.name === 'module' ? '' : node.name, childName[0]);
      }
    });
  }
}

function generateAllTemplates() {
  const folderPath = path.join(__dirname, src, data.nameKebabCase);

  if (!folderExists(folderPath)) {
    try {
      const basePath = path.join(__dirname, './module');
      const tree = dirTree(basePath);
      formatTree(tree!);
      console.log('✅ Structure created successfully.');
      execSync(
        `npx prettier src/modules/${data.nameKebabCase} --write > /dev/null 2>&1`,
        {
          stdio: 'inherit',
        },
      );
    } catch (error) {
      deleteFolder(folderPath);
      console.log(`🗑️ Folder deleted: ${folderPath}`);
    }
  } else {
    console.error(`❌ Folder already exists: ${folderPath}`);
  }
}

generateAllTemplates();
