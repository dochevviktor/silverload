export default class SLScroll {
  waitForMe = false;
  nextNumber = 0;
  element: HTMLDivElement | null;

  constructor(element: HTMLDivElement | null) {
    this.element = element;
  }

  async scrollLeft(left: number, timeout = 100): Promise<void> {
    if (Math.sign(this.nextNumber) !== Math.sign(left)) {
      this.nextNumber = left;
    } else {
      this.nextNumber += left / 1.4;
    }

    if (!this.waitForMe) {
      this.waitForMe = true;
      await this.setTimeoutPromise(() => this.scrollToLeftBy(this.nextNumber), timeout);
      this.nextNumber = 0;
      await this.setTimeoutPromise(() => (this.waitForMe = false), timeout);
    }
  }

  private setTimeoutPromise(fn: () => void, timeout = 0): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(fn()), timeout));
  }

  private scrollToLeftBy(left: number): void {
    this.element?.scrollBy({
      top: 0,
      left: left,
      behavior: 'smooth',
    });
  }
}
