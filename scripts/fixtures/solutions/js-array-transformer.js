function transformClouds(clouds, minHeight) {
  return clouds.filter((c) => c.height >= minHeight).map((c) => c.name.toUpperCase());
}
