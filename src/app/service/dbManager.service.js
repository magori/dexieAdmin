/* global Pormise:false*/
import {
  DbDump
} from './dbDump.service.js';

export class DbManagerService {

  constructor(dbManagerConfig) {
    'ngInject';

    this.config(dbManagerConfig)
    this.previsouSearch = "";
    this.countTupleForEachTable();
  }

  config(config) {
      this.config = config;
    this.db = config.getDb();
    this.tables = this.db.tables;
    this.dbDump = new DbDump();
    this.dbDump.config({
      db: this.db
    });
    var actionsLoad=this.resoloveConfigType('load');
    this.actionsLoad = actionsLoad;
    this.context = config.context;
    this.onNewDb = config.onNewDb();
  }

  columnsToDisplay(tableName){
    return this.resoloveConfigType('columns')[tableName];
  }

  resoloveConfigType(type){
    var config = {};
    Object.keys(this.config.tablesConfig()).forEach((table)=>{
      var tableConfig = this.config.tablesConfig()[table];
      if(tableConfig && tableConfig[type] != undefined){
        config[table] = tableConfig[type];
      }
    });
    return config;
  }

  onRefresh(call){
    this.onRefresh = call;
  }

  loadAll() {
    return Promise.all(this.tables.map((table) => this.load(table)));
  }

  hasActionLoad(table) {
    return this.resolveActionLoad(table);
  }

  hasTrash(table){
    var trashConfig = this.resoloveConfigType('trash');
    if(trashConfig[table.name] === false){
      return false;
    }
    return true;
  }

  resolveActionLoad(table) {
    return this.actionsLoad[table.name];
  }

  load(table) {
    var action = this.resolveActionLoad(table)
    if (action) {
      var promise = (this.context) ? action.call(this.context) : action(),
        self = this;
      if (promise && promise.then) {
        return promise.then(() => self.countTupleTable(table));
      } else {
        return new Pormise(() => {
          this.countTupleTable(table);
        })
      }
    }
  }

  createDb() {
    var db = new Dexie(this.dbDump.dbName);
    db.version(1).stores(this.dbDump.tableDef)
    return db;
  }

  deleteAllTable() {
    return Promise.all(this.tables.map(table => (this.hasTrash(table))?this.delete(table):false));
  }

  delete(table) {
    return table.clear().then(() => this.countTupleTable(table));
  }

  drop() {
    return this.db.delete()
      .then(() => this.createDb().open())
      .then((db) => {
        this.db = db
        if (this.onNewDb) {
          this.onNewDb(this.db)
        }
        this.tables = db.tables;
        this.dbDump.config({
          db: db
        });
        this.countTupleForEachTable();
      });
  }

  dump() {
    return this.dbDump.dump().then(dump => this.createFileAndDowload(dump));
  }

  dumpTable(talbe) {
    return this.dbDump.dumpTable(talbe).then(dump => this.createFileAndDowload(dump));
  }

  countTupleForEachTable() {
    return this.tables.map((table) => {
      this.countTupleTable(table);
    });
  }

  countTupleTable(table) {
    return table.count().then((nb) => {
        table.nbRow = nb;
        // if (this.context) {
        //   this.onRefresh.call(this.context);
        // } else {
        //   this.onRefresh();
        // }
      });
  }

  search(textSearch, table) {
    let search = textSearch.toUpperCase();
    if (search.indexOf(":") == 0) {
      let t = search.substr(1).split("=");
      if (t.length > 1) {
        let key = t[0].trim().toLowerCase();
        return table.filter((v) => v[key].toUpperCase().includes(t[1])).toArray();
      }
      return new Promise(() => {});
    } else {
      return table.toArray().then((list) => {
        list = list.map(v => {
          v.valstring = this.valuesToString(v);
          return v
        }).filter(v => v.valstring.includes(search));
        return list;
      });
    }
  }

  createFileAndDowload(text) {
    var data = new Blob([text], {
      type: 'text/plain'
    });
    var url = window.URL.createObjectURL(data);
    var a = document.createElement('a');
    a.style = "display: none";
    a.href = url;
    a.download = "dump_" + new Date().getTime() + ".txt";
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 50);
  }

  valuesToString(obj, values = '') {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        let val = obj[key];
        if (val instanceof Object) {
          values = values + this.valuesToString(val);
        } else {
          values = values + ' ' + obj[key];
        }
      }
    }
    return values.toUpperCase();
  }

  getDb() {
    return this.db;
  }
}
