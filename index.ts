import path from "path";
import * as grpc from "@grpc/grpc-js";
import { GrpcObject, ServiceClientConstructor } from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { AddressBookServiceHandlers } from "./generated/AddressBookService";
import { Person } from "./generated/Person";
import { Status } from "@grpc/grpc-js/build/src/constants";

const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, "./a.proto")
);

const personProto = grpc.loadPackageDefinition(packageDefinition);

const PERSONS: Person[] = [];

const handler: AddressBookServiceHandlers = {
    AddPerson: (call, callback) => {
        let person = {
            name: call.request.name,
            age: call.request.age,
        };
        PERSONS.push(person);
        callback(null, person);
    },
    GetPersonByName: (call, callback) => {
        const name = call.request.name;
        console.log("Finding person by name", name);
        const person = PERSONS.find((item) => item.name === name);
        console.log("Found person", person);

        if (person) {
            callback(null, person);
        } else {
            callback(
                { code: Status.NOT_FOUND, details: "Person not found" },
                null
            );
        }
    },
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
