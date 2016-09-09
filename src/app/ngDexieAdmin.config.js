/* global chance:false, Dexie:false */

export class NgDexieAdminConfig {
  constructor() {
    'ngInject';

    this.db = new Dexie("MyDatabases");
    this.db.version(1).stores({
      friends: "++id, name, age, isCloseFriend, contact.phone",
      notes: "++id, title, date, *items",
      noLoadAction: "++id",
      budget:"&id, titre"
    });
  }

  // onNewDb() {
  //   return (db) => { this.db = db };
  // }

  getDb() {
    return this.db;
  }

  tablesConfig() {

    var loadFirend = () => {
      var friends = [];
      for (var i = 0; i < 5; i++) {
        friends.push({
          name: chance.name(),
          age: chance.age(),
          gender: chance.gender(),
          country: chance.country({ full: true }),
          contact: {
            mail:{
              prof:chance.email(),
              private: chance.email()
            },
            phone: chance.phone()
          },
          contact2: {
              mail:chance.email(),
            phone: chance.phone()
          },
          contact3: {
            mail:chance.email(),
            phone: chance.phone()
          }
        });
      }
      return this.db.friends.bulkPut(friends);
    }

    var loadNote = () => {
      var notes = []
      for (var i = 0; i < 3; i++) {
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
          isCloseFriend:false,
          'contact.mail.prof':true
        },
        fields:{
            'contact2.phone': false
        },
        displayEdit: 'simple',
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
