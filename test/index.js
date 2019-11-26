const Container = require("../index.js")

Container.addStatus("test", 10, "\x1b[34m")

const container = new Container({
  debug: true, // enable the debug logs
  noColors: false // enable the console colors of the debug logs
})

container
  .register(require("./components/mysql.js"), { host: "example.com" })
  .register(require("./components/products.js"))
  .init()

container.on("products.running",  async () => {
  const productsComponent = await container.get("products")

  // logging the product retrieved with the products component
  const product = productsComponent.getProduct()
  console.log(product)
})

container.on("products.stopped",  async () => {
  const productsComponent = await container.get("products")

  // trying to get a product unsuccessfully because products component is stopped
  productsComponent.getProduct()
})

container.checkStatus()
  .then(console.log)
  .catch(console.error)
