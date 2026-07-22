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
 * Persistence for local_flujos_stage.
 *
 * @package    local_flujos
 * @copyright  2026 Alicia Morales Coach
 * @license    https://www.gnu.org/licenses/gpl-3.0.html GNU GPL v3 or later
 */

namespace local_flujos\local;

defined('MOODLE_INTERNAL') || die();

/**
 * CRUD y borrado en cascada para etapas.
 */
class stage {

    /** @var string Nombre de la tabla. */
    const TABLE = 'local_flujos_stage';

    /**
     * Crea una etapa nueva.
     *
     * @param \stdClass $data Debe incluir flowid, name, stagetype;
     *        opcionalmente sortorder, configjson.
     * @return int Id de la etapa creada.
     */
    public static function create(\stdClass $data): int {
        global $DB;

        $record = new \stdClass();
        $record->flowid = $data->flowid;
        $record->sortorder = $data->sortorder ?? 0;
        $record->name = $data->name;
        $record->stagetype = $data->stagetype;
        $record->configjson = $data->configjson ?? null;
        $record->timecreated = time();
        $record->timemodified = $record->timecreated;

        return $DB->insert_record(self::TABLE, $record);
    }

    /**
     * Obtiene una etapa por id.
     *
     * @param int $id
     * @return \stdClass|false
     */
    public static function get(int $id) {
        global $DB;
        return $DB->get_record(self::TABLE, ['id' => $id]);
    }

    /**
     * Lista las etapas de un flujo ordenadas por sortorder.
     *
     * @param int $flowid
     * @return array
     */
    public static function get_by_flow(int $flowid): array {
        global $DB;
        return $DB->get_records(self::TABLE, ['flowid' => $flowid], 'sortorder ASC');
    }

    /**
     * Actualiza una etapa existente.
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
     * Borra una etapa y, en cascada, sus campos.
     *
     * @param int $stageid
     * @return void
     */
    public static function delete(int $stageid): void {
        field::delete_by_stage($stageid);

        global $DB;
        $DB->delete_records(self::TABLE, ['id' => $stageid]);
    }
}
