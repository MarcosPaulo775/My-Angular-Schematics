import {
    apply,
    mergeWith,
    Rule,
    SchematicContext,
    template,
    Tree,
    url,
    move,
    SchematicsException
} from '@angular-devkit/schematics';
import { Schema } from './schema';
import { strings, normalize } from '@angular-devkit/core';
import { buildDefaultPath } from '@schematics/angular/utility/project';

export function serviceComponent(options: Schema): Rule {
    return (tree: Tree, context: SchematicContext) => {

        const workspaceConfigBuffer = tree.read('angular.json');
        if (!workspaceConfigBuffer) {
            throw new SchematicsException('Not an Angular CLI workspace');
        }

        const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
        const projectName = options.project || workspaceConfig.defaultProject;
        const project = workspaceConfig.projects[projectName];

        const defaultProjectPath = buildDefaultPath(project);

        if (options.path) {
            options.path = defaultProjectPath + '/' + options.path;
        } else {
            options.path = defaultProjectPath;
        }

        const sourceTemplates = url('./files');
        const sourceParametrizedTemplates = apply(sourceTemplates, [
            template({
                ...options,
                ...strings
            }),
            move(normalize(options.path as string))
        ]);

        return mergeWith(sourceParametrizedTemplates)(tree, context);
    };
}