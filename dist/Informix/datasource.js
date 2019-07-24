'use strict';


System.register(['lodash'], function (_export, _context) {
  "use strict";

  var _, _createClass, InformixDatasource;
  
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('InformixDatasource', InformixDatasource = function () {
        function InformixDatasource(instanceSettings, $q, backendSrv, templateSrv) {
          _classCallCheck(this, InformixDatasource);

          this.type = instanceSettings.type;
          this.url = instanceSettings.url;
          this.name = instanceSettings.name;
          this.q = $q;
          this.backendSrv = backendSrv;
          this.templateSrv = templateSrv;
          this.withCredentials = instanceSettings.withCredentials;
          this.headers = { 'Content-Type': 'application/json' };
          if (typeof instanceSettings.basicAuth === 'string' && instanceSettings.basicAuth.length > 0) {
            this.headers['Authorization'] = instanceSettings.basicAuth;
          }
        }

        _createClass(InformixDatasource, [{
          key: 'query',
          value: function query(options) {
            var query = this.buildQueryParameters(options);
            var self = this;
            var seriesList = [];
                                          
            

            query.targets = query.targets.filter(function (t) {
              return !t.hide;
            });

            if (query.targets.length <= 0) {
              return this.q.when({ data: [] });
            }

            if (this.templateSrv.getAdhocFilters) {
              query.adhocFilters = this.templateSrv.getAdhocFilters(this.name);
            } else {
              query.adhocFilters = [];
            }
            // console.log("query.targets:" + JSON.stringify(query.targets));
                                          
            var targetPromises = _(query.targets).map(function(target) {
                                                      
                    return self.doRequest ({
                            url: self.url + '/' + target.table + '?query=' + encodeURI(JSON.stringify(target.params.query)) + '&fields=' + encodeURI(JSON.stringify (target.params.fields)),
                                method: 'GET',
                                metadata: target.metadata
                            }).then(self.convertResponse);
                                                      }).value();
                    
          return self.q.all(targetPromises).then(function(convertedResponses) {
                                             var result = {
                                             data: _.map(convertedResponses, function(convertedResponse) {
                                                         return convertedResponse.data;
                                                         })
                                             };
                                             result.data = _.flatten(result.data);
                                             return result;
                                             });
                                        
        }
        }, {
          key: 'testDatasource',
          value: function testDatasource() {
            return this.doRequest({
            url: this.url + '/system.sql?query=%7B%22$sql%22:%22select%20DBINFO(%27version%27,%27full%27)%20version%20from%20sysmaster:systables%20where%20tabid=99%22%7D',
              method: 'GET'
            }).then(function (response) {
              if (response.status === 200) {
                return {
                    status: "success",
                    message: "Data source is working. Informix version: '" + JSON.stringify(response.data[0].version) + "'.",
                    title: "Success" };
              }
            });
          }
          }, {
          key: 'convertResponse',
          value: function convertResponse(response) {
              
              if (!response || !response.data)  { return []; }
              
              var seriesList = [];
              var rlen = response.data.length;
              var target_str = "";
                                          
              // console.log("convertResponse response:" + JSON.stringify(response))
              
              if (response.config.metadata.json_elem)
              {
              target_str = response.config.metadata.keyvalue + "/" + response.config.metadata.json_elem;
              }
              else
              {
              target_str = response.config.metadata.keyvalue + "/" + response.config.metadata.col_value;
              }
              
              seriesList.push({
                              target: target_str,
                              datapoints: _.map(response.data, function(element) {
                            
                            var ts = element[response.config.metadata.col_ts.toString()].$date;
                            
                            if (response.config.metadata.json_elem)
                            {
                            var json_doc = element[response.config.metadata.col_value.toString()];
                            return [json_doc[response.config.metadata.json_elem.toString()], ts];
                            }
                            else
                            {
                            return [element[response.config.metadata.col_value.toString()], ts];
                            }
                            })
                      });
              
              // console.log("convertResponse seriesList:" + JSON.stringify(seriesList));
              
              return {data: seriesList};
          }
        }, {
          key: 'annotationQuery',
          value: function annotationQuery(options) {
            var query = this.templateSrv.replace(options.annotation.query, {}, 'glob');
            var annotationQuery = {
              range: options.range,
              annotation: {
                name: options.annotation.name,
                datasource: options.annotation.datasource,
                enable: options.annotation.enable,
                iconColor: options.annotation.iconColor,
                query: query
              },
              rangeRaw: options.rangeRaw
            };

            return this.doRequest({
              url: this.url + '/annotations',
              method: 'POST',
              data: annotationQuery
            }).then(function (result) {
              return result.data;
            });
          }
        }, {
          key: 'metricFindQuery',
          value: function metricFindQuery(query) {
            var interpolated = {
              target: this.templateSrv.replace(query, null, 'regex')
            };

            return this.doRequest({
              url: this.url + '/search',
              data: interpolated,
              method: 'POST'
            }).then(this.mapToTextValue);
          }
        }, {
          key: 'mapToTextValue',
          value: function mapToTextValue(result) {
            return _.map(result.data, function (d, i) {
              if (d && d.text && d.value) {
                return { text: d.text, value: d.value };
              } else if (_.isObject(d)) {
                return { text: d, value: i };
              }
              return { text: d, value: d };
            });
          }
        }, {
          key: 'doRequest',
          value: function doRequest(options) {
                                          
            options.withCredentials = this.withCredentials;
            options.headers = this.headers;

            return this.backendSrv.datasourceRequest(options);
          }
        }, {
          key: 'buildQueryParameters',
          value: function buildQueryParameters(options) {
            var _this = this;

            //remove placeholder targets
            options.targets = _.filter(options.targets, function (target) {
              return target.target !== 'select metric';
            });


            var targets = _.map(options.targets, function (target) {
                                
                // console.log("target"+JSON.stringify(target));
                
                var queryobj = JSON.parse(target.target);
                var key = queryobj.key;
                var searchkey = {};
                searchkey[key.name] = key.value;
                var cols = {};
                cols[queryobj.col_ts] = 1;
                cols[queryobj.col_value] = 1;
                var from_ts = {};
                from_ts[queryobj.col_ts] = {"$gte": {"$date": options.range.from}};
                var to_ts = {};
                to_ts[queryobj.col_ts] = {"$lt": {"$date": options.range.to}};
                var searchlist = [];
                searchlist.push(searchkey, from_ts, to_ts);
                
                var meta = {};
                meta["keyvalue"] = key.value;
                meta["col_ts"] = queryobj.col_ts;
                meta["col_value"] = queryobj.col_value;
                meta["json_elem"] = queryobj.json_elem;
                
                var requestOptions = {
                url: '/' + queryobj.table,
                params:
                {
                query: {"$and": searchlist},
                fields: cols
                },
                metadata: meta
                };
                // console.log("cols:", JSON.stringify(cols));
                // console.log("from:" + options.range.from);
                // console.log("to:" + options.range.to);
                // console.log("from_ts:" + JSON.stringify(from_ts));
                // console.log("key.value:" + key.value);
                // console.log("requestOptions:" + JSON.stringify(requestOptions));
 
              return {
                target: _this.templateSrv.replace(target.target, options.scopedVars, 'regex'),
                refId: target.refId,
                hide: target.hide,
                type: target.type,
                table: queryobj.table,
                params:
                {
                    query: {"$and": searchlist},
                    fields: cols
                },
                metadata: meta
              };
            });
 
          options.targets = targets;
                                          
          return options;
          }
        }, {
          key: 'getTagKeys',
          value: function getTagKeys(options) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
              _this2.doRequest({
                url: _this2.url + '/tag-keys',
                method: 'POST',
                data: options
              }).then(function (result) {
                return resolve(result.data);
              });
            });
          }
        }, {
          key: 'getTagValues',
          value: function getTagValues(options) {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
              _this3.doRequest({
                url: _this3.url + '/tag-values',
                method: 'POST',
                data: options
              }).then(function (result) {
                return resolve(result.data);
              });
            });
          }
        }]);

        return InformixDatasource;
      }());

      _export('InformixDatasource', InformixDatasource);
    }
  };
});
//# XXXsourceMappingURL=datasource.js.map
