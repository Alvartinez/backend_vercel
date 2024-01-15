const { Router } = require("express");
const { newTarea, getTarea, getTareasAll, editTarea, deleteTarea } = require("../controllers/tarea");

const router = Router();

router.get("/:id", getTarea);
router.get("/tareas/:id", getTareasAll);
router.post("/newTarea", newTarea);
router.put("/updateTarea", editTarea);
router.delete("/deleteTarea", deleteTarea);

module.exports = router;