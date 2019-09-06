const { STATUS } = require("../../index")


/*
this is the mysql component definition:

there are 2 required fields:
- name
- init

and 4 optional:
- checkStatusInterval
- checkStatus
- debug
- noColors
 */

module.exports = {
  /*
  the name property is required and represents the component handler
   */
  name: "mysql",

  /*
  the init async function is required and must return whatever you
  need to retrieve with the container get function
   */
  init: async ({ setStatus, getStatus }) => {

    // this is a fake mysql client
    const mysqlFakeClient = {

      // the query function fakes a mysql query and returns a fake product object
      query: fakeSql => {
        if (getStatus().status !== STATUS.RUNNING) {
          throw new Error("Can't execute query, not connected to database")
        } else {
          console.log("Faking query execution:", fakeSql)
          return {
            product: {
              id: 123,
              name: "pizza",
              price: 10
            }
          }
        }
      },

      // the connect function fakes the connection to the database
      connect: () => {
        console.log("Connecting to database...")
        setTimeout(() => {
          if (getStatus().status !== STATUS.RUNNING) {
            console.log("Connection established")
            setStatus(STATUS.RUNNING)
          }
        }, 500)
      }
    }

    mysqlFakeClient.connect()

    return mysqlFakeClient
  },

  /*
  the checkStatusInterval property is optional and is expressed in milliseconds
   */
  checkStatusInterval: 5000,

  /*
  the checkStatus function is optional and will be called every checkStatusInterval
   */
  checkStatus: async ({ component, setStatus }) => {
    /*
    random switch of the component status from RUNNING to STOPPED
    and vice versa to fake ane intermittent connection
     */
    if (Math.random() > 0.5) {
      component.connect()
    } else {
      setStatus(STATUS.STOPPED, new Error("connection lost"))
    }
  },

  /*
  the debug option overrides the container debug option
   */
  debug: true,

  /*
  the noColors option overrides the container debug option
   */
  noColors: false
}

