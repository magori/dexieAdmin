/* global Pormise:false*/
import {DbDump} from './dbDump.service.js';

export class DbManagerService {

  constructor(ngDexieAdminConfig) {
    'ngInject';

    this.config(ngDexieAdminConfig)
    this.previsouSearch = "";
    this.countTupleForEachTable();
  }

  config(config) {
    this.config = config;
    this.db = config.getDb();
    this.tables = this.orderTables(this.db.tables);
    this.dbDump = new DbDump();
    this.dbDump.config({
      db: this.db
    });
    var actionsLoad = this.resolveConfigType('load');
    this.actionsLoad = actionsLoad;
    this.context = config.context;
    this.onNewDb = config.onNewDb();
  }

  getTables(){
    return this.tables;
  }

  orderTables(tables) {
    var confOrder = this.resolveConfigType('order');
    var tableOrder = [];
    for(let key in confOrder){
      tableOrder.push({name: key, order: confOrder[key]});
    }
    tableOrder.sort((a,b)=>b.order-a.order);
    tableOrder.map((order)=>{
      var index = tables.findIndex((t)=>t.name == order.name);
      var table = tables.splice(index,1)[0];
      tables.unshift(table);
    });
    return tables;
  }

  columnsToDisplay(tableName) {
    return this.resolveConfigType('columns')[tableName];
  }

  resolveColumns(table) {
    var columns = this.columnsToDisplay(table.name);
    if (!columns) {
      columns = {};
    }
    table.schema.indexes.forEach((indexe) => {
      if (columns[indexe.name] === undefined) {
        columns[indexe.name] = true;
      }
    })
    var columnsToDisplay = [];
    columnsToDisplay = Object.keys(columns).filter((key) => {
      let conf = columns[key];
      if (conf === false) {
        return false;
      }
      return true;
    });
    return columnsToDisplay;
  }

  buildData(table) {
    var selectedTableIndexes = this.resolveColumns(table);
    var dottedIndexes = selectedTableIndexes.filter((inedexe) => inedexe.includes("."))
    var indexes = [];
    dottedIndexes.forEach((indexe) => {
      indexes.push({
        key: indexe,
        value: indexe.split('.')
      })
    });
    return table.toArray().then((list) => {
        list.map(data => {
          indexes.forEach((indexe) => {
            var {
              key,
              value
            } = indexe;
            data[key] = value.reduce((obj, key) => (obj[key]) ? (obj[key]) : '', data);
          })
          return data;
        })
        return list;
      })
      .then((list) => {
        return list;
      });
  }

  resolveConfigType(type) {
    var config = {};
    Object.keys(this.config.tablesConfig()).forEach((table) => {
      var tableConfig = this.config.tablesConfig()[table];
      if (tableConfig && tableConfig[type] != undefined) {
        config[table] = tableConfig[type];
      }
    });
    return config;
  }

  onRefresh(call) {
    this.onRefresh = call;
  }

  hasActionLoad(table) {
    return this.resolveActionLoad(table);
  }

  hasDelete(table) {
    var trashConfig = this.resolveConfigType('noDelete');
    if (trashConfig[table.name] === false || trashConfig[table.name] === undefined) {
      return true;
    }
    return false;
  }

  resolveActionLoad(table) {
    return this.actionsLoad[table.name];
  }

  deleteAllTable() {
    return Promise.all(this.tables.map(table => (this.hasDelete(table)) ? this.delete(table) : false));
  }

  delete(table) {
    return table.clear().then(() => this.countTupleTable(table)).then(() => this.onRefresh());
  }

  loadAll() {
    return Promise.all(this.tables.map((table) => this.load(table)));
  }

  deleteObject(table, object) {
    var pk = table.schema.primKey.name;
    return table.delete(object[pk]);
  }

  load(table) {
    var action = this.resolveActionLoad(table)
    if (action) {
      var promise = (this.context) ? action.call(this.context) : action(),
        self = this;
      if (promise && promise.then) {
        return promise.then(() => self.countTupleTable(table)).then(() => this.onRefresh());
      } else {
        return new Pormise(() => {
          this.countTupleTable(table);
          this.onRefresh();
        })
      }
    }
  }

  createDb() {
    var db = new Dexie(this.dbDump.dbName);
    db.version(1).stores(this.dbDump.tableDef)
    return db;
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
    });
  }

  search(textSearch, table) {
    let search = textSearch.toUpperCase();
    if (search.indexOf(":") == 0) {
      let t = search.substr(1).split("=");
      if (t.length > 1) {
        let key = t[0].trim().toLowerCase();
        return this.buildData(table).then((list) => {
          if(list[0][key]){
          list =  list.filter(v => {
              var value = v[key];
              if(!isNaN(parseFloat(value)) && isFinite(value)){
                return value == t[1]*1;
              } else {
                return value.toUpperCase().includes(t[1]);
              }
            })
          }
          return list;
        });
      }
      return new Promise(() => {});
    } else {
      return this.buildData(table).then((list) => {
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
}
