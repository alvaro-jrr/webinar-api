import "dotenv/config";
import { migrate } from "drizzle-orm/libsql/migrator";

import { db, client } from "./client";
import { assignments } from "./schema";

// This will run migrations on the database, skipping the ones already applied.
await migrate(db, { migrationsFolder: "./drizzle" });

const data = [
	{
		id: "tfg2xyl54b6nnan1w09rusps",
		title: "Creación de Contenido Web con HTML y CSS",
		weighting: 5,
		date: "2024-05-12",
	},
	{
		id: "ooxeh4o14vhp9epb8qutlchp",
		title: "Desarrollo Web Avanzado y Rendimiento en la web del proyecto",
		weighting: 5,
		date: "2024-06-16",
	},
	{
		id: "usw3ehorqsgtjerdzxe7hl92",
		title: "Despliegue, Colaboración y Mantenimiento de Proyectos Web",
		weighting: 5,
		date: "2024-04-28",
	},
	{
		id: "ri5ar9wb9a1xhzypivvo4htv",
		title: "Diseño UI, UX y Accesibilidad para la Web Moderna",
		weighting: 5,
		date: "2024-04-21",
	},
	{
		id: "dkqxsp42mcu784qlliwhzcll",
		title: "Entrevista",
		weighting: 10,
		date: "2024-06-23",
	},
	{
		id: "jvo6vyviebsnd90xeaoaoh78",
		title: "Inteligencia Artificial en la Web de la prueba",
		weighting: 5,
		date: "2024-06-23",
	},
	{
		id: "ni95patoua076ejrrvm42yz0",
		title: "Interactividad Web con JavaScript y Herramientas Front-end",
		weighting: 5,
		date: "2024-05-19",
	},
	{
		id: "poth1m4igswkiw1q3sks7x7q",
		title: "Introducción al Desarrollo Back-end y Gestión de Datos",
		weighting: 5,
		date: "2024-05-26",
	},
	{
		id: "lmtvtgau2wlcizcz54lzu3ts",
		title: "Introducción al Desarrollo Web",
		weighting: 5,
		date: "2024-04-14",
	},
	{
		id: "qo9t5dkzvk64ypdidjlhndd3",
		title: "Protocolos Web y API Integrations",
		weighting: 5,
		date: "2024-06-09",
	},
	{
		id: "idge1s007zdk5mz57mait6p1",
		title: "Proyecto",
		weighting: 25,
		date: "2024-07-10",
	},
	{
		id: "jbpu83le3vwzg1b7m45bj1mr",
		title: "Prueba Técnica",
		weighting: 10,
		date: "2024-06-23",
	},
	{
		id: "gqc4dzlghqfjiw6wd11ad62h",
		title: "Seguridad Web en la web del proyecto",
		weighting: 5,
		date: "2024-06-16",
	},
	{
		id: "l1hiammc14f9f63h6oq4pbhq",
		title: "Testing Web de la prueba",
		weighting: 5,
		date: "2024-06-23",
	},
].map(({ id, ...restOfAssignment }) => {
	console.log(id);

	return { ...restOfAssignment };
});

await db.insert(assignments).values(data);

// Don't forget to close the connection, otherwise the script will hang.
client.close();
