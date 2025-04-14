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
          const cmd = `npx eslint "${src}/**/*.ts" --config ./.eslintrc.json`;
          grunt.log.writeln(`Running ESLint for ${project}`);
          try {
            execSync(cmd, { stdio: 'inherit' });
          } catch (err) {
            grunt.fail.fatal(`ESLint failed for ${project}`, err);
          }
        });
      });

      grunt.registerTask('default', [
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

  grunt.registerTask('publish', () => {
    const workspaceBase = path.resolve(__dirname, workspace);
    projects.forEach((project) => {
      try {
        execSync(`yarn publish --cwd ${path.resolve(workspaceBase, project)} --non-interactive --access public --registry https://registry.npmjs.org/`, {
          stdio: 'inherit',
        });
        grunt.log.ok(`Published ${project}`);
      } catch (error) {
        grunt.log.error(`Failed to publish ${project}`, error);
      }
    });
  });

  grunt.registerTask('deploy', ['bumpVersion', 'generateDocs', 'publish', 'copy:protoFiles', 'copy:i18n']);
};
