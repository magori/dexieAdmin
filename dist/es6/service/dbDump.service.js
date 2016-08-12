"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DbDump = function () {
    function DbDump() {
        'ngInject';

        _classCallCheck(this, DbDump);

        this.rn = "\r\n";
    }

    _createClass(DbDump, [{
        key: "config",
        value: function config(_config) {
            if (_config) {
                this.db = _config.db;
                this.dbName = this.db.name + "";
                this.tables = this.db.tables;
                this.tableDef = this.createTblesDef();
            }
        }
    }, {
        key: "dumpTable",
        value: function dumpTable(table) {
            var _this = this;

            return table.toArray(function (list) {
                var rn = _this.rn;
                var objects = JSON.stringify(list);
                return rn + "//-" + table.name + rn + " db." + table.name + ".bulkPut(" + objects + ")";
            });
        }
    }, {
        key: "createTblesDef",
        value: function createTblesDef() {
            var defTables = {};
            this.db.tables.map(function (table) {
                var primKeyAndIndexes = [table.schema.primKey].concat(table.schema.indexes);
                var schemaSyntax = primKeyAndIndexes.map(function (index) {
                    return index.src;
                }).join(',');
                defTables[table.name] = schemaSyntax;
            });
            return defTables;
        }
    }, {
        key: "dump",
        value: function dump() {
            var _this2 = this;

            var db = this.db,
                self = this,
                rn = this.rn;
            var promise = new Promise(function (resolve) {
                db.open().then(function () {
                    var dump = "var db = new Dexie('" + db.name + "') " + rn + " db.version(" + db.verno + ").stores({ " + rn;
                    var defs = self.createTblesDef();
                    dump = dump + Object.keys(defs).map(function (key) {
                        var schemaSyntax = defs[key];
                        return "  " + key + ": '" + schemaSyntax + "'";
                    }).join("," + rn);
                    return "" + rn + dump + "});" + rn;
                }).then(function (dump) {
                    var p = db.tables.map(function (table) {
                        return self.dumpTable(table);
                    });
                    Promise.all(p).then(function (dumpDataTable) {
                        resolve(dump + "//#### Datas #####" + _this2.rn + dumpDataTable.join(";") + ";");
                    });
                    return dump;
                }).finally(function () {
                    //db.close();
                });
            });
            return promise;
        }
    }]);

    return DbDump;
}();

exports.DbDump = DbDump;