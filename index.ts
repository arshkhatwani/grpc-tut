import path from "path";
import * as grpc from "@grpc/grpc-js";
import { GrpcObject, ServiceClientConstructor } from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { AddressBookServiceHandlers } from "./generated/AddressBookService";

const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, "./a.proto")
);

const personProto = grpc.loadPackageDefinition(packageDefinition);

const PERSONS = [];

const handler: AddressBookServiceHandlers = {
    AddPerson: (call, callback) => {
        console.log(call);
        let person = {
            name: call.request.name,
            age: call.request.age,
        };
        PERSONS.push(person);
        callback(null, person);
    },
    GetPersonByName: (call, callback) => {},
};

const server = new grpc.Server();

server.addService(
    (personProto.AddressBookService as ServiceClientConstructor).service,
    handler
);

server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
        console.log("Server is up and running");
    }
);
