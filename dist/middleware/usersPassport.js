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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersPassport = void 0;
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const passport_1 = __importDefault(require("passport"));
const key_1 = require("../config/key");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JwtStrategy = passport_jwt_1.default.Strategy;
const ExtractJwt = passport_jwt_1.default.ExtractJwt;
const JwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: key_1.keyJwt
};
const usersPassport = () => {
    passport_1.default.use(new JwtStrategy(JwtOptions, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield prisma.user.findUnique({
                where: {
                    id: payload.id
                }
            });
            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        }
        catch (error) {
            return done(error, false);
        }
    })));
};
exports.usersPassport = usersPassport;
