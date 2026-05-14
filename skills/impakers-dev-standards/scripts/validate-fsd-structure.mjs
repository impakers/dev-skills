#!/usr/bin/env node

import { existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const PROJECT_ROOT = process.cwd();

const REQUIRED_PATHS = [
  "app",
  "components/ui",
  "shared/ui",
  "entities",
  "features",
  "widgets",
  "lib",
  "types",
];

const PUBLIC_API_UI_ROOTS = ["shared/ui"];
const SLICED_LAYER_ROOTS = ["entities", "features", "widgets"];
const ALLOWED_SLICE_SUBDIRECTORIES = new Set(["ui", "lib"]);
const NON_UI_SOURCE_ROOTS = ["lib", "types"];
const ALLOWED_COMPONENT_SUBTREES = new Set([
  "ui",
  "layout",
  "administration",
  "animate-ui",
  "mock",
]);

const errors = [];

validateRequiredPaths();
validateSharedPublicApis();
validateSlicedLayers();
validateNonUiRoots();
validateComponentsRoot();

if (errors.length > 0) {
  console.error(`FSD structure validation failed with ${errors.length} error(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log("FSD structure validation passed");
}

function validateRequiredPaths() {
  for (const relativePath of REQUIRED_PATHS) {
    const absolutePath = resolveProjectPath(relativePath);

    if (!existsSync(absolutePath)) {
      errors.push(`Required FSD path is missing: ${relativePath}`);
      continue;
    }

    if (!statSync(absolutePath).isDirectory()) {
      errors.push(`Required FSD path must be a directory: ${relativePath}`);
    }
  }
}

function validateSharedPublicApis() {
  for (const relativePath of PUBLIC_API_UI_ROOTS) {
    requireFile(path.join(relativePath, "index.ts"), `${relativePath} must expose a public API via index.ts`);
  }
}

function validateSlicedLayers() {
  for (const layerRoot of SLICED_LAYER_ROOTS) {
    const absoluteLayerRoot = resolveProjectPath(layerRoot);

    if (!existsSync(absoluteLayerRoot)) {
      continue;
    }

    for (const sliceName of directoryNames(absoluteLayerRoot)) {
      const slicePath = path.join(layerRoot, sliceName);
      const uiPath = path.join(slicePath, "ui");

      requireDirectory(uiPath, `${slicePath} must keep render components under ui/`);
      requireFile(path.join(uiPath, "index.ts"), `${uiPath} must expose a public API via index.ts`);
      validateOptionalSliceLib(slicePath);
      forbidSourceFilesAtSliceRoot(slicePath);
      forbidUnexpectedSliceSubdirectories(slicePath, ALLOWED_SLICE_SUBDIRECTORIES);
    }
  }
}

function validateOptionalSliceLib(slicePath) {
  const libPath = path.join(slicePath, "lib");
  const absoluteLibPath = resolveProjectPath(libPath);

  if (!existsSync(absoluteLibPath)) {
    return;
  }

  requireFile(path.join(libPath, "index.ts"), `${libPath} must expose a public API via index.ts`);

  for (const filePath of walkFiles(absoluteLibPath)) {
    if (/\.tsx$/.test(filePath)) {
      errors.push(`${relativeProjectPath(filePath)} must not contain render-only TSX; keep slice UI under ${slicePath}/ui`);
    }
  }
}

function validateNonUiRoots() {
  for (const root of NON_UI_SOURCE_ROOTS) {
    const absoluteRoot = resolveProjectPath(root);

    if (!existsSync(absoluteRoot)) {
      continue;
    }

    for (const filePath of walkFiles(absoluteRoot)) {
      if (/\.tsx$/.test(filePath)) {
        errors.push(`${relativeProjectPath(filePath)} must not contain render-only TSX; move UI to shared/entities/features/widgets/components/ui`);
      }
    }
  }
}

function validateComponentsRoot() {
  const componentsRoot = resolveProjectPath("components");

  if (!existsSync(componentsRoot)) {
    errors.push("Required FSD path is missing: components");
    return;
  }

  for (const entry of directoryNames(componentsRoot)) {
    if (!ALLOWED_COMPONENT_SUBTREES.has(entry)) {
      errors.push(`components/${entry} is not an allowed components subtree; use components/ui for primitives or FSD layers for product UI`);
    }
  }
}

function forbidSourceFilesAtSliceRoot(slicePath) {
  const absoluteSlicePath = resolveProjectPath(slicePath);

  for (const entry of readdirSync(absoluteSlicePath, { withFileTypes: true })) {
    if (!entry.isFile()) {
      continue;
    }

    if (/\.(ts|tsx)$/.test(entry.name)) {
      errors.push(`${path.join(slicePath, entry.name)} must not live at the slice root; expose UI through ${slicePath}/ui/index.ts`);
    }
  }
}

function forbidUnexpectedSliceSubdirectories(slicePath, allowedSubdirectories) {
  const absoluteSlicePath = resolveProjectPath(slicePath);

  for (const entry of readdirSync(absoluteSlicePath, { withFileTypes: true })) {
    if (entry.isDirectory() && !allowedSubdirectories.has(entry.name)) {
      errors.push(`${path.join(slicePath, entry.name)} is not an allowed FSD slice subdirectory; this repo currently allows ui/ and optional lib/ only`);
    }
  }
}

function requireDirectory(relativePath, message) {
  const absolutePath = resolveProjectPath(relativePath);

  if (!existsSync(absolutePath) || !statSync(absolutePath).isDirectory()) {
    errors.push(message);
  }
}

function requireFile(relativePath, message) {
  const absolutePath = resolveProjectPath(relativePath);

  if (!existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
    errors.push(message);
  }
}

function directoryNames(absolutePath) {
  return readdirSync(absolutePath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function walkFiles(absolutePath) {
  const files = [];

  for (const entry of readdirSync(absolutePath, { withFileTypes: true })) {
    const entryPath = path.join(absolutePath, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkFiles(entryPath));
    } else if (entry.isFile()) {
      files.push(entryPath);
    }
  }

  return files;
}

function resolveProjectPath(relativePath) {
  return path.join(PROJECT_ROOT, relativePath);
}

function relativeProjectPath(absolutePath) {
  return path.relative(PROJECT_ROOT, absolutePath).split(path.sep).join("/");
}
