/* global Pormise:false*/
import {DbDump} from './dbDump.service.js';

export class DbManagerService {

  constructor(ngDexieAdminConfig) {
    'ngInject';

    //this.config(ngDexieAdminConfig)
    this.previsouSearch = "";
    //this.countTupleForEachTable();
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
    if(config.onNewDb) {
      this.onNewDb = config.onNewDb();
    }
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

  displayEditConfig(tableName) {
    var conf = this.resolveConfigType('displayEdit');
    if(conf){
      return conf[tableName];
    }
    return null;
  }

  fieldsConfig(tableName){
    var conf = this.resolveConfigType('fields');
    if(conf){
      return conf[tableName];
    }
    return null;
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
    var dottedIndexes = selectedTableIndexes.filter((inedex) => inedex.includes("."))
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
    if(this.config.tablesConfig){
      Object.keys(this.config.tablesConfig()).forEach((table) => {
        var tableConfig = this.config.tablesConfig()[table];
        if (tableConfig && tableConfig[type] != undefined) {
          config[table] = tableConfig[type];
        }
      });
    }
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

  add(table, objet){
    return table.put(objet);
  }

  save(table, objet){
    return table.put(objet);
  }

  deleteObject(table, object) {
    var pk = this.primaryKeyName(table);
    return table.delete(object[pk]);
  }

  delete(table, ids) {
    var promise = new Promise(()=>{});
    if(table && !ids){
      promise = table.clear();
    } else if(table && ids) {
      promise = table.bulkDelete(ids);
    }
    return promise.then(() => this.countTupleTable(table)).then(() => this.onRefresh());
  }

  loadAll() {
    return Promise.all(this.tables.map((table) => this.load(table)));
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
    var db = new Dexie(this.dbDump.dbName+"ddd");
    db.version(1).stores(this.dbDump.tableDef)
    return db;
  }

  drop() {
    return this.db.delete()
      .then(() => this.createDb())
      .then((db) => {
        db.open().then(()=>{
          this.db = db;
          this.tables = db.tables;
          if (this.onNewDb) {
            this.onNewDb(this.db)
          }
          this.dbDump.config({
            db: db
          });
           this.countTupleForEachTable();
        });
      });
  }

  dump() {
    return this.dbDump.dump().then(dump => this.createFileAndDowload(dump));
  }

  dumpTable(talbe) {
    return this.dbDump.dumpTable(talbe).then(dump => this.createFileAndDowload(dump));
  }

  countTupleForEachTable() {
    var i = 0;
    var size = this.tables.length;
    var f = () =>{
          if(i<size){
            this.countTupleTable(this.tables[i]).then(()=>{
              i++;
              f();
            });
          } else {
            this.onRefresh();
          }
    }
    f();
  }

  countTupleTable(table) {
    return table.count().then((nb) => {
      table.nbRow = nb;
    });
  }

  primaryKeyName(table){
    return table.schema.primKey.name;
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
    a.style.display = "none";
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


  tableParser(obj, path){
    var s = path.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    var currentPaht="";
    var t = [];
    var o = obj;
    console.log(a);
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        currentPaht = currentPaht+(currentPaht?".":"")+k;
        console.log(i,k,o);
        //"t[].child[].age")
        if (k in o) {
            o = o[k];
        } else if(k.indexOf('[]')){
          k = k.replace('[]','');
           t.push(o[k].length)
            o = o[k][0];
           for(var j=0; j<o.length; j++){
             //console.log(o[i]);
             this.tableParser(o[i],currentPaht)
           }
        }
     }
    console.log(t);
    return t;
  }
  // deletePropertyByPath(object, path){
  //   var s = path;
  //   // s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  //    s = s.replace(/^\./, '');           // strip a leading dot
  //    var a = s.split('.');
  //    var o = object;
  //    var nbElments = []
  //    for (var i = 0, n = a.length; i < n; ++i) {
  //        var k = a[i];
  //        if (k in o) {
  //            o = o[k];
  //        } else if(k == '[]'){
  //          nbElments.push(o.length)
  //        }
  //     }
  //     return
  //
  //     console.log(nbElments);
  //     //console.log("data."+key,eval( "delete data."+key));
  //     console.log(key, o);
  // }
}
