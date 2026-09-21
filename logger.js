const colors = require('colors');

const debugEnabled = process.env.DEBUG === '1';

function getPrefix(guild, channel) {
  if (!guild) return '[Startup]';
  const channelName = channel ? ` | #${channel.name}` : '';
  return `[${guild.name}${channelName}]`;
}

function write(level, message, guild, channel) {
  const prefix = colors.cyan(getPrefix(guild, channel));
  const colour = level === 'error' ? colors.red
    : level === 'warn' ? colors.yellow
      : level === 'debug' ? colors.grey
        : level === 'success' ? colors.blue
          : colors.white;
  const output = `${prefix} ${colour(message)}`;
  if (level === 'error') console.error(output);
  else console.log(output);
}

function logEvent(message, guild, channel, level = 'info') {
  write(level, message, guild, channel);
}

function logError(action, error, { guild, channel, messageId, fix } = {}) {
  const details = [
    `action=${action}`,
    messageId && `messageId=${messageId}`,
    error?.name && `error=${error.name}`,
    error?.code && `code=${error.code}`,
    error?.status && `status=${error.status}`,
    error?.message && `reason=${error.message}`,
    fix && `fix=${fix}`
  ].filter(Boolean).join(' ');
  write('error', details, guild, channel);
}

function debug(message, guild, channel) {
  if (debugEnabled) write('debug', message, guild, channel);
}

module.exports = { debug, logError, logEvent };
