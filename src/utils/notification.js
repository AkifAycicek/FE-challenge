import { escapeHtml } from '@vue/shared';

const defaultNotification = { title: 'Notification', body: 'Notification Body', variant: 'success' };

let notificationContainer = document.querySelector('.notification');

export const showNotification = async (notification = defaultNotification) => {
  try {
    if (!notificationContainer) {
      const element = document.createElement('div');
      element.classList.add('notification');
      document.body.append(element);
      notificationContainer = element;
    }

    const { title, body, variant } = notification;
    const id = '_' + Math.random().toString(16).substring(2, 10);
    const template = [
      `<div id="${id}" class="notification-item notification-item-${escapeHtml(variant)}">`,
      `<div class="notification-item-title">${escapeHtml(title)}</div>`,
      `<div class="notification-item-body">`,
      `<span class="notification-item-badge">${escapeHtml(variant)}</span>`,
      `<span class="notification-item-content">${escapeHtml(body)}</span>`,
      `</div>`,
      `<button class="notification-close-btn btn-sm">✖</button>`,
      `</div>`,
    ].join('');

    const temp = document.createElement('div');
    temp.innerHTML = template.trim();
    const notificationItem = temp.firstChild;
    notificationContainer.append(notificationItem);

    const closeButton = notificationItem.lastChild;
    if (closeButton) {
      closeButton.addEventListener('click', closeButtonClickEvent);
    }
  } catch (error) {
    showNotification({ title: 'An error occurred', body: JSON.stringify(error), variant: 'error' });
    console.error(error);
  }
};

export const closeButtonClickEvent = (e) => {
  try {
    e.target.parentElement.remove();

    if (notificationContainer.children.length <= 0) {
      notificationContainer.remove();
      notificationContainer = null;
    }
  } catch (error) {
    console.error(error);
  }
};
