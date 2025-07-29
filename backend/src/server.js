import Fastify from "fastify";
import mercurius from "mercurius";
import fastifyCors from "@fastify/cors";
import { schema } from "./schema.js";
import { resolvers } from "./resolvers.js";
import initDatabase from "./database.js";

// Crear instancia de Fastify
const fastify = Fastify({
  logger: true, // Logs automáticos para debugging
});

// Función principal para iniciar el servidor
const start = async () => {
  try {
    console.log("Starting NewsFeed Fastify + GraphQL Server...");

    await initDatabase();

    // 2. Configurar CORS para permitir requests del frontend
    await fastify.register(fastifyCors, {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
        "http://localhost:3000",
      ],
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    });

    // 3. Registrar GraphQL con Mercurius
    await fastify.register(mercurius, {
      schema: schema, // Schema GraphQL
      resolvers: resolvers, // Resolvers
      graphiql: false, // Deshabilitar GraphiQL por compatibilidad
      ide: false, // Deshabilitar IDE por compatibilidad
      path: "/graphql", // Endpoint GraphQL

      // Context que se pasa a todos los resolvers
      context: async (request, reply) => {
        return {
          request,
          reply,
          // Aquí puedes agregar autenticación:
          // user: await getUserFromToken(request.headers.authorization),
          // permissions: await getUserPermissions(user)
        };
      },

      // Manejo de errores personalizado
      errorHandler: (error, request, reply) => {
        console.error("GraphQL Error:", error.message);

        // Log completo para debugging
        if (process.env.NODE_ENV === "development") {
          console.error("Full error:", error);
        }

        // Respuesta estándar de GraphQL
        reply.code(200).send({
          data: null,
          errors: [
            {
              message: error.message,
              extensions: {
                code: error.extensions?.code || "INTERNAL_ERROR",
                timestamp: new Date().toISOString(),
              },
            },
          ],
        });
      },

      // Configuración adicional
      queryDepth: 10, // Prevenir queries muy profundas
      subscriptions: false, // Desactivar subscriptions por ahora
      federated: false, // No usar federación
      allowBatchedQueries: true, // Permitir múltiples queries
    });
    console.log("GraphQL registered at /graphql");

    // 4. Rutas adicionales útiles

    // Ruta principal con información del API
    fastify.get("/", async (request, reply) => {
      return {
        message: "NewsFeed Fastify + GraphQL API",
        version: "1.0.0",
        endpoints: {
          graphql: "/graphql",
          playground: "Use Postman or Insomnia for GraphQL testing",
          health: "/health",
          testQuery: "/test-graphql",
        },
        stack: [
          "Fastify v4.x",
          "Mercurius GraphQL",
          "SQLite Database",
          "Node.js Runtime",
        ],
        docs: "Use POST /graphql with GraphQL queries, or visit /test-graphql for examples",
        sampleQueries: {
          getAllPosts:
            'POST /graphql with body: {"query": "{ posts { id title author likesCount } }"}',
          createPost:
            'POST /graphql with body: {"query": "mutation { createPost(title: \\"Test\\", body: \\"Content\\", author: \\"User\\") { id title } }"}',
        },
      };
    });

    // Endpoint de prueba para GraphQL
    fastify.get("/test-graphql", async (request, reply) => {
      reply.type("text/html");
      return `
<!DOCTYPE html>
<html>
<head>
    <title> NewsFeed GraphQL API Tester</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #1a1a1a; color: #fff; }
        .container { max-width: 800px; margin: 0 auto; }
        .query-box { background: #2d2d2d; padding: 20px; border-radius: 8px; margin: 10px 0; }
        .query-box h3 { color: #4CAF50; margin-top: 0; }
        code { background: #333; padding: 10px; display: block; border-radius: 4px; overflow-x: auto; }
        .test-btn { background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
        .test-btn:hover { background: #45a049; }
        #result { background: #2d2d2d; padding: 15px; border-radius: 4px; margin-top: 20px; min-height: 100px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>NewsFeed GraphQL API Tester</h1>
        
        <div class="query-box">
            <h3>Obtener todos los posts</h3>
            <code>{"query": "{ posts { id title body author likesCount userLiked createdAt } }"}</code>
            <button class="test-btn" onclick="testQuery('{ posts { id title body author likesCount userLiked createdAt } }')">Probar Query</button>
        </div>

        <div class="query-box">
            <h3> Crear nuevo post</h3>
            <code>{"query": "mutation { createPost(title: \\"Post desde API\\", body: \\"Contenido del post\\", author: \\"Tester\\") { id title author likesCount } }"}</code>
            <button class="test-btn" onclick="testMutation()">Probar Mutation</button>
        </div>

        <div class="query-box">
            <h3> Dar like a un post</h3>
            <code>{"query": "mutation { likePost(id: \\"1\\") { id title likesCount userLiked } }"}</code>
            <button class="test-btn" onclick="testLike()">Probar Like</button>
        </div>

        <h3> Resultado:</h3>
        <div id="result">Selecciona una query para ver el resultado...</div>
    </div>

    <script>
        async function testQuery(query) {
            try {
                const response = await fetch('/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query })
                });
                const result = await response.json();
                document.getElementById('result').innerHTML = '<pre>' + JSON.stringify(result, null, 2) + '</pre>';
            } catch (error) {
                document.getElementById('result').innerHTML = '<pre style="color: #ff6b6b;">Error: ' + error.message + '</pre>';
            }
        }

        async function testMutation() {
            const mutation = 'mutation { createPost(title: "Post desde API", body: "Contenido del post desde el tester", author: "API Tester") { id title author likesCount createdAt } }';
            await testQuery(mutation);
        }

        async function testLike() {
            const mutation = 'mutation { likePost(id: "1") { id title likesCount userLiked } }';
            await testQuery(mutation);
        }
    </script>
</body>
</html>
      `;
    });

    // Health check para monitoreo
    fastify.get("/health", async (request, reply) => {
      return {
        status: "healthy",
        service: "NewsFeed GraphQL API",
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        memory: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + "MB",
        version: process.version,
      };
    });

    // Endpoint para obtener el schema SDL
    fastify.get("/schema", async (request, reply) => {
      reply.type("text/plain");
      return schema;
    });

    // 5. Iniciar servidor
    const PORT = process.env.PORT || 4000;
    const HOST = process.env.HOST || "localhost";

    await fastify.listen({
      port: PORT,
      host: HOST,
    });

    console.log(`
🎉 Fastify Server Ready!
📍 GraphQL API: http://${HOST}:${PORT}/graphql
🎮 GraphQL Tester: http://${HOST}:${PORT}/test-graphql
📊 Health Check: http://${HOST}:${PORT}/health
📄 Schema SDL: http://${HOST}:${PORT}/schema
⚡ Powered by Fastify + Mercurius + SQLite

💡 Para probar GraphQL:
   • Ve a: http://${HOST}:${PORT}/test-graphql
   • O usa Postman/Insomnia con: POST http://${HOST}:${PORT}/graphql
    `);
  } catch (error) {
    console.error("❌ Error starting Fastify server:", error);
    process.exit(1);
  }
};

// Shutdown graceful para producción
process.on("SIGINT", async () => {
  console.log("\n🛑 Received SIGINT, shutting down Fastify gracefully...");
  try {
    await fastify.close();
    console.log("✅ Fastify closed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Received SIGTERM, shutting down Fastify gracefully...");
  try {
    await fastify.close();
    console.log("✅ Fastify closed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
});

// Iniciar servidor
start();
