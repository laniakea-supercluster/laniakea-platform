/* eslint-disable consistent-return */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable prefer-destructuring */
const execSync = require('child_process').execSync;
const semver = require('semver');
const path = require('path');
const fs = require('fs');

module.exports = function (grunt) {
  const isHelpTask = grunt.cli.tasks.includes('help');

  let projects = [];

  const getProjects = () => {
    const allFolders = fs.readdirSync(__dirname).filter((file) => fs.statSync(path.join(__dirname, file)).isDirectory());
    return allFolders.filter((folder) => folder.includes('-lib-'));
  };

  const specifiedProjects = grunt.option('projects');
  const buildType = grunt.option('build-type');

  if (!isHelpTask) {
    const isCleanTask = grunt.cli.tasks.includes('clean');

    if (!specifiedProjects || specifiedProjects.trim() === '') {
      grunt.fail.fatal('No projects specified. Use --projects=project1,project2 or --projects=all to specify the target projects.');
    }

    if (!isCleanTask && (!buildType || !['nest', 'ts'].includes(buildType))) {
      grunt.fail.fatal('Invalid or no build type specified. Use --build-type=nest or --build-type=ts to specify the build method.');
    }

    projects = specifiedProjects === 'all' ? getProjects() : specifiedProjects.split(',').map((project) => project.trim());

    if (projects.length === 0) {
      grunt.fail.fatal('No valid projects found based on the provided --projects option.');
    }

    grunt.initConfig({
      clean: {},
      eslint: {},
      copy: {
        protoFiles: {},
      },
      watch: {
        ts: {
          files: [],
          tasks: ['ts'],
        },
      },
      bump: {
        options: {
          commitMessage: 'Release v%VERSION%',
          tagName: 'v%VERSION%',
          tagMessage: 'Version %VERSION%',
          commit: true,
          createTag: true,
          push: false,
        },
      },
      shell: {},
    });

    projects.forEach((project) => {
      const projectSrcPath = path.resolve(__dirname, project, 'src');
      const projectDistPath = path.resolve(__dirname, project, 'dist');

      grunt.config.merge({
        clean: {
          [project]: [`${projectDistPath}/**/*`],
        },
        eslint: {
          [project]: {
            src: [`${projectSrcPath}/**/*.ts`],
          },
        },
        copy: {
          protoFiles: {
            files: [{
              expand: true,
              cwd: `${projectSrcPath}/`,
              src: ['**/*.proto'],
              dest: `${projectDistPath}/`,
            }],
          },
          i18n: {
            files: [{
              expand: true,
              cwd: `${projectSrcPath}/i18n/`,
              src: ['**/*.{yml,json}'],
              dest: `${projectDistPath}/i18n/`,
            }],
          },
        },
        watch: {
          ts: {
            [project]: {
              files: [`${projectSrcPath}/**/*.ts`],
              tasks: ['ts'],
            },
          },
        },
        ts: {
          [project]: {
            src: [`${projectSrcPath}/**/*.ts`],
            outDir: `${projectDistPath}/`,
            options: {
              declaration: true,
              declarationDir: `${projectDistPath}/`,
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
                cwd: path.resolve(__dirname, project),
              },
            },
          },
        },
      });
    });
  }

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('help', 'Displays usage information', () => {
    grunt.log.writeln(`
Usage:
  npx grunt [task] --projects=[projects] --build-type=[build-type]

Tasks:
  clean         Cleans the dist directory of the specified projects.
  default       Builds the specified projects based on build-type and runs ESLint.
  deploy        Bumps version, generates documentation, and publishes the specified projects.
  check         Checks the next version of the specified projects without applying changes.

Options:
  --projects    A comma-separated list of projects to run the tasks on. Use "all" to select all projects.
  --build-type  Specifies the build method for the projects. Possible values: "ts", "nest".
`);
  });

  grunt.registerTask('determineVersion', 'Determine the next version for a project', (project) => {
    const type = grunt.option('type') || 'patch';
    const packageJsonPath = path.resolve(__dirname, project, 'package.json');

    const packageJson = require(packageJsonPath);
    const packageName = packageJson.name;

    let currentVersion;
    try {
      currentVersion = execSync(`yarn info ${packageName} version --silent`).toString().trim();
    } catch (error) {
      grunt.log.writeln(`Package not published yet for ${packageName}, starting at version 0.0.0`);
      currentVersion = '0.0.0';
    }

    let newVersion = semver.inc(currentVersion, type === 'breaking' ? 'major' : type === 'feat' ? 'minor' : 'patch');

    grunt.log.writeln(`${packageName} - Current Version: ${currentVersion}`);
    grunt.log.writeln(`${packageName} - New Version: ${newVersion}`);

    grunt.config.merge({
      shell: {
        [`${project}_yarnVersion`]: {
          command: `yarn version ${newVersion} --deferred`,
          options: {
            execOptions: {
              cwd: path.resolve(__dirname, project),
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
    projects.forEach((project) => {
      const distPath = path.resolve(__dirname, project, 'dist');
      const tsConfigPath = path.resolve(__dirname, project, 'tsconfig.json');

      try {
        execSync(`npx compodoc -p ${tsConfigPath} -d ${distPath}/documentation`, { stdio: 'inherit' });
        grunt.log.ok(`Documentation generated for ${project}`);
      } catch (error) {
        grunt.log.error(`Doc generation failed for ${project}`, error);
      }
    });
  });

  grunt.registerTask('serveDocs', () => {
    projects.forEach((project) => {
      try {
        const tsConfigPath = path.resolve(__dirname, project, 'tsconfig.json');
        execSync(`npx compodoc -p ${tsConfigPath} -s`, { stdio: 'inherit' });
      } catch (error) {
        grunt.log.error(`Failed to serve docs for ${project}`, error);
      }
    });
  });

  grunt.registerTask('publish', () => {
    projects.forEach((project) => {
      try {
        execSync(`yarn publish --cwd ${path.resolve(__dirname, project)} --non-interactive --access public --registry https://registry.npmjs.org/`, {
          stdio: 'inherit',
        });
        grunt.log.ok(`Published ${project}`);
      } catch (error) {
        grunt.log.error(`Failed to publish ${project}`, error);
      }
    });
  });

  grunt.registerTask('eslintTask', () => {
    projects.forEach((project) => {
      const projectSrcPath = path.join(project, 'src');
      const eslintCommand = `npx eslint "${projectSrcPath}/**/*.ts" --config ./.eslintrc.json`;

      grunt.log.writeln(`Running ESLint for ${project}`);
      try {
        execSync(eslintCommand, { stdio: 'inherit' });
      } catch (error) {
        grunt.fail.fatal(`ESLint failed for ${project}`, error);
      }
    });
  });

  projects.forEach((project) => {
    if (buildType === 'nest') {
      grunt.registerTask(`build_${project}`, [`shell:${project}_nestBuildTask`]);
    } else if (buildType === 'ts') {
      grunt.registerTask(`build_${project}`, [`ts:${project}`]);
    }
  });

  grunt.registerTask('default', ['clean', ...projects.map((project) => `build_${project}`), 'eslintTask', 'copy:protoFiles', 'copy:i18n']);
  grunt.registerTask('deploy', ['bumpVersion', 'generateDocs', 'publish', 'copy:protoFiles', 'copy:i18n']);
};
