/**
 * The Super Admin Console module (module 1) of the Igongo API. The gateway
 * imports only this file. See modules/super-admin/README.md.
 */

export { listModules, moduleSwitchReader, setModuleState } from "./application/use-cases/module-switches";
export { secretReader } from "./application/use-cases/secrets";
export { readSection } from "./application/use-cases/settings";
export { DrizzleConsoleStore } from "./infrastructure/db/drizzle-console-store";
export { consoleRouter, publicSettingsRouter, type ConsoleDeps } from "./presentation/console-router";
export { CONSOLE_PERMISSIONS } from "./presentation/permissions";
