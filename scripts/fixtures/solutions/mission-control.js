function runMission(commands) {
  const state = { status: "ready", fuel: 0, altitude: 0 };
  const rejected = [];
  commands.forEach((cmd, i) => {
    const reject = () => rejected.push(i);
    switch (cmd.type) {
      case "fuel":
        if (state.status !== "ready") return reject();
        state.fuel = Math.min(100, state.fuel + cmd.amount);
        break;
      case "launch":
        if (state.status !== "ready" || state.fuel < 50) return reject();
        state.status = "flying";
        state.fuel -= 50;
        break;
      case "burn":
        if (state.status !== "flying" || state.fuel < cmd.amount) return reject();
        state.fuel -= cmd.amount;
        state.altitude += cmd.amount * 10;
        break;
      case "land":
        if (state.status !== "flying") return reject();
        state.status = "landed";
        state.altitude = 0;
        break;
      default:
        reject();
    }
  });
  return { ...state, rejected };
}
