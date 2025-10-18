"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const Query_Constant_1 = require("./Query.Constant");
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    filter() {
        const filter = Object.assign({}, this.query);
        Query_Constant_1.excludingFields.forEach((x) => delete filter[x]);
        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }
    search(searchFields) {
        var _a;
        const searchTerm = ((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.searchTerm) || "";
        const searchQuery = {
            $or: searchFields.map((x) => ({
                [x]: { $regex: searchTerm, $options: "i" },
            })),
        };
        this.modelQuery = this.modelQuery.find(searchQuery);
        return this;
    }
    sort() {
        var _a;
        const sort = ((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.sort) || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    fields() {
        var _a, _b, _c;
        const fields = ((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fields)
            ? (_c = (_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.fields) === null || _c === void 0 ? void 0 : _c.split(",").join(" ")
            : "";
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    paginate() {
        var _a, _b;
        const page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    build() {
        return this.modelQuery;
    }
    getMetaData() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const totalDocument = yield this.modelQuery.model.countDocuments();
            const page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
            const limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
            const totalPage = Math.ceil(totalDocument / limit);
            return {
                page,
                limit,
                total: totalDocument,
                totalPage,
            };
        });
    }
}
exports.QueryBuilder = QueryBuilder;
