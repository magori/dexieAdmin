export class DbDump {

    constructor () {
        'ngInject';
        this.rn = "\r\n";
    }

    config(config){
        if(config){
          this.db = config.db;
          this.dbName = this.db.name+"";
          this.tables = this.db.tables;
          this.tableDef = this.createTblesDef(this.tables);
        }
    }

    dumpTable(table){
      return table.toArray((list) => {
        let rn = this.rn;
        let objects = JSON.stringify(list);
        return `${rn}//-${table.name}${rn} db.${table.name}.bulkPut(${objects})`
      });
    }

    createTblesDef(tables) {
        var defTables = {};
        tables.map(table=> {
            var primKeyAndIndexes = [table.schema.primKey].concat(table.schema.indexes);
            var schemaSyntax = primKeyAndIndexes.map((index)=>index.src).join(',');
            defTables[table.name] = schemaSyntax;
        });
        return defTables;
    }

    dump(tablesToExclude = "") {
        var db = this.db,
            self = this,
            rn = this.rn;
        var tablesFiltred = db.tables.filter((table)=> !tablesToExclude.includes(table.name));
        var promise = new Promise((resolve)=>{
            db.open().then(function () {
              let dump = `var db = new Dexie('${db.name}') ${rn} db.version(${db.verno}).stores({ ${rn}`;
              let defs = self.createTblesDef(tablesFiltred);
              dump = dump+Object.keys(defs).map(key => {
                  var schemaSyntax = defs[key];
                  return `  ${key}: '${schemaSyntax}'`;
              }).join(`,${rn}`);
              return`${rn}${dump}});${rn}`;
          }).then((dump)=>{
            let p = tablesFiltred.map((table)=>self.dumpTable(table));
            Promise.all(p).then((dumpDataTable) => {
              resolve(dump +"//#### Datas #####"+this.rn+ dumpDataTable.join(";")+";")
            });
            return dump;
          }).finally(()=> {
            //db.close();
          });
        })
        return promise;
    }
 }
