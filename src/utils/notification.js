import { escapeHtml } from '@vue/shared';

const defaultNotification = { title: 'Notification', message: 'Notification message', variant: 'success' };

let notificationContainer = document.querySelector('.notification');

export const showNotification = async (notification = defaultNotification) => {
  try {
    if (!notificationContainer) {
      const element = document.createElement('div');
      element.classList.add('notification');
      document.body.append(element);
      notificationContainer = element;
    }

    const { title, message, variant } = notification;
    const id = '_' + Math.random().toString(16).substring(2, 10);
    const template = [
      `<div id="${id}" class="notification-item notification-item-${escapeHtml(variant)}">`,
      `<div class="notification-item-title">${escapeHtml(title)}</div>`,
      `<div class="notification-item-body">`,
      `<span class="notification-item-badge">${escapeHtml(variant)}</span>`,
      `<span class="notification-item-content">${escapeHtml(message)}</span>`,
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
    return notificationItem;
  } catch (error) {
    handleNotification(error);
  }
};

export const handleNotification = (notification = defaultNotification) => {
  if (notification instanceof Error) {
    const { name: title, message } = notification;
    console.error(notification);
    return showNotification({ title, message, variant: 'error' });
  }
  return showNotification(notification);
};

const closeButtonClickEvent = (e) => {
  try {
    e.target.parentElement.remove();

    if (notificationContainer.children.length <= 0) {
      notificationContainer.remove();
      notificationContainer = null;
    }
  } catch (error) {
    handleNotification(error);
  }
};
