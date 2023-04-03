const PROXY_CONFIG = [
  {
    context: [
      "/products",
    ],
    target: "https://localhost:7020",
    secure: false
  },
  {
    context: [
      "/users",
    ],
    target: "https://localhost:7020",
    secure: false
  },
  {
    context: [
      "/cart",
    ],
    target: "https://localhost:7020",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
