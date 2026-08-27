const express = require("express");
const pool = require("../config/db");

const {
  verificarToken,
} = require("../middlewares/auth.middleware");

const {
  soloRoles,
} = require("../middlewares/roles.middleware");

const router = express.Router();

router.use(verificarToken);

/*
GET /api/bloques
Obtener bloques
*/

router.get("/", async (req, res) => {

  try {

    const resultado =
    await pool.query(

      `
      SELECT *
      FROM bloques
      ORDER BY nombre
      `

    );

    res.json(
      resultado.rows
    );

  } catch (error) {

    console.error(error);

    res.status(500).json({

      error:
      "Error obteniendo bloques",

    });

  }

});

/*
POST /api/bloques
Crear bloque
*/

router.post(
  "/",

  soloRoles("administrador"),

  async (req, res) => {

    const { nombre } = req.body;

    if (!nombre) {

      return res
      .status(400)
      .json({

        error:
        "Nombre obligatorio",

      });

    }

    try {

      const resultado =
      await pool.query(

        `
        INSERT INTO bloques
        (nombre)

        VALUES($1)

        RETURNING *
        `,

        [nombre]

      );

      res
      .status(201)
      .json(

        resultado.rows[0]

      );

    } catch (error) {

      console.error(error);

      res.status(500).json({

        error:
        "Error creando bloque",

      });

    }

  }

);

/*
DELETE /api/bloques/:id
Eliminar bloque
*/

router.delete(

  "/:id",

  soloRoles(
    "administrador"
  ),

  async (req, res) => {

    const { id } =
    req.params;

    try {

      await pool.query(

        `
        DELETE FROM bloques
        WHERE id=$1
        `,

        [id]

      );

      res.json({

        mensaje:
        "Bloque eliminado",

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        error:
        "Error eliminando bloque",

      });

    }

  }

);

module.exports = router;