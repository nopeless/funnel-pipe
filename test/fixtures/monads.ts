class Message {
  public readonly createdAt: Date;
  constructor(public message: string) {
    this.createdAt = new Date();
  }
}

class Data {
  constructor(public readonly data: string) {}
}

export { Message, Data };
