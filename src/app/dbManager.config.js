/* global chance:false, Dexie:false */

export class DbManagerConfig {
  constructor() {
    'ngInject';

    this.db = new Dexie("MyDatabases");
    this.db.test = "test";
    this.db.version(1).stores({
      friends: "++id, name, age, isCloseFriend, contact.phone ",
      notes: "++id, title, date, *items",
      noLoadAction: "++id"
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

    var loadFirend = () => {
      var friends = [];
      for (var i = 0; i < 3; i++) {
        friends.push({
          name: chance.name(),
          age: chance.age(),
          contact: {
            phone: chance.phone()
          }
        });
      }
      return this.db.friends.bulkPut(friends);
    }

    var loadNote = () => {
      var notes = []
      for (var i = 0; i < 1000; i++) {
        notes.push({
          title: 'tata'
        });
      }
      return this.getDb().notes.bulkPut(notes);
    }

    return {

      friends: {
        columns: {
          id: false,
          time: false,
          isCloseFriend:false
        },
        order: 2,
        noDelete: true,
        load: () => {return loadFirend()}
      },

      notes: {
        order: 1,
        load: () => {return loadNote()}
      }
    }
  }
}
