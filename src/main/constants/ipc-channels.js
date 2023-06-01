// TODO: rename ipc channels
module.exports = {
  SLA_AUTH_SIGN_IN: 'sla:auth:sing-in',
  SLA_AUTH_SIGN_OUT: 'sla:auth:sing-out',
  SLA_AUTH_STATE: 'sla:auth:status',
  SLA_LYRICS_CONNECT: 'sla:lyrics:connect',
  SLA_LYRICS_DISCONNECT: 'sla:lyrics:disconnect',
  SLA_LYRICS_CONNECT_REQUEST: 'sla:lyrics:connect-request',
  SLA_LYRICS_CONNECTION_STATUS_REPLY: 'sla:lyrics:connection-status-reply',
  SLA_LYRICS_CONNECTION_STATUS_REQUEST: 'sla:lyrics:connection-status-request',
  SLA_TRACK_LYRICS_REQUEST: 'sla:track-lyrics-request',
  SLA_TRACK_LYRICS_REPLY: 'sla:track-lyrics-reply',
  SLA_LOG: 'sla:core:log',
  SLA_SHOW_APP_WINDOW: 'sla:app:show-window',
  SLA_GET_PLAYBACK_STATE: 'sla:get-playback-state',
  SLA_ON_PLAYBACK_STATE: 'sla:on-playback-state',
}
