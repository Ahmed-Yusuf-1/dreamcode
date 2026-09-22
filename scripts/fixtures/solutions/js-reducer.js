function sumCloudAltitudes(clouds) {
  return clouds.reduce((sum, c) => sum + c.altitude, 0);
}
