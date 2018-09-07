const { ipcRenderer } = require('electron');
const path = require('path');

const getTeamIcon = function getTeamIcon(count = 0) {
  let countTeamIconCheck = count;
  let bgUrl = null;

  const teamMenu = document.querySelector('#team_menu');
  if (teamMenu) {
    teamMenu.click();

    const icon = document.querySelector('.team_icon');
    if (icon) {
      bgUrl = window.getComputedStyle(icon, null).getPropertyValue('background-image');
      bgUrl = /^url\((['"]?)(.*)\1\)$/.exec(bgUrl);
      bgUrl = bgUrl ? bgUrl[2] : '';
    }

    setTimeout(() => {
      document.querySelector('.team_menu').remove();
      document.querySelector('#msg_input .ql-editor').focus();
    }, 10);
  }

  countTeamIconCheck += 1;

  if (bgUrl) {
    ipcRenderer.sendToHost('avatar', bgUrl);
  } else if (countTeamIconCheck <= 5) {
    setTimeout(() => {
      getTeamIcon(countTeamIconCheck + 1);
    }, 2000);
  }
};

const getSidebarColor = function getSidebarColor() {
  const sidebar = document.querySelector('.client_channels_list_container');
  if (sidebar) {
    const color = window.getComputedStyle(sidebar, null).getPropertyValue('background');
    ipcRenderer.sendToHost('sidebarColor', color);
  }
};

const SELECTOR_CHANNELS_UNREAD = '.p-channel_sidebar__channel--unread:not(.p-channel_sidebar__channel--muted)';
module.exports = (Franz) => {
  const getMessages = () => {
    const directMessages = document.querySelectorAll(`${SELECTOR_CHANNELS_UNREAD} .p-channel_sidebar__badge.c-mention_badge`);
    const directCount = Array.from(directMessages).reduce((previous, current) => previous + parseInt(current.innerText), 0);
    const allMessages = document.querySelectorAll(SELECTOR_CHANNELS_UNREAD).length - directMessages.length;

    // set Franz badge
    Franz.setBadge(directCount, allMessages);
  };
  Franz.loop(getMessages);

  setTimeout(() => {
    getTeamIcon();
    getSidebarColor();
  }, 4000);

  // inject franz.css stylesheet
  Franz.injectCSS(path.join(__dirname, 'service.css'));
};
