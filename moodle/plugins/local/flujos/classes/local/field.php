<?php
// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Persistence for local_flujos_field.
 *
 * @package    local_flujos
 * @copyright  2026 Alicia Morales Coach
 * @license    https://www.gnu.org/licenses/gpl-3.0.html GNU GPL v3 or later
 */

namespace local_flujos\local;

defined('MOODLE_INTERNAL') || die();

/**
 * CRUD y borrado en cascada para campos de captura de datos.
 */
class field {

    /** @var string Nombre de la tabla. */
    const TABLE = 'local_flujos_field';

    /**
     * Crea un campo nuevo.
     *
     * @param \stdClass $data Debe incluir stageid, shortname, label, fieldtype;
     *        opcionalmente required, sensitivedata, optionsjson, sortorder.
     * @return int Id del campo creado.
     */
    public static function create(\stdClass $data): int {
        global $DB;

        $record = new \stdClass();
        $record->stageid = $data->stageid;
        $record->shortname = $data->shortname;
        $record->label = $data->label;
        $record->fieldtype = $data->fieldtype;
        $record->required = !empty($data->required) ? 1 : 0;
        $record->sensitivedata = !empty($data->sensitivedata) ? 1 : 0;
        $record->optionsjson = $data->optionsjson ?? null;
        $record->sortorder = $data->sortorder ?? 0;
        $record->timecreated = time();
        $record->timemodified = $record->timecreated;

        return $DB->insert_record(self::TABLE, $record);
    }

    /**
     * Obtiene un campo por id.
     *
     * @param int $id
     * @return \stdClass|false
     */
    public static function get(int $id) {
        global $DB;
        return $DB->get_record(self::TABLE, ['id' => $id]);
    }

    /**
     * Lista los campos de una etapa ordenados por sortorder.
     *
     * @param int $stageid
     * @return array
     */
    public static function get_by_stage(int $stageid): array {
        global $DB;
        return $DB->get_records(self::TABLE, ['stageid' => $stageid], 'sortorder ASC');
    }

    /**
     * Actualiza un campo existente.
     *
     * @param \stdClass $data Debe incluir id.
     * @return bool
     */
    public static function update(\stdClass $data): bool {
        global $DB;
        $data->timemodified = time();
        return $DB->update_record(self::TABLE, $data);
    }

    /**
     * Borra un campo y, en cascada, las respuestas capturadas para el.
     *
     * @param int $fieldid
     * @return void
     */
    public static function delete(int $fieldid): void {
        global $DB;
        $DB->delete_records('local_flujos_answer', ['fieldid' => $fieldid]);
        $DB->delete_records(self::TABLE, ['id' => $fieldid]);
    }

    /**
     * Borra todos los campos de una etapa (y sus respuestas asociadas).
     *
     * @param int $stageid
     * @return void
     */
    public static function delete_by_stage(int $stageid): void {
        global $DB;
        $fieldids = $DB->get_fieldset_select(self::TABLE, 'id', 'stageid = ?', [$stageid]);
        if (empty($fieldids)) {
            return;
        }
        [$insql, $inparams] = $DB->get_in_or_equal($fieldids);
        $DB->delete_records_select('local_flujos_answer', "fieldid $insql", $inparams);
        $DB->delete_records(self::TABLE, ['stageid' => $stageid]);
    }
}
