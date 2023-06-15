// TODO: rename ipc channels
module.exports = {
  SLA_AUTH_SIGN_IN: 'sla:auth:sing-in',
  SLA_AUTH_SIGN_OUT: 'sla:auth:sing-out',
  SLA_AUTH_STATE: 'sla:auth:status',
  SLA_LYRICS_CONNECT: 'sla:lyrics:connect',
  SLA_LYRICS_CONNECT_REQUEST: 'sla:lyrics:connect-request',
  SLA_LYRICS_SERVICE_STATE_REPLY: 'sla:lyrics:service-state-reply',
  SLA_LYRICS_SERVICE_STATE_REQUEST: 'sla:lyrics:service-state-request',
  SLA_LYRICS_ERROR_NOTIFY: 'sla:lyrics:error-notify',
  SLA_TRACK_LYRICS_REQUEST: 'sla:track-lyrics-request',
  SLA_TRACK_LYRICS_REPLY: 'sla:track-lyrics-reply',
  SLA_GET_PLAYBACK_STATE: 'sla:get-playback-state',
  SLA_START_OR_RESUME_PLAYBACK: 'sla:start-or-resume-playback',
  SLA_PAUSE_PLAYBACK: 'sla:pause-playback',
  SLA_ON_PLAYBACK_STATE: 'sla:on-playback-state',
  SLA_ON_ERROR: 'sla:on-error',
  SLA_APP_WINDOW_DID_FINISH_LOAD: 'sla:on-app-window-did-finish-load',
}
