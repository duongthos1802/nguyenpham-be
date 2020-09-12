import { SchemaComposer } from 'graphql-compose'
import { GraphQLUpload } from 'apollo-server-express'
import Mutations from './mutations'
import Queries from './queries'

const schemaComposer = new SchemaComposer()

schemaComposer.add(GraphQLUpload)

schemaComposer.Query.addFields(Queries)

schemaComposer.Mutation.addFields(Mutations)

export default schemaComposer.buildSchema()
