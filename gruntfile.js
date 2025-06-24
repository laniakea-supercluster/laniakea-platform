/* eslint-disable */
const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs');

module.exports = function (grunt) {
  const semver = require('semver');

  const isHelpTask = grunt.cli.tasks.includes('help');
  const buildType = grunt.option('build-type');
  const workspace = grunt.option('workspace');
  const specifiedProjects = grunt.option('projects');
  const taskName = grunt.cli.tasks[0] || 'default';
  const isOnlyCleanTask = grunt.cli.tasks.length === 1 && grunt.cli.tasks[0] === 'clean';

  let projects = [];

  
  const requireFromProject = (projectPath, pkg) => {
    try {
      return require(require.resolve(pkg, { paths: [projectPath] }));
    } catch {
      return require(pkg);
    }
  };

  if (!isHelpTask) {
    if (!workspace || !['libs', 'microservices'].includes(workspace)) {
      grunt.fail.fatal('Missing or invalid --workspace. Use --workspace=libs or --workspace=microservices');
    }

    const workspaceBase = path.resolve(__dirname, workspace);

    const getWorkspaceProjects = () => {
      return fs
        .readdirSync(workspaceBase)
        .filter((folder) => {
          const fullPath = path.join(workspaceBase, folder, 'src');
          return fs.existsSync(fullPath) && fs.lstatSync(fullPath).isDirectory();
        });
    };

    if (!specifiedProjects || specifiedProjects.trim() === '') {
      grunt.fail.fatal('Missing --projects. Example: --projects=laniakea-lib-core,laniakea-lib-central or --projects=*');
    }

    projects = specifiedProjects === '*'
      ? getWorkspaceProjects()
      : specifiedProjects.split(',').map(p => p.trim());

    if (!isOnlyCleanTask && (!buildType || !['ts', 'nest'].includes(buildType))) {
      grunt.fail.fatal('Missing or invalid --build-type. Use --build-type=ts or --build-type=nest');
    }

    grunt.initConfig({
      clean: {},
      ts: {},
      shell: {},
      eslint: {},
      copy: {
        protoFiles: {},
        i18n: {},
      },
    });

    projects.forEach((project) => {
      const projectPath = path.join(workspaceBase, project);
      const srcPath = path.join(projectPath, 'src');
      const distPath = path.join(projectPath, 'dist');

      if (!fs.existsSync(projectPath)) {
        grunt.fail.fatal(`Project folder not found: ${projectPath}`);
      }

      grunt.config.merge({
        clean: {
          [project]: [`${distPath}/**/*`],
        },
      });

      if (!isOnlyCleanTask) {
        grunt.config.merge({
          eslint: {
            [project]: {
              src: [`${srcPath}/**/*.ts`],
            },
          },
          ts: {
            [project]: {
              src: [`${srcPath}/**/*.ts`],
              outDir: distPath,
              options: {
                declaration: true,
                declarationDir: distPath,
                fast: 'never',
                pretty: true,
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
              },
            },
          },
          shell: {
            [`${project}_nestBuildTask`]: {
              command: 'npx nest build -p ./tsconfig.json',
              options: {
                execOptions: {
                  cwd: projectPath,
                },
              },
            },
          },
          copy: {
            protoFiles: {
              files: [{
                expand: true,
                cwd: srcPath,
                src: ['**/*.proto'],
                dest: distPath,
              }],
            },
            i18n: {
              files: [{
                expand: true,
                cwd: `${srcPath}/i18n/`,
                src: ['**/*.{yml,json}'],
                dest: `${distPath}/i18n/`,
              }],
            },
          },
        });

        grunt.registerTask(`build_${project}`, buildType === 'nest'
          ? [`shell:${project}_nestBuildTask`]
          : [`ts:${project}`]
        );
      }
    });

    if (!isOnlyCleanTask) {
      grunt.registerTask('eslintTask', () => {
        projects.forEach((project) => {
          const src = path.join(path.resolve(__dirname, workspace), project, 'src');
          const eslintConfigPath = path.resolve(__dirname, '.eslintrc.json');
          const cmd = `npx eslint "${src}/**/*.ts" --config ${eslintConfigPath} --resolve-plugins-relative-to ${__dirname}`;


          grunt.log.writeln(`Running ESLint for ${project}`);
          grunt.log.writeln(`→ Using ESLint config: ${eslintConfigPath}`);

          try {
            execSync(cmd, { stdio: 'inherit' });
          } catch (err) {
            grunt.fail.fatal(`ESLint failed for ${project}`, err);
          }
        });
      });

      grunt.registerTask('local', [
        'clean',
        ...projects.map(p => `build_${p}`),
        'eslintTask',
        'copy:protoFiles',
        'copy:i18n',
      ]);

      grunt.registerTask('build', [
        'clean',
        ...projects.map(p => `build_${p}`),
        'eslintTask',
        'copy:protoFiles',
        'copy:i18n',
      ]);

    }
  }

  grunt.registerTask('help', 'Displays usage information', () => {
    grunt.log.writeln(`
Usage:
  yarn grunt clean --workspace=[libs|microservices] --projects="*"
  yarn grunt [task] --workspace=[libs|microservices] --projects=project1[,project2] --build-type=[ts|nest]

Tasks:
  clean         Cleans the dist folder of all or selected projects.
  default       Builds the specified projects based on build-type and runs ESLint.
  deploy        Bumps version, generates documentation, and publishes the specified projects.
  check         Checks the next version of the specified projects without applying changes.

Options:
  --projects     "*" or a comma-separated list of projects to run the tasks on.
  --workspace    Folder where the projects are (libs or microservices).
  --build-type   Required only for build tasks. Possible values: "ts", "nest".
`);
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-ts');
  
  grunt.registerTask('determineVersion', 'Determine the next version for a project', (project) => {
    const type = grunt.option('type') || 'patch';
    const workspaceBase = path.resolve(__dirname, workspace);
    const projectPath = path.join(workspaceBase, project);
    const packageJsonPath = path.resolve(projectPath, 'package.json');

    const packageJson = require(packageJsonPath);
    const packageName = packageJson.name;

    const semverLocal = requireFromProject(projectPath, 'semver');

    let currentVersion;
    try {
      currentVersion = execSync(`yarn info ${packageName} version --silent`).toString().trim();
    } catch (error) {
      grunt.log.writeln(`Package not published yet for ${packageName}, starting at version 0.0.0`);
      currentVersion = '0.0.0';
    }

    const newVersion = semverLocal.inc(currentVersion, type === 'breaking' ? 'major' : type === 'feat' ? 'minor' : 'patch');

    grunt.log.writeln(`${packageName} - Current Version: ${currentVersion}`);
    grunt.log.writeln(`${packageName} - New Version: ${newVersion}`);

    grunt.config.merge({
      shell: {
        [`${project}_yarnVersion`]: {
          command: `yarn version ${newVersion} --deferred`,
          options: {
            execOptions: {
              cwd: projectPath,
            },
          },
        },
      },
    });
  });

  grunt.registerTask('bumpVersion', 'Determine and bump version for each project', () => {
    projects.forEach((project) => {
      grunt.task.run(`determineVersion:${project}`);
      grunt.task.run(`shell:${project}_yarnVersion`);
    });
  });

  grunt.registerTask('check', 'Check the next version without making changes', () => {
    projects.forEach((project) => {
      grunt.task.run(`determineVersion:${project}`);
    });
  });

  grunt.registerTask('generateDocs', () => {
    const workspaceBase = path.resolve(__dirname, workspace);
    projects.forEach((project) => {
      const distPath = path.resolve(workspaceBase, project, 'dist');
      const tsConfigPath = path.resolve(workspaceBase, project, 'tsconfig.json');

      try {
        execSync(`npx compodoc -p ${tsConfigPath} -d ${distPath}/documentation`, { stdio: 'inherit' });
        grunt.log.ok(`Documentation generated for ${project}`);
      } catch (error) {
        grunt.log.error(`Doc generation failed for ${project}`, error);
      }
    });
  });

  grunt.registerTask('serveDocs', () => {
    const workspaceBase = path.resolve(__dirname, workspace);
    projects.forEach((project) => {
      try {
        const tsConfigPath = path.resolve(workspaceBase, project, 'tsconfig.json');
        execSync(`npx compodoc -p ${tsConfigPath} -s`, { stdio: 'inherit' });
      } catch (error) {
        grunt.log.error(`Failed to serve docs for ${project}`, error);
      }
    });
  });

  grunt.registerTask('publish-local', () => {
    const workspaceBase = path.resolve(__dirname, workspace);
    const rootPackageJsonPath = path.resolve(__dirname, 'package.json');
    const rootPackageJson = JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf8'));

    projects.forEach((project) => {
      const projectPath = path.resolve(workspaceBase, project);
      const packageJsonPath = path.join(projectPath, 'package.json');

      try {
        const { name } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        const cmd = `npm publish --registry http://localhost/verdaccio/ --access=public`;
        execSync(cmd, { cwd: projectPath, stdio: 'inherit' });
        grunt.log.ok(`Published ${name}`);

        // ✅ Adiciona ao package.json raiz com o range desejado
        const range = '>=1.0.0-alpha.0 <2.0.0';
        rootPackageJson.dependencies ??= {};
        rootPackageJson.dependencies[name] = range;
        grunt.log.ok(`Added ${name}: "${range}" to root package.json`);
      } catch (error) {
        grunt.log.error(`Failed to publish ${project}`, error);
      }
    });

    // ✅ Salva modificações no package.json da raiz
    fs.writeFileSync(rootPackageJsonPath, JSON.stringify(rootPackageJson, null, 2) + '\n');
  });
 
  grunt.registerTask('publish', () => {
    const workspaceBase = path.resolve(__dirname, workspace);
    const registryUrl = 'https://npm.pkg.github.com/';

    const getGitBranch = () => {
      let branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
      if (branch === 'HEAD' && process.env.GITHUB_REF_NAME) {
        branch = process.env.GITHUB_REF_NAME;
      }
      return branch;
    };

    const parseEnvFromBranch = (branch) => {
      if (branch === 'master') return { tag: 'latest', suffix: '' };
      if (branch.startsWith('qa')) return { tag: 'qa', suffix: 'qa' };
      if (branch.startsWith('hotfix')) return { tag: 'qa', suffix: 'qa' };
      if (branch.startsWith('dev')) return { tag: 'dev', suffix: 'dev' };
      return { tag: 'custom', suffix: branch.replace(/\//g, '-') };
    };

    const branch = getGitBranch();
    const { tag, suffix } = parseEnvFromBranch(branch);

    projects.forEach((project) => {
      const projectPath = path.resolve(workspaceBase, project);
      const pkgPath = path.join(projectPath, 'package.json');
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

      const baseVersion = pkg.version.split('-')[0]; // "1.0.0"
      let newVersion = baseVersion;

      if (suffix) {
        const match = pkg.version.match(/-(alpha|beta)-(\d+)/);
        if (match) {
          const [, stage, num] = match;
          const next = parseInt(num, 10) + 1;
          newVersion = `${baseVersion}-${stage}-${next}-${suffix}`;
        } else {
          newVersion = `${baseVersion}-${suffix}`;
        }

        grunt.log.writeln(`📦 Applying version: ${newVersion}`);
        execSync(`npm version ${newVersion} --no-git-tag-version`, {
          cwd: projectPath,
          stdio: 'inherit',
        });
      } else {
        grunt.log.writeln(`📦 Using base version (no suffix): ${baseVersion}`);
      }

      try {
        if (!process.env.GH_NPM_TOKEN) {
          throw new Error('GH_NPM_TOKEN is not set in the environment');
        }

        process.env['NPM_CONFIG_//npm.pkg.github.com/:_authToken'] = process.env.GH_NPM_TOKEN;
        process.env['NPM_CONFIG_ALWAYS_AUTH'] = 'true';
        const cmd = `npm publish --registry ${registryUrl} --tag ${tag}`;
        execSync(cmd, { cwd: projectPath, stdio: 'inherit' });
        grunt.log.ok(`✅ Published ${project} as ${newVersion} with tag '${tag}'`);
      } catch (error) {
        grunt.log.error(`❌ Failed to publish ${project}`, error);
      }
    });
  });

  grunt.registerTask('deploy', ['bumpVersion', 'generateDocs', 'publish', 'copy:protoFiles', 'copy:i18n']);
};
