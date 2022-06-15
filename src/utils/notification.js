import { escapeHtml } from '@vue/shared';
class NotificationItem extends Notification {
  static #ALLOWED_WARIANTS = ['success', 'info', 'warning', 'error', 'danger', 'primary'];
  #message;
  #title;
  #variant;
  #closed;
  #closeResolve;
  #closeIn;
  #id = '_' + Math.random().toString(16).substring(2, 10);

  element = null;

  get message() {
    return this.#message;
  }

  get title() {
    return this.#title;
  }

  get variant() {
    return this.#variant;
  }

  get closed() {
    return this.#closed;
  }

  get closeIn() {
    return this.#closeIn;
  }

  get id() {
    return this.#id;
  }

  constructor(notification = { title: '', body: '', variant: 'primary', closeIn: 0, img: null, icon: null }) {
    let { title, variant = 'info', closeIn = Math.max(notification.body.length * 40, 3000), ...options } = notification;

    super(title, { ...options, silent: true });

    if (!this.constructor.#ALLOWED_WARIANTS.includes(variant)) {
      throw Error(`Variant must be one of ${this.constructor.#ALLOWED_WARIANTS.join(', ')}`);
    }

    this.onclose = () => {
      this.element.classList.toggle('open');
      this.element.offsetWidth;
      this.element.classList.toggle('close');
      setTimeout(() => {
        notifications.element.removeChild(this.element);
        this.#closeResolve();
      }, parseFloat(getComputedStyle(this.element).animationDuration) * 1000);
    };

    this.#title = super.title;
    this.#message = super.body;
    this.#variant = variant;
    this.#closeIn = closeIn;

    this.#closed = new Promise((resolve) => (this.#closeResolve = resolve));
  }

  closeNotification = async (closeIn = this.closeIn) => {
    setTimeout(async () => this.close(), closeIn);
  };
}

class NotificationContainer extends EventTarget {
  #queue = new Set();
  #current;
  #element;

  get element() {
    return this.#element;
  }
  get current() {
    return this.#current;
  }
  get queue() {
    return this.#queue;
  }

  constructor() {
    super();

    this.#createContainerElement();
  }

  async add(notificationItem) {
    if (!(notificationItem instanceof Notification)) {
      throw new Error('Argument must be an instance of Notification');
    }

    if (!this.#element) {
      this.#createContainerElement();
    }

    this.#queue.add(notificationItem);

    this.#element.append(notificationItem.element);

    if (!this.#current) {
      this.#closeNext();
    }
  }

  #closeNext = async () => {
    this.#current = this.#queue.values().next().value;
    if (this.#current) {
      if (this.#current.closeIn) {
        this.#current.closeNotification();

        await this.#current.closed;
      }

      // No auto close
      await this.#current.closed;
      this.#queue.delete(this.#current);
      return await this.#closeNext();
    }
    this.#element.remove();
    this.#element = null;
  };

  #createContainerElement = () => {
    let notificationContainer = document.querySelector('.notification');

    if (!notificationContainer) {
      const element = document.createElement('div');
      element.classList.add('notification');
      document.body.append(element);
      notificationContainer = element;
    }
    this.#element = notificationContainer;
  };
}

const notifications = new NotificationContainer();

export const handleNotification = async (notification) => {
  if ((await Notification.requestPermission()) == 'granted') {
    if (notification instanceof Error) {
      // replace key of name with 'title'
      delete Object.assign(notification, { ['title']: notification['name'], ...notification })['name'];
      notification.variant = 'error';
    }

    // replaces key of message with 'body'
    delete Object.assign(notification, { ['body']: notification['message'], ...notification })['message'];

    notification = new NotificationItem(notification);
    const { id, variant, title, body } = notification;
    const template = [
      `<div id="${id}" class="notification-item notification-item-${escapeHtml(variant)} open">`,
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
    const notificationElement = temp.firstChild;

    const closeButton = notificationElement.lastChild;
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        notification.closeNotification(1);
      });
    }

    notification.element = notificationElement;
    notifications.add(notification);
  } else {
    console.error('Please allow notifications in the browser');
  }
};
