
exports.getFromDeviceStorage = function (type, name) {
  return new Promise(function (resolve, reject) {
    var storage = navigator.getDeviceStorage(type);
    var request = storage.get(name);
    request.onerror = function () { return reject(this.error) };
    request.onsuccess = function () {
      var file = this.result;
      var reader = new FileReader();
      reader.onerror = function () { return reject(this.error) };
      reader.onload = function () {
        return resolve(reader.result);
      };
      reader.readAsArrayBuffer(file);
    };
  });
}

exports.enumerateDeviceStorage = function (type) {
  return new Promise(function (resolve, reject) {
    var storage = navigator.getDeviceStorage(type);
    var entries = [];
    var cursor = storage.enumerate();
    cursor.onerror = function () {
      return reject(this.error);
    };
    cursor.onsuccess = function () {
      if (this.done) {
        return resolve(entries);
      }
      entries.push(this.result);
      this.continue();
    };
  });
}

exports.promisifyMethods = function (context, methodNames) {
  methodNames.forEach(function(name) {
    var originalMethod = context[name];
    context[name] = function() {
      var mutableArguments = Array.prototype.slice.call(arguments, 0);
      return new Promise(function(resolve, reject) {
        mutableArguments.push(function(err, result) {
          return err ? reject(err) : resolve(result);
        });
        originalMethod.apply(context, mutableArguments);
      });
    };
  });
  return context;
}
