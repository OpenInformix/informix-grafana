'use strict';

System.register(['./datasource', './query_ctrl'], function (_export, _context) {
  "use strict";

  var InformixDatasource, InformixDatasourceQueryCtrl, InformixConfigCtrl, InformixQueryOptionsCtrl, InformixAnnotationsQueryCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_datasource) {
      InformixDatasource = _datasource.InformixDatasource;
    }, function (_query_ctrl) {
      InformixDatasourceQueryCtrl = _query_ctrl.InformixDatasourceQueryCtrl;
    }],
    execute: function () {
      _export('ConfigCtrl', InformixConfigCtrl = function InformixConfigCtrl() {
        _classCallCheck(this, InformixConfigCtrl);
      });

      InformixConfigCtrl.templateUrl = 'partials/config.html';

      _export('QueryOptionsCtrl', InformixQueryOptionsCtrl = function InformixQueryOptionsCtrl() {
        _classCallCheck(this, InformixQueryOptionsCtrl);
      });

      InformixQueryOptionsCtrl.templateUrl = 'partials/query.options.html';

      _export('AnnotationsQueryCtrl', InformixAnnotationsQueryCtrl = function InformixAnnotationsQueryCtrl() {
        _classCallCheck(this, InformixAnnotationsQueryCtrl);
      });

      InformixAnnotationsQueryCtrl.templateUrl = 'partials/annotations.editor.html';

      _export('Datasource', InformixDatasource);

      _export('QueryCtrl', InformixDatasourceQueryCtrl);

      _export('ConfigCtrl', InformixConfigCtrl);

      _export('QueryOptionsCtrl', InformixQueryOptionsCtrl);

      _export('AnnotationsQueryCtrl', InformixAnnotationsQueryCtrl);
    }
  };
});
//# XXXsourceMappingURL=module.js.map
