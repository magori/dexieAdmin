import { DbManagerService } from './dbManager.service.js';

describe('dBmanger service', () => {
  it("create simple delete prop", function() {
     var service = new DbManagerService({db:{}});
    // console.log(service.tableParser([1,2,3],"[]"));
    // expect(service.tableParser([1,2,3],"[]")).toEqual([3]);
    // expect(service.tableParser([1,2,{}],"[]")).toEqual([3]);
    //expect(service.tableParser([{t:[]}],"[].t")).toEqual([1]);
  //  expect(service.tableParser({t:[{name:'Toto'}]},"t[].name")).toEqual([1]);
    var o = {t:[
              {
                parent:'Toto',
                child:[{age:3},{age:2}]
                }
              ]};
    expect(service.tableParser(o,"t[].child[].age")).toEqual([1,2]);

  });

});
