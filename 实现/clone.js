const isType = (obj, type) => {
  if (typeof obj !== "object") return false;
  const typeString = Object.prototype.toString.call(obj);
  let flag;
  switch (type) {
    case "Array":
      flag = typeString === "[object Array]";
      break;
    case "Date":
      flag = typeString === "[object Date]";
      break;
    case "RegExp":
      flag = typeString === "[object RegExp]";
      break;
    default:
      flag = false;
      break;
  }
  return flag;
};

const getRegExp = re => {
  var flags = "";
  if (re.global) flags += "g";
  if (re.ignoreCase) flags += "i";
  if (re.multiline) flags += "m";
  return flags;
};

const clone = parent => {
  const parents = [];
  const children = [];

  const _clone = parent => {
    if (parent === null) return null;
    if (typeof parent !== "object") return parent;

    let child, proto;
    if (isType(parent, "Array")) {
      child = [];
    } else if (isType(parent, "RegExp")) {
      child = new RegExp(parent.source, getRegExp(parent));
      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
    } else if (isType(parent, "Date")) {
      child = new Date(parent.getTime());
    } else {
      proto = Object.getPrototypeOf(parents);
      child = Object.create(proto);
    }

    const index = parents.indexOf(parent);

    if (index != -1) {
      return children[index];
    }

    parents.push(parent);
    children.push(child);

    for (let i in parent) {
      child[i] = _clone(parent[i]);
    }
    return child;
  };
  return _clone(parent);
};

function person(pname) {
  this.name = pname;
}

const Messi = new person("Messi");

function say() {
  console.log("hi");
}

const oldObj = {
  a: say,
  c: new RegExp("ab+c", "i"),
  d: Messi,
  e: { h: 2 }
};

oldObj.b = oldObj;

const newObj = clone(oldObj);
oldObj.e.h = 3;
// console.log(newObj.a, oldObj.a); // [Function: say] [Function: say]
// console.log(newObj.b, oldObj.b); // { a: [Function: say], c: /ab+c/i, d: person { name: 'Messi' }, b: [Circular] } { a: [Function: say], c: /ab+c/i, d: person { name: 'Messi' }, b: [Circular] }
// console.log(newObj.c, oldObj.c); // /ab+c/i /ab+c/i
// console.log(newObj.d.constructor, oldObj.d.constructor); // [Function: person] [Function: person]
