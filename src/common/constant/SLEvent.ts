export enum SLEvent {
  // react -> electron
  MINIMIZE_WINDOW = 'MINIMIZE_WINDOW',
  MAXIMIZE_WINDOW = 'MAXIMIZE_WINDOW',
  CLOSE_WINDOW = 'CLOSE_WINDOW',
  GET_FILE_ARGUMENTS = 'GET_FILE_ARGUMENTS',

  // electron -> react
  WINDOW_MAXIMIZED = 'WINDOW_MAXIMIZED',
  WINDOW_UN_MAXIMIZED = 'WINDOW_UN_MAXIMIZED',
  SENT_FILE_ARGUMENTS = 'SENT_FILE_ARGUMENTS',
}