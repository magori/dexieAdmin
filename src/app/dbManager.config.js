/* global chance:false, Dexie:false */

export class DbManagerConfig {
  constructor() {
    'ngInject';

    this.db = new Dexie("MyDatabases");
    this.db.test = "test";
    this.db.version(1).stores({
      friends: "++id, name, age, isCloseFriend, contact.phone ",
      notes: "++id, title, date, *items",
      noAction: "++id",
      fleurs: "++id, name, race"
    });
  }

  onNewDb() {
    return (db) => {
      this.db = db;
    }
  }

  getDb() {
    return this.db;
  }

  tablesConfig() {
    return {
      friends: {
        columns: {
          id: false,
          time: true,
          isCloseFriend:false
        },
        trash: true,
        load: () => {
          var friends = [];
          for (var i = 0; i < 3; i++) {
            friends.push({
              name: chance.name(),
              age: chance.age(),
              contact: {
                phone: chance.phone()
              },
              t: {
                g: {
                  t: "toto",
                  v: "val"
                }
              }
            });
          }
          return this.db.friends.bulkPut(friends);
        }
      },
      notes: {
        load: () => {
          var notes = []
          for (var i = 0; i < 1000; i++) {
            notes.push({
              title: 'tata'
            });
          }
          return this.getDb().notes.bulkPut(notes);
        }
      }
    }
  }

}
