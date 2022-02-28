module.exports = {
  webpack: function(config, env) {
    config.resolve.fallback = {
      "events": require.resolve("events/"),
      "http": false,
      "https": false,
      "process": false,
      "url": false,
      "util": false
    }
    return config;
  }
}
