import EventEmitter from "eventemitter2";

class Pipe {
  constructor(lambda) {
    this.lambda = lambda;
    this.in = this.in.bind(this);
    this.out = null;
  }

  async in(arg) {
    const r = await this.lambda(arg);
    this.out && this.out.in(r);
    return r;
  }
}

class Funnel extends EventEmitter {
  constructor(pipe) {
    super();
    if (pipe) this.out = pipe;
    else this.out = null;

    this.on(`data`, (arg) => {
      this.out && this.out.in(arg);
    });
  }
}

class UpsideDownFunnel extends EventEmitter {
  constructor() {
    super();
    this.in = this.in.bind(this);
  }

  in(arg) {
    this.emit(`data`, arg);
    return arg;
  }
}

// | |
const p = new Pipe(async (x) => x + 1);

// \ /
const f = new Funnel(p);

// / \
const u = new UpsideDownFunnel();

f.out = p;
p.out = u;

u.on(`data`, (x) => console.log(x));

f.emit(`data`, `f emit `);

console.log(`res of p.in`, p.in(`p in `));

u.in(`u in `);
