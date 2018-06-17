"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var memoizee_1 = __importDefault(require("memoizee"));
var Api = /** @class */ (function () {
    function Api() {
    }
    Api.prototype.define = function (func) {
        var args = [];
        var callback = (function () {
            var _args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                _args[_i] = arguments[_i];
            }
            _args.forEach(function (a) { return args.push(a); });
        });
        var level = function () { return func.apply(void 0, args); };
        return new ApiChain(level, callback);
    };
    Api.Singleton = function (func) {
        var single = memoizee_1.default(func);
        return new Api().define(single);
    };
    Api.Replace = function (builder, func) {
        return this.Mock(builder, func);
    };
    Api.Mock = function (builder, func) {
        return ApiChain.Mock(builder, func);
    };
    Api.Merge = function (api1, ctor) {
        function With(api2, ctor2) {
            debugger;
            return new Api().define(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var call1 = ctor ? ctor : function () {
                    var any = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        any[_i] = arguments[_i];
                    }
                    return [];
                };
                var call2 = ctor2 ? ctor2 : function () {
                    var any = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        any[_i] = arguments[_i];
                    }
                    return [];
                };
                var arg1 = call1.apply(void 0, args);
                var arg2 = call2.apply(void 0, args);
                var r1 = (_a = api1.factory).Create.apply(_a, arg1);
                var r2 = (_b = api2.factory).Create.apply(_b, arg2);
                return __assign({}, r1, r2);
                var _a, _b;
            });
            //return new Merge<left,lr,right,rr,lf,rf>(api1,api2,ctor,ctor2);
        }
        return {
            With: With
        };
    };
    return Api;
}());
exports.Api = Api;
var ApiChain = /** @class */ (function () {
    function ApiChain(level, ctor) {
        this.level = level;
        this.ctor = ctor;
    }
    ApiChain.prototype.use = function (func) {
        var _this = this;
        return new ApiChain(function () { return func(_this.level()); }, this.ctor);
    };
    Object.defineProperty(ApiChain.prototype, "factory", {
        get: function () {
            var self = this;
            var Create;
            var thing = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                (_a = self).ctor.apply(_a, args);
                return self.level();
                var _a;
            };
            Create = thing;
            return {
                Create: Create
            };
        },
        enumerable: true,
        configurable: true
    });
    ApiChain.Mock = function (builder, func) {
        var real = builder.level;
        builder.level = func;
        return function () {
            builder.level = real;
        };
    };
    return ApiChain;
}());
exports.ApiChain = ApiChain;
var Merge = /** @class */ (function () {
    function Merge(api1, api2, ctor1, ctor2) {
        this.api1 = api1;
        this.api2 = api2;
        this.ctor1 = ctor1;
        this.ctor2 = ctor2;
    }
    Merge.prototype.define = function (func) {
        var _this = this;
        var first;
        var second;
        var combine = function () { return (__assign({}, first, second)); };
        var f = function () {
            var any = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                any[_i] = arguments[_i];
            }
            return func(combine());
        };
        var newCtor = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var call1 = _this.ctor1 ? _this.ctor1 : function () {
                var any = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    any[_i] = arguments[_i];
                }
                return [];
            };
            var call2 = _this.ctor2 ? _this.ctor2 : function () {
                var any = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    any[_i] = arguments[_i];
                }
                return [];
            };
            var arg1 = call1.apply(void 0, args);
            var arg2 = call2.apply(void 0, args);
            first = (_a = _this.api1.factory).Create.apply(_a, arg1);
            second = (_b = _this.api2.factory).Create.apply(_b, arg2);
            return f.apply(void 0, args);
            var _a, _b;
        };
        var chain = new ApiChain(f, newCtor);
        return chain;
    };
    return Merge;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQXBpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFDQSxzREFBZ0M7QUFLaEM7SUFFSTtJQUVBLENBQUM7SUFFRCxvQkFBTSxHQUFOLFVBQVksSUFBZ0I7UUFFeEIsSUFBSSxJQUFJLEdBQU8sRUFBRSxDQUFDO1FBQ2xCLElBQUksUUFBUSxHQUFHLENBQUM7WUFBQyxlQUFjO2lCQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7Z0JBQWQsMEJBQWM7O1lBQzNCLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLElBQUUsT0FBQSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFaLENBQVksQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBUSxDQUFDO1FBRVYsSUFBSSxLQUFLLEdBQUMsY0FBSSxPQUFBLElBQUksZUFBSSxJQUFJLEdBQVosQ0FBYSxDQUFDO1FBQzVCLE9BQU8sSUFBSSxRQUFRLENBQU0sS0FBSyxFQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTSxhQUFTLEdBQWhCLFVBQW9CLElBQVU7UUFDMUIsSUFBSSxNQUFNLEdBQUcsa0JBQVEsQ0FBQyxJQUFJLENBQWdCLENBQUM7UUFDM0MsT0FBTyxJQUFJLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRU0sV0FBTyxHQUFkLFVBQW9CLE9BQXFCLEVBQUMsSUFBVTtRQUNoRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFHTSxRQUFJLEdBQVgsVUFBaUIsT0FBcUIsRUFBQyxJQUFtQjtRQUN0RCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3RDLENBQUM7SUFHTSxTQUFLLEdBQVosVUFBNkMsSUFBc0IsRUFBQyxJQUFRO1FBQ3hFLGNBQTJCLElBQXVCLEVBQUMsS0FBUztZQUN4RCxRQUFRLENBQUM7WUFDVCxPQUFPLElBQUksR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO2dCQUFDLGNBQU87cUJBQVAsVUFBTyxFQUFQLHFCQUFPLEVBQVAsSUFBTztvQkFBUCx5QkFBTzs7Z0JBRTVCLElBQUksS0FBSyxHQUFPLElBQUksQ0FBQSxDQUFDLENBQUEsSUFBSSxDQUFBLENBQUMsQ0FBQTtvQkFBQyxhQUFZO3lCQUFaLFVBQVksRUFBWixxQkFBWSxFQUFaLElBQVk7d0JBQVosd0JBQVk7O29CQUFHLE9BQUEsRUFBRTtnQkFBRixDQUFFLENBQUM7Z0JBQzdDLElBQUksS0FBSyxHQUFPLEtBQUssQ0FBQSxDQUFDLENBQUEsS0FBSyxDQUFBLENBQUMsQ0FBQTtvQkFBQyxhQUFZO3lCQUFaLFVBQVksRUFBWixxQkFBWSxFQUFaLElBQVk7d0JBQVosd0JBQVk7O29CQUFHLE9BQUEsRUFBRTtnQkFBRixDQUFFLENBQUM7Z0JBQy9DLElBQUksSUFBSSxHQUFHLEtBQUssZUFBSSxJQUFJLENBQUMsQ0FBQztnQkFFMUIsSUFBSSxJQUFJLEdBQUcsS0FBSyxlQUFJLElBQUksQ0FBQyxDQUFBO2dCQUV6QixJQUFJLEVBQUUsR0FBRyxDQUFBLEtBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQSxDQUFDLE1BQU0sV0FBSSxJQUFJLENBQUMsQ0FBQTtnQkFDckMsSUFBSSxFQUFFLEdBQUcsQ0FBQSxLQUFBLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxNQUFNLFdBQUksSUFBSSxDQUFDLENBQUE7Z0JBR3JDLE9BQU8sYUFBSSxFQUFTLEVBQUksRUFBUyxDQUEwQixDQUFBOztZQUUvRCxDQUFDLENBQUMsQ0FBQTtZQUNGLGlFQUFpRTtRQUNyRSxDQUFDO1FBRUQsT0FBTztZQUNILElBQUksTUFBQTtTQUNQLENBQUE7SUFFTCxDQUFDO0lBT0wsVUFBQztBQUFELENBQUMsQUFoRUQsSUFnRUM7QUFoRVksa0JBQUc7QUFxRWhCO0lBR0ksa0JBQXNCLEtBQWMsRUFBUyxJQUFTO1FBQWhDLFVBQUssR0FBTCxLQUFLLENBQVM7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFLO0lBRXRELENBQUM7SUFJTSxzQkFBRyxHQUFWLFVBQWMsSUFBbUI7UUFBakMsaUJBRUM7UUFERyxPQUFPLElBQUksUUFBUSxDQUFTLGNBQUksT0FBQSxJQUFJLENBQUMsS0FBSSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQWxCLENBQWtCLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ2pFLENBQUM7SUFJRCxzQkFBSSw2QkFBTzthQUFYO1lBRUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ2hCLElBQUksTUFBMkIsQ0FBQztZQUdoQyxJQUFJLEtBQUssR0FBRztnQkFBUyxjQUFPO3FCQUFQLFVBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87b0JBQVAseUJBQU87O2dCQUN4QixDQUFBLEtBQUMsSUFBWSxDQUFBLENBQUMsSUFBSSxXQUFJLElBQUksRUFBRTtnQkFDNUIsT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUE7O1lBQ3ZCLENBQWdDLENBQUE7WUFFaEMsTUFBTSxHQUFHLEtBQVksQ0FBQztZQUN0QixPQUFPO2dCQUNILE1BQU0sUUFBQTthQUNULENBQUE7UUFDTCxDQUFDOzs7T0FBQTtJQUdNLGFBQUksR0FBWCxVQUFpQixPQUFxQixFQUFDLElBQW1CO1FBQ3RELElBQUksSUFBSSxHQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFFMUIsT0FBTyxDQUFDLEtBQUssR0FBRyxJQUFXLENBQUM7UUFFNUIsT0FBTztZQUNILE9BQU8sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFLTCxlQUFDO0FBQUQsQ0FBQyxBQTlDRCxJQThDQztBQTlDWSw0QkFBUTtBQWtEckI7SUFDSSxlQUFvQixJQUFzQixFQUFTLElBQXVCLEVBQVMsS0FBUyxFQUFTLEtBQVM7UUFBMUYsU0FBSSxHQUFKLElBQUksQ0FBa0I7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFtQjtRQUFTLFVBQUssR0FBTCxLQUFLLENBQUk7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFJO0lBRTlHLENBQUM7SUFLRCxzQkFBTSxHQUFOLFVBQTRCLElBQXFCO1FBQWpELGlCQXlCQztRQXZCRyxJQUFJLEtBQUssQ0FBQztRQUNWLElBQUksTUFBTSxDQUFDO1FBQ1gsSUFBSSxPQUFPLEdBQUcsY0FBSSxPQUFBLGNBQUssS0FBSyxFQUFJLE1BQU0sRUFBRSxFQUF0QixDQUFzQixDQUFDO1FBRXpDLElBQUksQ0FBQyxHQUFlO1lBQUMsYUFBWTtpQkFBWixVQUFZLEVBQVoscUJBQVksRUFBWixJQUFZO2dCQUFaLHdCQUFZOztZQUFHLE9BQUEsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQWYsQ0FBZSxDQUFDO1FBRXBELElBQUksT0FBTyxHQUFDO1lBQUMsY0FBTztpQkFBUCxVQUFPLEVBQVAscUJBQU8sRUFBUCxJQUFPO2dCQUFQLHlCQUFPOztZQUNoQixJQUFJLEtBQUssR0FBTyxLQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQSxLQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQTtnQkFBQyxhQUFZO3FCQUFaLFVBQVksRUFBWixxQkFBWSxFQUFaLElBQVk7b0JBQVosd0JBQVk7O2dCQUFHLE9BQUEsRUFBRTtZQUFGLENBQUUsQ0FBQztZQUN6RCxJQUFJLEtBQUssR0FBTyxLQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQSxLQUFJLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQTtnQkFBQyxhQUFZO3FCQUFaLFVBQVksRUFBWixxQkFBWSxFQUFaLElBQVk7b0JBQVosd0JBQVk7O2dCQUFHLE9BQUEsRUFBRTtZQUFGLENBQUUsQ0FBQztZQUN6RCxJQUFJLElBQUksR0FBRyxLQUFLLGVBQUksSUFBSSxDQUFDLENBQUM7WUFFMUIsSUFBSSxJQUFJLEdBQUcsS0FBSyxlQUFJLElBQUksQ0FBQyxDQUFBO1lBRXpCLEtBQUssR0FBRyxDQUFBLEtBQUEsS0FBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUEsQ0FBQyxNQUFNLFdBQUksSUFBSSxDQUFDLENBQUM7WUFDMUMsTUFBTSxHQUFHLENBQUEsS0FBQSxLQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQSxDQUFDLE1BQU0sV0FBSSxJQUFJLENBQUMsQ0FBQztZQUMzQyxPQUFPLENBQUMsZUFBSSxJQUFJLENBQWEsQ0FBQTs7UUFDakMsQ0FBQyxDQUFBO1FBRUQsSUFBSSxLQUFLLEdBQUcsSUFBSSxRQUFRLENBQU0sQ0FBQyxFQUFDLE9BQWMsQ0FBQyxDQUFDO1FBSWhELE9BQU8sS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFDTCxZQUFDO0FBQUQsQ0FBQyxBQWxDRCxJQWtDQyJ9