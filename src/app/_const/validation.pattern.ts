export const ValidationPattern = {
  FIRST_NAME: '[A-Za-z- ]+',
  LAST_NAME: '[A-Za-z- ]+',
  // 'EMAIL': '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$',
  PASSWORD: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[ !"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~])\S.{6,}\S$/,
  YOUTUBE_URL: /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/
};
