function createSecureObject(target, allowedKeys) {
  return new Proxy(target, {
    get(t, prop) {
      if (!allowedKeys.includes(prop)) throw new Error("Access Denied");
      return t[prop];
    },
    set(t, prop, value) {
      if (!allowedKeys.includes(prop)) throw new Error("Write Denied");
      t[prop] = value;
      return true;
    },
  });
}

function test_secure_proxy(propToRead, propToWrite, valToWrite) {
  const secure = createSecureObject({ name: "Nebula", type: "gas" }, ["name", "type", "density"]);
  try {
    secure[propToRead];
  } catch {
    return "read error";
  }
  try {
    secure[propToWrite] = valToWrite;
  } catch {
    return "write error";
  }
  return secure[propToWrite];
}
