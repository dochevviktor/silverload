export default class SLZoom {
  waitForMe = false;
  nextMultiplier = 1;
  callback: (multiplier: number) => void | null;

  constructor(callback: (multiplier: number) => void | null) {
    this.callback = callback;
  }

  async zoom(zin: boolean): Promise<void> {
    if (zin) {
      this.nextMultiplier += 0.1;
    } else {
      if (this.nextMultiplier > 0.1) this.nextMultiplier -= 0.1;
    }

    if (!this.waitForMe) {
      this.waitForMe = true;
      await this.setTimeoutPromise(() => this.callback(this.nextMultiplier), 10);
      this.nextMultiplier = 1;
      await this.setTimeoutPromise(() => (this.waitForMe = false), 2500);
    }
  }

  private setTimeoutPromise(fn, timeout = 0): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(fn()), timeout));
  }
}
