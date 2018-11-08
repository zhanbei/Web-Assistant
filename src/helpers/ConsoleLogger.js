'use strict';

import newConsoleLogger from '../utils/ConsoleLogger';

// TO-DO Make the #isDebugging configurable in the options page.
export const isDebugging = false;
export const ConsoleLogger = newConsoleLogger();
export default ConsoleLogger;

// Init the default logger.
if (isDebugging) {
	ConsoleLogger.setMinLoggingLevel(ConsoleLogger.LoggerVerbose.level);
} else {
	ConsoleLogger.setMinLoggingLevel(ConsoleLogger.LoggerInfo.level);
}
