import { ipcRenderer } from 'electron';
import path from 'path';

const getTeamIcon = function getTeamIcon() {
  const count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

  let countTeamIconCheck = count;
  document.querySelector('#team_menu').click();
  countTeamIconCheck += 1;
  const icon = document.querySelector('.team_icon');
  let bgUrl = window.getComputedStyle(icon, null).getPropertyValue('background-image');
  bgUrl = /^url\((['"]?)(.*)\1\)$/.exec(bgUrl);
  bgUrl = bgUrl ? bgUrl[2] : '';
  if (bgUrl) {
    ipcRenderer.sendToHost('avatar', bgUrl);
  } else if (countTeamIconCheck <= 3) {
    setTimeout(() => {
      getTeamIcon(countTeamIconCheck + 1);
    }, 1000);
  }

  setTimeout(() => {
    document.querySelector('.team_menu').remove();
    document.querySelector('.ql-editor').focus();
  }, 10);
};

module.exports = (Franz) => {
  const getMessages = () => {
    const directMessages = document.querySelectorAll('.p-channel_sidebar__badge').length;
    const allMessages = document.querySelectorAll('.p-channel_sidebar__channel--unread:not(.channel_sidebar__channel--muted)').length - directMessages;

    // set Franz badge
    Franz.setBadge(directMessages, allMessages);
  };
  Franz.loop(getMessages);

  setTimeout(() => {
    getTeamIcon();
  }, 4000);

  // inject franz.css stylesheet
  Franz.injectCSS(path.join(__dirname, 'service.css'));
};